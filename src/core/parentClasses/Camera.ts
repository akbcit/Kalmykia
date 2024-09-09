// src/core/Camera.ts
import * as THREE from "three";
import { setupCamera } from "../utils/setupCamera";
import { CameraProps, CameraType, OrthographicCameraProps, PerspectiveCameraProps } from "../../types/camera/CameraProps";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Camera {
    private camera: THREE.Camera;
    private controls?: OrbitControls;

    constructor(props: CameraProps, domElement?: HTMLElement) {
        const { camera, controls } = setupCamera(props, domElement);
        this.camera = camera;
        this.controls = controls;
    }

    public getCamera(): THREE.Camera {
        return this.camera;
    }

    public getControls(): OrbitControls | undefined {
        return this.controls;
    }

    public update(props: CameraProps): void {
        if (props.position) {
            this.camera.position.copy(props.position);
        }

        if (props.lookAt) {
            this.camera.lookAt(props.lookAt);
        }

        // Update specific properties for PerspectiveCamera
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

        // Update specific properties for OrthographicCamera
        if (this.camera instanceof THREE.OrthographicCamera && props.cameraType === CameraType.Orthographic) {
            const orthographicProps = props as OrthographicCameraProps;
            this.camera.updateProjectionMatrix();
        }

        // Update controls if available
        if (this.controls) {
            if (props.controls?.target) {
                this.controls.target.copy(props.controls.target);
                this.controls.update();
            }
            this.controls.autoRotate = props.controls?.autoRotate || false;
            this.controls.autoRotateSpeed = props.controls?.autoRotateSpeed || 2.0;
            this.controls.enabled = props.controls?.enabled ?? true;
        }
    }
}
