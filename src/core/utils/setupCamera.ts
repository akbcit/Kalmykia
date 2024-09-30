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

    if (props.cameraType === CameraType.Perspective) {
        const perspectiveProps = props as PerspectiveCameraProps;
        camera = new THREE.PerspectiveCamera(
            perspectiveProps.fov || 75,
            perspectiveProps.aspect || window.innerWidth / window.innerHeight,
            perspectiveProps.near || 0.1,
            perspectiveProps.far || 1000
        );
    } else if (props.cameraType === CameraType.Orthographic) {
        const orthographicProps = props as OrthographicCameraProps;
        const aspect = window.innerWidth / window.innerHeight;
        const viewSize = 10;
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

    // Set the camera's initial position and orientation
    camera.position.copy(props.position || new THREE.Vector3(0, 0, 5));
    camera.lookAt(props.lookAt || new THREE.Vector3(0, 0, 0));

    let controls: OrbitControls | undefined;

    if (props.controls && domElement) {
        controls = new OrbitControls(camera, domElement);

        const controlSettings = props.controls;
        controls.target.copy(controlSettings.target || props.lookAt || new THREE.Vector3(0, 0, 0));
        controls.autoRotate = controlSettings.autoRotate || false;
        controls.autoRotateSpeed = controlSettings.autoRotateSpeed || 2.0;
        controls.enabled = controlSettings.enabled ?? true;
        controls.minPolarAngle = controlSettings.minPolarAngle ?? 0;
        controls.maxPolarAngle = controlSettings.maxPolarAngle ?? Math.PI;
        controls.minAzimuthAngle = controlSettings.minAzimuthAngle ?? -Infinity;
        controls.maxAzimuthAngle = controlSettings.maxAzimuthAngle ?? Infinity;
        controls.enablePan = controlSettings.enablePan ?? true;
        controls.panSpeed = controlSettings.panSpeed ?? 1.0;
        controls.screenSpacePanning = controlSettings.screenSpacePanning ?? true;
        controls.enableZoom = controlSettings.enableZoom ?? true;
        controls.zoomSpeed = controlSettings.zoomSpeed ?? 1.0;
        controls.minDistance = controlSettings.minDistance ?? 0;
        controls.maxDistance = controlSettings.maxDistance ?? Infinity;
        controls.enableDamping = controlSettings.enableDamping ?? false;
        controls.dampingFactor = controlSettings.dampingFactor ?? 0.05;
        controls.rotateSpeed = controlSettings.rotateSpeed ?? 1.0;

        function enforceConstraints() {
            // Ensure camera doesn't look below the terrain
            if (controls!.target.y < 0) controls!.target.y = 0;
            
            // Ensure the camera's vertical position is within bounds
            if (camera.position.y < (controlSettings.minCameraY ?? 0.1)) {
                camera.position.y = controlSettings.minCameraY ?? 0.1;
            }
        }

        // Attach constraint enforcement to change event
        controls.addEventListener('change', enforceConstraints);

        controls.update();
    }

    return { camera, controls };
}