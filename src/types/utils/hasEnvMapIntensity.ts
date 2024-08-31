import * as THREE from "three";

// Correct implementation of hasEnvMapIntensity function
export function hasEnvMapIntensity(
    material: THREE.Material
): material is THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial {
    return (material as THREE.MeshStandardMaterial).envMapIntensity !== undefined;
}
