// src/index.ts
import { Kalmykia } from "./core/Kalmykia";
import * as THREE from 'three';
import { CameraType } from "./types/camera/CameraProps";
import { createAmbientLight, createMeshEntity, createDirectionalLight } from "./utils/entityUtils";
import { Scene } from "./core/parentClasses/Scene";
import { MeshComponent } from "./core/derivedClasses/components/MeshComponent";
import { RenderSystem } from "./core/parentClasses/systems/RenderSystem";
import { Terrain } from "./core/derivedClasses/entites/Terrain";
import { createResizeListener } from "./core/eventListeners/resizeListener";
import { createPanKeyListener } from "./core/eventListeners/panKeyListener";
import { BasicMaterial, LambertMaterial, PhongMaterial, StandardMaterial, ToonMaterial } from "./core/derivedClasses/entites/materials";
import { CubeGeometry, PlaneGeometry, PointGeometry, SphereGeometry } from "./core/derivedClasses/entites/geometries/primitives";

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
            position: new THREE.Vector3(4, 4, 999),
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
    engine.addScene('main', mainScene);
    engine.switchScene('main'); // Switch to the main scene

    const cameraInstance = engine.getCameraInstance();  
    const threeCamera = cameraInstance.getCamera() 
    const controls = cameraInstance.getControls();  

    const resizeListenerConfig = createResizeListener(threeCamera, engine.getRenderer());
    engine.addEventListener(resizeListenerConfig); 

    // Register the keyboard panning listener
    if (controls) {
        const panKeyListenerConfig = createPanKeyListener(controls);
        engine.addEventListener(panKeyListenerConfig);
    }
    
    // Initialize the TerrainSystem and add it to the main scene
    const renderSystem = new RenderSystem(engine.getRenderer(), mainScene, threeCamera);

    engine.addSystem(renderSystem);

    // Instantiate terrain
    const terrain = new Terrain();

    // Add terrain to the scene
    mainScene.addEntity(terrain);

    // Create custom materials
    const basicMaterial = new BasicMaterial({ color: 0xffffff, wireframe: false });
    const standardMaterial = new StandardMaterial({ color: 0xffaa00, roughness: 0.5, metalness: 0.8 });
    const phongMaterial = new PhongMaterial({ color: 0x0000ff, shininess: 200 });
    const toonMaterial = new ToonMaterial({ color: 0xffff00 });
    const lambertMaterial = new LambertMaterial({ color: 0x00ff00 });

    // Create custom geometries
    const cubeGeometry = new CubeGeometry({ width: 2, height: 2, depth: 2 });
    const planeGeometry = new PlaneGeometry({ width: 10, height: 10 });
    const sphereGeometry = new SphereGeometry({ radius: 1 });
    const pointGeometry = new PointGeometry({ position: new THREE.Vector3(0, 0, 0) });

    // Create and add GameObjects (cubes) to the scene
    const basicCube = createMeshEntity(new THREE.Vector3(-6, 0, 0), basicMaterial, cubeGeometry);
    const standardCube = createMeshEntity(new THREE.Vector3(-3, 0, 0), standardMaterial, cubeGeometry);
    const phongCube = createMeshEntity(new THREE.Vector3(0, 0, 0), phongMaterial, cubeGeometry);
    const basicSphere = createMeshEntity(new THREE.Vector3(-6, 0, -5), basicMaterial, sphereGeometry);
    const lambertCube = createMeshEntity(new THREE.Vector3(6, 0, 0), lambertMaterial, cubeGeometry);

    [basicCube, standardCube, phongCube, basicSphere, lambertCube].forEach(entity => mainScene.addEntity(entity));

    // Create and add lights to the scene
    const directionalLight = createDirectionalLight(new THREE.Vector3(10, 10, 10), 1.5);
    const ambientLight = createAmbientLight(0.8);

    mainScene.addEntity(directionalLight);
    mainScene.addEntity(ambientLight);

    // Register an update callback to rotate only the cubes in the scene
    mainScene.registerUpdateCallback((delta: number) => {
        // Assuming the terrain is not part of this array
        [basicCube, standardCube, phongCube, basicSphere, lambertCube].forEach(entity => {
            const meshComponent = entity.getComponent(MeshComponent);
            if (meshComponent) {
                meshComponent.getMesh().rotation.x += delta * 0.5;
                meshComponent.getMesh().rotation.y += delta * 0.5;
            }
        });
    });
});
