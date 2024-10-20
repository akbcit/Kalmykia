import * as THREE from "three";
import { MaterialFactory } from "../../materials/MaterialFactory";

export interface BaseMaterialParams {
  color?: THREE.Color | string;         // Color of the material
  roughness?: number;                   // Roughness factor for PBR materials
  metalness?: number;                   // Metalness factor for PBR materials
  transparency?: number;                // Transparency factor for materials
  shininess?: number;                   // Shininess factor for materials
}

// === Trunk Material Parameters ===
/**
 * Defines material properties specific to the trunk of the tree.
 */
export interface TrunkMaterialParams extends BaseMaterialParams {
  barkTexturePath?: string;             // Path to the bark texture map
  barkDisplacementScale?: number;       // Displacement scale for bark textures
  barkNormalMapPath?: string;           // Path to a normal map for bark
  barkRoughnessMapPath?: string;        // Path to a roughness map for bark
  barkKnotFrequency?: number;           // Frequency of bark knots
  barkKnotSize?: number;                // Size of bark knots
}

// === Branch Material Parameters ===
/**
 * Defines material properties specific to the branches of the tree.
 */
export interface BranchMaterialParams extends BaseMaterialParams {
  branchTexturePath?: string;           // Path to the branch texture map
  branchDisplacementScale?: number;     // Scale of displacement for branch textures
  windInfluence?: number;               // Degree of influence by wind on branches
}

// === Leaf Material Parameters ===
/**
 * Defines material properties specific to the leaves of the tree.
 */
export interface LeafMaterialParams extends BaseMaterialParams {
  leafTexturePath?: string;             // Path to the leaf texture map
  windInfluence?: number;               // Degree of wind influence on leaf movement
  leafSubsurfaceScattering?: boolean;   // Enable subsurface scattering for realistic leaf lighting
  translucency?: number;                // Degree of translucency for leaves
}

// === Trunk Configuration ===
/**
 * Interface for trunk-specific parameters.
 * Controls the appearance, geometry, and texture of the tree trunk.
 */
export interface TrunkParams {
  trunkShape?: "cylinder" | "cone" | "custom";  // Shape of the trunk
  trunkHeight: number;  // Height of the trunk (in units)
  trunkBaseRadius: number;  // Radius of the trunk at the base
  trunkTopRadius: number;  // Radius of the trunk at the top
  trunkSegments: number;  // Number of segments (affects smoothness)

  trunkTapering?: number;  // Degree of tapering (optional)
  rootFlareWidth?: number;  // Width of root flares (optional)

  // NEW: Directly pass a material for the trunk
  trunkMaterial: THREE.Material;
}

// === Branch Configuration ===
/**
 * Interface for branch-specific parameters.
 * Manages branching levels, geometry, distribution patterns, and material properties.
 */
export interface BranchParams {
  branchLevels: number;                  // Number of recursive branching levels
  branchLengthFactor: number;            // Length factor for branches relative to parent branch/trunk
  branchBaseRadius: number;              // Base radius of each branch
  branchTopRadius: number;               // Top radius of each branch
  branchSpreadAngle: number;             // Maximum spread angle of branches (in radians)
  branchCurveFactor: number;             // Factor controlling curvature of branches (0 = straight, 1 = full curve)
  branchDistribution: "uniform" | "random" | "spiral"; // Distribution pattern for branches
  branchMaterialProperties?: BranchMaterialParams;     // Optional material properties for branches

  branchRandomnessFactor?: number;       // Randomness in branch lengths and angles
  branchTorsionFactor?: number;          // Twisting or torsion along the branch axis
  branchGravityInfluence?: number;       // Degree of branch drooping due to gravity
  branchGrowthDirection?: THREE.Vector3; // Preferred growth direction for branches (e.g., simulate phototropism)
}

// === Leaf Configuration ===
/**
 * Interface for leaf-specific parameters.
 * Defines leaf shape, density, material properties, and growth patterns.
 */
export interface LeafParams {
  leafShape: "oval" | "round" | "spiky"; // Shape of individual leaves
  leafDensity: number;                   // Number of leaves per branch
  leafSize: number;                      // Average size of individual leaves
  leafColor?: THREE.Color | string;      // Color of the leaves (if no texture is used)
  leafTexturePath?: string;              // Optional path to the leaf texture map
  leafRandomness?: number;               // Randomness in leaf positioning and size
  leafMaterialProperties?: LeafMaterialParams; // Optional material properties for leaves

  leafBendFactor?: number;               // Degree of leaf bending (used to simulate natural curvature)
  leafOrientation?: "random" | "upward" | "downward"; // Orientation of leaves on branches
  leafGrowthDirection?: THREE.Vector3;   // Preferred growth direction for leaves (e.g., towards sunlight)
  leafAttachmentStyle?: "spiral" | "opposite" | "alternate"; // Style of leaf attachment on branches
}

// === Overall Tree Structure Configuration ===
/**
 * Interface for overall tree structure parameters.
 * Controls the tree's shape, dimensions, and root spread.
 */
