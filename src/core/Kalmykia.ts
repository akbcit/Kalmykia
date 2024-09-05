// src/core/Kalmykia.ts
import * as THREE from "three";
import { Scene, Renderer, Camera } from "./index";
import { Entity } from "./parentClasses/Entity"; // Entity class representing game objects
import { Component } from "./parentClasses/Component"; // Base class for all components
import { UpdateCallback } from "../types/UpdateCallback"; // Type definition for update callbacks
import { KalmykiaProps } from "../types/KalmykiaProps"; // Type definition for engine properties
import { RenderSystem } from "./parentClasses/systems/RenderSystem"; // System responsible for rendering entities

// Main Kalmykia class, representing the core of the game engine
export class Kalmykia {
    private scene: Scene; // Represents the 3D scene where objects are rendered
    private renderer: Renderer; // Manages rendering the scene and camera to the screen
    private camera: Camera; // Defines the viewpoint and projection for the scene
    private clock: THREE.Clock; // Manages time for animations and updates within the scene
    private updateCallbacks: UpdateCallback[] = []; // Stores functions that are called on each frame for dynamic updates
    private entities: Entity[] = []; // List of all entities in the scene, managed by ECS
    private systems: { update: (entities: Entity[], delta: number) => void }[] = []; // List of systems that operate on entities, managed by ECS

    // Constructor initializes the engine with a container element and optional properties
    constructor(container: HTMLElement, props?: KalmykiaProps) {
        // Set up the scene with provided scene properties
        this.scene = new Scene(props?.scene);

        // Set up the camera, potentially using camera props for configuration
        this.camera = new Camera(props?.camera);

        // Set up the renderer with screen properties and attach it to the DOM container
        this.renderer = new Renderer(container, props?.screen);

        // Initialize the clock for tracking time deltas
        this.clock = new THREE.Clock();

        // Initialize the RenderSystem with both the renderer and camera, adding it to the systems list
        const renderSystem = new RenderSystem(this.renderer, this.scene, this.camera.getCamera());
        this.systems.push(renderSystem);

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

        // Update all systems with the current entities, allowing them to process logic
        this.systems.forEach(system => system.update(this.entities, delta));

        // Render the current state of the scene from the perspective of the camera
        this.renderer.getRenderer().render(this.scene.getScene(), this.camera.getCamera());
    };

    // Sets up event listeners for handling browser window resize
    private setupEventListeners(): void {
        window.addEventListener('resize', () => {
            const camera = this.camera.getCamera();

            // Check if the camera is a PerspectiveCamera before updating the aspect ratio
            if (camera instanceof THREE.PerspectiveCamera) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            } 
            // For OrthographicCamera or other camera types, update as needed
            else if (camera instanceof THREE.OrthographicCamera) {
                const aspect = window.innerWidth / window.innerHeight;
                const viewSize = 10; // Define a suitable view size for your application

                // Adjust orthographic camera properties on resize if needed
                camera.left = -aspect * viewSize / 2;
                camera.right = aspect * viewSize / 2;
                camera.top = viewSize / 2;
                camera.bottom = -viewSize / 2;
                camera.updateProjectionMatrix();
            }

            // Update the renderer size to match the new window dimensions
            this.renderer.getRenderer().setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Adds an entity to the ECS system
    public addEntity(entity: Entity): void {
        this.entities.push(entity);
    }

    // Removes an entity from the ECS system
    public removeEntity(entity: Entity): void {
        this.entities = this.entities.filter(e => e.getId() !== entity.getId());
    }

    // Adds a component to a specific entity
    public addComponentToEntity(entity: Entity, component: Component): void {
        entity.addComponent(component);
    }

    // Registers a new system to be called on each frame update
    public addSystem(system: { update: (entities: Entity[], delta: number) => void }): void {
        this.systems.push(system);
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
