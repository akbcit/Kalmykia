import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise'; // Import Simplex noise

// Interface to define parameters for partial geometry creation
export interface PartialGeometryParams {
  center: THREE.Vector2;         // Center position in the XZ plane for the region of interest
  radius: number;                // Radius around the center to include vertices
  edgeSmoothing?: boolean;       // Option to apply edge smoothing using noise
  noiseIntensity?: number;       // Intensity of the noise for smoothing edges
  smoothingRadius?: number;      // Additional radius to smooth the edges
}

export class PartialGeometry extends THREE.BufferGeometry {
  constructor(originalGeometry: THREE.BufferGeometry, params: PartialGeometryParams) {
    super(); // Call the parent constructor

    const { center, radius, edgeSmoothing = false, noiseIntensity = 0.1, smoothingRadius = 0.2 } = params;

    // Convert center from Vector2 to Vector3 for internal operations (assuming y=0)
    const center3D = new THREE.Vector3(center.x, 0, center.y);

    // Perform clipping and retain only vertices within the specified radius
    const clippedGeometry = this.clipGeometry(originalGeometry, center3D, radius, edgeSmoothing, noiseIntensity, smoothingRadius);

    // Copy attributes and indices from the resulting geometry to this geometry
    this.copy(clippedGeometry);
  }

  clipGeometry(
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
  
    if (!position) {
      console.error('Geometry position attribute is undefined.');
      return new THREE.BufferGeometry();
    }
  
    const newPositions: number[] = [];
    const newIndices: number[] = [];
    const newUVs: number[] = [];
    const vertexMap: Map<number, number> = new Map();
  
    let newIndex = 0;
    const noise = createNoise2D();
  
    for (let i = 0; i < position.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(position, i);
      
      // Calculate distance only using XZ plane
      const distanceXZ = new THREE.Vector2(vertex.x, vertex.z).distanceTo(new THREE.Vector2(center.x, center.z));
  
      // Include vertices within the specified radius in the XZ plane
      if (distanceXZ <= radius) {
        // Smooth edges if the vertex is near the boundary of the radius
        if (edgeSmoothing && distanceXZ >= radius - smoothingRadius) {
          // Project the vertex onto the circular boundary
          const direction = new THREE.Vector3(vertex.x - center.x, 0, vertex.z - center.z).normalize();
          vertex.copy(center.clone().add(direction.multiplyScalar(radius)));
  
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
    newGeometry.computeVertexNormals();
  
    return newGeometry;
  }
}
