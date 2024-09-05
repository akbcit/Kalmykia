// src/core/Renderer.ts
import * as THREE from "three";
import { setupRenderer } from "../utils/setupRenderer"; // Correct import for utility function
import { ScreenProps } from "../../types/screen/ScreenProps";

/**
 * Renderer class encapsulates a Three.js WebGLRenderer and manages its configuration
 * through ScreenProps. It uses utility functions for setup to keep the code modular and maintainable.
 */
export class Renderer {
    // Private Three.js WebGLRenderer object
    private renderer: THREE.WebGLRenderer;

    /**
     * Constructor initializes the renderer using provided ScreenProps, configuring properties
     * like antialiasing, size, and pixel ratio. The renderer is attached to the specified DOM container.
     *
     * @param container - The DOM element to which the renderer's canvas will be attached.
     * @param props - Optional ScreenProps object containing configuration options.
     */
    constructor(container: HTMLElement, props?: ScreenProps) {
        // Use the setupRenderer utility function to create and configure the renderer
        this.renderer = setupRenderer(container, props);
    }

    /**
     * Exposes the underlying Three.js renderer object for external use, such as rendering or further configuration.
     *
     * @returns The configured Three.js WebGLRenderer.
     */
    public getRenderer(): THREE.WebGLRenderer {
        return this.renderer;
    }

    /**
     * Disposes the renderer and cleans up resources to prevent memory leaks.
     * Should be called when the renderer is no longer needed.
     */
    public dispose(): void {
        this.renderer.dispose();
    }
}
