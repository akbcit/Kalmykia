// src/types/SceneProps.ts
import * as THREE from "three";
import { FogProps } from "./FogProps";
import { GridHelperProps } from "./GridHelperProps";
import { AxesHelperProps } from "./AxesHelperProps";
import { LightingProps } from "../lighting/LightingProps";
import { EnvironmentMapProps } from "./EnvironmentMapProps";

/**
 * SceneProps interface defines optional properties to configure a Three.js scene.
 * This interface helps in setting up the 3D environment by specifying various visual 
 * and functional aspects of the scene.
 */
export interface SceneProps {
  /**
   * Sets the background color of the scene.
   * Accepts THREE.Color, a CSS color string, or a hexadecimal number.
   * Example: '#ffffff' or 0xffffff for a white background.
   */
  backgroundColor?: THREE.Color | string | number;

  /**
   * Sets a texture for the scene background, such as a skybox or any plain texture.
   * This property can override the background color if both are specified.
   */
  backgroundTexture?: THREE.Texture;

  /**
   * Configures fog effects in the scene to create depth and atmosphere.
   * Supports both linear and exponential fog types.
   * Fog can simulate environmental effects like haze or mist.
   */
  fog?: FogProps;

  /**
   * Configures a grid helper in the scene, providing a visual grid in the XZ plane.
   * Useful for orientation, positioning, and alignment of objects within the scene.
   */
  gridHelper?: GridHelperProps;

  /**
   * Configures an axes helper in the scene, showing the XYZ axes (red, green, blue).
   * Helps to visualize the coordinate system, making it easier to understand object positioning.
   */
  axesHelper?: AxesHelperProps;

  /**
   * Configures an environment map that adds reflections and environmental effects to objects in the scene.
   * Commonly used to simulate realistic lighting and reflections on surfaces.
   */
  environmentMap?: EnvironmentMapProps;
}
