// src/utils/entityUtils.ts
import * as THREE from 'three';
import { GameObject } from '../core/derivedClasses/entites/GameObject';
import { LightObject } from '../core/derivedClasses/entites/LightObject';
import { Entity } from '../core/parentClasses/Entity';
import { MeshComponent } from '../core/derivedClasses/components/MeshComponent';

export function createCube(position: THREE.Vector3, material: THREE.Material): Entity {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // Create a new MeshComponent with both geometry and material
    const meshComponent = new MeshComponent(geometry, material);
    
    // Set the mesh position
    meshComponent.getMesh().position.copy(position);

    const cubeEntity = new Entity(); // Instantiate your entity class
    cubeEntity.addComponent(meshComponent); // Attach the MeshComponent here

    return cubeEntity;
}

export function createDirectionalLight(position: THREE.Vector3, intensity: number): LightObject {
    const light = new THREE.DirectionalLight(0xffffff, intensity);
    light.position.copy(position);
    return new LightObject(light);
}

export function createAmbientLight(intensity: number): LightObject {
    const light = new THREE.AmbientLight(0x404040, intensity);
    return new LightObject(light);
}
