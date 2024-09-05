// src/core/GameObject.ts
import * as THREE from 'three';
import { MeshComponent } from '../components/MeshComponent';  
import { Entity } from '../../parentClasses/Entity';

export class GameObject extends Entity {
    constructor(mesh: THREE.Object3D) {
        super();  

        // Check if the provided object is a Mesh and add MeshComponent accordingly
        if (mesh instanceof THREE.Mesh) {
            // Create a MeshComponent using the mesh's geometry and material
            const meshComponent = new MeshComponent(mesh.geometry, mesh.material);
            this.addComponent(meshComponent); // Add MeshComponent to the entity
        } else {
            console.warn('GameObject only supports THREE.Mesh objects for MeshComponent.');
        }
    }

    // Optionally, add more specific behavior for GameObject here
}
