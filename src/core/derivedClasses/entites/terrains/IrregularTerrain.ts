// terrains/IrregularTerrain.ts
import * as THREE from 'three';
import { IrregularPlaneGeometry, IrregularPlaneGeometryParams } from '../geometries/primitives/IrregularPlaneGeometry';
import { BaseTerrain, BaseTerrainParams } from './BaseTerrain';

export interface IrregularTerrainParams extends BaseTerrainParams {
    irregularPlaneGeometryParams?: IrregularPlaneGeometryParams;
}

export class IrregularTerrain extends BaseTerrain {
    private irregularPlaneGeometryParams: IrregularPlaneGeometryParams;

    constructor(params: IrregularTerrainParams = {}) {
        // Destructure params to separate the base params and irregular geometry params
        const { irregularPlaneGeometryParams = {}, ...baseParams } = params;

        // Pass the base params to the parent class constructor
        super(baseParams);

        // Assign the irregular plane geometry params with default values
        this.irregularPlaneGeometryParams = irregularPlaneGeometryParams;
    }

    // Override method to create an irregular plane geometry
    protected createTerrainGeometry(): THREE.BufferGeometry {
        const {
            radius = 50, // Default radius for the circular plane
            segments = 30, // Number of segments for smoother edges
            boundaryDisplacementFactor = 5,
            curvatureLayers = 3, // Number of sine/cosine layers to add complexity
            smoothnessFactor = 2, // Increase to make the boundary smoother
        } = this.irregularPlaneGeometryParams ?? {}; // Use nullish coalescing operator to ensure this is not undefined

        const geometry = new IrregularPlaneGeometry({
            radius,
            segments,
            boundaryDisplacementFactor,
            curvatureLayers,
            smoothnessFactor,
        });
        
        return geometry;
    }
}
