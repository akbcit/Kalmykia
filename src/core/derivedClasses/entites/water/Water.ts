// src/entities/WaterEntity.ts
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water';
import { Entity } from '../../../parentClasses/Entity';
import { MeshComponent } from '../../components/MeshComponent';

export type WaterEntityParams = {
  geometry: THREE.PlaneGeometry | THREE.BufferGeometry; // Required: Geometry of the water surface (plane or buffer).

  // Texture Settings
  texturePath?: string;                     // Path to the normal map texture for water surface distortion.
  textureWidth?: number;                    // Width of the generated water texture (default: 512).
  textureHeight?: number;                   // Height of the generated water texture (default: 512).
  waterNormals?: THREE.Texture;             // Preloaded normal map texture for water surface distortion.

  // Water Surface Properties
  waterColor?: THREE.Color | number;        // Color of the water surface, either THREE.Color or hex number.
  distortionScale?: number;                 // Scale of surface distortion; higher values = more pronounced waves.
  alpha?: number;                           // Transparency value for water. 1 = opaque, 0 = fully transparent.

  // Sun Properties
  sunDirection?: THREE.Vector3;             // Direction of sunlight as a vector. Defines light source position.
  sunColor?: THREE.Color | number;          // Color of the sunlight, either THREE.Color or hex number.

  // Animation Settings
  timeScale?: number;                       // Multiplier for the speed of the water animation.
  waveSpeed?: number;                       // Speed at which the waves move.
  waveIntensity?: number;                   // Intensity of the waves' motion and height.

  // Surface Scale and Position
  size?: number;                            // Scale size of the water surface (affects wave size).
  flowDirection?: THREE.Vector2;            // Flow direction of the water waves as a 2D vector.

  // Rendering Options
  side?: THREE.Side;                        // Render both sides of the water surface (default: `THREE.DoubleSide`).
  fog?: boolean;                            // Determines if fog should affect the water surface.
  opacity?: number;                         // Water surface opacity (for semi-transparent water effect).

  // Refraction and Reflection
  reflectivity?: number;                    // Intensity of reflection on the water surface.
  refractionRatio?: number;                 // Amount of light bending through water (defines clarity).

  // Light Interaction
  ambientLightColor?: THREE.Color | number; // Color of ambient light affecting the water surface.
  lightIntensity?: number;                  // Intensity of the directional light on the water surface.

  // Custom Shader Uniforms (optional)
  customUniforms?: Record<string, { value: any }>; // Additional custom uniforms for shaders.

  // Shadow Properties
  castShadow?: boolean;                     // Determines if the water surface should cast a shadow.
  receiveShadow?: boolean;                  // Determines if the water surface should receive shadows.

  hasDoubleSide?: boolean;

  // Optional Callbacks for Water Entity
  onBeforeRender?: (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => void; // Custom render logic.
  onAfterRender?: (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => void;  // Custom post-render logic.
};

export class WaterEntity extends Entity {
  private water: Water;
  private static readonly DEFAULT_NORMALS_PATH = 'src/assets/normals/waternormals.jpg'; // Default path for waterNormals texture

  constructor(params: WaterEntityParams) {
    super();

    // Validate required geometry parameter
    if (!params.geometry) {
      throw new Error('WaterEntity class requires a geometry object.');
    }

    // Create a TextureLoader and use default normals if a texture path or waterNormals are not provided
    let waterNormals: THREE.Texture | undefined = params.waterNormals;
    if (!waterNormals) {
      const textureLoader = new THREE.TextureLoader();
      const texturePath = params.texturePath || WaterEntity.DEFAULT_NORMALS_PATH; // Use user-provided or default path
      waterNormals = textureLoader.load(texturePath);
      waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
    }

    // Create the water object using the provided parameters
    this.water = new Water(params.geometry, {
      textureWidth: params.textureWidth || 512,
      textureHeight: params.textureHeight || 512,
      waterNormals: waterNormals, // Use the provided or default normal texture
      sunDirection: params.sunDirection || new THREE.Vector3(0.2, 1.0, 0.1),
      sunColor: params.sunColor || 0xffffff,
      waterColor: params.waterColor || 0x001e0f,
      distortionScale: params.distortionScale || 3.7,
      fog: params.fog || false,
    });

    // Set double-sided rendering 
    if (params.hasDoubleSide) {
      this.water.material.side = THREE.DoubleSide;
    }

    const waterMaterial = this.water.material;
    // waterMaterial.polygonOffset = true;
    // waterMaterial.polygonOffsetFactor  = 10;
    // waterMaterial.polygonOffsetUnits  = 10;
    waterMaterial.depthWrite = false; // Prevent water from affecting depth buffer
    waterMaterial.depthTest = true; // Enable depth testing
    waterMaterial.depthFunc = THREE.LessEqualDepth;
    waterMaterial.transparent = true;
    waterMaterial.blending = THREE.NormalBlending;
    
    // Set additional water properties based on params
    if (params.opacity !== undefined) this.water.material.opacity = params.opacity;
    if (params.side !== undefined) this.water.material.side = params.side;
    if (params.alpha !== undefined) this.water.material.transparent = params.alpha < 1;

    // Add the water mesh to the entity as a MeshComponent
    const waterMeshComponent = new MeshComponent(this.water.geometry, this.water.material);
    this.addComponent(waterMeshComponent);

    // Set render order for the WaterEntity's mesh
    this.setRenderOrder(10); // Render after terrain

    // Rotate and position the water object
    this.water.rotation.x = -Math.PI / 2; // Rotate to lie flat
    this.water.position.y = 0;

    // Set wave size and flow direction if provided
    if (params.size !== undefined) this.water.material.uniforms['size'].value = params.size;
    if (params.flowDirection) this.water.material.uniforms['flowDirection'].value = params.flowDirection;

    // Optional shadows
    if (params.castShadow !== undefined) this.water.castShadow = params.castShadow;
    if (params.receiveShadow !== undefined) this.water.receiveShadow = params.receiveShadow;
  }

  // Method to get the Three.js water object for direct manipulation if needed
  public getWater(): Water {
    return this.water;
  }

  // Override the getObject3D method to return the water mesh
  public getObject3D(): THREE.Object3D | null {
    return this.water;
  }

  // Method to update water animation, similar to what you had before
  public updateWaterAnimation(deltaTime: number): void {
    const timeUniform = this.water.material.uniforms['time'];

    if (timeUniform) {
      timeUniform.value += deltaTime;
    }

    // Update the texture and other rendering logic if necessary
    this.water.material.needsUpdate = true;
  }

  // Method to dynamically update the sun position
  public updateSunPosition(sunPosition: THREE.Vector3): void {
    if (this.water.material.uniforms['sunDirection']) {
      this.water.material.uniforms['sunDirection'].value.copy(sunPosition).normalize();
    }
  }

  // Method to dynamically update the sun color
  public setSunColor(newSunColor: THREE.Color): void {
    if (this.water.material.uniforms['sunColor']) {
      this.water.material.uniforms['sunColor'].value.set(newSunColor);
    }
  }
}
