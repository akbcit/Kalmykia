import * as THREE from 'three';

export interface ShadowsProps {
  enabled: boolean; // Globally enable/disable shadows
  shadowMapSize?: THREE.Vector2; // Size of the shadow map
  shadowCameraNear?: number; // Near plane of the shadow camera
  shadowCameraFar?: number; // Far plane of the shadow camera
  shadowBias?: number; // Bias for shadow mapping
}