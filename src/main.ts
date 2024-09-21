// src/index.ts
import * as THREE from 'three';
import { Terrain } from './core/derivedClasses/entites/Terrain';
import { CameraType } from './types/camera/CameraProps';
import { KalmykiaBuilder } from './core/KalmykiaBuilder';
import { createMeshGameObject } from './utils/entityUtils';
import { MeshComponent } from './core/derivedClasses/components/MeshComponent';
import { CustomTerrainMaterial } from './assets/CustomTerrainMaterial ';


// // Function to generate a pastel color
// function generatePastelColor(hue: number): THREE.Color {
//     const lightness = 0.8; // High lightness for pastel effect
//     const saturation = 0.3; // Low saturation for pastel effect

//     const color = new THREE.Color();
//     color.setHSL(hue, saturation, lightness);
//     return color;
//   }

//   // Generate an array of 100 pastel colors
//   const pastelColors: THREE.Color[] = [];
//   const numColors = 100;

//   for (let i = 0; i < numColors; i++) {
//     const hue = i / numColors; // Interpolate hue
//     pastelColors.push(generatePastelColor(hue));
//   }

// // Create the custom material with the colors
// const customMaterial = new CustomTerrainMaterial(pastelColors);


const doubleSidedPlaneMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    roughness: 0.5,
    metalness: 0.5,
    side: THREE.DoubleSide
});

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app') as HTMLElement;


    const noisyTerrain = new Terrain({
        width: 700,
        height: 700,
        widthSegments: 100,
        heightSegments: 100,
        flatShading: true,
        scale: 50,
        detail: 10,
        material: doubleSidedPlaneMaterial // Use the custom material
    });

    // Initialize the Three.js engine
    const engine = new KalmykiaBuilder(container)
        .setCamera({
            cameraType: CameraType.Perspective,
            position: new THREE.Vector3(4, 4, 14),
            fov: 60,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 10000,
            lookAt: new THREE.Vector3(0, 0, 0),
            controls: {
                enabled: true,
                type: 'orbit',
                target: new THREE.Vector3(0, 0, 0),
                autoRotate: false,
                minPolarAngle: 0,
                maxPolarAngle: Math.PI / 2,
                minDistance: 5,
                maxDistance: 1000,
            },
        })
        .addScene('main', '#333', 5)
        .addResizeListener()
        .addPanKeyListener()
        .addRenderSystem()
        .addEntity(createMeshGameObject(
            new THREE.Vector3(1, 0, 0),
            new THREE.MeshToonMaterial({ color: 0xffff00 }),
            new THREE.BoxGeometry(1, 2, 2)
        ))
        .addTerrain(noisyTerrain)
        .addDirectionalLight(new THREE.Vector3(10, 10, 10), 1.5)
        .addAmbientLight(0.8)
        .build();

    // Register update callback and then start the engine
    engine.sceneManager.getCurrentScene()?.registerUpdateCallback((delta: number) => {
        // Update the custom material with the elapsed time
        // customMaterial.update();

        // Example callback to rotate an object
        const meshComponent = engine.sceneManager.getCurrentScene()?.getEntities()[0].getComponent(MeshComponent);
        if (meshComponent) {
            meshComponent.getMesh().rotation.x += delta * 0.5;
            meshComponent.getMesh().rotation.y += delta * 0.5;
        }
    });

    engine.start(); // Start the engine
});
