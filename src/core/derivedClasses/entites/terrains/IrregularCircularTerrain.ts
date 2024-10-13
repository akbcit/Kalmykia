import { BaseTerrain, BasinParams } from './BaseTerrain';
import { IrregularCircularGeometry, IrregularCircularGeometryParams } from '../geometries/custom/IrregularCircularGeometry';
import * as THREE from 'three';

export interface IrregularCircularTerrainParams {
    terrainMaterial: THREE.Material;
    terrainGeometry: IrregularCircularGeometryParams;
    basins?: BasinParams[];
}

export class IrregularCircularTerrain extends BaseTerrain {
    private circularGeometry: IrregularCircularGeometry;

    constructor(params: IrregularCircularTerrainParams) {
        const geometry = new IrregularCircularGeometry(params.terrainGeometry);
        super(geometry, params.terrainMaterial, params.basins || []);
        this.circularGeometry = geometry;
    }

    /**
     * Update the radius of the circular terrain.
     * Recreates the geometry with the new radius and rebuilds the terrain.
     */
    public updateRadius(newRadius: number): void {
        this.circularGeometry.setRadius(newRadius); // Update radius at geometry level
        this.updateTerrain(); // Rebuild terrain with the new radius
    }

    /**
     * Update the height factor for the terrain noise.
     * Adjusts the height scaling and rebuilds the terrain.
     */
    public updateHeightFactor(newHeightFactor: number): void {
        this.circularGeometry.updateParams({ heightFactor: newHeightFactor });
        this.updateTerrain(); // Rebuild terrain with updated height factor
    }
}
