import { Component } from "../../parentClasses/Component";
import * as THREE from 'three';

export class PositionComponent extends Component {
    public position: THREE.Vector3;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super();
        // Initialize the position with default values or provided values.
        this.position = new THREE.Vector3(x, y, z);
    }

    // Method to update position
    public setPosition(x: number = 0, y: number = 0, z: number = 0): void {
        this.position.set(x, y, z);
    }

    // Method to translate the position
    public translate(x: number = 0, y: number = 0, z: number = 0): void {
        this.position.add(new THREE.Vector3(x, y, z));
    }
}
