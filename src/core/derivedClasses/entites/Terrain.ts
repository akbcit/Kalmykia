// src/entities/Terrain.ts
import * as THREE from 'three';
import { PlaneGeometry } from './geometries/primitives';
import { StandardMaterial } from './materials'; // Adjust the import path as needed
import { Entity } from '../../parentClasses/Entity';
import { MeshComponent } from '../components/MeshComponent';

interface TerrainParams {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
  material?: THREE.Material; // Accepts any THREE.Material, including custom materials
  flatShading?: boolean; // Toggle for flat shading
}

// Type guard to check if the material supports flatShading
function supportsFlatShading(
  material: THREE.Material
): material is
  | THREE.MeshStandardMaterial
  | THREE.MeshLambertMaterial
  | THREE.MeshPhongMaterial {
  return (
    material instanceof THREE.MeshStandardMaterial ||
    material instanceof THREE.MeshLambertMaterial ||
    material instanceof THREE.MeshPhongMaterial
  );
}

export class Terrain extends Entity {
  private mesh: THREE.Mesh;

  constructor({
    width = 100,
    height = 100,
    widthSegments = 50,
    heightSegments = 50,
    material = new StandardMaterial({ color: 0x228b22 }), // Default to a custom StandardMaterial
    flatShading = false,
  }: TerrainParams) {
    super(); // Call the Entity constructor

    // Create a plane geometry with the given dimensions and segments
    const geometry = new PlaneGeometry({
      width,
      height,
      widthSegments,
      heightSegments,
    });

    geometry.rotateX(-Math.PI / 2); // Rotate to make it horizontal, aligned with the XZ plane

    // Apply flat shading if the material supports it
    if (flatShading && supportsFlatShading(material)) {
      material.flatShading = true;
      material.needsUpdate = true; // Update the material to reflect changes
    }

    // Create the Mesh with geometry and material
    this.mesh = new THREE.Mesh(geometry, material);

    // Add a MeshComponent to the Terrain entity
    const meshComponent = new MeshComponent(this.mesh.geometry, this.mesh.material);
    this.addComponent(meshComponent); // Add MeshComponent to the entity

    // Optional: Log details for debugging
    (geometry as PlaneGeometry).logDetails();
  }

  // Method to expose the THREE.Object3D (mesh)
  public getObject3D(): THREE.Object3D {
    return this.mesh;
  }
}
