import * as THREE from 'three';
import { MaterialFactory } from '../materials/MaterialFactory';
import { NoiseFunction } from '../../../../utils/noise/types/NoiseFunction';
import { createNoise2D } from 'simplex-noise';
import { Entity } from '../../../parentClasses/Entity';
import { MeshComponent } from '../../components/MeshComponent';
import { RectangularPlaneGeometry } from '../geometries/primitives';
import { RectangularPlaneGeometryParams } from '../geometries/primitives/RectangularPlaneGeometry';

const materialFactory = new MaterialFactory();

export interface RectangularTerrainParams {
  rectangularPlaneParams?: RectangularPlaneGeometryParams;
  material?: THREE.Material;
  noiseScale?: number;
  heightFactor?: number;
  receiveShadow?: boolean;
  noiseFunction?: NoiseFunction;
}

export class RectangularTerrain extends Entity {

  private mesh: THREE.Mesh;
  private noise2D: (x: number, y: number) => number;

  constructor({
    rectangularPlaneParams,
    material = materialFactory.createStandardMaterial({ color: 0x228b22 }),
    noiseScale = 10,
    heightFactor = 10,
    receiveShadow = true,
    noiseFunction = createNoise2D(Math.random), // Use the passed noise function or default to Simplex noise
  }: RectangularTerrainParams) {

    // Call the Entity constructor
    super();

    // Assign the passed noise function
    this.noise2D = noiseFunction;

    const {
      width = 100,
      height = 100,
      widthSegments = 50,
      heightSegments = 50
    } = rectangularPlaneParams ?? {};

    // Create terrain geometry
    const geometry = this.createTerrainGeometry(width, height, widthSegments, heightSegments);

    // Apply noise to terrain
    this.applyNoiseToTerrain(geometry, noiseScale, heightFactor);

    // Compute normals
    geometry.computeVertexNormals();

    // Create mesh
    this.mesh = this.createMesh(geometry, material, receiveShadow);

    // Add mesh component
    this.addMeshComponent(this.mesh);
  }

  // Extract noise initialization into its own method
  private initializeNoise(): (x: number, y: number) => number {
    return createNoise2D(Math.random);
  }

  // Create terrain geometry using RectangularPlaneGeometry
  private createTerrainGeometry(width: number, height: number, widthSegments: number, heightSegments: number): RectangularPlaneGeometry {

    const geometry = new RectangularPlaneGeometry({
      width,
      height,
      widthSegments,
      heightSegments,
    });

    // Rotate to make it horizontal
    geometry.rotateX(-Math.PI / 2);

    return geometry;
  }

  // Apply noise to terrain vertices
  private applyNoiseToTerrain(geometry: RectangularPlaneGeometry, noiseScale: number, heightFactor: number): void {
    // Get positionAttribute of geometry
    const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;

    // For each vertex in the position attribute
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i); // Get x position
      const z = positionAttribute.getZ(i); // Get z position

      // Calculate height value using noise function
      let heightValue = this.noise2D(x / noiseScale, z / noiseScale);
      heightValue *= heightFactor; // Scale height value

      // Set y position (height)
      positionAttribute.setY(i, heightValue);
    }

    // Mark the position attribute as needing update
    positionAttribute.needsUpdate = true;
  }

  // Create mesh from geometry and material
  private createMesh(geometry: THREE.BufferGeometry, material: THREE.Material, receiveShadow: boolean): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = receiveShadow;
    return mesh;
  }

  // Add the mesh component to Terrain Entity
  private addMeshComponent(mesh: THREE.Mesh): void {
    const meshComponent = new MeshComponent(mesh.geometry, mesh.material);
    this.addComponent(meshComponent);
  }

  // Return the mesh as a 3D object
  public getObject3D(): THREE.Object3D {
    return this.mesh;
  }
}
