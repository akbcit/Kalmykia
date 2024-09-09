// src/types/camera/CameraProps.ts
import * as THREE from "three";

// Enum to specify camera types
export enum CameraType {
    Perspective = "Perspective",
    Orthographic = "Orthographic",
    // Add more camera types here as needed
}

export interface CameraControlsProps {
    enabled?: boolean;
    type?: 'orbit' | 'firstPerson' | 'fly' | 'trackball'; // Type of camera control
    target?: THREE.Vector3; // Target position for the camera controls
    autoRotate?: boolean; // Whether the camera should auto-rotate around the target
    autoRotateSpeed?: number; // Speed of auto-rotation
}

// Base camera properties including controls
export interface BaseCameraProps {
    cameraType: CameraType; // Camera type
    position?: THREE.Vector3; // Position of the camera
    lookAt?: THREE.Vector3; // Point the camera should look at
    controls?: CameraControlsProps; // Optional controls configuration
}

export interface PerspectiveCameraProps extends BaseCameraProps {
    fov?: number; // Field of view
    aspect?: number; // Aspect ratio
    near?: number; // Near clipping plane
    far?: number; // Far clipping plane
}

export interface OrthographicCameraProps extends BaseCameraProps {
    left?: number; // Left plane
    right?: number; // Right plane
    top?: number; // Top plane
    bottom?: number; // Bottom plane
    near?: number; // Near clipping plane
    far?: number; // Far clipping plane
}

// Unified CameraProps type with controls included
export type CameraProps = PerspectiveCameraProps | OrthographicCameraProps;
