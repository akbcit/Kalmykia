import * as THREE from "three";

export interface CustomGeometryParams {
  center: [number, number, number]; // Center of the plane (x, y, z)
  radius: number; // Radius of the circular plane
  smoothness?: number; // Number of points for smooth interpolation
  wiggliness?: number; // Controls edge irregularity
}

export class CustomGeometry {
  private geometry: THREE.BufferGeometry;
  private params: CustomGeometryParams;

  constructor(params: CustomGeometryParams) {
    this.params = params;

    const curvePoints = this.createCatmullRomPoints(); // Generate smooth points
    this.geometry = this.createGeometryFromCurve(curvePoints); // Create geometry with UVs
  }

  // Generate smooth, wiggly points along a Catmull-Rom spline
  private createCatmullRomPoints(): THREE.Vector3[] {
    const { radius, center, smoothness = 10, wiggliness = 0.1 } = this.params;
    const [cx, cy, cz] = center;
    const segments = 32; // Number of points around the circle

    // Generate points with wiggle along the X-Z plane
    return Array.from({ length: segments }, (_, i) => {
      const angle = (i / segments) * Math.PI * 2;
      const x = (radius + this.getWigglyOffset(wiggliness)) * Math.cos(angle);
      const z = (radius + this.getWigglyOffset(wiggliness)) * Math.sin(angle);
      return new THREE.Vector3(x + cx, cy, z + cz); // Points aligned on X-Z
    });
  }

  // Generate random offset for wiggly edges
  private getWigglyOffset(wiggliness: number): number {
    return (Math.random() - 0.5) * wiggliness;
  }

  // Create geometry from curve points and generate UVs
  private createGeometryFromCurve(points: THREE.Vector3[]): THREE.BufferGeometry {
    const vertices = [];
    const indices = [];
    const uvs = []; // Store UV coordinates

    // Add center point
    const [cx, cy, cz] = this.params.center;
    vertices.push(cx, cy, cz);
    uvs.push(0.5, 0.5); // Center of texture is (0.5, 0.5)

    // Add curve points to vertices and calculate UVs
    for (const point of points) {
      vertices.push(point.x, point.y, point.z);
      const u = 0.5 + (point.x - cx) / (2 * this.params.radius);
      const v = 0.5 + (point.z - cz) / (2 * this.params.radius);
      uvs.push(u, v); // Map X-Z plane points to UV coordinates
    }

    // Create faces connecting the center to the curve points
    for (let i = 1; i < points.length; i++) {
      indices.push(0, i, i + 1);
    }
    indices.push(0, points.length, 1); // Close the loop

    // Create BufferGeometry with vertices, indices, and UVs
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); // Set UV attribute
    geometry.setIndex(indices);
    geometry.computeVertexNormals(); // Compute normals for shading

    return geometry;
  }

  // Get the final geometry
  public getGeometry(): THREE.BufferGeometry {
    return this.geometry;
  }
}
