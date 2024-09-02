
import { CameraType } from './types/camera/CameraProps';
import { GameObject } from './core';
import { Kalmykia } from "./core/Kalmykia";

import * as THREE from 'three';
import { PerspectiveCameraProps } from './types/camera/CameraProps';

// Wait for the DOM to be fully loaded before initializing the engine
window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app') as HTMLElement;

    // Initialize Kalmykia with basic properties
    const engine = new Kalmykia(container, {
        screen: {
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true,
            pixelRatio: window.devicePixelRatio,
        },
            camera: {
                cameraType: CameraType.Perspective, // Specify the camera type explicitly
                position: new THREE.Vector3(0, 0, 20),
                fov: 45, // Field of view for PerspectiveCamera
                aspect: window.innerWidth / window.innerHeight, // Aspect ratio required for PerspectiveCamera
                near: 0.1, // Optional: near clipping plane (default is 0.1 if not specified)
                far: 1000, // Optional: far clipping plane (default is 1000 if not specified)
            } as PerspectiveCameraProps,
        //    camera: {
        //         cameraType: CameraType.Orthographic, // Specify the camera type as Orthographic
        //         left: -2, // Left plane of the camera
        //         right: 2, // Right plane of the camera
        //         top: 2, // Top plane of the camera
        //         bottom: -2, // Bottom plane of the camera
        //         near: 0.1, // Near clipping plane
        //         far: 1000, // Far clipping plane
        //         position: new THREE.Vector3(0, 0, 20) // Position of the camera
        //     },
        scene: {
            backgroundColor: '#333', // Set a dark background color for visibility
            axesHelper: { size: 4 }, // Optional: Add axes helper to visualize axes in the scene
        },
    });

    // Create a simple cube entity to add to the scene
    const geometry = new THREE.BoxGeometry(1, 1, 1); // Define a cube geometry
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Create a green standard material
    const cube = new THREE.Mesh(geometry, material); // Combine the geometry and material into a mesh

    // Create a light source
    const light = new THREE.DirectionalLight(0xffffff, 1); // White light with full intensity
    light.position.set(5, 5, 5); // Position the light

    // Create an Entity wrapper for the light
    const lightEntity = new GameObject(light);

    // Create an Entity wrapper for the cube
    const cubeEntity = new GameObject(cube);

    // Add both entities to the scene using Kalmykia's addObject method
    engine.addObject(lightEntity);
    engine.addObject(cubeEntity);

    // // Start rendering with a callback to rotate the cube on each frame
    // engine.registerUpdateCallback((delta: number) => {
    //     // Rotate the cube every frame for a simple animation
    //     cube.rotation.x += delta;
    //     cube.rotation.y += delta;
    // });
});
