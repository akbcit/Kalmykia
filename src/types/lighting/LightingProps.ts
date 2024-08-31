import * as THREE from 'three';

export interface AmbientLightProps {
    color: THREE.Color | string | number;
    intensity?: number;
}

export interface DirectionalLightProps {
    color: THREE.Color | string | number;
    intensity?: number;
    position?: THREE.Vector3; // Position of the directional light
    castShadow?: boolean; // Whether the light casts shadows
}

export interface PointLightProps {
    color: THREE.Color | string | number;
    intensity?: number;
    position?: THREE.Vector3;
    distance?: number;
    decay?: number; // How quickly the light dims with distance
    castShadow?: boolean;
}

export interface SpotLightProps {
    color: THREE.Color | string | number;
    intensity?: number;
    position?: THREE.Vector3;
    target?: THREE.Vector3; // Target position for the spotlight
    angle?: number; // Maximum angle of light dispersion from its direction
    penumbra?: number; // Percent of the spotlight cone that is attenuated due to penumbra
    decay?: number;
    distance?: number;
    castShadow?: boolean;
  }

  export interface LightingProps {
    ambientLight?: AmbientLightProps;
    directionalLight?: DirectionalLightProps;
    pointLights?: PointLightProps[];
    spotLights?: SpotLightProps[];
  }