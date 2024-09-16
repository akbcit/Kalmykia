// src/core/EntityManager.ts
import { Entity } from "./Entity";
import * as THREE from "three";

export class EntityManager {
    private entities: Entity[] = [];

    public addEntity(entity: Entity, scene: THREE.Scene): void {
        this.entities.push(entity);

        // Check if the entity has an Object3D and add it to the scene
        const object3D = entity.getObject3D?.();
        if (object3D instanceof THREE.Object3D) {
            console.log('Adding Object3D to scene:', object3D);  // Debug log
            scene.add(object3D);
        } else {
            console.warn('No Object3D found in entity:', entity);  // Debug log
        }
    }

    public removeEntity(entity: Entity, scene: THREE.Scene): void {
        this.entities = this.entities.filter(e => e !== entity);

        // Check if the entity has an Object3D and remove it from the scene
        const object3D = entity.getObject3D?.();
        if (object3D instanceof THREE.Object3D) {
            console.log('Removing Object3D from scene:', object3D);  // Debug log
            scene.remove(object3D);
        } else {
            console.warn('No Object3D found in entity to remove:', entity);  // Debug log
        }
    }

    public getEntities(): Entity[] {
        return this.entities;
    }

    public updateEntities(delta: number): void {
        this.entities.forEach(entity => {
            entity.update(delta);  // Ensure each entity's update method is called
        });
    }
}
