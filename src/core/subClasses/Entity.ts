import { Component } from "./Component";

let nextEntityId = 0;

export class Entity {
    private id: number;
    private components: Map<string, Component>;

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
        const componentName = component.constructor.name;
        if (this.components.has(componentName)) {
            console.warn(`Entity ${this.id} already has a component of type ${componentName}.`);
        }
        this.components.set(componentName, component);
        return this;
    }

    // Retrieves a component by type, cast to the correct class
    public getComponent<T extends Component>(type: new () => T): T | undefined {
        return this.components.get(type.name) as T;
    }

    // Checks if the entity has a component of a specific type
    public hasComponent<T extends Component>(type: new () => T): boolean {
        return this.components.has(type.name);
    }

    // Removes a component and triggers the component's cleanup
    public removeComponent<T extends Component>(type: new () => T): void {
        const componentName = type.name;
        const component = this.components.get(componentName);
        if (component) {
            component.dispose(); // Clean up the component before removal
            this.components.delete(componentName);
        } else {
            console.warn(`Entity ${this.id} does not have a component of type ${componentName} to remove.`);
        }
    }

    // Calls the update method on all components
    public update(delta: number): void {
        this.components.forEach((component) => {
            component.update(delta);
        });
    }

    // Clears all components, useful for cleanup or entity destruction
    public clearComponents(): void {
        this.components.forEach((component) => component.dispose()); // Dispose of each component
        this.components.clear();
    }
}
