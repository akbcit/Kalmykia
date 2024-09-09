// src/core/LightObject.ts
import * as THREE from 'three';
import { LightComponent } from '../components/LightComponent';  
import { Entity } from '../../parentClasses/Entity';

export class LightObject extends Entity {
    constructor(light: THREE.Light) {
        super();  

        // Add the LightComponent to the entity
        const lightComponent = new LightComponent(light);
        this.addComponent(lightComponent);
    }

    // Method to expose the THREE.Object3D representation (light)
    public getObject3D(): THREE.Light | null {
        const lightComponent = this.getComponent(LightComponent);
        return lightComponent ? lightComponent.light : null; // Return light if found, otherwise null
    }
}
