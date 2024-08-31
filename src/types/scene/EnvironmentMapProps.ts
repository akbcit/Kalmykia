import * as THREE from 'three';

export interface EnvironmentMapProps {
    texture: THREE.CubeTexture | THREE.Texture; // Environment map texture
    intensity?: number; // Intensity of the environment map reflection
}