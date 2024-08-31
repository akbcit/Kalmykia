// src/core/utils/setupCamera.ts
import * as THREE from "three";
import { CameraProps } from "../../types/camera/CameraProps"; // Ensure correct import for CameraProps

/**
 * Sets up the Three.js PerspectiveCamera with optional properties like FOV, aspect ratio,
 * near and far planes, and initial position. This function configures the camera based on
 * provided CameraProps, allowing for flexible and dynamic camera setup.
 *
 * @param props - Optional CameraProps object containing configuration options.
 * @returns The configured Three.js PerspectiveCamera.
 */
export function setupCamera(props?: CameraProps): THREE.PerspectiveCamera {
    // Create a new PerspectiveCamera with default values or props if provided
    const camera = new THREE.PerspectiveCamera(
        props?.fov || 75,
        props?.aspect || window.innerWidth / window.innerHeight,
        props?.near || 0.1,
        props?.far || 1000
    );

    // Set the camera's position, defaulting to z = 5 if not specified
    if (props?.position) {
        camera.position.copy(props.position);
    } else {
        camera.position.z = 5;
    }

    // Return the fully configured camera
    return camera;
}
