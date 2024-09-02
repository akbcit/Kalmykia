// src/core/Entity.ts
import * as THREE from "three";

// Base class for all entities within the scene
export class GameObject {
    protected mesh: THREE.Object3D;

    constructor(mesh: THREE.Object3D) {
        this.mesh = mesh;
    }

    // Adds the entity's mesh to the specified scene
    public addToScene(scene: THREE.Scene): void {
        scene.add(this.mesh);
    }

    // Removes the entity's mesh from the specified scene
    public removeFromScene(scene: THREE.Scene): void {
        scene.remove(this.mesh);
    }

    // Updates the entity (override in derived classes for custom behavior)
    public update(delta: number): void {
        // Default update logic (e.g., animations, transformations)
    }

    // Exposes the underlying mesh
    public getMesh(): THREE.Object3D {
        return this.mesh;
    }
}
