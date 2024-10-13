import { Entity } from "../../../parentClasses/Entity";
import { MeshComponent } from "../../components/MeshComponent";
import * as THREE from "three";
import { BaseIrregularGeometry, BaseIrregularGeometryParams } from "../geometries/custom/BaseIrregularGeometry";

export interface BasinParams {
    position: THREE.Vector2;
    radius: number;
    depth: number;
    falloff?: "linear" | "smooth";
}

export abstract class BaseTerrain extends Entity {
    protected geometry: BaseIrregularGeometry;
    protected meshComponent: MeshComponent;
    protected basins: BasinParams[] = [];
    protected initialHeights: Float32Array | null = null;

    constructor(
        geometry: BaseIrregularGeometry,
        material: THREE.Material,
        basins: BasinParams[] = []
    ) {
        super();
        this.geometry = geometry;
        this.basins = basins;

        // Initialize the mesh component
        this.meshComponent = new MeshComponent(this.geometry.getGeometry(), material);
        this.addComponent(this.meshComponent);

        this.storeInitialHeights();
        this.applyBasins();
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

    // Add a new basin
    public addBasin(basin: BasinParams): void {
        this.basins.push(basin);
        this.applyBasins();
    }

    // Clear all basins
    public clearBasins(): void {
        this.basins = [];
        this.applyBasins();
    }

    // Update an existing basin
    public updateBasin(index: number, updatedParams: Partial<BasinParams>): void {
        if (index >= 0 && index < this.basins.length) {
            Object.assign(this.basins[index], updatedParams);
            this.applyBasins();
            this.rebuildTerrain();
        }
    }

    // Rebuild the terrain mesh and update the scene
    public rebuildTerrain(): void {
        this.meshComponent.updateMesh(this.geometry.getGeometry(), this.meshComponent.getMesh().material);
        this.meshComponent.getMesh().geometry.computeBoundingSphere();
        this.meshComponent.getMesh().updateMatrixWorld(true);
    }

    // Update terrain after changing geometry parameters
    public updateTerrain(): void {
        this.geometry.applyNoise();
        this.applyBasins();
        this.rebuildTerrain();
    }

    // Expose method to update geometry parameters dynamically
    public updateGeometryParams(params: Partial<BaseIrregularGeometryParams>): void {
        Object.assign(this.geometry.params, params); // Merge new parameters
        this.updateTerrain(); // Rebuild terrain with updated parameters
    }
}
