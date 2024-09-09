// src/utils/entityUtils.ts
import * as THREE from 'three';
import { GameObject } from '../core/derivedClasses/entites/GameObject';
import { LightObject } from '../core/derivedClasses/entites/LightObject';

export function createCube(position: THREE.Vector3, material: THREE.Material): GameObject {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    return new GameObject(mesh);
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
