// src/types/KalmykiaProps.ts
import { ScreenProps } from "./screen/ScreenProps";
import { CameraControlsProps, CameraProps } from "./camera/CameraProps";
import { PhysicsProps } from "./physics/PhysicsProps";
import { SceneProps } from "./scene/SceneProps";  // Import SceneProps

/**
 * KalmykiaProps interface defines the configuration options for the Kalmykia engine,
 * encompassing all settings related to the scene, screen display, camera configuration,
 * and additional effects or controls.
 */
export interface KalmykiaProps {

  /**
   * Configures screen settings, including resolution, fullscreen mode, and rendering options.
   * This pertains to how the content is displayed on the screen, not how the scene is set up.
   */
  screen?: ScreenProps;

  /**
   * Configures camera controls, such as orbit, first-person, fly, or trackball controls.
   * Defines the type of control, target, auto-rotation, and other behaviors for navigating the scene.
   */
  cameraControls?: CameraControlsProps;

  /**
   * Configures the camera associated with the scene, including field of view (FOV), aspect ratio, near and far planes, and position.
   * Allows setting up the camera directly within the scene's configuration, defining the viewpoint of the scene.
   */
  camera?: CameraProps;

  /**
   * Configures physics settings, including global gravity and world scale.
   * Integrates a physics engine if required for dynamic interactions, collisions, and simulations within the scene.
   */
  physics?: PhysicsProps;
}
