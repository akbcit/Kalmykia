import * as THREE from "three";

export interface CameraProps {
    fov?: number; // Field of view
    aspect?: number; // Aspect ratio
    near?: number; // Near clipping plane
    far?: number; // Far clipping plane
    position?: THREE.Vector3; // Position of the camera
}