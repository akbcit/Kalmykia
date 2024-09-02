import * as THREE from "three";
import { CameraProps, CameraType, PerspectiveCameraProps, OrthographicCameraProps } from "../../types/camera/CameraProps";

/**
 * Sets up a Three.js camera (either Perspective or Orthographic) based on CameraProps.
 *
 * @param props - CameraProps object containing configuration options.
 * @returns The configured Three.js camera.
 */
export function setupCamera(props: CameraProps): THREE.Camera {
    let camera: THREE.Camera;

    switch (props.cameraType) {
        case CameraType.Perspective: {
            // Assert props as PerspectiveCameraProps to access specific properties
            const perspectiveProps = props as PerspectiveCameraProps;

            // Setup PerspectiveCamera
            camera = new THREE.PerspectiveCamera(
                perspectiveProps.fov || 75,
                perspectiveProps.aspect || window.innerWidth / window.innerHeight,
                perspectiveProps.near || 0.1,
                perspectiveProps.far || 1000
            );
            break;
        }

        case CameraType.Orthographic: {
            // Assert props as OrthographicCameraProps to access specific properties
            const orthographicProps = props as OrthographicCameraProps;

            // Setup OrthographicCamera
            camera = new THREE.OrthographicCamera(
                orthographicProps.left || -1,
                orthographicProps.right || 1,
                orthographicProps.top || 1,
                orthographicProps.bottom || -1,
                orthographicProps.near || 0.1,
                orthographicProps.far || 1000
            );
            break;
        }

        // Add more camera setups here as needed

        default:
            throw new Error("Unsupported camera type");
    }

    // Set the camera's position, defaulting if not specified
    if (props.position) {
        camera.position.copy(props.position);
    } else {
        camera.position.set(0, 0, 5); // Default position
    }

    return camera;
}
