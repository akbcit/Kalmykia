// src/index.ts
import { Kalmykia } from "./core/Kalmykia";
import * as THREE from 'three';
import { CameraType } from "./types/camera/CameraProps";
import { createAmbientLight, createMeshEntity, createDirectionalLight } from "./utils/entityUtils";
import { Scene } from "./core/parentClasses/Scene";
import { MeshComponent } from "./core/derivedClasses/components/MeshComponent";
import { RenderSystem } from "./core/parentClasses/systems/RenderSystem";
import { createResizeListener } from "./core/eventListeners/resizeListener";
import { createPanKeyListener } from "./core/eventListeners/panKeyListener";

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
            position: new THREE.Vector3(4, 4, 14),
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
                minPolarAngle: 0, // Prevent going below horizon
                maxPolarAngle: Math.PI / 2, // Allow looking straight down
                minDistance: 5, // Minimum zoom distance
                maxDistance: 1000, // Maximum zoom distance
            }
        }
    });

    // Create a new scene
    const mainScene = new Scene({
        backgroundColor: '#333',
        axesHelper: { size: 5 },
    });

    // Add the scene to the engine and switch to it
    engine.sceneManager.addScene('main', mainScene);
    engine.switchScene('main'); // Switch to the main scene

    const cameraInstance = engine.getCameraInstance();  
    const threeCamera = cameraInstance.getCamera(); 
    const controls = cameraInstance.getControls();  

    const resizeListenerConfig = createResizeListener(threeCamera, engine.getRenderer());
    engine.addEventListener(resizeListenerConfig); 

    // Register the keyboard panning listener
    if (controls) {
        const panKeyListenerConfig = createPanKeyListener(controls);
        engine.addEventListener(panKeyListenerConfig);
    }
    
    // Initialize the RenderSystem and add it to the main scene
    const renderSystem = new RenderSystem(engine.getRenderer(), mainScene, threeCamera);
    engine.addSystem(renderSystem);

    // Create and add a single cube entity to the scene
    const toonMaterial = new THREE.MeshToonMaterial({ color: 0xffff00 });
    const cubeGeometry = new THREE.BoxGeometry(1, 2, 2);
    const cubeEntity = createMeshEntity(new THREE.Vector3(1, 0, 0), toonMaterial, cubeGeometry);

    mainScene.addEntity(cubeEntity);

    // Create and add lights to the scene
    const directionalLight = createDirectionalLight(new THREE.Vector3(10, 10, 10), 1.5);
    const ambientLight = createAmbientLight(0.8);

    mainScene.addEntity(directionalLight);
    mainScene.addEntity(ambientLight);

    // Register an update callback to rotate the cube in the scene
    mainScene.registerUpdateCallback((delta: number) => {
        const meshComponent = cubeEntity.getComponent(MeshComponent);
        if (meshComponent) {
            meshComponent.getMesh().rotation.x += delta * 0.5;
            meshComponent.getMesh().rotation.y += delta * 0.5;
        }
    });

    // Start the engine
    engine.start();
});
