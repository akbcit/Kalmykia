import { Component } from "../../parentClasses/Component";
import * as THREE from "three";

// GroupMeshComponent class that holds a Three.js group of mesh objects
export class GroupMeshComponent extends Component {
    private group: THREE.Group; // Use a Group to hold all the meshes

    constructor() {
        super();
        this.group = new THREE.Group(); // Initialize a new group
    }

    // Method to add a mesh to the group
    public addMesh(geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[]): void {
        const mesh = new THREE.Mesh(geometry, material); // Create a new mesh
        this.group.add(mesh); // Add the mesh to the group
    }

    // Method to get the group object
    public getMesh(): THREE.Group {
        return this.group; // Return the group containing all meshes
    }

    // Dispose method to clean up the group and its children
    public dispose(): void {
        this.group.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => mat.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        this.group.clear(); // Remove all children from the group
    }
}
