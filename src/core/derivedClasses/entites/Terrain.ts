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
  noiseScale?: number; // Scale for Simplex noise, like in TerrainSystem
  heightFactor?: number; // Controls height intensity
  receiveShadow?: boolean;
}

export class Terrain extends Entity {
  private mesh: THREE.Mesh;
  private noise2D: (x: number, y: number) => number; // Simplex noise function

  constructor({
    width = 100,
    height = 100,
    widthSegments = 50,
    heightSegments = 50,
    material = materialFactory.createStandardMaterial({ color: 0x228b22 }),
    noiseScale = 10, // Similar to TerrainSystem's noise scaling
    heightFactor = 10, // Controls height intensity (like TerrainSystem's height)
    receiveShadow = true, // Default to receiving shadows
  }: TerrainParams) {
    super(); // Call the Entity constructor

    this.noise2D = createNoise2D(Math.random); // Initialize Simplex noise with a random seed

    const geometry = new PlaneGeometry({
      width,
      height,
      widthSegments,
      heightSegments,
    });

    geometry.rotateX(-Math.PI / 2); // Rotate to make it horizontal, aligned with the XZ plane

    // Apply the noise to the terrain vertices, similar to TerrainSystem
    const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const z = positionAttribute.getZ(i);
      let heightValue = this.noise2D(x / noiseScale, z / noiseScale); // Use noise with scaling
      heightValue *= heightFactor; // Apply height scaling (like in TerrainSystem)

      // Set the Y position (height) of the vertex
      positionAttribute.setY(i, heightValue);
    }

    // Mark the position attribute as updated to reflect the changes in the mesh
    positionAttribute.needsUpdate = true;

    // Recalculate normals for proper lighting
    geometry.computeVertexNormals();

    // Create the mesh and apply the material
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.receiveShadow = receiveShadow; // Set the mesh to receive shadows

    // Add MeshComponent to the entity
    const meshComponent = new MeshComponent(this.mesh.geometry, this.mesh.material);
    this.addComponent(meshComponent);
  }

  public getObject3D(): THREE.Object3D {
    return this.mesh;
  }
}
