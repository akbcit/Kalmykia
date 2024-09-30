// terrains/IrregularTerrain.ts
import * as THREE from 'three';
import { IrregularPlaneGeometry, IrregularPlaneGeometryParams } from '../geometries/primitives/IrregularPlaneGeometry';
import { BaseTerrain, BaseTerrainParams } from './BaseTerrain';

export interface IrregularTerrainParams extends BaseTerrainParams {
  irregularPlaneGeometryParams?: IrregularPlaneGeometryParams;
}

export class IrregularTerrain extends BaseTerrain {
  private irregularPlaneGeometryParams: IrregularPlaneGeometryParams;
  protected mesh: THREE.Mesh; // Mesh to represent the terrain

  constructor(params: IrregularTerrainParams = {}) {
    // Destructure params to separate the base params and irregular geometry params
    const { irregularPlaneGeometryParams = {}, ...baseParams } = params;

    // Pass the base params to the parent class constructor
    super(baseParams);

    // Assign the irregular plane geometry params with default values
    this.irregularPlaneGeometryParams = {
      radius: 50,
      segments: 30,
      boundaryDisplacementFactor: 5,
      curvatureLayers: 3,
      smoothnessFactor: 2,
      ...irregularPlaneGeometryParams, // Override default values if passed
    };

    // Initialize and create the mesh after params are set
    this.mesh = this.createMesh();
  }

  // Override method to create an irregular plane geometry
  protected createTerrainGeometry(): THREE.BufferGeometry {
    const {
      radius,
      segments,
      boundaryDisplacementFactor,
      curvatureLayers,
      smoothnessFactor,
    } = this.irregularPlaneGeometryParams;

    // Create a new IrregularPlaneGeometry with the defined parameters
    const geometry = new IrregularPlaneGeometry({
      radius,
      segments,
      boundaryDisplacementFactor,
      curvatureLayers,
      smoothnessFactor,
    });

    return geometry;
  }

  // Create a mesh from the geometry and material
  protected createMesh(): THREE.Mesh {
    // Create geometry using the method implemented in this class
    const geometry = this.createTerrainGeometry();

    // Apply noise if needed
    if (this.useNoise && this.noise2D) {
      this.applyNoiseToTerrain(geometry); // Default values or pass as params
    }

    // Create the mesh with the geometry and material
    const mesh = new THREE.Mesh(geometry, this.material);
    mesh.receiveShadow = this.receiveShadow;

    return mesh;
  }

  // Method to update the terrain's geometry dynamically
  public updateGeometry(newParams: Partial<IrregularTerrainParams>): void {
    // Update the irregular plane geometry params with new values
    this.irregularPlaneGeometryParams = {
      ...this.irregularPlaneGeometryParams,
      ...newParams.irregularPlaneGeometryParams,
    };

    // Create new geometry with updated parameters
    const newGeometry = this.createTerrainGeometry();

    // Replace the old geometry with the new one
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.geometry = newGeometry;
      this.mesh.geometry.computeVertexNormals();
    }
  }

  // Return the mesh as a 3D object
  public getObject3D(): THREE.Object3D {
    return this.mesh;
  }
}
