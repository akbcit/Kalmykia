// src/index.ts
import { Kalmykia } from "./core/Kalmykia";
import * as THREE from 'three';
import { CameraType } from "./types/camera/CameraProps";
import { createAmbientLight, createCube, createDirectionalLight } from "./utils/entityUtils";
import { Scene } from "./core/parentClasses/Scene";
import { basicMaterial, lambertMaterial, phongMaterial, standardMaterial, toonMaterial } from "./materials/materials";
import { MeshComponent } from "./core/derivedClasses/components/MeshComponent";

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app') as HTMLElement;

    // Initialize the Kalmykia engine with configuration settings
    const engine = new Kalmykia(container, {
        screen: {
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true,
            pixelRatio: window.devicePixelRatio,
        },
        camera: {
            cameraType: CameraType.Perspective,
            position: new THREE.Vector3(4, 4, 15),
            fov: 60,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 1000,
            lookAt: new THREE.Vector3(0, 0, 0),
            controls: {
                enabled: true,
                type: "orbit",
                target: new THREE.Vector3(0, 0, 0),
                autoRotate: false,
            }
        }
    });

    // Create a new scene
    const mainScene = new Scene({
        backgroundColor: '#333',
        axesHelper: { size: 5 },
    });

    // Add the scene to the engine and switch to it
    engine.addScene('main', mainScene);
    engine.switchScene('main'); // Switch to the main scene

    // Create and add GameObjects (cubes) to the scene
    const basicCube = createCube(new THREE.Vector3(-6, 0, 0), basicMaterial);
    const standardCube = createCube(new THREE.Vector3(-3, 0, 0), standardMaterial);
    const phongCube = createCube(new THREE.Vector3(0, 0, 0), phongMaterial);
    const toonCube = createCube(new THREE.Vector3(3, 0, 0), toonMaterial);
    const lambertCube = createCube(new THREE.Vector3(6, 0, 0), lambertMaterial);

    [basicCube, standardCube, phongCube, toonCube, lambertCube].forEach(cube => mainScene.addEntity(cube));

    // Create and add lights to the scene
    const directionalLight = createDirectionalLight(new THREE.Vector3(10, 10, 10), 1.5);
    const ambientLight = createAmbientLight(0.8);

    mainScene.addEntity(directionalLight);
    mainScene.addEntity(ambientLight);

    // Register an update callback to rotate all cubes in the scene
    mainScene.registerUpdateCallback((delta: number) => {
        [basicCube, standardCube, phongCube, toonCube, lambertCube].forEach(entity => {
            const meshComponent = entity.getComponent(MeshComponent);
            if (meshComponent) {
                meshComponent.getMesh().rotation.x += delta * 0.5;
                meshComponent.getMesh().rotation.y += delta * 0.5;
            }
        });
    });
});
