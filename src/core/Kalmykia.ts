import * as THREE from "three";
import { Scene, Renderer, Entity, Camera } from "./index";
import { UpdateCallback } from "../types/UpdateCallback";
import { KalmykiaProps } from "../types/KalmykiaProps";

// Main Kalmykia class, representing the core of the game engine
export class Kalmykia {
    // Represents the 3D scene where objects are rendered
    private scene: Scene;

    // Manages rendering the scene and camera to the screen
    private renderer: Renderer;

    // Defines the viewpoint and projection for the scene
    private camera: Camera;

    // Manages time for animations and updates within the scene
    private clock: THREE.Clock;

    // Stores functions that are called on each frame for dynamic updates
    private updateCallbacks: UpdateCallback[] = [];

    // Constructor to initialize the engine with a container element and optional properties
    constructor(container: HTMLElement, props?: KalmykiaProps) {
        // Set up the scene with provided scene properties
        this.scene = new Scene(props?.scene); 

        // Set up the camera, potentially using camera props for configuration
        this.camera = new Camera(props?.camera);

        // Set up the renderer with screen properties and attach it to the DOM container
        this.renderer = new Renderer(container, props?.screen);

        // Initialize the clock for tracking time deltas
        this.clock = new THREE.Clock();

        // Set up event listeners (e.g., for window resize) to adjust camera and renderer settings
        this.setupEventListeners();

        // Start the animation loop
        this.animate();
    }

    // Main animation loop that updates the scene on each frame
    private animate = (): void => {
        // Request the next frame to keep the loop going
        requestAnimationFrame(this.animate);

        // Calculate the time delta since the last frame
        const delta = this.clock.getDelta();

        // Call all registered update callbacks with the time delta
        this.updateCallbacks.forEach((callback) => callback(delta));

        // Render the current state of the scene from the perspective of the camera
        this.renderer.getRenderer().render(this.scene.getScene(), this.camera.getCamera());
    };

    // Sets up event listeners for handling browser window resize
    private setupEventListeners(): void {
        window.addEventListener('resize', () => {
            const camera = this.camera.getCamera();
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            this.renderer.getRenderer().setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Adds an object (entity) to the scene
    public addObject(entity: Entity): void {
        entity.addToScene(this.scene.getScene());
    }

    // Removes an object (entity) from the scene
    public removeObject(entity: Entity): void {
        entity.removeFromScene(this.scene.getScene());
    }

    // Registers a callback function to be called on each frame update
    public registerUpdateCallback(callback: UpdateCallback): void {
        this.updateCallbacks.push(callback);
    }

    // Deregisters a previously registered update callback
    public deregisterUpdateCallback(callback: UpdateCallback): void {
        this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    }

    // Cleans up resources used by the renderer and removes event listeners
    public dispose(): void {
        this.renderer.dispose();
        // Additional cleanup, like removing event listeners, can be added here
    }
}
