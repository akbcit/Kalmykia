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

  // Method to clip geometry based on center and radius
  clipGeometry(
    originalGeometry: THREE.BufferGeometry,
    center: THREE.Vector3,
    radius: number,
    edgeSmoothing: boolean,
    noiseIntensity: number,
    smoothingRadius: number
  ): THREE.BufferGeometry {
    // Clone the original geometry to modify
    const geom = originalGeometry.clone();
    const position = geom.attributes.position as THREE.BufferAttribute;
    const index = geom.index;

    if (!position) {
      console.error('Geometry position attribute is undefined.');
      return new THREE.BufferGeometry();
    }

    // Create arrays to store clipped positions and indices
    const newPositions: number[] = [];
    const newIndices: number[] = [];
    const vertexMap: Map<number, number> = new Map(); // Map to store the new index of each vertex

    let newIndex = 0;
    const noise = createNoise2D(); // Initialize the noise generator

    // Iterate through the vertices and retain only those within the radius
    for (let i = 0; i < position.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(position, i);
      const distance = vertex.distanceTo(new THREE.Vector3(center.x, vertex.y, center.z));

      // Check if the vertex is within the radius
      if (distance <= radius) {
        // If edge smoothing is enabled and the vertex is near the edge, apply smoothing
        if (edgeSmoothing && distance >= radius - smoothingRadius) {
          const factor = (radius - distance) / smoothingRadius;
          const smoothedVertex = vertex.clone().lerp(center, 1 - factor); // Linear interpolation
          vertex.copy(smoothedVertex);

          // Optionally, add noise for more natural smoothing
          if (noiseIntensity > 0) {
            const noiseValue = noise(vertex.x * 0.1, vertex.z * 0.1) * noiseIntensity;
            vertex.add(vertex.clone().sub(center).normalize().multiplyScalar(noiseValue));
          }
        }
        newPositions.push(vertex.x, vertex.y, vertex.z);
        vertexMap.set(i, newIndex++); // Map old index to new index
      }
    }

    // If no vertices are within the radius, return an empty geometry
    if (newPositions.length === 0) {
      console.warn('No vertices found within the specified region. Returning an empty geometry.');
      return new THREE.BufferGeometry();
    }

    // Create a new index array by mapping old indices to new ones, ensuring valid faces
    if (index) {
      for (let i = 0; i < index.count; i += 3) {
        const a = index.getX(i);
        const b = index.getX(i + 1);
        const c = index.getX(i + 2);

        // Only include faces where all vertices are within the new geometry
        if (vertexMap.has(a) && vertexMap.has(b) && vertexMap.has(c)) {
          newIndices.push(vertexMap.get(a)!, vertexMap.get(b)!, vertexMap.get(c)!);
        }
      }
    }

    // Create a new geometry with the clipped vertices and indices
    const newGeometry = new THREE.BufferGeometry();
    newGeometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
    newGeometry.setIndex(newIndices);
    newGeometry.computeVertexNormals(); // Recompute normals for the new geometry

    return newGeometry;
  }
}
