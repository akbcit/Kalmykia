import * as THREE from "three";
import { NoiseFunction } from "../../../../../utils/noise/types/NoiseFunction";

export interface IrregularCircularGeometryParams {
  radius: number;
  segments?: number; // Number of subdivisions (grid density)
  position?: [number, number, number];
  noiseFunction: NoiseFunction;
  heightFactor?: number;
}

export class IrregularCircularGeometry {
  private geometry: THREE.BufferGeometry;
  private params: Required<IrregularCircularGeometryParams>;

  constructor(params: IrregularCircularGeometryParams) {
    this.params = {
      radius: params.radius,
      segments: params.segments || 64,
      position: params.position || [0, 0, 0],
      noiseFunction: params.noiseFunction,
      heightFactor: params.heightFactor || 1,
    };

    this.geometry = this.createCircularGridGeometry(); // Create the circular grid
    this.applyNoise(); // Apply plane-like noise
    this.rotateToXZPlane();
    this.positionPlane();
  }

  /**
   * Create a circular geometry by generating a square grid and filtering out vertices outside the circle.
   */
  private createCircularGridGeometry(): THREE.BufferGeometry {
    const { radius, segments } = this.params;
    const step = (2 * radius) / segments; // Grid step size
    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const map: Map<string, number> = new Map(); // Track vertex indices

    let index = 0;

    // Generate the square grid
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = -radius + i * step;
        const y = -radius + j * step;

        // Only keep vertices inside the circular boundary
        if (x * x + y * y <= radius * radius) {
          vertices.push(x, y, 0); // Store the vertex

          // Generate UV coordinates for texture mapping
          const u = (x + radius) / (2 * radius);
          const v = (y + radius) / (2 * radius);
          uvs.push(u, v);

          map.set(`${i}-${j}`, index++); // Track vertex index
        }
      }
    }

    // Create triangle indices for the circular grid
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = map.get(`${i}-${j}`);
        const b = map.get(`${i + 1}-${j}`);
        const c = map.get(`${i}-${j + 1}`);
        const d = map.get(`${i + 1}-${j + 1}`);

        // Ensure indices exist and add triangles
        if (a !== undefined && b !== undefined && c !== undefined) {
          indices.push(a, b, c);
        }
        if (b !== undefined && c !== undefined && d !== undefined) {
          indices.push(b, d, c);
        }
      }
    }

    // Create and populate the BufferGeometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.setAttribute(
      "uv",
      new THREE.Float32BufferAttribute(uvs, 2) // Set UVs for texture mapping
    );
    geometry.setIndex(indices);
    geometry.computeVertexNormals(); // Ensure smooth shading
    return geometry;
  }

  /**
   * Apply plane-like noise to the circular geometry.
   */
  private applyNoise(): void {
    const positions = this.geometry.attributes.position as THREE.BufferAttribute;
    const { radius, noiseFunction, heightFactor } = this.params;

    // Apply noise to the Z-coordinate of each vertex
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);

      // Treat (x, y) as Cartesian coordinates
      const nx = (x + radius) / (2 * radius);
      const ny = (y + radius) / (2 * radius);

      // Apply noise to the z-coordinate
      const noiseValue = noiseFunction(nx, ny) * heightFactor;
      positions.setZ(i, noiseValue);
    }

    positions.needsUpdate = true;
    this.geometry.computeVertexNormals(); // Smooth the shading
  }

  /**
   * Rotate the plane to align with the XZ plane.
   */
  private rotateToXZPlane(): void {
    this.geometry.rotateX(-Math.PI / 2); // Align to XZ plane
  }

  /**
   * Translate the plane to its given position.
   */
  private positionPlane(): void {
    const [x, y, z] = this.params.position;
    this.geometry.translate(x, y, z); // Position the plane in the scene
  }

  /**
   * Return the generated geometry.
   */
  public getGeometry(): THREE.BufferGeometry {
    return this.geometry;
  }
}
