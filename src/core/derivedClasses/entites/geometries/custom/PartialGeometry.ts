import * as THREE from 'three';

// Interface to define parameters for partial geometry creation
export interface PartialGeometryParams {
  center: THREE.Vector2;         // Center position in the XZ plane for the region of interest
  radius: number;                // Radius around the center to include vertices
  heightRange?: [number, number]; // Optional height range [min, max] to filter vertices
  irregularFactor?: number;       // Optional factor for edge irregularity
  falloff?: 'linear' | 'smooth';  // Optional falloff type for the region
}



export class PartialGeometry extends THREE.BufferGeometry {
  constructor(originalGeometry: THREE.BufferGeometry, params: PartialGeometryParams) {
    super(); // Call the parent constructor

    const { center, radius, irregularFactor = 1, heightRange } = params;

    // Convert center from Vector2 to Vector3 for internal operations (assuming y=0)
    const center3D = new THREE.Vector3(center.x, 0, center.y);

    // Perform clipping and irregular edge creation based on parameters
    const clippedGeometry = this.clipGeometry(originalGeometry, center3D, radius, heightRange);
    
    // Ensure the clipped geometry is not empty before creating irregular edges
    if (clippedGeometry.attributes.position === undefined || clippedGeometry.attributes.position.count === 0) {
      console.warn('Clipped geometry is empty or undefined. Returning an empty geometry.');
      return;
    }

    const irregularGeometry = this.createIrregularEdges(clippedGeometry, center3D, radius, irregularFactor);

    // Copy attributes and indices from the resulting geometry to this geometry
    this.copy(irregularGeometry);
  }

  // Method to clip geometry based on center, radius, and height range
  clipGeometry(originalGeometry: THREE.BufferGeometry, center: THREE.Vector3, radius: number, heightRange?: [number, number]): THREE.BufferGeometry {
    const geom = originalGeometry.clone();
    const position = geom.attributes.position as THREE.BufferAttribute;

    // Check if the position attribute is defined
    if (!position) {
      console.error('Geometry position attribute is undefined.');
      return new THREE.BufferGeometry();
    }

    // Filter vertices based on their distance from the center and height range
    const vertices: THREE.Vector3[] = [];
    for (let i = 0; i < position.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(position, i);
      const distance = vertex.distanceTo(center);

      // Check if the vertex is within the radius and height range, if specified
      const withinRadius = distance <= radius;
      const withinHeightRange = !heightRange || (vertex.y >= heightRange[0] && vertex.y <= heightRange[1]);

      if (withinRadius && withinHeightRange) { // Keep vertices that satisfy the conditions
        vertices.push(vertex);
      }
    }

    // Reconstruct geometry using the filtered vertices
    if (vertices.length === 0) {
      console.warn('No vertices found within the specified region. Returning an empty geometry.');
      return new THREE.BufferGeometry();
    }

    const newGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
    newGeometry.computeVertexNormals(); // Recompute normals for the new geometry
    return newGeometry;
  }

  // Method to add irregular edges to the geometry around a specified center and radius
  createIrregularEdges(geometry: THREE.BufferGeometry, center: THREE.Vector3, radius: number, irregularFactor: number): THREE.BufferGeometry {
    const position = geometry.attributes.position as THREE.BufferAttribute;

    // Check if position attribute is defined
    if (!position) {
      console.error('Position attribute is undefined. Returning original geometry.');
      return geometry;
    }

    const newPositions: THREE.Vector3[] = [];

    for (let i = 0; i < position.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(position, i);

      // Calculate distance from the center to decide if the vertex should be affected
      const distanceToCenter = vertex.distanceTo(center);

      if (distanceToCenter <= radius) {
        // Apply noise-based random displacement for irregularity within the radius
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * irregularFactor,
          (Math.random() - 0.5) * irregularFactor,
          (Math.random() - 0.5) * irregularFactor
        );
        vertex.add(offset); // Displace vertex
      }

      newPositions.push(vertex);
    }

    // Update geometry with new vertices
    const irregularGeometry = new THREE.BufferGeometry().setFromPoints(newPositions);
    irregularGeometry.computeVertexNormals();
    return irregularGeometry;
  }
}

