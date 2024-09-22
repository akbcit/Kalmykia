import * as THREE from 'three';
import { PlaneGeometry } from './geometries/primitives';
import { Entity } from '../../parentClasses/Entity';
import { MeshComponent } from '../components/MeshComponent';
import { MaterialFactory } from './materials/MaterialFactory';
import { createNoise2D } from 'simplex-noise'; // Use Simplex noise directly

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
}

export class Terrain extends Entity {
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
  }: TerrainParams) {
    super(); // Call the Entity constructor
    this.noise2D = this.initializeNoise(); // Extract noise initialization

    const geometry = this.createTerrainGeometry(width, height, widthSegments, heightSegments);
    this.applyNoiseToTerrain(geometry, noiseScale, heightFactor); // Apply noise in a separate method
    geometry.computeVertexNormals(); // Compute normals

    this.mesh = this.createMesh(geometry, material, receiveShadow); // Create mesh

    this.addMeshComponent(this.mesh); // Add mesh component
  }

  // Extract noise initialization into its own method
  private initializeNoise(): (x: number, y: number) => number {
    return createNoise2D(Math.random); // Simplex noise with random seed
  }

  // Extract terrain geometry creation into its own method
  private createTerrainGeometry(width: number, height: number, widthSegments: number, heightSegments: number): THREE.PlaneGeometry {
    const geometry = new PlaneGeometry({
      width,
      height,
      widthSegments,
      heightSegments,
    });
    geometry.rotateX(-Math.PI / 2); // Rotate to make it horizontal
    return geometry;
  }

  // Extract the logic of applying noise to terrain vertices into its own method
  private applyNoiseToTerrain(geometry: THREE.PlaneGeometry, noiseScale: number, heightFactor: number): void {
    const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const z = positionAttribute.getZ(i);
      let heightValue = this.noise2D(x / noiseScale, z / noiseScale);
      heightValue *= heightFactor;
      positionAttribute.setY(i, heightValue);
    }
    positionAttribute.needsUpdate = true; // Mark for update
  }

  // Extract mesh creation into its own method
  private createMesh(geometry: THREE.BufferGeometry, material: THREE.Material, receiveShadow: boolean): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = receiveShadow;
    return mesh;
  }

  // Extract adding the mesh component into its own method
  private addMeshComponent(mesh: THREE.Mesh): void {
    const meshComponent = new MeshComponent(mesh.geometry, mesh.material);
    this.addComponent(meshComponent);
  }

  public getObject3D(): THREE.Object3D {
    return this.mesh;
  }
}
