import * as THREE from "three";
import { BaseMaterialOptions, MeshBasicMaterialOptions, MeshDepthMaterialOptions, MeshDistanceMaterialOptions, MeshLambertMaterialOptions, MeshMatcapMaterialOptions, MeshNormalMaterialOptions, MeshPhongMaterialOptions, MeshPhysicalMaterialOptions, MeshStandardMaterialOptions, MeshToonMaterialOptions, PointsMaterialOptions, RawShaderMaterialOptions, ShaderMaterialOptions, SpriteMaterialOptions } from "./types/MaterialOptions";

export class MaterialFactory {
    private materialOptions: BaseMaterialOptions;

    constructor(options: BaseMaterialOptions = {}) {
        this.materialOptions = options;
    }

    public createStandardMaterial(options: MeshStandardMaterialOptions = {}): THREE.MeshStandardMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.MeshStandardMaterial(mergedOptions);
    }

    public createBasicMaterial(options: MeshBasicMaterialOptions = {}): THREE.MeshBasicMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.MeshBasicMaterial(mergedOptions);
    }

    public createPhongMaterial(options: MeshPhongMaterialOptions = {}): THREE.MeshPhongMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.MeshPhongMaterial(mergedOptions);
    }

    public createLambertMaterial(options: MeshLambertMaterialOptions = {}): THREE.MeshLambertMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.MeshLambertMaterial(mergedOptions);
    }

    public createPhysicalMaterial(options: MeshPhysicalMaterialOptions = {}): THREE.MeshPhysicalMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.MeshPhysicalMaterial(mergedOptions);
    }

    public createToonMaterial(options: MeshToonMaterialOptions = {}): THREE.MeshToonMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.MeshToonMaterial(mergedOptions);
    }

    public createNormalMaterial(options: MeshNormalMaterialOptions = {}): THREE.MeshNormalMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.MeshNormalMaterial(mergedOptions);
    }

    public createMatcapMaterial(options: MeshMatcapMaterialOptions = {}): THREE.MeshMatcapMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.MeshMatcapMaterial(mergedOptions);
    }

    public createDepthMaterial(options: MeshDepthMaterialOptions = {}): THREE.MeshDepthMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.MeshDepthMaterial(mergedOptions);
    }

    public createDistanceMaterial(options: MeshDistanceMaterialOptions = {}): THREE.MeshDistanceMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.MeshDistanceMaterial(mergedOptions);
    }

    public createSpriteMaterial(options: SpriteMaterialOptions = {}): THREE.SpriteMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.SpriteMaterial(mergedOptions);
    }

    public createShaderMaterial(options: ShaderMaterialOptions = {}): THREE.ShaderMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.ShaderMaterial(mergedOptions);
    }

    public createRawShaderMaterial(options: RawShaderMaterialOptions = {}): THREE.RawShaderMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.RawShaderMaterial(mergedOptions);
    }

    public createPointsMaterial(options: PointsMaterialOptions = {}): THREE.PointsMaterial {
        const mergedOptions = { ...this.materialOptions, ...options };
        return new THREE.PointsMaterial(mergedOptions);
    }
}