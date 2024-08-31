// src/core/Camera.ts
import * as THREE from "three";
import { setupCamera } from "../utils/setupCamera"; // Utility function to initialize the camera
import { CameraProps } from "types/camera/CameraProps";

/**
 * Camera class encapsulates a Three.js PerspectiveCamera and manages its configuration
 * through CameraProps. It uses utility functions for setup to keep the code modular and maintainable.
 */
export class Camera {
    // Private Three.js PerspectiveCamera object
    private camera: THREE.PerspectiveCamera;

    /**
     * Constructor initializes the camera using provided CameraProps, configuring properties
     * like FOV, aspect ratio, near and far planes, and position.
     *
     * @param props - Optional CameraProps object containing configuration options.
     */
    constructor(props?: CameraProps) {
        // Initialize the camera using the setupCamera utility function
        this.camera = setupCamera(props);
    }

    /**
     * Exposes the underlying Three.js camera object for external use, such as rendering or controls.
     *
     * @returns The configured Three.js PerspectiveCamera.
     */
    public getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    /**
     * Updates the camera properties dynamically based on provided CameraProps.
     * Useful for adjusting the camera's position, FOV, or other parameters at runtime.
     *
     * @param props - CameraProps object containing new configuration options.
     */
    public update(props: CameraProps): void {
        if (props.position) {
            this.camera.position.copy(props.position);
        }
        // Additional updates for FOV, aspect ratio, etc., can be handled here
        if (props.fov) {
            this.camera.fov = props.fov;
            this.camera.updateProjectionMatrix();
        }
        if (props.aspect) {
            this.camera.aspect = props.aspect;
            this.camera.updateProjectionMatrix();
        }
    }

    // Add more camera-specific methods if needed (e.g., controls, animations)
}
