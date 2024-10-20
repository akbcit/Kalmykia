import * as THREE from "three";
import {
    BaseMaterialOptions, MeshBasicMaterialOptions, MeshLambertMaterialOptions, MeshPhongMaterialOptions,
    MeshStandardMaterialOptions, MeshPhysicalMaterialOptions, MeshToonMaterialOptions,
    MeshNormalMaterialOptions, MeshMatcapMaterialOptions, MeshDepthMaterialOptions,
    MeshDistanceMaterialOptions, SpriteMaterialOptions, PointsMaterialOptions,
    ShaderMaterialOptions, RawShaderMaterialOptions
} from "./types/MaterialOptions";
import { Water } from 'three/examples/jsm/objects/Water';
import { BranchMaterialParams, LeafMaterialParams, TrunkMaterialParams } from "../trees/types/TreeParams";

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

    public createMossyRockMaterial(): THREE.MeshStandardMaterial {
        const colorTexture = this.loadTexture('src/assets/textures/mossyRock/Rock057_1K-JPG_Color.jpg');
        const normalTexture = this.loadTexture('src/assets/textures/mossyRock/Rock057_1K-JPG_NormalGL.jpg');
        const roughnessTexture = this.loadTexture('src/assets/textures/mossyRock/Rock057_1K-JPG_Roughness.jpg');
        const aoTexture = this.loadTexture('src/assets/textures/mossyRock/Rock057_1K-JPG_AmbientOcclusion.jpg');
        const displacementTexture = this.loadTexture('src/assets/textures/mossyRock/Rock057_1K-JPG_Displacement.jpg');

        // Ensure textures are set to repeat and wrapped properly
        [colorTexture, normalTexture, roughnessTexture, aoTexture, displacementTexture].forEach((texture) => {
            if (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(5, 5); // Adjust repetition
                texture.generateMipmaps = true;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
            }
        });

        // Create and return the material with the textures applied
        const material = new THREE.MeshStandardMaterial({
            map: colorTexture,
            normalMap: normalTexture,
            displacementScale: 0.02, // Subtle displacement
            roughness: 0.8,
            metalness: 0.2, // Slight metallic shine
            side: THREE.FrontSide, // Avoid double-side rendering issues
            transparent: false, // Disable transparency for proper Z-buffer handling
        });

        return material;
    }


    public createWetMudMaterial(): THREE.MeshStandardMaterial {
        const colorTexture = this.loadTexture('src/assets/textures/mud/ground_0005_basecolor_1k.jpg');
        const normalTexture = this.loadTexture('src/assets/textures/mud/ground_0005_normal_1k.png');
        const roughnessTexture = this.loadTexture('src/assets/textures/mud/ground_0005_roughness_1k.jpg');
        const ambientOcclusionTexture = this.loadTexture('src/assets/textures/mud/ground_0005_ambient_occlusion_1k.jpg'); // Optional

        // Ensure all textures are set to repeat and wrap correctly
        [colorTexture, normalTexture, roughnessTexture, ambientOcclusionTexture].forEach((texture) => {
            if (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(10, 10); // Adjust repetition
            }
        });

        // Create and return the material with the textures applied
        const material = new THREE.MeshStandardMaterial({
            map: colorTexture,
            normalMap: normalTexture,
            roughnessMap: roughnessTexture,
            aoMap: ambientOcclusionTexture, // Ambient occlusion to add depth
            roughness: 0.5,
            metalness: 0, // More reflective, simulating wetness
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.95, // Slight transparency can make the effect look subtle
        });

        return material;
    }

    public createTrunkMaterial(params?: TrunkMaterialParams): THREE.MeshStandardMaterial {
        const materialParams: THREE.MeshStandardMaterialParameters = {
            color: params?.color || 0x8B4513,   // Default brown color for trunk
            roughness: params?.roughness ?? 0.8,
            metalness: params?.metalness ?? 0,
        };

        // Apply bark texture if path is provided
        if (params?.barkTexturePath) {
            materialParams.map = this.textureLoader.load(params.barkTexturePath);
        }

        // Create and return the material
        return new THREE.MeshStandardMaterial(materialParams);
    }

    public createWetMudShaderMaterial(center: [number, number], radius: number): THREE.ShaderMaterial {
        const colorTexture = this.loadTexture('src/assets/textures/mud/ground_0005_basecolor_1k.jpg');
        const normalTexture = this.loadTexture('src/assets/textures/mud/ground_0005_normal_1k.png');
        const roughnessTexture = this.loadTexture('src/assets/textures/mud/ground_0005_roughness_1k.jpg');
        const ambientOcclusionTexture = this.loadTexture('src/assets/textures/mud/ground_0005_ambient_occlusion_1k.jpg'); // Optional

        // Ensure all textures are set to repeat and wrap correctly
        [colorTexture, normalTexture, roughnessTexture, ambientOcclusionTexture].forEach((texture) => {
            if (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(10, 10); // Adjust repetition
            }
        });

        // Create the shader material
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                colorMap: { value: colorTexture },
                normalMap: { value: normalTexture },
                roughnessMap: { value: roughnessTexture },
                aoMap: { value: ambientOcclusionTexture },
                center: { value: new THREE.Vector3(center[0], 0, center[1]) },
                radius: { value: radius }
            },
            vertexShader: `
                varying vec3 vPosition;
                varying vec2 vUv;
                void main() {
                    vPosition = position;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D colorMap;
                uniform sampler2D normalMap;
                uniform sampler2D roughnessMap;
                uniform sampler2D aoMap;
                uniform vec3 center;
                uniform float radius;
                varying vec3 vPosition;
                varying vec2 vUv;
                
                void main() {
                    float dist = distance(vPosition.xz, center.xz);
                    float blendFactor = smoothstep(radius - 0.2, radius, dist); // Adjust 0.2 for sharpness
    
                    vec4 color = texture2D(colorMap, vUv);
                    vec4 ao = texture2D(aoMap, vUv);
                    vec4 roughness = texture2D(roughnessMap, vUv);
                    vec4 normal = texture2D(normalMap, vUv);
    
                    // Apply blending based on distance for smoother transition
                    vec4 finalColor = mix(color, vec4(0.2, 0.2, 0.2, 0.0), blendFactor);
                    gl_FragColor = finalColor;
                    gl_FragColor.rgb *= ao.rgb; // Apply ambient occlusion
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        return shaderMaterial;
    }


    /**
     * Creates a material for branches using the specified BranchMaterialParams.
     */
    public createBranchMaterial(params?: BranchMaterialParams): THREE.MeshStandardMaterial {
        const materialParams: THREE.MeshStandardMaterialParameters = {
            color: params?.color || 0x8B4513,   // Default brown color for branches
            roughness: params?.roughness ?? 0.6,
            metalness: params?.metalness ?? 0,
        };

        // Apply branch texture if path is provided
        if (params?.branchTexturePath) {
            materialParams.map = this.textureLoader.load(params.branchTexturePath);
        }

        // Create and return the material
        return new THREE.MeshStandardMaterial(materialParams);
    }

    /**
     * Creates a material for leaves using the specified LeafMaterialParams.
     */
    public createLeafMaterial(params?: LeafMaterialParams): THREE.MeshStandardMaterial {
        const materialParams: THREE.MeshStandardMaterialParameters = {
            color: params?.color || 0x228B22,  // Default green color for leaves
            roughness: params?.roughness ?? 0.5,
            metalness: params?.metalness ?? 0,
            opacity: params?.transparency ?? 1,
            transparent: params?.transparency !== undefined ? true : false,
        };

        // Apply leaf texture if path is provided
        if (params?.leafTexturePath) {
            materialParams.map = this.textureLoader.load(params.leafTexturePath);
        }

        // Create and return the material
        return new THREE.MeshStandardMaterial(materialParams);
    }

    public createMossyTerrainMaterial(): THREE.MeshStandardMaterial {
        const colorTexture = this.loadTexture('src/assets/textures/moss/Moss002_1K-JPG_Color.jpg');
        const normalTexture = this.loadTexture('src/assets/textures/moss/Moss002_1K-JPG_NormalGL.jpg');
        const roughnessTexture = this.loadTexture('src/assets/textures/moss/Moss002_1K-JPG_Roughness.jpg');
        const aoTexture = this.loadTexture('src/assets/textures/moss/Moss002_1K-JPG_AmbientOcclusion.jpg');
        const displacementTexture = this.loadTexture('src/assets/textures/moss/Moss002_1K-JPG_Displacement.jpg');

        // Ensure textures are configured to repeat and wrapped properly
        [colorTexture, normalTexture, roughnessTexture, aoTexture, displacementTexture].forEach((texture) => {
            if (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(2, 2); // Adjust repetition for large terrain
                texture.generateMipmaps = true;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
            }
        });

        // Create and return the material with the textures applied
        const material = new THREE.MeshStandardMaterial({
            map: colorTexture,                    // Base color map
            normalMap: normalTexture,             // Normal map for surface details
            roughnessMap: roughnessTexture,       // Roughness map for material roughness
            aoMap: aoTexture,                     // Ambient Occlusion map
            displacementScale: 0.2,               // Adjust scale for displacement effect
            roughness: 1,                         // No shininess, natural surface
            metalness: 0,                         // Non-metallic surface
            side: THREE.FrontSide,               // Render on both sides
            transparent: false,                   // Disable transparency to avoid Z-buffer issues
        });

        return material;
    }

    public createSnowMaterial(): THREE.MeshStandardMaterial {

        const colorTexture = this.loadTexture('src/assets/textures/snow/Snow010A_1K-JPG_Color.jpg');
        const normalTexture = this.loadTexture('src/assets/textures/snow/Snow010A_1K-JPG_NormalGL.jpg');
        const roughnessTexture = this.loadTexture('src/assets/textures/snow/Snow010A_1K-JPG_Roughness.jpg');
        const aoTexture = this.loadTexture('src/assets/textures/snow/Snow010A_1K-JPG_AmbientOcclusion.jpg');
        const displacementTexture = this.loadTexture('src/assets/textures/snow/Snow010A_1K-JPG_Displacement.jpg');

        // Ensure textures are configured to repeat and wrapped properly
        [colorTexture, normalTexture, roughnessTexture, aoTexture, displacementTexture].forEach((texture) => {
            if (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(2, 2); // Adjust repetition for large terrain
                texture.generateMipmaps = true;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
            }
        });

        // Create and return the material with the textures applied
        const material = new THREE.MeshStandardMaterial({
            map: colorTexture,                    // Base color map
            normalMap: normalTexture,             // Normal map for surface details
            roughnessMap: roughnessTexture,       // Roughness map for material roughness
            aoMap: aoTexture,                     // Ambient Occlusion map
            displacementScale: 0.2,               // Adjust scale for displacement effect
            roughness: 1,                         // No shininess, natural surface
            metalness: 0,                         // Non-metallic surface
            side: THREE.FrontSide,               // Render on both sides
            transparent: false,                   // Disable transparency to avoid Z-buffer issues
        });

        return material;
    }


}
