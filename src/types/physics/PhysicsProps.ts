import * as THREE from 'three';

export interface PhysicsProps {
    gravity?: THREE.Vector3; // Global gravity for the scene (if physics engine is integrated)
    worldScale?: number; // Scaling factor for the physics world
}