import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { CameraType } from './types/camera/CameraProps';
import { KalmykiaBuilder } from './core/KalmykiaBuilder';
import { LightFactory } from './core/derivedClasses/components/light/LightFactory';
import { MaterialFactory } from './core/derivedClasses/entites/materials/MaterialFactory';
import { WaterEntity, WaterEntityParams } from './core/derivedClasses/entites/water/Water';
import { seededCircularWavesFunction } from './utils/noise/functions/noiseFunctions';
import { GLTFEntity } from './core/derivedClasses/entites/gtlf/GTLFEntity';
import { TreeEntity } from './core/derivedClasses/entites/trees/TreeEntity';
import { getDefaultTreeParams } from './core/derivedClasses/entites/trees/types/TreeParams';
import { IrregularCircularTerrain, IrregularCircularTerrainParams } from './core/derivedClasses/entites/terrains/IrregularCircularTerrain';
import { BasinParams, MaterialPatchParams } from './core/derivedClasses/entites/terrains/BaseTerrain';
import { BumpyPlane } from './core/derivedClasses/entites/geometries/custom/BumpyPlane';
import { Entity } from './core/parentClasses/Entity';
import { MeshComponent } from './core/derivedClasses/components/MeshComponent';

// Initialize material factory and materials
const materialFactory = new MaterialFactory();
const doubleSidedPlaneMaterial = materialFactory.createNonShinyMossMaterial();


window.addEventListener('DOMContentLoaded', () => {

  const container = document.getElementById('app') as HTMLElement;

  const bumpyPlane = new BumpyPlane(30, 30, 10, 10, 0.7);
  const bumpyMesh = new MeshComponent(bumpyPlane.getGeometry(), doubleSidedPlaneMaterial);
  const bumpyEntity = new Entity();
  bumpyEntity.addComponent(bumpyMesh);
  bumpyEntity.setPosition(0, 10, 0);

  // Create WaterEntity
  const waterParams: WaterEntityParams = {
    geometry: new THREE.CircleGeometry(12, 32),
    alpha: 0.21,
    hasDoubleSide: false,

  };

  const waterEntity = new WaterEntity(waterParams);

  // Load Duck Model
  const duckModelPath = 'src/core/derivedClasses/entites/gtlf/models/duck/Duck.gltf';
  const duckEntity = new GLTFEntity(duckModelPath, new THREE.Vector3(0, -0.1, 0), new THREE.Vector3(5, 5, 5));

  // Define basins
  const basins: BasinParams[] = [
    {
      position: new THREE.Vector2(0, 0),
      radius: 12,
      depth: 7,
      falloff: "linear",
    },
  ];

  // Create Terrain Parameters
  const circularTerrainParams: IrregularCircularTerrainParams = {
    terrainGeometry: {
      radius: 100,
      segments: 400,
      noiseFunction: seededCircularWavesFunction(1, 0.2),
      heightFactor: 7,
      position: [0, 0, 0],
    },
    terrainMaterial: doubleSidedPlaneMaterial,
    basins,
  };

  const circularTerrain = new IrregularCircularTerrain(circularTerrainParams);
  const patchMaterial = materialFactory.createWetMudMaterial()
  const height = circularTerrain.getHeightAt(0, 0); // Get height at the center
  console.log(height);
  // Define material patches
  const materialPatches: MaterialPatchParams[] = [
    { center: new THREE.Vector2(0, 0), radius: 16, material: patchMaterial },
  ];

  // Add patches to the terrain
  materialPatches.forEach((patch) => {
    const partialGeometry = circularTerrain.getPartialGeometry({
      center: [patch.center.x, patch.center.y],
      radius: patch.radius,
    });

    const patchMesh = new THREE.Mesh(partialGeometry, patch.material);
    patchMesh.position.y += 0.01; // Slight offset to prevent Z-fighting
    circularTerrain.meshComponent.getMesh().add(patchMesh); // Add patch to the terrain mesh
  });


  waterEntity.setPosition(0, -1, 0);

  // Create Tree
  const treeParams = getDefaultTreeParams({
    trunkParams: { trunkHeight: 20, trunkBaseRadius: 1.2, trunkTopRadius: 0.6 },
    environmentalParams: { windStrength: 0.5 },
  });
  const myTree = new TreeEntity(treeParams);
  myTree.setPosition(30, -1, 0);

  // Initialize Kalmykia Engine
  const engine = new KalmykiaBuilder(container)
    .setCamera({
      cameraType: CameraType.Perspective,
      position: new THREE.Vector3(60, 30, 5),
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
    .addTerrain(circularTerrain).addEntity(waterEntity).addEntity(myTree)
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
