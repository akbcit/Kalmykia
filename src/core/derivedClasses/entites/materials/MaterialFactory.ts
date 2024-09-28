import * as THREE from "three";
import {
    BaseMaterialOptions, MeshBasicMaterialOptions, MeshLambertMaterialOptions, MeshPhongMaterialOptions,
    MeshStandardMaterialOptions, MeshPhysicalMaterialOptions, MeshToonMaterialOptions,
    MeshNormalMaterialOptions, MeshMatcapMaterialOptions, MeshDepthMaterialOptions,
    MeshDistanceMaterialOptions, SpriteMaterialOptions, PointsMaterialOptions,
    ShaderMaterialOptions, RawShaderMaterialOptions
} from "./types/MaterialOptions";

export class MaterialFactory {
    private materialOptions: BaseMaterialOptions;
    private textureLoader: THREE.TextureLoader;

    constructor(options: BaseMaterialOptions = {}) {
        this.materialOptions = options;
        this.textureLoader = new THREE.TextureLoader();
    }

    // Helper function to load texture if texture path is provided
    private loadTexture(path?: string): THREE.Texture | null {
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
}
