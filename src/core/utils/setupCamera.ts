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

    // Set the camera's position and look at the specified target
    camera.position.copy(props.position || new THREE.Vector3(0, 0, 5));
    camera.lookAt(props.lookAt || new THREE.Vector3(0, 0, 0));

    let controls: OrbitControls | undefined;

    // Initialize controls if props.controls is defined and domElement is provided
    if (props.controls && domElement) {
        controls = new OrbitControls(camera, domElement);

        // Apply controls settings only if props.controls is defined
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

        // Apply panning restrictions to XZ plane if specified
        if (controlSettings.restrictPanToXZPlane) {
            controls.addEventListener('change', () => {
                controls?.target.set(controls.target.x, 0, controls.target.z);
                camera.position.y = Math.max(camera.position.y, 0.1);
            });
        }

        // Apply min and max pan limits if specified
        if (controlSettings.maxPan || controlSettings.minPan) {
            controls.addEventListener('change', () => {
                if (controls) {
                    const target = controls.target;
                    if (controlSettings.maxPan) {
                        target.x = Math.min(target.x, controlSettings.maxPan.x);
                        target.y = Math.min(target.y, controlSettings.maxPan.y);
                        target.z = Math.min(target.z, controlSettings.maxPan.z);
                    }
                    if (controlSettings.minPan) {
                        target.x = Math.max(target.x, controlSettings.minPan.x);
                        target.y = Math.max(target.y, controlSettings.minPan.y);
                        target.z = Math.max(target.z, controlSettings.minPan.z);
                    }
                }
            });
        }

        controls.update();
    }

    return { camera, controls };
}
