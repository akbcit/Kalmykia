// src/index.ts
import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { CameraType } from './types/camera/CameraProps';
import { KalmykiaBuilder } from './core/KalmykiaBuilder';
import { LightFactory } from './core/derivedClasses/components/light/LightFactory';
import { MaterialFactory } from './core/derivedClasses/entites/materials/MaterialFactory';
import { WaterLakeIrregularTerrain } from './core/derivedClasses/entites/terrains/natural/WaterLakeIrregularTerrain';

const materialFactory = new MaterialFactory();

const customWaterMaterial = materialFactory.createWaterMaterial({
  color: '#3FA7D6',
  metalness: 0.2,
  roughness: 0.3,
  transmission: 0.9,
  reflectivity: 0.5,
  clearcoat: 0.7,
  clearcoatRoughness: 0.2,
  opacity: 0.8,
  ior: 1.33,
  envMapIntensity: 0.5,
  side: THREE.DoubleSide,
});

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app') as HTMLElement;

  // Create a water terrain using the WaterLakeIrregularTerrain class
  const waterTerrain = new WaterLakeIrregularTerrain({
    irregularPlaneGeometryParams: { radius: 10, segments: 30, boundaryDisplacementFactor: 1 },
    material: customWaterMaterial,
    noiseScale: 10,
    heightFactor: 2,
    receiveShadow: true,
    useNoise: false,
    rippleSpeed: 1,
    rippleFrequency: 1,
    amplitude: 2,
  });

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
    .addScene('main', '#333', 5)
    .addResizeListener()
    .addPanKeyListener()
    .addRenderSystem()
    .addLight(LightFactory.createLight({ type: 'directional', color: 'white', position: new THREE.Vector3(100, 100, 10) }))
    .addAmbientLight(10)
    .addTerrain(waterTerrain)
    .build();

  // Add dat.GUI for controlling various terrain properties
  const gui = new GUI();
  const params = {
    radius: 10,
    segments: 30,
    boundaryDisplacementFactor: 1,
    rippleSpeed: 1,
    rippleFrequency: 1,
    amplitude: 2,
  };

  // GUI controls for terrain geometry
  gui.add(params, 'radius', 1, 1000).onChange((value) => {
    waterTerrain.updateGeometry({ irregularPlaneGeometryParams: { radius: value } });
  });

  gui.add(params, 'segments', 1, 100).step(1).onChange((value) => {
    waterTerrain.updateGeometry({ irregularPlaneGeometryParams: { segments: value } });
  });

  gui.add(params, 'boundaryDisplacementFactor', 0, 10).onChange((value) => {
    waterTerrain.updateGeometry({ irregularPlaneGeometryParams: { boundaryDisplacementFactor: value } });
  });

  // GUI controls for ripple properties
  gui.add(params, 'rippleSpeed', 0.1, 10).onChange((value) => {
    waterTerrain.rippleSpeed = value;
  });

  gui.add(params, 'rippleFrequency', 0.1, 10).onChange((value) => {
    waterTerrain.rippleFrequency = value;
  });

  gui.add(params, 'amplitude', 0.1, 10).onChange((value) => {
    waterTerrain.amplitude = value;
  });

  // Register update callback for animations
  engine.sceneManager.getCurrentScene()?.registerUpdateCallback((delta: number) => {
    waterTerrain.updateRipples();
  });

  engine.start();
});
