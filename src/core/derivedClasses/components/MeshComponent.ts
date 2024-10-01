// src/core/derivedClasses/components/MeshComponent.ts
import { Component } from "../../parentClasses/Component"; // Base class for all components
import * as THREE from "three"; // Import Three.js

// MeshComponent class that holds a Three.js mesh object
export class MeshComponent extends Component {
    public mesh: THREE.Mesh; // Three.js mesh object

    // Constructor initializes the mesh with given geometry and material
    constructor(geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[]) {
        super(); // Call the base Component constructor
        this.mesh = new THREE.Mesh(geometry, material); // Create a new mesh with the provided geometry and material
    }

    // Method to get the mesh object
    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    // New Method to get the geometry of the mesh
    public getGeometry(): THREE.BufferGeometry | null {
        return this.mesh.geometry instanceof THREE.BufferGeometry ? this.mesh.geometry : null;
    }

   // Method to update the mesh's geometry and material
  public updateMesh(newGeometry: THREE.BufferGeometry, newMaterial?: THREE.Material | THREE.Material[]): void {
    // Dispose of the existing geometry and replace it with the new one
    this.mesh.geometry.dispose();
    this.mesh.geometry = newGeometry;

    // If a new material is provided, update the material as well
    if (newMaterial) {
      if (Array.isArray(this.mesh.material)) {
        // Dispose of the current array of materials
        this.mesh.material.forEach((material) => material.dispose());
      } else {
        // Dispose of the single material instance
        this.mesh.material.dispose();
      }
      this.mesh.material = newMaterial;
    }
    this.mesh.geometry.computeVertexNormals(); // Optionally recompute normals after geometry change
  }


    // Clean up any resources used by the mesh when the component is disposed
    public dispose(): void {
        // Dispose of the mesh geometry
        this.mesh.geometry.dispose();

        // Dispose of the mesh material(s), handling both single material and array of materials
        if (Array.isArray(this.mesh.material)) {
            // If material is an array, dispose of each material in the array
            this.mesh.material.forEach((material) => material.dispose());
        } else {
            // If material is a single instance, dispose directly
            this.mesh.material.dispose();
        }
    }
}
