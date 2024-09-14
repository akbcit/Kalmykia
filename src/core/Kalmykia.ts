// src/core/Kalmykia.ts
import * as THREE from "three";
import { Scene, Renderer, Camera } from "./index";
import { UpdateCallback } from "../types/UpdateCallback";
import { KalmykiaProps } from "../types/KalmykiaProps";
import { RenderSystem } from "./parentClasses/systems/RenderSystem";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CameraProps, CameraType } from "../types/camera/CameraProps";
import { SceneManager } from "./SceneManager";

export class Kalmykia {
    private sceneManager: SceneManager; 
    private renderer: Renderer; 
    private camera: Camera; 
    private clock: THREE.Clock; 
    private systems: RenderSystem[] = []; // Render systems that operate on entities
    private cameraControls: OrbitControls | null = null; 

    constructor(container: HTMLElement, props?: KalmykiaProps) {
        this.sceneManager = new SceneManager();
        this.renderer = new Renderer(container, props?.screen);

        const defaultCameraProps: CameraProps = {
            cameraType: CameraType.Perspective,
            position: new THREE.Vector3(0, 0, 5),
            lookAt: new THREE.Vector3(0, 0, 0),
            controls: {
                enabled: true,
                type: "orbit",
                target: new THREE.Vector3(0, 0, 0),
                autoRotate: false,
            },
        };

        this.camera = new Camera(props?.camera || defaultCameraProps);
        this.clock = new THREE.Clock();
        this.setupEventListeners();
        this.initializeCameraControls(props?.camera);
        this.animate();
    }

    private initializeCameraControls(cameraProps?: CameraProps): void {
        const camera = this.camera.getCamera();
        const domElement = this.renderer.getRenderer().domElement;

        if (cameraProps?.controls && cameraProps.controls.type === 'orbit') {
            this.cameraControls = new OrbitControls(camera, domElement);
            this.cameraControls.target.copy(cameraProps.lookAt || cameraProps.controls.target || new THREE.Vector3(0, 0, 0));
            this.cameraControls.autoRotate = cameraProps.controls.autoRotate || false;
            this.cameraControls.autoRotateSpeed = cameraProps.controls.autoRotateSpeed || 2.0;
            this.cameraControls.enabled = cameraProps.controls.enabled ?? true;
            this.cameraControls.update();
        }
    }

    private animate = (): void => {
        requestAnimationFrame(this.animate);
        const delta = this.clock.getDelta();

        if (this.cameraControls) {
            this.cameraControls.update();
        }

        const currentScene = this.sceneManager.getCurrentScene();
        if (currentScene) {
            currentScene.update(delta); // Each scene manages its own updates
            this.systems.forEach(system => system.update(currentScene.getEntities(), delta));
            this.renderer.getRenderer().render(currentScene.getScene(), this.camera.getCamera());
        } else {
            console.warn('No current scene set in SceneManager.');
        }
    };

    private setupEventListeners(): void {
        window.addEventListener('resize', () => {
            const camera = this.camera.getCamera();

            if (camera instanceof THREE.PerspectiveCamera) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            } else if (camera instanceof THREE.OrthographicCamera) {
                const aspect = window.innerWidth / window.innerHeight;
                const viewSize = 10;
                camera.left = -aspect * viewSize / 2;
                camera.right = aspect * viewSize / 2;
                camera.top = viewSize / 2;
                camera.bottom = -viewSize / 2;
                camera.updateProjectionMatrix();
            }

            this.renderer.getRenderer().setSize(window.innerWidth, window.innerHeight);
        });
    }

    public addScene(name: string, scene: Scene): void {
        this.sceneManager.addScene(name, scene);
    }

    public switchScene(name: string): void {
        this.sceneManager.switchScene(name);
    }

    // Add getter methods to expose renderer and camera
    public getRenderer(): Renderer {
        return this.renderer;
    }

    public getCamera(): THREE.PerspectiveCamera | THREE.OrthographicCamera {
        return this.camera.getCamera();  
    }
}
