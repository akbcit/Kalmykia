import * as THREE from "three";
import {
    BaseMaterialOptions, MeshBasicMaterialOptions, MeshLambertMaterialOptions, MeshPhongMaterialOptions,
    MeshStandardMaterialOptions, MeshPhysicalMaterialOptions, MeshToonMaterialOptions,
    MeshNormalMaterialOptions, MeshMatcapMaterialOptions, MeshDepthMaterialOptions,
    MeshDistanceMaterialOptions, SpriteMaterialOptions, PointsMaterialOptions,
    ShaderMaterialOptions, RawShaderMaterialOptions
} from "./types/MaterialOptions";
import { Water } from 'three/examples/jsm/objects/Water';

export class MaterialFactory {
    private materialOptions: BaseMaterialOptions;
    private textureLoader: THREE.TextureLoader;

    constructor(options: BaseMaterialOptions = {}) {
        this.materialOptions = options;
        this.textureLoader = new THREE.TextureLoader();
    }

    // Helper function to load texture if texture path is provided
    public loadTexture(path?: string): THREE.Texture | null {
        return path ? this.textureLoader.load(path) : null;
    }

    // Helper function to merge texture-related properties if they exist
    private applyTextures(options: any, texturePath?: string): any {
        const texture = this.loadTexture(texturePath);
        return texture ? { ...options, map: texture } : options;
    }

    // Only add map (diffuse texture) if it's relevant to the material type
    public createStandardMaterial(options: MeshStandardMaterialOptions = {}, texturePath?: string): THREE.MeshStandardMaterial {
        const mergedOptions = this.applyTextures({ ...this.materialOptions, ...options }, texturePath);
        return new THREE.MeshStandardMaterial(mergedOptions);
    }

    public createBasicMaterial(options: MeshBasicMaterialOptions = {}, texturePath?: string): THREE.MeshBasicMaterial {
        const mergedOptions = this.applyTextures({ ...this.materialOptions, ...options }, texturePath);
        return new THREE.MeshBasicMaterial(mergedOptions);
    }

    public createPhongMaterial(options: MeshPhongMaterialOptions = {}, texturePath?: string): THREE.MeshPhongMaterial {
        const mergedOptions = this.applyTextures({ ...this.materialOptions, ...options }, texturePath);
        return new THREE.MeshPhongMaterial(mergedOptions);
    }

    public createLambertMaterial(options: MeshLambertMaterialOptions = {}, texturePath?: string): THREE.MeshLambertMaterial {
        const mergedOptions = this.applyTextures({ ...this.materialOptions, ...options }, texturePath);
        return new THREE.MeshLambertMaterial(mergedOptions);
    }

    public createPhysicalMaterial(options: MeshPhysicalMaterialOptions = {}, texturePath?: string): THREE.MeshPhysicalMaterial {
        const mergedOptions = this.applyTextures({ ...this.materialOptions, ...options }, texturePath);
        return new THREE.MeshPhysicalMaterial(mergedOptions);
    }

    public createToonMaterial(options: MeshToonMaterialOptions = {}, texturePath?: string): THREE.MeshToonMaterial {
        const mergedOptions = this.applyTextures({ ...this.materialOptions, ...options }, texturePath);
        return new THREE.MeshToonMaterial(mergedOptions);
    }

    public createNormalMaterial(options: MeshNormalMaterialOptions = {}): THREE.MeshNormalMaterial {
        // No texture support for this material
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.MeshNormalMaterial(mergedOptions);
    }

    public createMatcapMaterial(options: MeshMatcapMaterialOptions = {}, texturePath?: string): THREE.MeshMatcapMaterial {
        const mergedOptions = this.applyTextures({ ...this.materialOptions, ...options }, texturePath);
        return new THREE.MeshMatcapMaterial(mergedOptions);
    }

    public createDepthMaterial(options: MeshDepthMaterialOptions = {}, texturePath?: string): THREE.MeshDepthMaterial {
        const mergedOptions = this.applyTextures({ ...this.materialOptions, ...options }, texturePath);
        return new THREE.MeshDepthMaterial(mergedOptions);
    }

    public createDistanceMaterial(options: MeshDistanceMaterialOptions = {}): THREE.MeshDistanceMaterial {
        // No texture support for this material
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.MeshDistanceMaterial(mergedOptions);
    }

    public createSpriteMaterial(options: SpriteMaterialOptions = {}, texturePath?: string): THREE.SpriteMaterial {
        const mergedOptions = this.applyTextures({ ...this.materialOptions, ...options }, texturePath);
        return new THREE.SpriteMaterial(mergedOptions);
    }

    public createShaderMaterial(options: ShaderMaterialOptions = {}): THREE.ShaderMaterial {
        // Custom shader materials often have their own uniforms for textures
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.ShaderMaterial(mergedOptions);
    }

