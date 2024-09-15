// src/index.ts
import * as THREE from 'three';
import { CameraType } from './types/camera/CameraProps';
import { KalmykiaBuilder } from './core/KalmykiaBuilder';
import { createMeshEntity } from './utils/entityUtils'; // Import createMeshEntity
import { MeshComponent } from './core/derivedClasses/components/MeshComponent';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app') as HTMLElement;

    // Use KalmykiaBuilder to fluently set up the engine and its components
    const engine = new KalmykiaBuilder(container)
        .setCamera({
            cameraType: CameraType.Perspective,
            position: new THREE.Vector3(4, 4, 14),
            fov: 60,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 1000,
            lookAt: new THREE.Vector3(0, 0, 0),
            controls: {
                enabled: true,
                type: 'orbit',
                target: new THREE.Vector3(0, 0, 0),
                autoRotate: false,
                minPolarAngle: 0, // Prevent going below horizon
                maxPolarAngle: Math.PI / 2, // Allow looking straight down
                minDistance: 5, // Minimum zoom distance
                maxDistance: 1000, // Maximum zoom distance
            },
        })
        .addScene('main', '#333', 5) // Add and configure the main scene
        .addResizeListener() // Add resize listener for responsive behavior
        .addPanKeyListener() // Add pan key listener for camera controls
        .addRenderSystem() // Initialize the RenderSystem
        .addEntity(createMeshEntity(
            new THREE.Vector3(1, 0, 0), // Position of the entity
            new THREE.MeshToonMaterial({ color: 0xffff00 }), // Material of the entity
            new THREE.BoxGeometry(1, 2, 2) // Geometry of the entity (cube)
        ))
        .addDirectionalLight(new THREE.Vector3(10, 10, 10), 1.5) // Add directional light using utility
        .addAmbientLight(0.8) // Add ambient light using utility
        .build(); // Get the engine instance

    // Register update callback and then start the engine
    engine.sceneManager.getCurrentScene()?.registerUpdateCallback((delta: number) => {
        // Example callback to rotate an object
        const meshComponent = engine.sceneManager.getCurrentScene()?.getEntities()[0].getComponent(MeshComponent);
        if (meshComponent) {
            meshComponent.getMesh().rotation.x += delta * 0.5;
            meshComponent.getMesh().rotation.y += delta * 0.5;
        }
    });

    engine.start(); // Start the engine
});
