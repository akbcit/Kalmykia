import { Kalmykia } from './core/Kalmykia';
import * as THREE from 'three';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app') as HTMLElement;

    // Initialize Kalmykia with basic props
    const engine = new Kalmykia(container, {
        screen: {
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true,
            pixelRatio: window.devicePixelRatio,
        },
        camera: {
            position: new THREE.Vector3(0, 0, 5),
        },
        scene: {
            backgroundColor: '#333', // Dark background for visibility
        },
    });

    // Create a simple cube entity to add to the scene
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    // Start rendering
    engine.registerUpdateCallback((delta) => {
        // Rotate the cube every frame for a simple animation
        cube.rotation.x += delta;
        cube.rotation.y += delta;
    });
});
