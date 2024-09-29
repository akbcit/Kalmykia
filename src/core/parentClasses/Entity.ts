// src/core/Entity.ts
import { MeshComponent } from "../derivedClasses/components/MeshComponent";
import { Component } from "./Component";
import * as THREE from "three";

// Global counter to generate unique IDs for each entity
let nextEntityId = 0;

export class Entity {
    // Unique identifier for the entity
    private id: number;

    // Map to store components by their class names as keys
    private components: Map<string, Component>;

    // Constructor initializes the entity with a unique ID and an empty component map
    constructor() {
        this.id = nextEntityId++;
        this.components = new Map<string, Component>();
    }

    // Returns the unique identifier of the entity
    public getId(): number {
        return this.id;
    }

    // Adds a component to the entity, with chaining for flexibility
    public addComponent(component: Component): this {
        const componentName = component.constructor.name; // Get the class name of the component
        if (this.components.has(componentName)) {
            console.warn(`Entity ${this.id} already has a component of type ${componentName}.`);
        }
        this.components.set(componentName, component); // Add the component to the map
        return this; // Return the entity itself to allow method chaining
    }

    // Retrieves a component by type, cast to the correct class
    // Accepts a constructor function to match the component type
    public getComponent<T extends Component>(type: { new(...args: any[]): T }): T | undefined {
        return this.components.get(type.name) as T; // Cast the retrieved component to the specified type
    }

    // Checks if the entity has a component of a specific type
    public hasComponent<T extends Component>(type: { new(...args: any[]): T }): boolean {
        return this.components.has(type.name); // Check existence of component by class name
    }

    // Removes a component and triggers the component's cleanup
    public removeComponent<T extends Component>(type: { new(...args: any[]): T }): void {
        const componentName = type.name;
        const component = this.components.get(componentName); // Retrieve the component
        if (component) {
            component.dispose(); // Call dispose method to clean up resources
            this.components.delete(componentName); // Remove component from the map
        } else {
            console.warn(`Entity ${this.id} does not have a component of type ${componentName} to remove.`);
        }
    }

    // Calls the update method on all components
    public update(delta: number): void {
        // Iterate over each component and call its update method
        this.components.forEach((component) => {
            component.update(delta);
        });
    }

    // Clears all components, useful for cleanup or entity destruction
    public clearComponents(): void {
        // Dispose of each component to release resources
        this.components.forEach((component) => component.dispose());
        this.components.clear(); // Clear the component map
    }

    // New method to set the position of the entity's Object3D, if it has a MeshComponent
    public setPosition(x: number, y: number, z: number): void {
        const object3D = this.getObject3D();
        if (object3D) {
            object3D.position.set(x, y, z);
        } else {
            console.warn(`Entity ${this.id} does not have an associated Object3D to set position.`);
        }
    }

    //Method to set position using a THREE.Vector3 for convenience
    public setPositionVector(position: THREE.Vector3): void {
        this.setPosition(position.x, position.y, position.z);
    }

    // Method to get the THREE.Object3D associated with this entity, if any
    public getObject3D(): THREE.Object3D | null {
        // Check if the entity has a MeshComponent and return its mesh
        const meshComponent = this.getComponent(MeshComponent); // Assuming MeshComponent is defined elsewhere
        return meshComponent ? meshComponent.getMesh() : null;
    }
}
