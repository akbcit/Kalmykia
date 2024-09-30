// src/index.ts
import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { CameraType } from './types/camera/CameraProps';
import { KalmykiaBuilder } from './core/KalmykiaBuilder';
import { LightFactory } from './core/derivedClasses/components/light/LightFactory';
import { MaterialFactory } from './core/derivedClasses/entites/materials/MaterialFactory';
import { WaterEntity, WaterEntityParams } from './core/derivedClasses/entites/water/Water';
import { IrregularPlaneGeometry } from './core/derivedClasses/entites/geometries/primitives/IrregularPlaneGeometry';
import { RectangularTerrain } from './core/derivedClasses/entites/terrains/RectangularTerrain';
import { fractalBrownianMotion, seededCheckerboardFunction, seededCircularWavesFunction, seededSineWaveFunction } from './utils/noise/functions/noiseFunctions';
import { BasinParams } from './core/derivedClasses/entites/terrains/BaseTerrain';

const materialFactory = new MaterialFactory();
const doubleSidedPlaneMaterial = materialFactory.createNonShinyMossMaterial();

// Create a smooth base noise function for hills
const baseNoise = seededCircularWavesFunction(0.05); // Adjust frequency for smoothness

// Use fractal Brownian motion for soft hills
const softHillNoiseFunction = fractalBrownianMotion(baseNoise, 5, 0.5, 2.0, 1.0);

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app') as HTMLElement;

  // Create a new WaterEntity
  const waterParams: WaterEntityParams = {
    geometry: new IrregularPlaneGeometry({ radius: 20 }),
    sunColor: 0xffffff, // Sunlight color
    waterColor: 0x001e0f, // Water surface color
    distortionScale: 4, // Scale of water surface distortion
    size: 2.0, // Increase size of the waves
    alpha: 0.85, // Slightly increase transparency
    castShadow: true, // Enable casting shadows
    receiveShadow: true, // Enable receiving shadows
    hasDoubleSide: true,
    sunDirection: new THREE.Vector3(1, 1, 1),
  };

  const waterEntity = new WaterEntity(waterParams);

  const basins: BasinParams[] = [
    {
      position: new THREE.Vector2(0, 0), // Basin position at center
      radius: 20, // Radius of the basin
      depth: 5,  // Depth of the basin (shallower to keep it close to zero)
      falloff: 'smooth',
    },
  ];

  // Create terrain with basins
  const noisyTerrain = new RectangularTerrain({
    material: doubleSidedPlaneMaterial,
    noiseScale: 100,
    heightFactor: 10,
    baseHeight: 0, // Set base height of the terrain
    rectangularPlaneParams: {
      width: 200,
      height: 200,
      widthSegments: 50,
      heightSegments: 50,
    },
    noiseFunction: softHillNoiseFunction,
    basins, // Pass the basins array to the terrain
  });

  // Get the lowest point of the first basin to position the water
  const lowestPoint = noisyTerrain.getBasinLowestPoint(0); // Get the lowest point of the first basin

  waterEntity.setPosition(0, 1, 0);

  // Initialize Kalmykia engine
  const engine = new KalmykiaBuilder(container)
    .setCamera({
      cameraType: CameraType.Perspective,
      position: new THREE.Vector3(0, 100, 100),
      fov: 60,
      aspect: window.innerWidth / window.innerHeight,
      near: 1,
      far: 1000,
      lookAt: new THREE.Vector3(0, 0, 0),
      controls: {
        enabled: true,
        type: 'orbit',
        target: new THREE.Vector3(0, 0, 0),
        autoRotate: false,
        minPolarAngle: 0.1,
        maxPolarAngle: Math.PI / 4  ,
        minDistance: 5,
        maxDistance: 1000,
        restrictPanToXZPlane: true,
      },
    })
    .addScene('main', '#0D1B2A', 5)
    .addResizeListener()
    .addPanKeyListener()
    .addRenderSystem()
    .addLight(LightFactory.createLight({ type: 'directional', color: 0xffffff, position: new THREE.Vector3(100, 100, 10) }))
    .addAmbientLight(0.5)
    .addEntity(waterEntity)
    .addTerrain(noisyTerrain)
    .build();

  // Add dat.GUI for controlling water properties
  const gui = new GUI();
  const waterFolder = gui.addFolder('Water Properties');
  const waterUniforms = waterEntity.getWater().material.uniforms;

  waterFolder.addColor(waterUniforms.waterColor, 'value').name('Water Color');
  waterFolder.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('Distortion Scale');
  waterFolder.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('Size');
  waterFolder.open();

  // Add a folder for terrain properties
  const terrainFolder = gui.addFolder('Terrain Properties');

  // Define a proxy object for dynamic updates
  const terrainProps = {
    noiseScale: noisyTerrain.noiseScale,
    heightFactor: noisyTerrain.heightFactor,
    baseHeight: noisyTerrain.baseHeight,
    widthSegments: noisyTerrain.rectangularPlaneParams.widthSegments,
    heightSegments: noisyTerrain.rectangularPlaneParams.heightSegments,
    basinDepth: basins[0].depth,
  };

  // Add controls for terrain properties that affect hill formation
  terrainFolder.add(terrainProps, 'noiseScale', 1, 200, 1).name('Noise Scale')
    .onChange((value: number) => {
      noisyTerrain.noiseScale = value;
      noisyTerrain.rebuildTerrain(); // Rebuild terrain on change
    });

  terrainFolder.add(terrainProps, 'heightFactor', 1, 20, 0.1).name('Height Factor')
    .onChange((value: number) => {
      noisyTerrain.heightFactor = value;
      noisyTerrain.rebuildTerrain(); // Rebuild terrain on change
    });

  terrainFolder.add(terrainProps, 'baseHeight', -10, 10, 0.1).name('Base Height')
    .onChange((value: number) => {
      noisyTerrain.baseHeight = value;
      noisyTerrain.rebuildTerrain(); // Rebuild terrain on change
    });

  terrainFolder.add(terrainProps, 'widthSegments', 1, 200, 1).name('Width Segments')
    .onChange((value: number) => {
      noisyTerrain.rectangularPlaneParams.widthSegments = value;
      noisyTerrain.rebuildTerrain(); // Rebuild terrain with new mesh resolution
    });

  terrainFolder.add(terrainProps, 'heightSegments', 1, 200, 1).name('Height Segments')
    .onChange((value: number) => {
      noisyTerrain.rectangularPlaneParams.heightSegments = value;
      noisyTerrain.rebuildTerrain(); // Rebuild terrain with new mesh resolution
    });

  terrainFolder.add(terrainProps, 'basinDepth', 1, 20, 0.1).name('Basin Depth')
    .onChange((value: number) => {
      basins[0].depth = value;
      noisyTerrain.clearBasins();
      noisyTerrain.addBasin(basins[0]); // Update terrain with new basin depth
    });

  terrainFolder.open();

  // Register update callback for animations
  engine.sceneManager.getCurrentScene()?.registerUpdateCallback((delta: number) => {
    waterEntity.updateWaterAnimation(delta);
  });

  engine.start();
});
