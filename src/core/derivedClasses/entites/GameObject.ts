// src/core/GameObject.ts
import * as THREE from 'three';
import { Entity } from '../../parentClasses/Entity';
import { MeshComponent } from '../components/MeshComponent';

export class GameObject extends Entity {
    private mesh: THREE.Mesh;

    constructor(mesh: THREE.Mesh) {
        super();  
        this.mesh = mesh;

        // Create and add MeshComponent using the provided mesh
        const meshComponent = new MeshComponent(mesh.geometry, mesh.material);
        this.addComponent(meshComponent); // Add MeshComponent to the entity
    }

    // Expose the underlying THREE.Object3D (mesh)
    public getObject3D(): THREE.Object3D {
        return this.mesh;
    }
}
