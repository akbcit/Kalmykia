import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { CameraType } from './types/camera/CameraProps';
import { KalmykiaBuilder } from './core/KalmykiaBuilder';
import { LightFactory } from './core/derivedClasses/components/light/LightFactory';
import { MaterialFactory } from './core/derivedClasses/entites/materials/MaterialFactory';
import { WaterEntity, WaterEntityParams } from './core/derivedClasses/entites/water/Water';
import { fractalBrownianMotion, seededCircularWavesFunction } from './utils/noise/functions/noiseFunctions';
import { GLTFEntity } from './core/derivedClasses/entites/gtlf/GTLFEntity';
import { TreeEntity } from './core/derivedClasses/entites/trees/TreeEntity';
import { getDefaultTreeParams } from './core/derivedClasses/entites/trees/types/TreeParams';
import { IrregularCircularTerrain, IrregularCircularTerrainParams } from './core/derivedClasses/entites/terrains/IrregularCircularTerrain';
import { BasinParams } from './core/derivedClasses/entites/terrains/BaseTerrain';

// Initialize material factory and materials
const materialFactory = new MaterialFactory();
const doubleSidedPlaneMaterial = materialFactory.createNonShinyMossMaterial();

// Create noise functions for terrain
const baseNoise = seededCircularWavesFunction(0.05); // Base noise function
const softHillNoiseFunction = fractalBrownianMotion(baseNoise, 5, 0.5, 2.0, 1.0); // Smooth hills

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app') as HTMLElement;

  // Create WaterEntity
  const waterParams: WaterEntityParams = {
    geometry: new THREE.CircleGeometry(40, 32),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 4,
    size: 2.0,
    alpha: 0.85,
    castShadow: true,
    receiveShadow: true,
    hasDoubleSide: true,
    sunDirection: new THREE.Vector3(1, 1, 1),
  };
  const waterEntity = new WaterEntity(waterParams);

  // Load Duck Model
  const duckModelPath = 'src/core/derivedClasses/entites/gtlf/models/duck/Duck.gltf';
  const duckEntity = new GLTFEntity(duckModelPath, new THREE.Vector3(0, -0.1, 0), new THREE.Vector3(5, 5, 5));

  // Define basins
  const basins: BasinParams[] = [
    {
      position: new THREE.Vector2(0, 0),
      radius: 10,
      depth: 5,
      falloff: 'smooth',
    },
  ];

  // Create Terrain Parameters
  const circularTerrainParams: IrregularCircularTerrainParams = {
    terrainGeometry: {
      radius: 100,
      segments: 100,
      noiseFunction: softHillNoiseFunction,
      heightFactor: 10,
      position: [0, 0, 0],
    },
    terrainMaterial: doubleSidedPlaneMaterial,
    basins,
  };

  const circularTerrain = new IrregularCircularTerrain(circularTerrainParams);
  waterEntity.setPosition(0, 1, 0);

  // Create Tree
  const treeParams = getDefaultTreeParams({
    trunkParams: { trunkHeight: 30, trunkBaseRadius: 3 },
    environmentalParams: { windStrength: 0.5 },
  });
  const myTree = new TreeEntity(treeParams);
  myTree.setPosition(50, 20, 2);

  // Initialize Kalmykia Engine
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
        maxPolarAngle: Math.PI / 4,
        minDistance: 5,
        maxDistance: 1000,
        restrictPanToXZPlane: true,
      },
    })
    .addScene('main', '#0D1B2A')
    .addResizeListener()
    .addPanKeyListener()
    .addRenderSystem()
    .addLight(
      LightFactory.createLight({
        type: 'directional',
        color: 0xffffff,
        position: new THREE.Vector3(100, 100, 10),
      })
    )
    .addAmbientLight(0.5)
    .addTerrain(circularTerrain)
    .build();

  // Setup GUI
  const gui = new GUI();

  const terrainProps = {
    basinRadius: basins[0].radius,
    basinDepth: basins[0].depth,
    noiseRadius: circularTerrainParams.terrainGeometry.radius, // Radius of the terrain
    noiseHeightFactor: circularTerrainParams.terrainGeometry.heightFactor, // Noise height factor
    baseHeight: 0, // Initial base height
  };

  const terrainFolder = gui.addFolder('Terrain Properties');

  // Control for updating the terrain radius
  terrainFolder.add(terrainProps, 'noiseRadius', 50, 200, 1).onChange((value) => {
    circularTerrain.updateRadius(value); // Update radius dynamically
  });

  // Control for updating the noise height factor
  terrainFolder.add(terrainProps, 'noiseHeightFactor', 1, 20, 0.1).onChange((value) => {
    circularTerrain.updateHeightFactor(value); // Update height factor dynamically
  });


  const basinFolder = gui.addFolder('Basin Properties');
  basinFolder.add(terrainProps, 'basinRadius', 1, 50, 1).onChange((value) => {
    circularTerrain.updateBasin(0, { radius: value }); // Update only the radius
  });

  basinFolder.add(terrainProps, 'basinDepth', 1, 20, 0.1).onChange((value) => {
    circularTerrain.updateBasin(0, { depth: value }); // Update only the depth
  });

  terrainFolder.open();
  basinFolder.open();

  // Animation Update Callback
  engine.sceneManager.getCurrentScene()?.registerUpdateCallback(delta => {
    waterEntity.updateWaterAnimation(delta);
  });

  engine.start();
});
