// src/index.ts
import { Kalmykia } from "./core/Kalmykia"; 
import * as THREE from 'three';
import { CameraType } from "./types/camera/CameraProps";
import { Terrain } from "./core/derivedClasses/entites/Terrain";
import { Entity } from "./core/parentClasses/Entity";
import { GameObject } from "./core/derivedClasses/entites/GameObject";

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app') as HTMLElement;

    const engine = new Kalmykia(container, {
        screen: {
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true,
            pixelRatio: window.devicePixelRatio,
        },
        camera: {
            cameraType: CameraType.Perspective,
            position: new THREE.Vector3(0, 0, 20),
            fov: 45,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 1000,
        },
        scene: {
            backgroundColor: '#333',
            axesHelper: { size: 4 },
        },
    });

    // Add the terrain entity
    const terrain = new Terrain();
    engine.addEntity(terrain);

    // Create a simple cube entity and add it as a GameObject
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    const cubeEntity:Entity = new GameObject(cube); // Ensure GameObject correctly extends Entity
    engine.addEntity(cubeEntity); // Add to engine without errors

    // Add a light entity as a GameObject
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    const lightEntity:Entity = new GameObject(light); // Ensure GameObject correctly extends Entity
    engine.addEntity(lightEntity); // Add to engine without errors

    // Register an update callback to rotate the cube
    engine.registerUpdateCallback((delta: number) => {
        cube.rotation.x += delta;
        cube.rotation.y += delta;
    });
});
