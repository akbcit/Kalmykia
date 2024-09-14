// src/core/Scene.ts
import * as THREE from "three";
import { setupScene } from "../utils/setupScene";
import { SceneProps } from "../../types/scene/SceneProps";
import { Entity } from "./Entity";
import { UpdateCallback } from "../../types/UpdateCallback";

export class Scene {
    private scene: THREE.Scene;
    private entities: Entity[] = [];
    private updateCallbacks: UpdateCallback[] = []; 

    constructor(props?: SceneProps) {
        this.scene = setupScene(new THREE.Scene(), props);
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public addEntity(entity: Entity): void {
        this.entities.push(entity);

        // Check for Object3D in GameObject
        const object3D = entity.getObject3D?.();
        if (object3D instanceof THREE.Object3D) {
            this.scene.add(object3D);
        }
    }

    public removeEntity(entity: Entity): void {
        this.entities = this.entities.filter(e => e !== entity);

        // Check for Object3D in GameObject and remove it
        const object3D = entity.getObject3D?.();
        if (object3D instanceof THREE.Object3D) {
            this.scene.remove(object3D);
        }
    }

    public getEntities(): Entity[] {
        return this.entities;
    }

    public update(delta: number): void {
        this.updateCallbacks.forEach(callback => callback(delta));
        this.entities.forEach(entity => entity.update(delta)); // Update each entity
    }

    public registerUpdateCallback(callback: UpdateCallback): void {
        this.updateCallbacks.push(callback);
    }

    public dispose(): void {
        this.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.geometry.dispose();
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        this.updateCallbacks = []; // Clear update callbacks
    }

    public init(): void {
        // Default implementation; can be overridden in subclasses for custom initialization
    }
}