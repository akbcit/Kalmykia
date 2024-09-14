// src/core/Camera.ts
import * as THREE from "three";
import { setupCamera } from "../utils/setupCamera";
import { CameraProps, CameraType, OrthographicCameraProps, PerspectiveCameraProps } from "../../types/camera/CameraProps";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Camera {
    private camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    private controls?: OrbitControls;

    constructor(props: CameraProps, domElement?: HTMLElement) {
        const { camera, controls } = setupCamera(props, domElement);
        this.camera = camera;
        this.controls = controls;
    }

    public getCamera(): THREE.PerspectiveCamera | THREE.OrthographicCamera {
        return this.camera;
    }

    public getControls(): OrbitControls | undefined {
        return this.controls;
    }

    public update(props: CameraProps): void {
        // Update the camera position
        if (props.position) {
            this.camera.position.copy(props.position);
        }

        // Update the camera's lookAt
        if (props.lookAt) {
            this.camera.lookAt(props.lookAt);
        }

        // Update specific properties for PerspectiveCamera
        if (this.camera instanceof THREE.PerspectiveCamera && props.cameraType === CameraType.Perspective) {
            const perspectiveProps = props as PerspectiveCameraProps;
            if (perspectiveProps.fov !== undefined) {
                this.camera.fov = perspectiveProps.fov;
            }
            if (perspectiveProps.aspect !== undefined) {
                this.camera.aspect = perspectiveProps.aspect;
            }
            this.camera.updateProjectionMatrix(); // Update the projection matrix once after all perspective updates
        }

        // Update specific properties for OrthographicCamera
        if (this.camera instanceof THREE.OrthographicCamera && props.cameraType === CameraType.Orthographic) {
            const orthographicProps = props as OrthographicCameraProps;
            this.camera.left = orthographicProps.left ?? -window.innerWidth / 2;
            this.camera.right = orthographicProps.right ?? window.innerWidth / 2;
            this.camera.top = orthographicProps.top ?? window.innerHeight / 2;
            this.camera.bottom = orthographicProps.bottom ?? -window.innerHeight / 2;
            this.camera.near = orthographicProps.near ?? 0.1;
            this.camera.far = orthographicProps.far ?? 1000;
            this.camera.updateProjectionMatrix(); // Update the projection matrix once after all orthographic updates
        }

        // Update OrbitControls if available
        if (this.controls) {
            // Update the target and relevant control properties
            if (props.controls?.target) {
                this.controls.target.copy(props.controls.target);
            }
            this.controls.autoRotate = props.controls?.autoRotate || false;
            this.controls.autoRotateSpeed = props.controls?.autoRotateSpeed || 2.0;
            this.controls.enabled = props.controls?.enabled ?? true;

            // Apply additional controls settings
            if (props.controls?.enablePan !== undefined) {
                this.controls.enablePan = props.controls.enablePan;
            }
            if (props.controls?.panSpeed !== undefined) {
                this.controls.panSpeed = props.controls.panSpeed;
            }
            if (props.controls?.enableZoom !== undefined) {
                this.controls.enableZoom = props.controls.enableZoom;
            }
            if (props.controls?.zoomSpeed !== undefined) {
                this.controls.zoomSpeed = props.controls.zoomSpeed;
            }
            if (props.controls?.enableDamping !== undefined) {
                this.controls.enableDamping = props.controls.enableDamping;
            }
            if (props.controls?.dampingFactor !== undefined) {
                this.controls.dampingFactor = props.controls.dampingFactor;
            }
            if (props.controls?.rotateSpeed !== undefined) {
                this.controls.rotateSpeed = props.controls.rotateSpeed;
            }
            if (props.controls?.restrictPanToXZPlane) {
                // Implement restriction to XZ plane
                this.controls.addEventListener('change', () => {
                    this.controls?.target.set(this.controls.target.x, 0, this.controls.target.z);
                });
            }

            // Apply min and max pan limits if specified
            if (props.controls?.maxPan || props.controls?.minPan) {
                this.controls.addEventListener('change', () => {
                    const target = this.controls!.target;
                    if (props.controls?.maxPan) {
                        target.x = Math.min(target.x, props.controls.maxPan.x);
                        target.y = Math.min(target.y, props.controls.maxPan.y);
                        target.z = Math.min(target.z, props.controls.maxPan.z);
                    }
                    if (props.controls?.minPan) {
                        target.x = Math.max(target.x, props.controls.minPan.x);
                        target.y = Math.max(target.y, props.controls.minPan.y);
                        target.z = Math.max(target.z, props.controls.minPan.z);
                    }
                });
            }

            this.controls.update(); // Ensure controls are updated after changes
        }
    }
}
