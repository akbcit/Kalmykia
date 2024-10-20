import * as THREE from "three";
import { NoiseFunction } from "../../../../../utils/noise/types/NoiseFunction";
import { BaseIrregularGeometry, BaseIrregularGeometryParams } from "./BaseIrregularGeometry";

export interface IrregularCircularGeometryParams extends BaseIrregularGeometryParams {
  radius: number;
  segments?: number;
}

export class IrregularCircularGeometry extends BaseIrregularGeometry {
  params: Required<Omit<IrregularCircularGeometryParams, 'noiseFunction'>> & { noiseFunction?: NoiseFunction };

  constructor(params: IrregularCircularGeometryParams) {
    super(params);
    this.params = {
      radius: params.radius,
      segments: params.segments || 64,
      position: params.position || [0, 0, 0],
      noiseFunction: params.noiseFunction,
      heightFactor: params.heightFactor || 1,
      baseHeight: params.baseHeight || 0,
    };

    this.createGeometry();   
    this.initializeGeometry();   
  }

  /**
   * Create the circular geometry with UV mapping on the XZ plane.
   */
  protected createGeometry(): void {
    this.disposeGeometry(); // Dispose old geometry
  
    const { radius, segments } = this.params;
    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const vertexIndexMap: Map<string, number> = new Map();
    const step = (2 * radius) / segments;
    let index = 0;
  
    // Generate vertices on the XZ plane
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = -radius + i * step;
        const z = -radius + j * step;
  
        if (x * x + z * z <= radius * radius) {
          vertices.push(x, 0, z); // Use (x, 0, z) for XZ alignment
  
          // UV mapping for texture coordinates
          const u = (x + radius) / (2 * radius);
          const v = (z + radius) / (2 * radius); // Z-axis for UVs
          uvs.push(u, v);
  
          vertexIndexMap.set(`${i}-${j}`, index++);
        }
      }
    }
  
    // Generate triangle indices with correct winding order (CCW)
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = vertexIndexMap.get(`${i}-${j}`);
        const b = vertexIndexMap.get(`${i + 1}-${j}`);
        const c = vertexIndexMap.get(`${i}-${j + 1}`);
        const d = vertexIndexMap.get(`${i + 1}-${j + 1}`);
  
        // Ensure the triangles are defined in counter-clockwise (CCW) order
        if (a !== undefined && b !== undefined && c !== undefined) indices.push(a, c, b);
        if (b !== undefined && c !== undefined && d !== undefined) indices.push(b, c, d);
      }
    }
  
    // Create BufferGeometry and assign attributes
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    this.geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    this.geometry.setIndex(indices);
    this.geometry.computeVertexNormals(); // Smooth shading
  }

  /**
   * Apply noise to the Y-coordinates of vertices, if available.
   */
  public applyNoise(): void {
    const positions = this.geometry.attributes.position as THREE.BufferAttribute;
    const { radius, noiseFunction, heightFactor, segments } = this.params;
  
    if (!noiseFunction) return; // Skip if no noise function
  
    const noiseScale = 1 / Math.sqrt(segments/2); // Scale noise based on segment density
  
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i); // Use Z instead of Y
  
      // Scale X and Z for smoother transitions in noise
      const nx = (x + radius) / (2 * radius) * noiseScale;
      const nz = (z + radius) / (2 * radius) * noiseScale;
  
      // Apply interpolated noise to create smoother height transitions
      const noiseValue = noiseFunction(nx, nz) * heightFactor;
      const currentY = positions.getY(i);
  
      // Use linear interpolation for smoother blending
      const smoothedY = THREE.MathUtils.lerp(currentY, noiseValue, 0.5);
      positions.setY(i, smoothedY);
    }
  
    positions.needsUpdate = true;
    this.geometry.computeVertexNormals(); // Recompute normals for smooth shading
  }

  /**
   * Set a new radius and rebuild the geometry.
   */
  public setRadius(newRadius: number): void {
    this.params.radius = newRadius;
    this.createGeometry();
    this.initializeGeometry();  // Reinitialize after geometry change
  }

  /**
   * Set a new height factor and reapply noise, if available.
   */
  public setHeightFactor(newHeightFactor: number): void {
    this.params.heightFactor = newHeightFactor;
    this.applyNoise();  // Reapply noise with the new height factor
  }

  public getHeightAt(x: number, z: number): number {
    const { radius, noiseFunction, heightFactor } = this.params;

    // Ensure the point is within the circular boundary
    if (x * x + z * z > radius * radius) {
      console.warn(`Point (${x}, ${z}) is outside the terrain boundary.`);
      return 0;
    }

    const nx = (x + radius) / (2 * radius); // Normalize x
    const nz = (z + radius) / (2 * radius); // Normalize z

    const noiseValue = noiseFunction ? noiseFunction(nx, nz) : 0;
    return noiseValue * heightFactor;
  }
}
