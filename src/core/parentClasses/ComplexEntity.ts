import { Component } from "./Component";
import { Entity } from "./Entity";
import { GroupMeshComponent } from "../derivedClasses/components/GroupMeshComponent"; // Import the GroupMeshComponent
import * as THREE from "three";

export class ComplexEntity extends Entity {
    private groupMeshComponent: GroupMeshComponent;

    constructor() {
        super();
        this.groupMeshComponent = new GroupMeshComponent(); // Initialize the GroupMeshComponent
    }

    // Override addComponent to only add GroupMeshComponent
    public addComponent(component: Component): this {
        if (component instanceof GroupMeshComponent) {
            // If a GroupMeshComponent is being added, set it as the group component
            this.groupMeshComponent = component;
            console.log(`GroupMeshComponent set for ComplexEntity ${this.getId()}`);
        }

        return this; // No longer adding directly to the components map
    }

    // Override getObject3D to return the group object
    public getObject3D(): THREE.Group | null {
        // Check if group is already set up
        let group = this.getObject3DInstance() as THREE.Group;
        if (!group) {
            // If not, get the group from GroupMeshComponent
            group = this.groupMeshComponent.getMesh() as THREE.Group;
            this.setObject3DInstance(group); // Set the object3D property to the created group
        }

        return group;
    }

    public setPosition(x: number, y: number, z: number): void {
        const group = this.getObject3D();
        if (group) {
            group.position.set(x, y, z);
        }
    }

    public setPositionVector(position: THREE.Vector3): void {
        const group = this.getObject3D();
        if (group) {
            group.position.copy(position);
        }
    }

    public setScale(x: number, y: number, z: number): void {
        const group = this.getObject3D();
        if (group) {
            group.scale.set(x, y, z);
        }
    }

    public setRotation(x: number, y: number, z: number): void {
        const group = this.getObject3D();
        if (group) {
            group.rotation.set(x, y, z);
        }
    }
}
