// src/types/camera/CameraProps.ts
import * as THREE from "three";

// Enum to specify camera types
export enum CameraType {
    Perspective = "Perspective",
    Orthographic = "Orthographic",
    // Add more camera types here as needed
}

export interface BaseCameraProps {
    cameraType: CameraType; // Camera type
    position?: THREE.Vector3; // Position of the camera
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

// Unified CameraProps type
export type CameraProps = PerspectiveCameraProps | OrthographicCameraProps;
