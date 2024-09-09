import * as THREE from "three";
import { Component } from "../../parentClasses/Component";

export class LightComponent extends Component {
    public light: THREE.Light;

    constructor(light: THREE.Light) {
        super();
        this.light = light;
    }

    // You can add additional light management methods here if needed
    public update(delta: number): void {
        // Implement light-specific updates if necessary
    }

    public dispose(): void {
        // Cleanup if needed
    }
}
