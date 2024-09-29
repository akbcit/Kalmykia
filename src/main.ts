// src/index.ts
import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { CameraType } from './types/camera/CameraProps';
import { KalmykiaBuilder } from './core/KalmykiaBuilder';
import { LightFactory } from './core/derivedClasses/components/light/LightFactory';
import { MaterialFactory } from './core/derivedClasses/entites/materials/MaterialFactory';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { WaterEntity, WaterEntityParams } from './core/derivedClasses/entites/water/Water';
import { IrregularPlaneGeometry } from './core/derivedClasses/entites/geometries/primitives/IrregularPlaneGeometry';

const materialFactory = new MaterialFactory();

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app') as HTMLElement;

  // Create a new WaterEntity
  const waterParams: WaterEntityParams = {
    geometry: new IrregularPlaneGeometry({}),
    texturePath: 'src/assets/normals/waternormals.jpg',
    sunDirection: new THREE.Vector3(0.2, 1.0, 0.1), // Sunlight direction
    sunColor: 0xffffff, // Sunlight color
    waterColor: 0x001e0f, // Water surface color
    distortionScale: 3.7, // Scale of water surface distortion
    size: 1, // Size of the water waves
    alpha: 0.75, // Transparency
    castShadow: true, // Enable casting shadows
    receiveShadow: true, // Enable receiving shadows
  };

  const waterEntity = new WaterEntity(waterParams);

  const engine = new KalmykiaBuilder(container)
    .setCamera({
      cameraType: CameraType.Perspective,
      position: new THREE.Vector3(0, 100, 100),
      fov: 60,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 10000,
      lookAt: new THREE.Vector3(0, 0, 0),
      controls: {
        enabled: true,
        type: 'orbit',
        target: new THREE.Vector3(0, 0, 0),
        autoRotate: false,
        minPolarAngle: 0,
        maxPolarAngle: Math.PI / 2,
        minDistance: 5,
        maxDistance: 1000,
      },
    })
    .addScene('main', '#0ac0fc', 5)
    .addResizeListener()
    .addPanKeyListener()
    .addRenderSystem()
    .addLight(LightFactory.createLight({ type: 'directional', color: 0xffffff, position: new THREE.Vector3(100, 100, 10) }))
    .addAmbientLight(0.5).addEntity(waterEntity)
    .build();

  // Load water normal texture
  const textureLoader = new THREE.TextureLoader();
  const waterNormals = textureLoader.load('src/assets/normals/waternormals.jpg');
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  // Add dat.GUI for controlling water properties
  // Add dat.GUI for controlling water properties
  const gui = new GUI();
  const waterUniforms = waterEntity.getWater().material.uniforms;
  const waterFolder = gui.addFolder('Water');
  waterFolder.addColor(waterUniforms.waterColor, 'value').name('Water Color');
  waterFolder.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('Distortion Scale');
  waterFolder.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('Size');
  waterFolder.open();

  // Register update callback for animations
  engine.sceneManager.getCurrentScene()?.registerUpdateCallback((delta: number) => {
    waterEntity.updateWaterAnimation(delta);
  });

  engine.start();
});