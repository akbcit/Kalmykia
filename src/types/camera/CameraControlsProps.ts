import * as THREE from 'three';

export interface CameraControlsProps {
    enabled?: boolean;
    type?: 'orbit' | 'firstPerson' | 'fly' | 'trackball'; // Type of camera control
    target?: THREE.Vector3; // Target position for the camera controls
    autoRotate?: boolean; // Whether the camera should auto-rotate around the target
    autoRotateSpeed?: number; // Speed of auto-rotation
}