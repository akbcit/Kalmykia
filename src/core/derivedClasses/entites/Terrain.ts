// src/entities/Terrain.ts
import * as THREE from "three";
import { Entity } from "../../parentClasses/Entity";
import { MeshComponent } from "../components/MeshComponent";

export class Terrain extends Entity {
  constructor() {
    super();

    // Create a plane geometry for the terrain
    const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    geometry.rotateX(-Math.PI / 2); // Rotate to make it horizontal

    // Create a standard material for the terrain
    const material = new THREE.MeshStandardMaterial({ color: 0x228b22 });

    // Create a MeshComponent with the geometry and material
    const meshComponent = new MeshComponent(geometry, material);

    // Add the MeshComponent to the Terrain entity
    this.addComponent(meshComponent);
  }

}
