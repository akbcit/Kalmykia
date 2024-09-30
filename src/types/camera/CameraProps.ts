// src/types/camera/CameraProps.ts
import * as THREE from "three";

// Enum to specify camera types
export enum CameraType {
    Perspective = "Perspective",
    Orthographic = "Orthographic",
    // Add more camera types here as needed
}

export interface CameraControlsProps {
    enabled?: boolean; // Enable or disable the controls
    type?: 'orbit' | 'firstPerson' | 'fly' | 'trackball'; // Type of camera control
    target?: THREE.Vector3; // Target position for the camera to look at
    autoRotate?: boolean; // Automatically rotate the camera around the target
    autoRotateSpeed?: number; // Speed of auto-rotation
    minPolarAngle?: number; // Minimum vertical angle for orbit controls
    maxPolarAngle?: number; // Maximum vertical angle for orbit controls
    minAzimuthAngle?: number; // Minimum horizontal angle for orbit controls
    maxAzimuthAngle?: number; // Maximum horizontal angle for orbit controls
    enablePan?: boolean; // Allow panning
    panSpeed?: number; // Speed of panning
    screenSpacePanning?: boolean; // Pan in screen space (default true)
    enableZoom?: boolean; // Allow zooming
    zoomSpeed?: number; // Speed of zooming
    minDistance?: number; // Minimum zoom distance for perspective camera
    maxDistance?: number; // Maximum zoom distance for perspective camera
    enableDamping?: boolean; // Enable damping (smooth camera movements)
    dampingFactor?: number; // Damping factor
    rotateSpeed?: number; // Speed of rotation
    keys?: { LEFT: string; UP: string; RIGHT: string; BOTTOM: string }; // Key mappings for controls
    restrictPanToXZPlane?: boolean; // Restrict panning to the XZ plane
    maxPan?: THREE.Vector3; // Maximum limits for panning
    minPan?: THREE.Vector3; // Minimum limits for panning
    enableKeys?: boolean; // Enable or disable keyboard controls
    movementSpeed?: number; // Movement speed for first-person and fly controls
    lookSpeed?: number; // Look speed for first-person and fly controls
    noFly?: boolean; // Disable fly mode (only for fly controls)
    dragToLook?: boolean; // Allow drag to look around (first-person and fly controls)
    enableRoll?: boolean; // Allow rolling the camera (fly controls)
    minCameraY?: number; // Minimum Y position for the camera
    maxLookDownAngle?: number; // Maximum downward angle for looking down
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
