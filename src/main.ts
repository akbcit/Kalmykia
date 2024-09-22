// src/index.ts
import * as THREE from 'three';
import { TerrainPlane } from './core/derivedClasses/entites/TerrainPlane';
import { CameraType } from './types/camera/CameraProps';
import { KalmykiaBuilder } from './core/KalmykiaBuilder';
import { createMeshGameObject } from './utils/entityUtils';
import { MeshComponent } from './core/derivedClasses/components/MeshComponent';
import { MaterialFactory } from './core/derivedClasses/entites/materials/MaterialFactory';
import { LightFactory } from './core/derivedClasses/components/light/LightFactory';
import { diamondSquareFunction, fractalBrownianMotion, ridgedMultifractalNoise, seededCheckerboardFunction, seededCircularWavesFunction, seededPlateauFunction, seededRadialGradientFunction, seededRandomWalkFunction, seededRidgeNoiseFunction, seededSineWaveFunction, seededTurbulenceFunction, thresholdNoise, voronoiNoiseFunction } from './utils/noise/functions/noiseFunctions';

const materialFactory = new MaterialFactory();

const doubleSidedPlaneMaterial = materialFactory.createStandardMaterial({ color: "#7CFC00", side: THREE.DoubleSide });

window.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('app') as HTMLElement;


    // Create noisy terrain using the imported simplexNoiseGenerator
    const noisyTerrain = new TerrainPlane({
        width: 10,
        height: 10,
        widthSegments: 256,
        heightSegments: 256,
        material: doubleSidedPlaneMaterial,
        noiseScale: 10,
        heightFactor: 10,
        receiveShadow: true,
        noiseFunction: thresholdNoise((seededCircularWavesFunction())),
    })

    // Initialize the Three.js engine
    const engine = new KalmykiaBuilder(container)
        .setCamera({
            cameraType: CameraType.Perspective,
            position: new THREE.Vector3(0, 23, 50),
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
        .addLight(LightFactory.createLight({ type: "directional", color: "white", position: new THREE.Vector3(10, 10, 1) }))
        .addTerrain(noisyTerrain)
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