export interface TreeStructureParams {
  treeShape: "conical" | "spherical" | "cylindrical" | "asymmetrical"; // General shape of the tree
  treeHeight: number;                   // Total height of the tree
  treeWidth: number;                    // Maximum width of the tree
  treeRootSpread: number;               // Spread of the tree's roots (visual effect)

  crownShape?: "round" | "elliptical" | "irregular";  // Shape of the tree crown (upper foliage)
  crownDensity?: number;                // Density of the foliage in the crown
  crownHeight?: number;                 // Height of the crown relative to the overall tree height
  rootDepth?: number;                   // Depth of roots (used for visualization or physics)
}

// === Environmental Factors Configuration ===
/**
 * Interface for environmental parameters that affect tree appearance and behavior.
 * Manages environmental interactions like wind, age, and seasonal changes.
 */
export interface EnvironmentalParams {
  treeAge: number;                      // Age of the tree (can influence size, shape, and branch density)
  seasonalVariation?: boolean;          // Flag to enable or disable seasonal changes in foliage
  swayFactor?: number;                  // Degree of swaying due to wind (0 = no sway, 1 = full sway)
  windDirection?: THREE.Vector3;        // Optional vector for wind direction (affects branch and leaf sway)
  windStrength?: number;                // Strength of wind affecting the tree (0 = no wind)

  sunExposureFactor?: number;           // Factor influencing growth direction towards sunlight
  soilType?: "sandy" | "clay" | "loamy"; // Type of soil (can affect root spread and stability)
  humidityFactor?: number;              // Humidity stress factor affecting leaf size and density
}

// === Position, Rotation, and Scale Configuration ===
/**
 * Interface for basic transformation parameters.
 * Handles position, rotation, and scaling of the tree.
 */
export interface TransformParams {
  position?: THREE.Vector3;             // Position of the tree in the scene
  rotation?: THREE.Euler;               // Rotation of the tree in the scene
  scale?: THREE.Vector3;                // Scale of the tree in the scene
}

// === Animation Properties Configuration ===
/**
 * Interface for animation-specific parameters.
 * Manages growth speed, wind animations, and seasonal transitions.
 */
export interface AnimationParams {
  growthSpeed?: number;                 // Speed of growth animations (if animated)
  windAnimationSpeed?: number;          // Speed of wind animations affecting branches and leaves

  branchSwingAmplitude?: number;        // Amplitude of branch swinging due to wind
  leafFlutterFactor?: number;           // Degree to which individual leaves flutter in the wind
  seasonalTransitionSpeed?: number;     // Speed of transitioning between seasons (e.g., leaf color change)
}

// === Master TreeParams Interface ===
/**
 * Combines all the individual interfaces into a single `TreeParams` interface.
 * Provides a comprehensive set of parameters for controlling every aspect of tree generation.
 */
export interface TreeParams {
  trunkParams: TrunkParams;
  branchParams: BranchParams;
  leafParams: LeafParams;
  structureParams: TreeStructureParams;
  environmentalParams: EnvironmentalParams;
  transformParams: TransformParams;
  animationParams: AnimationParams;
  trunkMaterialParams?: TrunkMaterialParams;   // Optional trunk material properties
  branchMaterialParams?: BranchMaterialParams; // Optional branch material properties
  leafMaterialParams?: LeafMaterialParams;     // Optional leaf material properties
}


// Define Partial versions for each nested parameter type
type PartialTrunkParams = Partial<TrunkParams>;
type PartialBranchParams = Partial<BranchParams>;
type PartialLeafParams = Partial<LeafParams>;
type PartialTreeStructureParams = Partial<TreeStructureParams>;
type PartialEnvironmentalParams = Partial<EnvironmentalParams>;
type PartialTransformParams = Partial<TransformParams>;
type PartialAnimationParams = Partial<AnimationParams>;
type PartialTrunkMaterialParams = Partial<TrunkMaterialParams>;
type PartialBranchMaterialParams = Partial<BranchMaterialParams>;
type PartialLeafMaterialParams = Partial<LeafMaterialParams>;

// Define PartialTreeParams to allow partial objects for each nested parameter
type PartialTreeParams = {
  trunkParams?: PartialTrunkParams;
  branchParams?: PartialBranchParams;
  leafParams?: PartialLeafParams;
  structureParams?: PartialTreeStructureParams;
  environmentalParams?: PartialEnvironmentalParams;
  transformParams?: PartialTransformParams;
  animationParams?: PartialAnimationParams;
  trunkMaterialParams?: PartialTrunkMaterialParams;
  branchMaterialParams?: PartialBranchMaterialParams;
  leafMaterialParams?: PartialLeafMaterialParams;
};

/**
 * Deep merge function to merge custom partial parameters with defaults.
 */
function deepMerge<T>(target: T, source: Partial<T>): T {
  if (!target || typeof target !== "object" || typeof source !== "object") return target;

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      // Ensure the target object has the property as an object before merging
      if (!(key in target) || typeof (target as any)[key] !== "object") {
        (target as any)[key] = {};
      }
      // Recursively merge nested objects
      (target as any)[key] = deepMerge((target as any)[key], source[key] as any);
    } else {
      (target as any)[key] = source[key] as T[keyof T];
    }
  }
  return target;
}