    public createRawShaderMaterial(options: RawShaderMaterialOptions = {}): THREE.RawShaderMaterial {
        // Raw shader materials also use custom uniforms
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.RawShaderMaterial(mergedOptions);
    }

    public createPointsMaterial(options: PointsMaterialOptions = {}, texturePath?: string): THREE.PointsMaterial {
        const mergedOptions = this.applyTextures({ ...this.materialOptions, ...options }, texturePath);
        return new THREE.PointsMaterial(mergedOptions);
    }


    public createWaterMaterial(options: {
        textureWidth?: number;
        textureHeight?: number;
        waterNormalsPath?: string;
        sunDirection?: THREE.Vector3;
        sunColor?: number | string;
        waterColor?: number | string;
        distortionScale?: number;
        doubleSide?: boolean; // New parameter to control rendering on both sides
    } = {}): THREE.ShaderMaterial {
        // Set default parameters for the material
        const defaults = {
            textureWidth: 512,
            textureHeight: 512,
            waterNormalsPath: 'src/assets/normals/seaWaves.jpg',
            sunDirection: new THREE.Vector3(0, 1, 0),
            sunColor: 0xffffff,
            waterColor: 0x3399ff, // Light blue color for water
            distortionScale: 3.7,
            doubleSide: true, // Default to rendering on both sides
        };

        // Merge user options with default values
        const params = { ...defaults, ...options };

        // Load waterNormals texture if a path is provided
        let waterNormals: THREE.Texture | undefined = undefined;
        if (params.waterNormalsPath) {
            waterNormals = this.textureLoader.load(
                params.waterNormalsPath,
                () => console.log('Water normals texture loaded successfully.'),
                undefined,
                (error) => {
                    console.error(`Failed to load water normals texture: ${error}`);
                }
            );
            if (waterNormals) {
                waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
            }
        }

        // Create the water material using THREE.Water
        let water: Water;
        try {
            water = new Water(new THREE.PlaneGeometry(1000, 1000), {
                textureWidth: params.textureWidth,
                textureHeight: params.textureHeight,
                waterNormals: waterNormals,
                sunDirection: params.sunDirection,
                sunColor: params.sunColor,
                waterColor: params.waterColor, // Use the blue water color here
                distortionScale: params.distortionScale,
                fog: false,
            });

            // Ensure the water has a visible blue color
            (water.material as any).uniforms['waterColor'].value.set(0x3399ff);

            // Set the side property based on the `doubleSide` parameter
            water.material.side = params.doubleSide ? THREE.DoubleSide : THREE.FrontSide;

            console.log('Water material created successfully with the following properties:', water.material);
        } catch (error) {
            console.error('Error creating water material:', error);
            throw new Error(`Water material creation failed: ${error}`);
        }

        return water.material as THREE.ShaderMaterial;
    }

    public createDebugMaterial(): THREE.MeshBasicMaterial {
        // Simple red-colored material to check visibility
        return new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    }

    public createBasicWaterMaterial(): THREE.MeshStandardMaterial {
        return new THREE.MeshStandardMaterial({
            color: 0x3399ff, // Light blue color
            metalness: 0.1,
            roughness: 0.1,
            opacity: 0.7, // Adjust opacity
            transparent: true, // Allow transparency for water-like effect
            side: THREE.DoubleSide, // Render both sides of the geometry
        });
    }

    public createGrassyTerrainMaterial(): THREE.MeshStandardMaterial {
        // Load each texture map with their respective paths
        const colorTexture = this.loadTexture('src/assets/textures/grass/Grass001_1K-JPG_Color.jpg');
        const ambientOcclusionTexture = this.loadTexture('src/assets/textures/grass/Grass001_1K-JPG_AmbientOcclusion.jpg');
        const displacementTexture = this.loadTexture('src/assets/textures/grass/Grass001_1K-JPG_Displacement.jpg');
        const normalTexture = this.loadTexture('src/assets/textures/grass/Grass001_1K-JPG_NormalGL.jpg'); // Use NormalGL for Three.js
        const roughnessTexture = this.loadTexture('src/assets/textures/grass/Grass001_1K-JPG_Roughness.jpg');

        // Ensure textures are set to repeat and wrap correctly for large terrains
        [colorTexture, ambientOcclusionTexture, displacementTexture, normalTexture, roughnessTexture].forEach((texture) => {
            if (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(10, 10); // Repeat the texture for large terrains
            }
        });

        // Create and return the material with all texture maps applied
        return new THREE.MeshStandardMaterial({
            map: colorTexture,                          // Base color map
            aoMap: ambientOcclusionTexture,             // Ambient Occlusion map
            displacementMap: displacementTexture,       // Displacement map for surface detail
            displacementScale: 0.2,                     // Scale of displacement, adjust as needed
            normalMap: normalTexture,                   // Normal map for surface details
            roughnessMap: roughnessTexture,             // Roughness map for material roughness
            roughness: 1,                             // Base roughness value
            metalness: 0,                             // Low metalness for non-metallic surface
            side: THREE.DoubleSide,                     // Render on both sides
        });
    }
    // Create a muddy terrain material
    public createMuddyTerrainMaterial(): THREE.MeshStandardMaterial {
        const mudTexturePath = 'src/assets/textures/___.jpg'; // Path to mud texture
        const texture = this.loadTexture(mudTexturePath);

        // Set texture wrapping and repetition
        if (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10); // Repeat the texture for large terrains
        }

