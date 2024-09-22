import * as THREE from 'three';

/**
 * Base options common to all light types.
 */
export interface BaseLightOptions {
    type: 'ambient' | 'directional' | 'point' | 'spot'; // Type of the light
    color: THREE.ColorRepresentation; // Color of the light
    intensity?: number; // Light intensity, default varies per type
    castShadow?: boolean; // Whether the light casts shadows
}

/**
 * Options specific to directional lights.
 */
export interface DirectionalLightOptions extends BaseLightOptions {
    type: 'directional'; // Must be 'directional' for directional lights
    position?: THREE.Vector3; // Position of the light in 3D space
    target?: THREE.Vector3; // The point the light is aimed at
    shadowMapSize?: THREE.Vector2; // Resolution of the shadow map
    shadowCameraNear?: number; // Near clipping plane of the shadow camera
    shadowCameraFar?: number; // Far clipping plane of the shadow camera
    shadowBias?: number; // Shadow bias to avoid artifacts
}

/**
 * Options specific to point lights.
 */
export interface PointLightOptions extends BaseLightOptions {
    type: 'point'; // Must be 'point' for point lights
    position?: THREE.Vector3; // Position of the point light
    distance?: number; // Maximum range of the light, default is infinite
    decay?: number; // How quickly the light dims as distance increases

    // Shadow-related properties
    shadowMapSize?: THREE.Vector2; // Resolution of the shadow map
    shadowCameraNear?: number; // Near clipping plane for the shadow camera
    shadowCameraFar?: number; // Far clipping plane for the shadow camera
    shadowBias?: number; // Bias for shadow calculations to avoid artifacts
}

/**
 * Options specific to spot lights.
 */
export interface SpotLightOptions extends BaseLightOptions {
    type: 'spot'; // Must be 'spot' for spot lights
    position?: THREE.Vector3; // Position of the spot light
    target?: THREE.Vector3; // The point the light is aimed at
    distance?: number; // Maximum range of the light
    angle?: number; // Maximum angle of the light cone in radians
    penumbra?: number; // Soft edge for the light cone, between 0 and 1
    decay?: number; // How quickly the light dims as distance increases

    // Shadow-related properties
    shadowMapSize?: THREE.Vector2; // Resolution of the shadow map
    shadowCameraNear?: number; // Near clipping plane of the shadow camera
    shadowCameraFar?: number; // Far clipping plane of the shadow camera
    shadowBias?: number; // Bias for shadow calculations to avoid artifacts
}

/**
 * Options specific to ambient lights.
 */
export interface AmbientLightOptions extends BaseLightOptions {
    type: 'ambient'; // Must be 'ambient' for ambient lights
}

/**
 * Union type for all possible light options.
 */
export type LightOptions = 
    | DirectionalLightOptions
    | PointLightOptions
    | SpotLightOptions
    | AmbientLightOptions;
