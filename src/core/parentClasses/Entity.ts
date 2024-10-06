import { MeshComponent } from "../derivedClasses/components/MeshComponent";
import { Component } from "./Component";
import * as THREE from "three";

let nextEntityId = 0;

export class Entity {

    private id: number;
    private components: Map<string, Component>;
    private position: THREE.Vector3; // New property to store the entity's position
    private object3D: THREE.Object3D | null = null;

    constructor() {
        this.id = nextEntityId++;
        this.components = new Map<string, Component>();
        this.position = new THREE.Vector3(0, 0, 0); // Initialize position with a default value
    }

    // Private method to check if the component is unique
    private hasUniqueComponent(componentName: string): boolean {
        return this.components.has(componentName);
    }

    public getId(): number {
        return this.id;
    }

    public addComponent(component: Component): this {
        const componentName = component.constructor.name;

        // Check for unique component before adding
        if (this.hasUniqueComponent(componentName)) {
            console.warn(`Entity ${this.id} already has a component of type ${componentName}.`);
            return this;
        }

        // Explicitly set the MeshComponent if the added component is a MeshComponent
        if (component instanceof MeshComponent) {
            this.components.set("MeshComponent", component); // Set the MeshComponent with a specific key
        }

        this.components.set(componentName, component);
        return this;
    }

    public getComponent<T extends Component>(type: { new(...args: any[]): T }): T | undefined {
        return this.components.get(type.name) as T;
    }

    public hasComponent<T extends Component>(type: { new(...args: any[]): T }): boolean {
        return this.components.has(type.name);
    }

    public removeComponent<T extends Component>(type: { new(...args: any[]): T }): void {
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
        this.position.set(x, y, z); // Update the internal position property
        this.syncPositionWithObject3D(); // Sync the position with the Object3D
    }

    public setPositionVector(position: THREE.Vector3): void {
        this.position.copy(position); // Update the internal position property
        this.syncPositionWithObject3D(); // Sync the position with the Object3D
    }

    public getPosition(): THREE.Vector3 {
        return this.position.clone(); // Return a copy of the internal position property
    }

    // Sync the position property with the Object3D if it exists
    private syncPositionWithObject3D(): void {
        const object3D = this.getObject3D();
        if (object3D) {
            object3D.position.copy(this.position);
        } else {
            console.warn(`Entity ${this.id} does not have an associated Object3D to synchronize position.`);
        }
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

    public getObject3DInstance(): THREE.Object3D | null {
        return this.object3D;
    }

    public getObject3D(): THREE.Object3D | null {
        const meshComponent = this.getComponent(MeshComponent);
        if (meshComponent) {
            return meshComponent.getMesh();
        } else {
            // Log a warning only if the MeshComponent is expected to exist at this point
            console.warn(`Entity ${this.id} does not have an associated MeshComponent yet.`);
            return null;
        }
    }

    // Add a new setter method to the Entity class
    public setObject3DInstance(object3D: THREE.Object3D | null): void {
        this.object3D = object3D;
    }

    // New Method to expose transform data for GUI control
    public getTransformData(): { position: THREE.Vector3, rotation: THREE.Euler, scale: THREE.Vector3 } | null {
        const object3D = this.getObject3D();
        if (object3D) {
            return {
                position: this.position.clone(), // Use the internal position property
                rotation: object3D.rotation.clone(),
                scale: object3D.scale.clone(),
            };
        } else {
            console.warn(`Entity ${this.id} does not have an associated Object3D to get transform data.`);
            return null;
        }
    }
}
