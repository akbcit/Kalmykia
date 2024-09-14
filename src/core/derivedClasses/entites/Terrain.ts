// src/entities/Terrain.ts
import * as THREE from "three";
import { Entity } from "../../parentClasses/Entity";
import { MeshComponent } from "../components/MeshComponent";
import { createNoise2D } from "simplex-noise"; // Importing Simplex noise function

export class Terrain extends Entity {
  constructor() {
    super();

    // Create a plane geometry for the terrain
    const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    geometry.rotateX(-Math.PI / 2); // Rotate to make it horizontal

    // Create noise function for height variation
    const noise2D = createNoise2D(Math.random);

    // Modify the geometry vertices to add height variation
    const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const z = positionAttribute.getZ(i);
      const height = noise2D(x / 10, z / 10); // Adjust scale for desired detail
      positionAttribute.setY(i, height * 5); // Set the new height, scale as needed
    }
    positionAttribute.needsUpdate = true; // Mark the attribute for update
    geometry.computeVertexNormals(); // Recompute normals for correct lighting

    // Create a standard material for the terrain with some properties
    const material = new THREE.MeshStandardMaterial({
      color: 0x228b22, // Green color for grass-like appearance
      wireframe: false, // Set to true if you want to debug the terrain mesh
      flatShading: true, // Flat shading for a more stylized look
    });

    // Create a MeshComponent with the geometry and material
    const meshComponent = new MeshComponent(geometry, material);

    // Add the MeshComponent to the Terrain entity
    this.addComponent(meshComponent);
  }
}
