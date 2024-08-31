// src/core/utils/setupScene.ts
import * as THREE from "three";
import { setupLighting } from "./setupLighting";
import { setupEnvironmentMap } from "./setupEnvironmentMap";
import { SceneProps } from "types/scene/SceneProps";

/**
 * Sets up the Three.js scene with optional properties for background, fog, helpers, and lighting.
 * This function configures the scene based on the provided SceneProps, making it easier to manage
 * and maintain scene configuration in a modular way.
 *
 * @param scene - The Three.js scene object to configure.
 * @param props - Optional SceneProps object containing configuration options.
 * @returns The configured Three.js scene.
 */
export function setupScene(scene: THREE.Scene, props?: SceneProps): THREE.Scene {
    // Set background color or texture if specified
    if (props?.backgroundColor) {
        scene.background = new THREE.Color(props.backgroundColor);
    }

    if (props?.backgroundTexture) {
        scene.background = props.backgroundTexture;
    }

    // Configure fog in the scene to add atmospheric effects like mist or haze
    if (props?.fog) {
        scene.fog = props.fog.type === 'exponential'
            ? new THREE.FogExp2(props.fog.color, props.fog.density)
            : new THREE.Fog(props.fog.color, props.fog.near, props.fog.far);
    }

    // Add a grid helper to the scene if specified in the properties
    if (props?.gridHelper) {
        const gridHelper = new THREE.GridHelper(
            props.gridHelper.size || 10,
            props.gridHelper.divisions || 10,
            props.gridHelper.colorCenterLine || 0x444444,
            props.gridHelper.colorGrid || 0x888888
        );
        scene.add(gridHelper);
    }

    // Add an axes helper to visualize the XYZ axes in the scene if specified
    if (props?.axesHelper) {
        const axesHelper = new THREE.AxesHelper(props.axesHelper.size || 5);
        scene.add(axesHelper);
    }

    // Configure scene lighting using a utility function to add various lights
    setupLighting(scene, props?.lighting);

    // Set up the environment map for reflections and environmental effects
    setupEnvironmentMap(scene, props?.environmentMap);

    // Return the fully configured scene
    return scene;
}
