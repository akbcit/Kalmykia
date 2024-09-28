import * as THREE from 'three';

export interface IrregularPlaneGeometryParams {
  radius?: number; // Define the radius for the plane
  segments?: number; // Number of segments around the circular plane
  boundaryDisplacementFactor?: number; // Controls the amount of displacement for the boundary
  curvatureLayers?: number; // Number of curvature layers to add complexity
  smoothnessFactor?: number; // Parameter to control smoothness and flow of boundaries
}

export class IrregularPlaneGeometry extends THREE.BufferGeometry {
  constructor({
    radius = 50, // Default radius for the circular plane
    segments = 30, // Number of segments for smoother edges
    boundaryDisplacementFactor = 5,
    curvatureLayers = 3, // Number of sine/cosine layers to add complexity
    smoothnessFactor = 2, // Increase to make the boundary smoother
  }: IrregularPlaneGeometryParams) {
    super();

    // Create a circular base plane with randomized, smooth edges
    this.createRandomizedCircularPlane(radius, segments, boundaryDisplacementFactor, curvatureLayers, smoothnessFactor);

    // Compute normals once after setting vertices and indices
    this.computeVertexNormals();
  }

  private createRandomizedCircularPlane(
    radius: number,
    segments: number,
    boundaryDisplacementFactor: number,
    curvatureLayers: number,
    smoothnessFactor: number
  ) {
    const vertices: number[] = [];
    const indices: number[] = [];

    // Calculate angle increment for each segment
    const angleIncrement = (Math.PI * 2) / segments;

    // Create center vertex
    vertices.push(0, 0, 0); // Center point (x = 0, y = 0, z = 0)

    // Create boundary vertices with randomization
    for (let i = 0; i < segments; i++) {
      // Calculate angle for this segment
      const angle = i * angleIncrement;

      // Calculate initial x and z positions for this vertex on the circle
      let x = Math.cos(angle) * radius;
      let z = Math.sin(angle) * radius;

      // Apply multiple layers of displacement with randomization to create smoother boundary irregularities
      for (let layer = 1; layer <= curvatureLayers; layer++) {
        const frequency = layer * smoothnessFactor + Math.random() * 0.5; // Randomize frequency
        const amplitude = (boundaryDisplacementFactor / (layer * 1.5)) + Math.random() * boundaryDisplacementFactor * 0.1; // Randomize amplitude slightly

        // Calculate displacement using sine with random values
        const displacement = Math.sin(angle * frequency) * amplitude;

        // Randomly alter position with displacement and random factors
        x += displacement * Math.cos(angle) + (Math.random() - 0.5) * boundaryDisplacementFactor * 0.2;
        z += displacement * Math.sin(angle) + (Math.random() - 0.5) * boundaryDisplacementFactor * 0.2;
      }

      // Slight randomization of the vertex position itself
      x += (Math.random() - 0.5) * boundaryDisplacementFactor * 0.5;
      z += (Math.random() - 0.5) * boundaryDisplacementFactor * 0.5;

      // Keep the y position constant at 0 for a flat plane
      const y = 0;

      // Push the vertex position to the vertices array
      vertices.push(x, y, z);
    }

    // Create indices for triangles between center vertex and boundary vertices
    for (let i = 1; i < segments; i++) {
      // Indices for triangle from center to boundary
      indices.push(0, i, i + 1);
    }

    // Connect the last vertex back to the first boundary vertex to close the loop
    indices.push(0, segments, 1);

    // Set the position attribute for the geometry
    this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.setIndex(indices);
  }
}
