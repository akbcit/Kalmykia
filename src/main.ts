import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { CameraType } from './types/camera/CameraProps';
import { KalmykiaBuilder } from './core/KalmykiaBuilder';
import { LightFactory } from './core/derivedClasses/components/light/LightFactory';
import { MaterialFactory } from './core/derivedClasses/entites/materials/MaterialFactory';
import { WaterEntity, WaterEntityParams } from './core/derivedClasses/entites/water/Water';
import { Terrain, GeometryType, BasinParams, TerrainParams, RectangularPlaneGeometryParams } from './core/derivedClasses/entites/terrains/Terrain';
import { fractalBrownianMotion, seededCircularWavesFunction } from './utils/noise/functions/noiseFunctions';
import { PartialGeometryParams } from './core/derivedClasses/entites/geometries/custom/PartialGeometry';
import { Entity } from './core/parentClasses/Entity';
import { MeshComponent } from './core/derivedClasses/components/MeshComponent';
import { GLTFEntity } from './core/derivedClasses/entites/gtlf/GTLFEntity';
import { getDefaultTreeParams, TreeParams, TrunkParams } from './core/derivedClasses/entites/trees/types/TreeParams';
import { TreeEntity } from './core/derivedClasses/entites/trees/TreeEntity';

// Initialize material factory and materials
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
    geometry: new THREE.CircleGeometry(40, 32),
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

  // Path to the Flower.glb model
  const duckModelPath = 'src/core/derivedClasses/entites/gtlf/models/duck/Duck.gltf';

  // Create a new GLTFEntity and position it in the scene
  const duckEntity = new GLTFEntity(duckModelPath, new THREE.Vector3(0, -0.1, 0), new THREE.Vector3(5, 5, 5));


  // Define basins for the terrain
  const basins: BasinParams[] = [
    {
      position: new THREE.Vector2(0, 0), // Basin position at center
      radius: 30, // Radius of the basin
      depth: 5,  // Depth of the basin (shallower to keep it close to zero)
      falloff: 'smooth',
    },
  ];

  // Create terrain parameters with geometry type and properties
  const terrainParams: TerrainParams = {
    geometryType: GeometryType.Rectangular, // Choose Rectangular geometry
    geometryParams: {
      width: 400,
      height: 400,
      widthSegments: 100,
      heightSegments: 100,
    },
    material: doubleSidedPlaneMaterial,
    noiseScale: 100,
    heightFactor: 10,
    baseHeight: 0, // Set base height of the terrain
    noiseFunction: softHillNoiseFunction,
    useNoise: true,
    basins,
  };

  // Create terrain using the new Terrain class
  const terrain = new Terrain(terrainParams);

  // Visualize the partial geometry for a region
  const partialParams: PartialGeometryParams = {
    center: new THREE.Vector2(0, 0), // Set center point for partial geometry
    radius: 45,
    edgeSmoothing: true,
    noiseIntensity: 0,
    smoothingRadius: 0,
  };

  // Create partial geometry based on defined parameters
  const partialGeometry = terrain.createPartialGeometry(partialParams);
  let partialGeomEntity = new Entity();

  // create a mesh
  if (partialGeometry) {
    const partialGeomMaterial = materialFactory.createWetMudMaterial();
    const mesh = new MeshComponent(partialGeometry, partialGeomMaterial);
    partialGeomEntity.addComponent(mesh);
  }

  // Get the lowest point of the first basin to position the water
  const lowestPoint = terrain.getBasinLowestPoint(0); // Get the lowest point of the first basin

  waterEntity.setPosition(0, 1, 0);

  // Provide only the specific values to override
  const mergedParams = getDefaultTreeParams({
    trunkParams: {
      trunkHeight: 30,            // Override trunk height
      trunkBaseRadius: 3          // Override trunk base radius
    },
    environmentalParams: {
      windStrength: 0.5           // Override wind strength
    }
  });

  const myTree = new TreeEntity(mergedParams);

  myTree.setPosition(50, 20, 2);

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
    .addLight(LightFactory.createLight({ type: 'directional', color: 0xffffff, position: new THREE.Vector3(100, 100, 10) }))
    .addAmbientLight(0.5)
    .addEntity(waterEntity)
    .addTerrain(terrain).addEntity(partialGeomEntity).addEntity(duckEntity).addEntity(myTree)
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
    noiseScale: terrain.getNoiseScale(),
    heightFactor: terrain.getHeightFactor(),
    baseHeight: terrain.getBaseHeight(),
    widthSegments: (terrain.getGeometryParams() as RectangularPlaneGeometryParams).widthSegments,
    heightSegments: (terrain.getGeometryParams() as RectangularPlaneGeometryParams).heightSegments,
    basinDepth: basins[0].depth,
  };

  // Add controls for terrain properties that affect hill formation
  terrainFolder.add(terrainProps, 'noiseScale', 1, 200, 1).name('Noise Scale')
    .onChange((value: number) => {
      terrain.setNoiseScale(value);
      terrain.rebuildTerrain(); // Rebuild terrain on change
    });

  terrainFolder.add(terrainProps, 'heightFactor', 1, 20, 0.1).name('Height Factor')
    .onChange((value: number) => {
      terrain.setHeightFactor(value);
      terrain.rebuildTerrain(); // Rebuild terrain on change
    });

  terrainFolder.add(terrainProps, 'baseHeight', -10, 10, 0.1).name('Base Height')
    .onChange((value: number) => {
      terrain.setBaseHeight(value);
      terrain.rebuildTerrain(); // Rebuild terrain on change
    });

  terrainFolder.add(terrainProps, 'widthSegments', 1, 200, 1).name('Width Segments')
    .onChange((value: number) => {
      const newParams = terrain.getGeometryParams() as RectangularPlaneGeometryParams;
      newParams.widthSegments = value;
      terrain.setGeometryParams(newParams);
      terrain.rebuildTerrain(); // Rebuild terrain with new mesh resolution
    });

  terrainFolder.add(terrainProps, 'heightSegments', 1, 200, 1).name('Height Segments')
    .onChange((value: number) => {
      const newParams = terrain.getGeometryParams() as RectangularPlaneGeometryParams;
      newParams.heightSegments = value;
      terrain.setGeometryParams(newParams);
      terrain.rebuildTerrain(); // Rebuild terrain with new mesh resolution
    });

  terrainFolder.add(terrainProps, 'basinDepth', 1, 20, 0.1).name('Basin Depth')
    .onChange((value: number) => {
      basins[0].depth = value;
      terrain.clearBasins();
      terrain.addBasin(basins[0]); // Update terrain with new basin depth
    });

  terrainFolder.open();

  console.log(duckEntity.getObject3D())

  // Register update callback for animations
  engine.sceneManager.getCurrentScene()?.registerUpdateCallback((delta: number) => {
    waterEntity.updateWaterAnimation(delta);
  });

  engine.start();
});
