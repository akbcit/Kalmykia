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

}
