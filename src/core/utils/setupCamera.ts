// src/utils/setupCamera.ts
import * as THREE from "three";
import { CameraProps, CameraType, OrthographicCameraProps, PerspectiveCameraProps } from "../../types/camera/CameraProps";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Sets up a Three.js camera and optionally configures controls based on CameraProps.
 *
 * @param props - CameraProps object containing configuration options.
 * @param domElement - The DOM element to attach the controls (if applicable).
 * @returns The configured Three.js camera and optional controls.
 */
export function setupCamera(props: CameraProps, domElement?: HTMLElement): { camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, controls?: OrbitControls } {
    let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;

    // Initialize the appropriate camera type
    if (props.cameraType === CameraType.Perspective) {

        // Cast props to PerspectiveCameraProps
        const perspectiveProps = props as PerspectiveCameraProps;

        camera = new THREE.PerspectiveCamera(
            perspectiveProps.fov || 75,
            perspectiveProps.aspect || window.innerWidth / window.innerHeight,
            perspectiveProps.near || 0.1,
            perspectiveProps.far || 1000
        );
    } else if (props.cameraType === CameraType.Orthographic) {
        // Cast props to OrthographicCameraProps
        const orthographicProps = props as OrthographicCameraProps;
        const aspect = window.innerWidth / window.innerHeight;
        const viewSize = 10; // Default view size for Orthographic camera
        camera = new THREE.OrthographicCamera(
            orthographicProps.left || -aspect * viewSize / 2,
            orthographicProps.right || aspect * viewSize / 2,
            orthographicProps.top || viewSize / 2,
            orthographicProps.bottom || -viewSize / 2,
            props.near || 0.1,
            props.far || 1000
        );
    } else {
        throw new Error("Unsupported camera type");
    }

    // Set the camera's position and look at the specified target
    camera.position.copy(props.position || new THREE.Vector3(0, 0, 5));
    camera.lookAt(props.lookAt || new THREE.Vector3(0, 0, 0));

    let controls: OrbitControls | undefined;

    // Initialize controls if specified
    if (props.controls && domElement) {
        controls = new OrbitControls(camera, domElement);

        // Apply controls settings
        controls.target.copy(props.controls.target || props.lookAt || new THREE.Vector3(0, 0, 0));
        controls.autoRotate = props.controls.autoRotate || false;
        controls.autoRotateSpeed = props.controls.autoRotateSpeed || 2.0;
        controls.enabled = props.controls.enabled ?? true;
        controls.update();
    }

    return { camera, controls };
}