/**
 * Helper function to merge specific nested params with their defaults.
 * Handles merging deeply and ensures that nested objects are fully populated.
 */
function mergeNestedParams<T>(defaultParams: T, customParams?: Partial<T>): T {
  return customParams ? deepMerge(defaultParams, customParams) : defaultParams;
}

/**
 * Returns the default tree parameters.
 * Allows partial overrides for each nested parameter.
 */
const materialFactory = new MaterialFactory();
export function getDefaultTreeParams(overrides?: PartialTreeParams): TreeParams {
  // Default values for TreeParams
  const defaultParams: TreeParams = {
    trunkParams: {
      trunkShape: "cylinder",
      trunkHeight: 15,
      trunkBaseRadius: 2,
      trunkTopRadius: 1.5,
      trunkSegments: 16,
      trunkTapering: 0.2,
      trunkMaterial:materialFactory.createDebugMaterial(),
      rootFlareWidth: undefined,
    },
    branchParams: {
      branchLevels: 1,
      branchLengthFactor: 0.5,
      branchBaseRadius: 0.5,
      branchTopRadius: 0.2,
      branchSpreadAngle: Math.PI / 6,
      branchCurveFactor: 0,
      branchDistribution: "uniform",
      branchMaterialProperties: undefined,
      branchRandomnessFactor: undefined,
      branchTorsionFactor: undefined,
      branchGravityInfluence: undefined,
      branchGrowthDirection: new THREE.Vector3(0, 1, 0),
    },
    leafParams: {
      leafShape: "oval",
      leafDensity: 50,
      leafSize: 0.1,
      leafColor: new THREE.Color(0x228B22),
      leafTexturePath: undefined,
      leafRandomness: 0,
      leafMaterialProperties: undefined,
      leafBendFactor: 0,
      leafOrientation: "upward",
      leafGrowthDirection: new THREE.Vector3(0, 1, 0),
      leafAttachmentStyle: "spiral",
    },
    structureParams: {
      treeShape: "cylindrical",
      treeHeight: 20,
      treeWidth: 10,
      treeRootSpread: 5,
      crownShape: "round",
      crownDensity: 0.8,
      crownHeight: 10,
      rootDepth: undefined,
    },
    environmentalParams: {
      treeAge: 30,
      seasonalVariation: false,
      swayFactor: 0,
      windDirection: new THREE.Vector3(0, 0, 0),
      windStrength: 0,
      sunExposureFactor: undefined,
      soilType: undefined,
      humidityFactor: undefined,
    },
    transformParams: {
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1),
    },
    animationParams: {
      growthSpeed: 1,
      windAnimationSpeed: 0,
      branchSwingAmplitude: undefined,
      leafFlutterFactor: undefined,
      seasonalTransitionSpeed: undefined,
    },
    trunkMaterialParams: {
      color: new THREE.Color(0x8B4513),
      roughness: 0.7,
      metalness: 0,
      barkTexturePath: undefined,
      barkDisplacementScale: undefined,
      barkNormalMapPath: undefined,
      barkRoughnessMapPath: undefined,
      barkKnotFrequency: undefined,
      barkKnotSize: undefined,
    },
    branchMaterialParams: {
      color: new THREE.Color(0x8B4513),
      roughness: 0.7,
      metalness: 0,
      branchTexturePath: undefined,
      branchDisplacementScale: undefined,
      windInfluence: 0,
    },
    leafMaterialParams: {
      color: new THREE.Color(0x228B22),
      roughness: 0.5,
      metalness: 0,
      leafTexturePath: undefined,
      windInfluence: 0.3,
      leafSubsurfaceScattering: true,
      translucency: 0.5,
    },
  };

  // Use deepMerge to merge custom overrides into the default parameters
  return {
    ...defaultParams,
    trunkParams: mergeNestedParams(defaultParams.trunkParams, overrides?.trunkParams),
    branchParams: mergeNestedParams(defaultParams.branchParams, overrides?.branchParams),
    leafParams: mergeNestedParams(defaultParams.leafParams, overrides?.leafParams),
    structureParams: mergeNestedParams(defaultParams.structureParams, overrides?.structureParams),
    environmentalParams: mergeNestedParams(defaultParams.environmentalParams, overrides?.environmentalParams),
    transformParams: mergeNestedParams(defaultParams.transformParams, overrides?.transformParams),
    animationParams: mergeNestedParams(defaultParams.animationParams, overrides?.animationParams),
    trunkMaterialParams: mergeNestedParams(defaultParams.trunkMaterialParams, overrides?.trunkMaterialParams),
    branchMaterialParams: mergeNestedParams(defaultParams.branchMaterialParams, overrides?.branchMaterialParams), // Corrected to merge with `branchMaterialParams`
    leafMaterialParams: mergeNestedParams(defaultParams.leafMaterialParams, overrides?.leafMaterialParams),
  };
}