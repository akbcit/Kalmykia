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

    // Create a circular base plane with randomized, smooth edges on the X-Z plane
    this.createRandomizedCircularPlane(radius, segments, boundaryDisplacementFactor, curvatureLayers, smoothnessFactor);

    // Compute normals once after setting vertices and indices
    this.computeVertexNormals();

    // Rotate the geometry to lie on the X-Z plane
    this.rotateX(-Math.PI / 2); // Rotate by 90 degrees around the X-axis
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

    // Create center vertex for X-Z plane
    vertices.push(0, 0, 0); // Center point (x = 0, y = 0, z = 0)

    // Create boundary vertices with randomization on the X-Z plane
    for (let i = 0; i < segments; i++) {
      // Calculate angle for this segment
      const angle = i * angleIncrement;

      // Calculate initial x and z positions for this vertex on the circle based on the radius
      let x = Math.cos(angle) * radius;
      let z = Math.sin(angle) * radius; // Use `z` for boundary position, y will be 0

      // Apply multiple layers of displacement with randomization to create smoother boundary irregularities
      for (let layer = 1; layer <= curvatureLayers; layer++) {
        const frequency = layer * smoothnessFactor; // Control frequency based on smoothness factor
        const amplitude = boundaryDisplacementFactor / (layer * 2); // Control amplitude based on displacement factor

        // Calculate displacement using sine and cosine with frequency and amplitude
        const displacement = Math.sin(angle * frequency) * amplitude;

        // Randomly alter position with displacement to create irregularities
        x += displacement * Math.cos(angle);
        z += displacement * Math.sin(angle);
      }

      // Slight randomization of the vertex position itself
      x += (Math.random() - 0.5) * boundaryDisplacementFactor * 0.2;
      z += (Math.random() - 0.5) * boundaryDisplacementFactor * 0.2;

      // Push the boundary vertex position to the vertices array for X-Z plane
      vertices.push(x, 0, z); // Ensure y position is 0 for a flat plane on X-Z
    }

    // Create indices for triangles between center vertex and boundary vertices
    for (let i = 1; i < segments; i++) {
      indices.push(0, i, i + 1);
    }

    // Connect the last vertex back to the first boundary vertex to close the loop
    indices.push(0, segments, 1);

    // Set the position attribute for the geometry
    this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.setIndex(indices);
  }
}