        return new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.9,
            metalness: 0.1,
            side: THREE.DoubleSide,
        });
    }


    public createMossyTerrainMaterial(): THREE.MeshStandardMaterial {
        // Load each texture map with their respective paths
        const colorTexture = this.loadTexture('src/assets/textures/moss/Moss002_1K-JPG_Color.jpg');
        const ambientOcclusionTexture = this.loadTexture('src/assets/textures/moss/Moss002_1K-JPG_AmbientOcclusion.jpg');
        const displacementTexture = this.loadTexture('src/assets/textures/moss/Moss002_1K-JPG_Displacement.jpg');
        const normalTexture = this.loadTexture('src/assets/textures/moss/Moss002_1K-JPG_NormalGL.jpg'); // Use NormalGL for Three.js
        const roughnessTexture = this.loadTexture('src/assets/textures/moss/Moss002_1K-JPG_Roughness.jpg');

        // Ensure textures are set to repeat and wrap correctly for large terrains
        [colorTexture, ambientOcclusionTexture, displacementTexture, normalTexture, roughnessTexture].forEach((texture) => {
            if (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(10, 10); // Repeat the texture for large terrains
            }
        });

        // Create and return the material with all texture maps applied
        return new THREE.MeshStandardMaterial({
            map: colorTexture,                          // Base color map
            aoMap: ambientOcclusionTexture,             // Ambient Occlusion map
            displacementMap: displacementTexture,       // Displacement map for surface detail
            displacementScale: 0.1,                     // Scale of displacement, adjust as needed
            normalMap: normalTexture,                   // Normal map for surface details
            roughnessMap: roughnessTexture,             // Roughness map for material roughness
            roughness: 1,                               // Base roughness value (no shininess)
            metalness: 0,                               // No metalness for a natural, non-metallic surface
            side: THREE.DoubleSide,                     // Render on both sides
        });
    }

    public createNonShinyMossMaterial(): THREE.MeshLambertMaterial {
        const colorTexture = this.loadTexture('src/assets/textures/moss/Moss002_1K-JPG_Color.jpg');
        if (colorTexture) {
            colorTexture.wrapS = colorTexture.wrapT = THREE.RepeatWrapping;
            colorTexture.repeat.set(10, 10); // Repeat the texture for large terrains
        }

        return new THREE.MeshLambertMaterial({
            map: colorTexture,      // Base color map
            side: THREE.DoubleSide, // Render on both sides
        });
    }

    public createWetMudMaterial(): THREE.MeshStandardMaterial {
        // Load each texture map with their respective paths
        const colorTexture = this.loadTexture('src/assets/textures/mud/ground_0005_basecolor_1k.jpg');
        const ambientOcclusionTexture = this.loadTexture('src/assets/textures/mud/ground_0005_ambient_occlusion_1k.jpg');
        const displacementTexture = this.loadTexture('src/assets/textures/mud/ground_0005_height_1k.png');
        const normalTexture = this.loadTexture('src/assets/textures/mud/ground_0005_normal_1k.png'); // Normal texture
        const roughnessTexture = this.loadTexture('src/assets/textures/mud/ground_0005_roughness_1k.jpg');
    
        // Ensure textures are set to repeat and wrap correctly for large terrains
        [colorTexture, ambientOcclusionTexture, displacementTexture, normalTexture, roughnessTexture].forEach((texture) => {
            if (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(10, 10); // Repeat the texture for large terrains
            }
        });
    
        // Create and return the material with all texture maps applied
        return new THREE.MeshStandardMaterial({
            map: colorTexture,                          // Base color map
            aoMap: ambientOcclusionTexture,             // Ambient Occlusion map
            displacementMap: displacementTexture,       // Displacement map for surface detail
            displacementScale: 0.15,                    // Scale of displacement, adjust as needed
            normalMap: normalTexture,                   // Normal map for surface details
            roughnessMap: roughnessTexture,             // Roughness map for material roughness
            roughness: 0.6,                             // Slightly lower roughness for wet appearance
            metalness: 0,                             // Slight metalness for a shiny wet look
            side: THREE.DoubleSide,                     // Render on both sides
        });
    }

}
