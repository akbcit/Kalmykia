// src/core/Camera.ts
import * as THREE from "three";
import { setupCamera } from "../utils/setupCamera";
import { CameraProps, CameraType, OrthographicCameraProps, PerspectiveCameraProps } from "../../types/camera/CameraProps";

export class Camera {
    // Private Three.js Camera object, supporting multiple camera types
    private camera: THREE.Camera;

    // Default camera properties for the most common use case: PerspectiveCamera
    private static defaultPerspectiveProps: PerspectiveCameraProps = {
        cameraType: CameraType.Perspective,
        fov: 75, // Default field of view
        aspect: window.innerWidth / window.innerHeight, // Default aspect ratio
        near: 0.1, // Default near clipping plane
        far: 1000, // Default far clipping plane
        position: new THREE.Vector3(0, 0, 5), // Default position
    };

    constructor(props?: CameraProps) {
        // Use default properties if props are undefined
        const cameraProps = props || Camera.defaultPerspectiveProps;

        // Initialize the camera using the setupCamera utility function
        this.camera = setupCamera(cameraProps);
    }

    public getCamera(): THREE.Camera {
        return this.camera;
    }

    public update(props: CameraProps): void {
        if (props.position) {
            this.camera.position.copy(props.position);
        }

        // Handle updates specific to the camera type
        if (this.camera instanceof THREE.PerspectiveCamera && props.cameraType === CameraType.Perspective) {
            const perspectiveProps = props as PerspectiveCameraProps;
            if (perspectiveProps.fov !== undefined) {
                this.camera.fov = perspectiveProps.fov;
                this.camera.updateProjectionMatrix();
            }
            if (perspectiveProps.aspect !== undefined) {
                this.camera.aspect = perspectiveProps.aspect;
                this.camera.updateProjectionMatrix();
            }
        }

        if (this.camera instanceof THREE.OrthographicCamera && props.cameraType === CameraType.Orthographic) {
            const orthographicProps = props as OrthographicCameraProps;
            if (orthographicProps.left !== undefined && orthographicProps.right !== undefined) {
                this.camera.left = orthographicProps.left;
                this.camera.right = orthographicProps.right;
                this.camera.updateProjectionMatrix();
            }
            if (orthographicProps.top !== undefined && orthographicProps.bottom !== undefined) {
                this.camera.top = orthographicProps.top;
                this.camera.bottom = orthographicProps.bottom;
                this.camera.updateProjectionMatrix();
            }
        }
    }
}
