// src/core/components/MeshComponent.ts
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

    // Method to update the mesh properties, if necessary
    public update(delta: number): void {
        // Example: Rotate the mesh over time or other transformations
        this.mesh.rotation.y += delta * 0.5; // Rotate around the Y-axis
    }

    // Clean up any resources used by the mesh when the component is disposed
    public dispose(): void {
        // Dispose of the mesh geometry
        this.mesh.geometry.dispose();

        // Dispose of the mesh material(s), handling both single material and array of materials
        if (Array.isArray(this.mesh.material)) {
            // If material is an array, dispose each material in the array
            this.mesh.material.forEach(material => material.dispose());
        } else {
            // If material is a single instance, dispose directly
            this.mesh.material.dispose();
        }
    }
}
