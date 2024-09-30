// src/utils/setupRenderer.ts
import * as THREE from "three";
import { ScreenProps } from "../../types/screen/ScreenProps"; // Import ScreenProps for configuration

/**
 * Sets up and configures the Three.js WebGLRenderer with optional screen properties for resolution,
 * fullscreen mode, pixel ratio, and antialiasing. The renderer is attached to the specified DOM container.
 *
 * @param container - The DOM element to which the renderer's canvas will be attached.
 * @param props - Optional ScreenProps object containing configuration options for the renderer.
 * @returns The configured Three.js WebGLRenderer.
 */
export function setupRenderer(container: HTMLElement, props?: ScreenProps): THREE.WebGLRenderer {
    // Create a new WebGLRenderer with antialiasing based on props or default to true
    const renderer = new THREE.WebGLRenderer({ antialias: props?.antialias ?? true,logarithmicDepthBuffer: true});

    // Set the renderer's size based on provided width and height, or default to window size
    renderer.setSize(props?.width || window.innerWidth, props?.height || window.innerHeight);

    // Set the renderer's pixel ratio, commonly used for high-DPI screens
    renderer.setPixelRatio(props?.pixelRatio || Math.min(window.devicePixelRatio, 2));

    // If fullscreen mode is specified, adjust the renderer or listen for resize events
    if (props?.fullscreen) {
        // Set the renderer to adjust on window resize for fullscreen mode
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    // Append the renderer's DOM element to the specified container
    container.appendChild(renderer.domElement);

    // Return the fully configured renderer
    return renderer;
}
