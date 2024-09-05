// src/core/Scene.ts
import * as THREE from "three";
import { setupScene } from "../utils/setupScene"; // Import the setupScene utility to handle scene configuration
import { SceneProps } from "../../types/scene/SceneProps";

/**
 * Scene class encapsulates a Three.js scene and manages its configuration through SceneProps.
 * It utilizes utility functions to modularize the setup, ensuring that the scene is configured
 * consistently and maintainably.
 */
export class Scene {
    // Private Three.js scene object
    private scene: THREE.Scene;

    /**
     * Constructor initializes the scene using provided SceneProps, setting up elements
     * like background, fog, helpers, lighting, and environment maps.
     *
     * @param props - Optional SceneProps object containing configuration options.
     */
    constructor(props?: SceneProps) {
        // Use the setupScene utility function to initialize and configure the scene
        this.scene = setupScene(new THREE.Scene(), props);
    }

    /**
     * Exposes the underlying Three.js scene object for external use, such as rendering or adding objects.
     *
     * @returns The configured Three.js scene.
     */
    public getScene(): THREE.Scene {
        return this.scene;
    }
}
