import { Entity } from "../../../parentClasses/Entity";
import { MeshComponent } from "../../components/MeshComponent";
import * as THREE from "three";
import { BaseIrregularGeometry, BaseIrregularGeometryParams } from "../geometries/custom/BaseIrregularGeometry";
import { PartialGeometryParams } from "../geometries/custom/PartialGeometry";

export interface BasinParams {
    position: THREE.Vector2;
    radius: number;
    depth: number;
    falloff?: "linear" | "smooth";
}

export interface MaterialPatchParams {
    center: THREE.Vector2;
    radius: number;
    material: THREE.Material;
}

export abstract class BaseTerrain extends Entity {
    protected geometry: BaseIrregularGeometry;
    public meshComponent: MeshComponent;
    protected basins: BasinParams[] = [];
    protected materialPatches: MaterialPatchParams[] = [];
    protected initialHeights: Float32Array | null = null;
    protected mesh: THREE.Mesh | null = null;

    constructor(
        geometry: BaseIrregularGeometry,
        material: THREE.Material,
        basins: BasinParams[] = [],
        materialPatches: MaterialPatchParams[] = []
    ) {
        super();
        this.geometry = geometry;
        this.basins = basins;
        this.materialPatches = materialPatches;

        // Initialize the mesh component
        this.meshComponent = new MeshComponent(this.geometry.getGeometry(), material);
        this.meshComponent.getMesh().renderOrder = 0;
        this.addComponent(this.meshComponent);
        this.mesh = this.meshComponent.getMesh();

        // Store heights and apply terrain features
        this.storeInitialHeights();
        this.applyBasins();
        this.addPatchMeshes(); // Add patch meshes to the scene
    }

    // Store initial Y-coordinates of the vertices
    protected storeInitialHeights(): void {
        const positions = this.geometry.getGeometry().attributes.position as THREE.BufferAttribute;
        this.initialHeights = new Float32Array(positions.count);

        for (let i = 0; i < positions.count; i++) {
            this.initialHeights[i] = positions.getY(i);
        }
    }

    // Apply the effects of basins on the terrain
    public applyBasins(): void {
        const positions = this.geometry.getGeometry().attributes.position as THREE.BufferAttribute;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            let height = this.initialHeights ? this.initialHeights[i] : positions.getY(i);

            height = this.applyBasinEffects(x, z, height);
            positions.setY(i, height);
        }

        positions.needsUpdate = true;
        this.geometry.getGeometry().computeVertexNormals();
    }

    // Update terrain after changing geometry parameters
    public updateTerrain(): void {
        this.geometry.applyNoise();
        this.applyBasins();
        this.rebuildTerrain();
    }


    // Calculate the basin effects based on distance and falloff
    protected applyBasinEffects(x: number, z: number, baseHeight: number): number {
        let height = baseHeight;

        for (const basin of this.basins) {
            const dx = x - basin.position.x;
            const dz = z - basin.position.y;
            const distance = Math.sqrt(dx * dx + dz * dz);

            if (distance < basin.radius) {
                const falloff = (basin.radius - distance) / basin.radius;
                const falloffFactor = basin.falloff === "smooth" ? Math.pow(falloff, 2) : falloff;
                height = Math.min(0 - basin.depth * falloffFactor, height);
            }
        }
        return height;
    }

    // Add material patch meshes to the scene
    public addPatchMeshes(): void {
        for (const patch of this.materialPatches) {
            const partialGeometry = this.getPartialGeometry({
                center: [patch.center.x, patch.center.y],
                radius: patch.radius,
            });

            // Create a mesh for the patch and slightly offset it to prevent Z-fighting
            const patchMesh = new THREE.Mesh(partialGeometry, patch.material);
            patchMesh.position.y += 0.01; // Slightly raise the patch mesh to avoid Z-fighting

            // Add the patch mesh to the terrain mesh
            this.meshComponent.getMesh().add(patchMesh);
        }
    }

    // Add a new material patch
    public addMaterialPatch(patch: MaterialPatchParams): void {
        this.materialPatches.push(patch);
        this.addPatchMeshes(); // Rebuild patches
    }

    // Clear all material patches
    public clearMaterialPatches(): void {
        this.materialPatches = [];
        this.meshComponent.getMesh().clear(); // Clear all child meshes (patches)
    }

    // Rebuild the terrain mesh
    public rebuildTerrain(): void {
        this.meshComponent.updateMesh(this.geometry.getGeometry(), this.meshComponent.getMesh().material);
        this.meshComponent.getMesh().geometry.computeBoundingSphere();
        this.meshComponent.getMesh().updateMatrixWorld(true);
    }

    // Get a partial geometry for a patch
    public getPartialGeometry(params: PartialGeometryParams) {
        return this.geometry.createPartialGeometry(params);
    }

    // Update an existing basin
    public updateBasin(index: number, updatedParams: Partial<BasinParams>): void {
        if (index >= 0 && index < this.basins.length) {
            Object.assign(this.basins[index], updatedParams);
            this.applyBasins();
            this.rebuildTerrain();
        }
    }
}
