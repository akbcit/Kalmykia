// baseClasses/BaseTerrain.ts
import * as THREE from 'three';
import { Entity } from '../../../parentClasses/Entity';
import { NoiseFunction } from '../../../../utils/noise/types/NoiseFunction';
import { createNoise2D } from 'simplex-noise';
import { MeshComponent } from '../../components/MeshComponent';

export interface BaseTerrainParams {
  noiseScale?: number;
  heightFactor?: number;
  material?: THREE.Material;
  receiveShadow?: boolean;
  noiseFunction?: NoiseFunction;
}

export abstract class BaseTerrain extends Entity {
  protected mesh: THREE.Mesh;
  protected noise2D: (x: number, y: number) => number;

  constructor({
    noiseScale = 10,
    heightFactor = 10,
    material = new THREE.MeshStandardMaterial({ color: 0x228b22 }),
    receiveShadow = true,
    noiseFunction = createNoise2D(Math.random),
  }: BaseTerrainParams) {
    super();

    // Initialize noise function
    this.noise2D = noiseFunction;

    // Create geometry using the derived class's implementation
    const geometry = this.createTerrainGeometry();

    // // Apply noise to terrain
    this.applyNoiseToTerrain(geometry, noiseScale, heightFactor);

    // Compute normals
    geometry.computeVertexNormals();

    // Create mesh and add it to the entity
    this.mesh = this.createMesh(geometry, material, receiveShadow);
    this.addMeshComponent(this.mesh);
  }

  // Abstract method to create terrain geometry
  protected abstract createTerrainGeometry(): THREE.BufferGeometry;

  // Apply noise to terrain vertices
  protected applyNoiseToTerrain(geometry: THREE.BufferGeometry, noiseScale: number, heightFactor: number): void {
    const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const z = positionAttribute.getZ(i);
      let heightValue = this.noise2D(x / noiseScale, z / noiseScale);
      heightValue *= heightFactor;
      positionAttribute.setY(i, heightValue);
    }

    positionAttribute.needsUpdate = true;
  }

  // Create mesh from geometry and material
  private createMesh(geometry: THREE.BufferGeometry, material: THREE.Material, receiveShadow: boolean): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = receiveShadow;
    return mesh;
  }

  // Add the mesh component to the Entity
  private addMeshComponent(mesh: THREE.Mesh): void {
    const meshComponent = new MeshComponent(mesh.geometry, mesh.material);
    this.addComponent(meshComponent);
  }

  // Return the mesh as a 3D object
  public getObject3D(): THREE.Object3D {
    return this.mesh;
  }
}
