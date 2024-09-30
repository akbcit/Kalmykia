// src/core/Entity.ts
import { MeshComponent } from "../derivedClasses/components/MeshComponent";
import { Component } from "./Component";
import * as THREE from "three";

let nextEntityId = 0;

export class Entity {
    private id: number;
    private components: Map<string, Component>;

    constructor() {
        this.id = nextEntityId++;
        this.components = new Map<string, Component>();
    }

    public getId(): number {
        return this.id;
    }

    public addComponent(component: Component): this {
        const componentName = component.constructor.name;
        if (this.components.has(componentName)) {
            console.warn(`Entity ${this.id} already has a component of type ${componentName}.`);
        }
        this.components.set(componentName, component);
        return this;
    }

    public getComponent<T extends Component>(type: { new (...args: any[]): T }): T | undefined {
        return this.components.get(type.name) as T;
    }

    public hasComponent<T extends Component>(type: { new (...args: any[]): T }): boolean {
        return this.components.has(type.name);
    }

    public removeComponent<T extends Component>(type: { new (...args: any[]): T }): void {
        const componentName = type.name;
        const component = this.components.get(componentName);
        if (component) {
            component.dispose();
            this.components.delete(componentName);
        } else {
            console.warn(`Entity ${this.id} does not have a component of type ${componentName} to remove.`);
        }
    }

    public update(delta: number): void {
        this.components.forEach((component) => {
            component.update(delta);
        });
    }

    public clearComponents(): void {
        this.components.forEach((component) => component.dispose());
        this.components.clear();
    }

    // Position-related methods
    public setPosition(x: number, y: number, z: number): void {
        const object3D = this.getObject3D();
        if (object3D) {
            object3D.position.set(x, y, z);
        } else {
            console.warn(`Entity ${this.id} does not have an associated Object3D to set position.`);
        }
    }

    public setPositionVector(position: THREE.Vector3): void {
        this.setPosition(position.x, position.y, position.z);
    }

    public getPosition(): THREE.Vector3 | null {
        const object3D = this.getObject3D();
        return object3D ? object3D.position.clone() : null;
    }

    // Rotation-related methods
    public setRotation(x: number, y: number, z: number): void {
        const object3D = this.getObject3D();
        if (object3D) {
            object3D.rotation.set(x, y, z);
        } else {
            console.warn(`Entity ${this.id} does not have an associated Object3D to set rotation.`);
        }
    }

    public getRotation(): THREE.Euler | null {
        const object3D = this.getObject3D();
        return object3D ? object3D.rotation.clone() : null;
    }

    // Scale-related methods
    public setScale(x: number, y: number, z: number): void {
        const object3D = this.getObject3D();
        if (object3D) {
            object3D.scale.set(x, y, z);
        } else {
            console.warn(`Entity ${this.id} does not have an associated Object3D to set scale.`);
        }
    }

    public getScale(): THREE.Vector3 | null {
        const object3D = this.getObject3D();
        return object3D ? object3D.scale.clone() : null;
    }

    // Method to set the render order of the entity's Object3D
    public setRenderOrder(order: number): void {
        const object3D = this.getObject3D();
        if (object3D) {
            object3D.renderOrder = order;
        } else {
            console.warn(`Entity ${this.id} does not have an associated Object3D to set render order.`);
        }
    }

    // Method to get the THREE.Object3D associated with this entity, if any
    public getObject3D(): THREE.Object3D | null {
        const meshComponent = this.getComponent(MeshComponent);
        return meshComponent ? meshComponent.getMesh() : null;
    }

    // New Method to expose transform data for GUI control
    public getTransformData(): { position: THREE.Vector3, rotation: THREE.Euler, scale: THREE.Vector3 } | null {
        const object3D = this.getObject3D();
        if (object3D) {
            return {
                position: object3D.position.clone(),
                rotation: object3D.rotation.clone(),
                scale: object3D.scale.clone(),
            };
        } else {
            console.warn(`Entity ${this.id} does not have an associated Object3D to get transform data.`);
            return null;
        }
    }
}
