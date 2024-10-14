import * as THREE from "three";
import { NoiseFunction } from "../../../../../utils/noise/types/NoiseFunction";
import { PartialGeometry, PartialGeometryParams } from "./PartialGeometry";

export interface BaseIrregularGeometryParams {
  position?: [number, number, number];
  noiseFunction?: NoiseFunction; // Optional noise function
  heightFactor?: number;
  baseHeight?: number;
}

export abstract class BaseIrregularGeometry {
  protected geometry: THREE.BufferGeometry = new THREE.BufferGeometry(); // Initialize with empty geometry
  params: Required<Omit<BaseIrregularGeometryParams, 'noiseFunction'>> & { noiseFunction?: NoiseFunction };
  protected initialHeights: Float32Array | null = null;

  constructor(params: BaseIrregularGeometryParams) {
    this.params = {
      position: params.position || [0, 0, 0],
      noiseFunction: params.noiseFunction,
      heightFactor: params.heightFactor || 1,
      baseHeight: params.baseHeight || 0,
    };
  }

  // Call after geometry creation
  protected initializeGeometry(): void {
    this.storeInitialHeights();
    this.applyNoise();
  }

  protected abstract createGeometry(): void;

  /**
   * Store initial heights (Y coordinates) for resetting later.
   */
  protected storeInitialHeights(): void {
    const positions = this.geometry.attributes.position as THREE.BufferAttribute;
    this.initialHeights = new Float32Array(positions.count);

    for (let i = 0; i < positions.count; i++) {
      this.initialHeights[i] = positions.getY(i); // Store initial Y positions
    }
  }

  /**
   * Apply noise to the geometry's vertices if a noise function is available.
   */
  public applyNoise(): void {
    const positions = this.geometry.attributes.position as THREE.BufferAttribute;
    const { noiseFunction, heightFactor, baseHeight } = this.params;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);

      const noiseValue = noiseFunction ? noiseFunction(x, y) * heightFactor : 0;
      positions.setY(i, baseHeight + noiseValue); // Set new height
    }

    positions.needsUpdate = true;
    this.geometry.computeVertexNormals(); // Ensure smooth shading
  }

  /**
   * Set a new noise function and reapply it to the geometry.
   */
  public setNoiseFunction(newNoiseFunction?: NoiseFunction): void {
    this.params.noiseFunction = newNoiseFunction;
    this.applyNoise();
  }

  /**
   * Update the height factor and reapply noise.
   */
  public setHeightFactor(newHeightFactor: number): void {
    this.params.heightFactor = newHeightFactor;
    this.applyNoise();
  }

  /**
   * Reset geometry to its original height using stored initial values.
   */
  public resetHeights(): void {
    if (!this.initialHeights) return;

    const positions = this.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      positions.setY(i, this.initialHeights[i]); // Reset to original height
    }

    positions.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  /**
   * Update parameters dynamically and reapply noise.
   */
  public updateParams(updatedParams: Partial<BaseIrregularGeometryParams>): void {
    Object.assign(this.params, updatedParams); // Merge new params
    this.applyNoise(); // Reapply noise with updated parameters
  }

  /**
   * Get the generated geometry.
   */
  public getGeometry(): THREE.BufferGeometry {
    return this.geometry;
  }

  /**
   * Dispose of the geometry to free GPU resources.
   */
  public disposeGeometry(): void {
    this.geometry.dispose(); // Free GPU resources

    // Iterate over each attribute and safely clean up the array
    for (const key in this.geometry.attributes) {
      const attribute = this.geometry.getAttribute(key) as THREE.BufferAttribute;
      if (attribute) {
        attribute.array = new Float32Array(); // Replace with an empty array
        attribute.needsUpdate = true;
      }
    }
  }

  public createPartialGeometry(params: PartialGeometryParams) {
    const geometry = this.getGeometry();
    const partialGeometry = new PartialGeometry(geometry, params);
    return partialGeometry;
  }
}
