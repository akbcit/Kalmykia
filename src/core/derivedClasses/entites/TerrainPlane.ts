import * as THREE from 'three';
import { PlaneGeometry } from './geometries/primitives';
import { Entity } from '../../parentClasses/Entity';
import { MeshComponent } from '../components/MeshComponent';
import { MaterialFactory } from './materials/MaterialFactory';
import { createNoise2D } from 'simplex-noise'; // Use Simplex noise directly
import { NoiseFunction } from '../../../utils/noise/types/NoiseFunction';

const materialFactory = new MaterialFactory();

export interface TerrainParams {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
  material?: THREE.Material;
  noiseScale?: number;
  heightFactor?: number;
  receiveShadow?: boolean;
  noiseFunction?: NoiseFunction;
}

export class TerrainPlane extends Entity {
  private mesh: THREE.Mesh;
  private noise2D: (x: number, y: number) => number;

  constructor({
    width = 100,
    height = 100,
    widthSegments = 50,
    heightSegments = 50,
    material = materialFactory.createStandardMaterial({ color: 0x228b22 }),
    noiseScale = 10,
    heightFactor = 10,
    receiveShadow = true,
    // use the passed noise function or default to Simplex noise
    noiseFunction = createNoise2D(Math.random),
  }: TerrainParams) {

    // Call the Entity constructor
    super();

    // Assign the passed noise function
    this.noise2D = noiseFunction;

    // create terrain geometry
    const geometry = this.createTerrainGeometry(width, height, widthSegments, heightSegments);

    // apply noise to terrain to...
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

    // Simplex noise with random seed
    return createNoise2D(Math.random);
  }

  // create terrain geometry
  private createTerrainGeometry(width: number, height: number, widthSegments: number, heightSegments: number): THREE.PlaneGeometry {

    const geometry = new PlaneGeometry({
      width,
      height,
      widthSegments,
      heightSegments,
    });

    // rotate to make it horizontal
    geometry.rotateX(-Math.PI / 2);

    return geometry;
  }

  // the logic of applying noise to terrain vertices
  private applyNoiseToTerrain(geometry: THREE.PlaneGeometry, noiseScale: number, heightFactor: number): void {

    // take positionAttribute of geometry 
    const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;

    // for each positionAttribute
    for (let i = 0; i < positionAttribute.count; i++) {

      // get x 
      const x = positionAttribute.getX(i);

      // get z
      const z = positionAttribute.getZ(i);

      // assign a height (y)
      let heightValue = this.noise2D(x / noiseScale, z / noiseScale);

      // 10 by default
      heightValue *= heightFactor;

      // set y!
      positionAttribute.setY(i, heightValue);
    }

    // mark for update
    positionAttribute.needsUpdate = true;
  }

  // mesh creation
  private createMesh(geometry: THREE.BufferGeometry, material: THREE.Material, receiveShadow: boolean): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material);

    // receive shadow
    mesh.receiveShadow = receiveShadow;
    return mesh;
  }

  // adding the mesh component to Terrain Entity
  private addMeshComponent(mesh: THREE.Mesh): void {
    const meshComponent = new MeshComponent(mesh.geometry, mesh.material);
    this.addComponent(meshComponent);
  }

  // method to return mesh
  public getObject3D(): THREE.Object3D {
    return this.mesh;
  }
}
