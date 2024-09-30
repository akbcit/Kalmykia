// terrains/RectangularTerrain.ts
import * as THREE from 'three';
import { RectangularPlaneGeometry } from '../geometries/primitives';
import { RectangularPlaneGeometryParams } from '../geometries/primitives/RectangularPlaneGeometry';
import { BaseTerrain, BaseTerrainParams } from './BaseTerrain';

export interface RectangularTerrainParams extends BaseTerrainParams {
  rectangularPlaneParams?: RectangularPlaneGeometryParams;
}

export class RectangularTerrain extends BaseTerrain {
  protected mesh: THREE.Mesh;
  public rectangularPlaneParams: RectangularPlaneGeometryParams;

  constructor(params: RectangularTerrainParams = {}) {
    const { rectangularPlaneParams = {}, ...baseParams } = params;

    // Pass the base params to the parent class constructor
    super(baseParams);

    // Assign the rectangular plane geometry params with default values
    this.rectangularPlaneParams = {
      width: 100,
      height: 100,
      widthSegments: 50,
      heightSegments: 50,
      ...rectangularPlaneParams, // Override default values if passed
    };

    // Initialize and create the mesh after params are set
    this.mesh = this.createMesh();
  }

  // Override and implement the abstract method to create terrain geometry
  protected createTerrainGeometry(): THREE.BufferGeometry {
    const { width, height, widthSegments, heightSegments } = this.rectangularPlaneParams;

    // Create a rectangular plane geometry
    const geometry = new RectangularPlaneGeometry({
      width,
      height,
      widthSegments,
      heightSegments,
    });

    // Rotate the plane to be horizontal
    geometry.rotateX(-Math.PI / 2);

    return geometry;
  }

  // Create a mesh from the geometry and material
  protected createMesh(): THREE.Mesh {
    // Create geometry
    const geometry = this.createTerrainGeometry();

    // Apply noise if required
    if (this.useNoise) {
      this.applyNoiseToTerrain(geometry); // Default values can be adjusted or passed as parameters
    }

    // Create mesh from geometry and material
    const mesh = new THREE.Mesh(geometry, this.material);
    mesh.receiveShadow = this.receiveShadow;

    return mesh;
  }

  // Return the mesh as a 3D object
  public getObject3D(): THREE.Object3D {
    return this.mesh;
  }
}
