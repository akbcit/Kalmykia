// src/utils/setupLighting.ts
import { LightingProps } from "../../types/lighting/LightingProps";
import * as THREE from "three";

export function setupLighting(scene: THREE.Scene, lighting?: LightingProps): void {
    if (!lighting) return;

    if (lighting.ambientLight) {
        const ambientLight = new THREE.AmbientLight(
            lighting.ambientLight.color,
            lighting.ambientLight.intensity || 1
        );
        scene.add(ambientLight);
    }

    if (lighting.directionalLight) {
        const dirLight = new THREE.DirectionalLight(
            lighting.directionalLight.color,
            lighting.directionalLight.intensity || 1
        );
        dirLight.position.copy(lighting.directionalLight.position || new THREE.Vector3(5, 10, 7.5));
        dirLight.castShadow = lighting.directionalLight.castShadow || false;
        scene.add(dirLight);
    }

    if (lighting.pointLights) {
        lighting.pointLights.forEach(lightProps => {
            const pointLight = new THREE.PointLight(
                lightProps.color,
                lightProps.intensity || 1,
                lightProps.distance,
                lightProps.decay || 2
            );
            pointLight.position.copy(lightProps.position || new THREE.Vector3(0, 0, 0));
            pointLight.castShadow = lightProps.castShadow || false;
            scene.add(pointLight);
        });
    }

    if (lighting.spotLights) {
        lighting.spotLights.forEach(lightProps => {
            const spotLight = new THREE.SpotLight(
                lightProps.color,
                lightProps.intensity || 1,
                lightProps.distance,
                lightProps.angle || Math.PI / 4,
                lightProps.penumbra || 0.1,
                lightProps.decay || 1
            );
            spotLight.position.copy(lightProps.position || new THREE.Vector3(0, 0, 0));
            spotLight.target.position.copy(lightProps.target || new THREE.Vector3(0, 0, 0));
            spotLight.castShadow = lightProps.castShadow || false;
            scene.add(spotLight);
            scene.add(spotLight.target);
        });
    }
}
