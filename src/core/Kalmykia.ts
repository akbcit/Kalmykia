// src/core/Kalmykia.ts
import * as THREE from "three";
import { Scene, Renderer, Camera } from "./index";
import { UpdateCallback } from "../types/UpdateCallback";
import { KalmykiaProps } from "../types/KalmykiaProps";
import { RenderSystem } from "./parentClasses/systems/RenderSystem";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CameraProps, CameraType } from "../types/camera/CameraProps";
import { SceneManager } from "./SceneManager";
import { EventListenerConfig } from "../types/eventListeners/EventListenerConfig";

export class Kalmykia {
    public sceneManager: SceneManager;
    private renderer: Renderer;
    private camera: Camera;
    private clock: THREE.Clock;
    private systems: RenderSystem[] = []; // Render systems that operate on entities
    private cameraControls: OrbitControls | null = null;
    private eventListeners = new Map<string, EventListenerConfig>();
    private isRunning: boolean = false;

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

        // Initialize camera using Camera class which internally calls setupCamera
        this.camera = new Camera(props?.camera || defaultCameraProps, this.renderer.getRenderer().domElement);
        this.clock = new THREE.Clock();
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

    // Start method to begin the rendering loop
    public start(): void {
        if (this.isRunning) {
            console.warn('Engine is already running.');
            return;
        }

        if (!this.sceneManager.getCurrentScene()) {
            console.error('No scene set. Please add and switch to a scene before starting the engine.');
            return;
        }

        this.isRunning = true;
        this.animate(); // Kick off the animation loop
    }

    // Add event listeners and register them by ID
    public addEventListener<E extends Event>(config: EventListenerConfig<E>): void {
        const id = config.id || `${config.type}-${Date.now()}`; // Generate a unique ID if none provided

        // Register the event listener with correct type casting
        config.target.addEventListener(config.type, config.listener as EventListenerOrEventListenerObject);

        // Store the configuration in the map
        this.eventListeners.set(id, config as EventListenerConfig<any>);

    }

    // Remove event listeners by ID
    public removeEventListener(id: string): void {
        const config = this.eventListeners.get(id); // Retrieve the listener configuration by ID
        if (config) {
            // Remove the event listener with correct type casting
            config.target.removeEventListener(config.type, config.listener as EventListenerOrEventListenerObject);

            this.eventListeners.delete(id); // Remove the configuration from the map
        } else {
            console.warn(`Event listener with ID ${id} not found.`); // Warn if the ID is not found
        }
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

    public getCameraInstance(): Camera {
        return this.camera;
    }

    // Make the addSystem method public to allow adding systems from outside
    public addSystem(system: RenderSystem): void {
        this.systems.push(system);
    }
}