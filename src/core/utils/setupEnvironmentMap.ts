// src/utils/setupEnvironmentMap.ts
import * as THREE from "three";
import { EnvironmentMapProps } from "../../types/scene/EnvironmentMapProps";
import { hasEnvMapIntensity } from "../../types/utils/hasEnvMapIntensity";

export function setupEnvironmentMap(scene: THREE.Scene, environmentMap?: EnvironmentMapProps): void {
    if (!environmentMap) return;

    scene.environment = environmentMap.texture;
    scene.environment.mapping = THREE.EquirectangularReflectionMapping;

    scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const material = mesh.material;

            if (Array.isArray(material)) {
                material.forEach((mat) => {
                    if (hasEnvMapIntensity(mat)) {
                        mat.envMapIntensity = environmentMap.intensity || 1;
                    }
                });
            } else {
                if (hasEnvMapIntensity(material)) {
                    material.envMapIntensity = environmentMap.intensity || 1;
                }
            }
        }
    });
}
