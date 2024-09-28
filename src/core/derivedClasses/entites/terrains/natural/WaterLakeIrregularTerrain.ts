import * as THREE from 'three';
import { IrregularTerrain, IrregularTerrainParams } from '../IrregularTerrain';

export interface WaterLakeIrregularTerrainParams extends IrregularTerrainParams {
    rippleSpeed?: number;
    rippleFrequency?: number;
    amplitude?: number;
    rippleFunction?: (x: number, z: number, distanceFromCenter: number, elapsedTime: number) => number;
  }

  export class WaterLakeIrregularTerrain extends IrregularTerrain {
    private clock: THREE.Clock;
    public rippleSpeed: number;
    public rippleFrequency: number;
    public amplitude: number;
    private originalPositions!: Float32Array;
    private rippleFunction: (x: number, z: number, distanceFromCenter: number, elapsedTime: number) => number;
  
    constructor(params: WaterLakeIrregularTerrainParams = {}) {
      // Merge the default irregular plane parameters with incoming params
      const defaultIrregularParams: IrregularTerrainParams = {
        irregularPlaneGeometryParams: {
          radius: 1, // Default radius
          segments: 60, // Increase segments for a smoother surface
          boundaryDisplacementFactor: 2, // Lower for less chaotic boundary
          curvatureLayers: 2, // Number of sine/cosine layers for complexity
          smoothnessFactor: 3, // Smoother boundary
        },
        material: new THREE.MeshStandardMaterial({ color: 0x3399ff, wireframe: false }), // Default water-like material
      };
  
      // Merge the provided params with default values for `IrregularTerrain`
      super({ ...defaultIrregularParams, ...params });
  
      // Additional parameters for water ripples
      this.clock = new THREE.Clock();
      this.rippleSpeed = params.rippleSpeed ?? 1.0;
      this.rippleFrequency = params.rippleFrequency ?? 0.1;
      this.amplitude = params.amplitude ?? 0.5;
  
      // Use the provided ripple function or use the default circular ripple function
      this.rippleFunction = params.rippleFunction ?? this.defaultRippleFunction;
  
      // Initialize originalPositions after the geometry is created in the base class
      if (this.mesh && this.mesh.geometry) {
        this.originalPositions = new Float32Array((this.mesh.geometry.attributes.position as THREE.BufferAttribute).array);
      } else {
        console.error("Mesh or geometry not found in the base class.");
      }
    }
  
    // Default ripple function for circular ripples
    private defaultRippleFunction(x: number, z: number, distanceFromCenter: number, elapsedTime: number): number {
      return Math.sin(this.rippleFrequency * (distanceFromCenter - elapsedTime * this.rippleSpeed)) * this.amplitude;
    }
  
    // Method to update ripple effect based on time
    public updateRipples(): void {
      if (!this.mesh || !this.mesh.geometry) return;
  
      const positionAttribute = this.mesh.geometry.attributes.position as THREE.BufferAttribute;
      const elapsedTime = this.clock.getElapsedTime();
  
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = this.originalPositions[i * 3];
        const z = this.originalPositions[i * 3 + 2];
  
        // Calculate the distance from the center (0,0) to (x,z)
        const distanceFromCenter = Math.sqrt(x * x + z * z);
  
        // Use the ripple function to calculate the y position
        const y = this.rippleFunction(x, z, distanceFromCenter, elapsedTime);
  
        // Set the new Y position for the vertex
        positionAttribute.setY(i, y);
      }
  
      // Recompute normals to ensure proper lighting effects
      this.mesh.geometry.computeVertexNormals();
  
      // Mark the position attribute as needing update
      positionAttribute.needsUpdate = true;
    }
  }