// src/utils/LightFactory.ts
import * as THREE from 'three';
import { LightOptions } from './LightOptions';

export class LightFactory {
    static createLight(options: LightOptions): THREE.Light {
        let light: THREE.Light;

        switch (options.type) {
            case 'ambient':
                light = new THREE.AmbientLight(options.color, options.intensity || 1);
                break;

            case 'directional':
                light = new THREE.DirectionalLight(options.color, options.intensity || 1);
                light.position.copy(options.position || new THREE.Vector3(0, 10, 10));

                if (options.castShadow) {
                    light.castShadow = true;
                    if (light.shadow) {
                        light.shadow.mapSize.copy(options.shadowMapSize || new THREE.Vector2(1024, 1024));

                        // Make sure shadow.camera is a PerspectiveCamera or OrthographicCamera
                        if (light.shadow.camera instanceof THREE.PerspectiveCamera || light.shadow.camera instanceof THREE.OrthographicCamera) {
                            light.shadow.camera.near = options.shadowCameraNear || 0.5;
                            light.shadow.camera.far = options.shadowCameraFar || 500;
                        }

                        light.shadow.bias = options.shadowBias || 0;
                    }
                }
                break;

            case 'point':
                light = new THREE.PointLight(options.color, options.intensity || 1, options.distance, options.decay);
                light.position.copy(options.position || new THREE.Vector3(0, 10, 10));

                if (options.castShadow) {
                    light.castShadow = true;
                    if (light.shadow) {
                        light.shadow.mapSize.copy(options.shadowMapSize || new THREE.Vector2(1024, 1024));

                        // Ensure shadow.camera is handled safely
                        if (light.shadow.camera instanceof THREE.PerspectiveCamera || light.shadow.camera instanceof THREE.OrthographicCamera) {
                            light.shadow.camera.near = options.shadowCameraNear || 0.5;
                            light.shadow.camera.far = options.shadowCameraFar || 500;
                        }

                        light.shadow.bias = options.shadowBias || 0;
                    }
                }
                break;

            case 'spot':
                light = new THREE.SpotLight(
                    options.color,
                    options.intensity || 1,
                    options.distance,
                    options.angle || Math.PI / 4,
                    options.penumbra || 0.1,
                    options.decay
                );
                light.position.copy(options.position || new THREE.Vector3(0, 10, 10));

                // Access 'target' only if the light is a SpotLight
                if (light instanceof THREE.SpotLight) {
                    light.target.position.copy(options.target || new THREE.Vector3(0, 0, 0));
                }

                if (options.castShadow) {
                    light.castShadow = true;
                    if (light.shadow) {
                        light.shadow.mapSize.copy(options.shadowMapSize || new THREE.Vector2(1024, 1024));

                        // Ensure shadow.camera is properly handled
                        if (light.shadow.camera instanceof THREE.PerspectiveCamera || light.shadow.camera instanceof THREE.OrthographicCamera) {
                            light.shadow.camera.near = options.shadowCameraNear || 0.5;
                            light.shadow.camera.far = options.shadowCameraFar || 500;
                        }

                        light.shadow.bias = options.shadowBias || 0;
                    }
                }
                break;

            default:
                throw new Error('Unknown light type');
        }

        return light;
    }
}
