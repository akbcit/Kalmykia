import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise'; // Import Simplex noise

export interface PartialGeometryParams {
  center: [number, number];      // Tuple representing the XZ coordinates
  radius: number;                // Radius to include vertices
  edgeSmoothing?: boolean;       // Enable edge smoothing
  noiseIntensity?: number;       // Intensity of noise perturbation
  smoothingRadius?: number;      // Radius over which to smooth edges
}

export class PartialGeometry extends THREE.BufferGeometry {
  constructor(originalGeometry: THREE.BufferGeometry, params: PartialGeometryParams) {
    super();

    const {
      center,
      radius,
      edgeSmoothing = false,
      noiseIntensity = 0.1,
      smoothingRadius = 0.2,
    } = params;

    // Convert the tuple to a THREE.Vector3 with Y = 0
    const center3D = new THREE.Vector3(center[0], 0, center[1]);

    // Clip the geometry and smooth edges if needed
    const clippedGeometry = this.clipAndSmoothGeometry(
      originalGeometry,
      center3D,
      radius,
      edgeSmoothing,
      noiseIntensity,
      smoothingRadius
    );

    // Copy the resulting geometry into this instance
    this.copy(clippedGeometry);
  }

  private clipAndSmoothGeometry(
    originalGeometry: THREE.BufferGeometry,
    center: THREE.Vector3,
    radius: number,
    edgeSmoothing: boolean,
    noiseIntensity: number,
    smoothingRadius: number
  ): THREE.BufferGeometry {
    const geom = originalGeometry.clone();
    const position = geom.attributes.position as THREE.BufferAttribute;
    const index = geom.index;
    const uv = geom.attributes.uv as THREE.BufferAttribute | undefined;

    const newPositions: number[] = [];
    const newIndices: number[] = [];
    const newUVs: number[] = [];
    const vertexMap: Map<number, number> = new Map();

    let newIndex = 0;
    const noise = createNoise2D();

    for (let i = 0; i < position.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(position, i);
      const distanceXZ = new THREE.Vector2(vertex.x, vertex.z).distanceTo(
        new THREE.Vector2(center.x, center.z)
      );

      if (distanceXZ <= radius) {
        if (edgeSmoothing && distanceXZ >= radius - smoothingRadius) {
          const direction = new THREE.Vector3(
            vertex.x - center.x,
            0,
            vertex.z - center.z
          ).normalize();

          const t = (radius - distanceXZ) / smoothingRadius; // Linear interpolation factor
          vertex.lerp(center.clone().add(direction.multiplyScalar(radius)), t);

          if (noiseIntensity > 0) {
            const noiseValue = noise(vertex.x * 0.1, vertex.z * 0.1) * noiseIntensity;
            vertex.add(direction.multiplyScalar(noiseValue));
          }
        }

        newPositions.push(vertex.x, vertex.y, vertex.z);

        if (uv) {
          const u = uv.getX(i);
          const v = uv.getY(i);
          newUVs.push(u, v);
        }

        vertexMap.set(i, newIndex++);
      }
    }

    if (newPositions.length === 0) {
      console.warn('No vertices found within the specified region. Returning an empty geometry.');
      return new THREE.BufferGeometry();
    }

    if (index) {
      for (let i = 0; i < index.count; i += 3) {
        const a = index.getX(i);
        const b = index.getX(i + 1);
        const c = index.getX(i + 2);

        if (vertexMap.has(a) && vertexMap.has(b) && vertexMap.has(c)) {
          newIndices.push(vertexMap.get(a)!, vertexMap.get(b)!, vertexMap.get(c)!);
        }
      }
    }

    const newGeometry = new THREE.BufferGeometry();
    newGeometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));

    if (newUVs.length > 0) {
      newGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));
    }

    newGeometry.setIndex(newIndices);
    newGeometry.computeVertexNormals(); // Recompute normals for smooth shading

    return newGeometry;
  }
}
