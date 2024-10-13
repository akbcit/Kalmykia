import * as THREE from "three";
import { BaseTerrain, BasinParams } from "./BaseTerrain";
import { IrregularPlaneGeometry, IrregularPlaneGeometryParams } from "../geometries/custom/IrregularPlaneGeometry";

export interface IrregularRectangularTerrainParams {
    terrainMaterial: THREE.Material;
    terrainGeometry: IrregularPlaneGeometryParams;
    basins?: BasinParams[];
}

export class IrregularRectangularTerrain extends BaseTerrain {
    constructor(params: IrregularRectangularTerrainParams) {
        const geometry = new IrregularPlaneGeometry(params.terrainGeometry);
        super(geometry, params.terrainMaterial, params.basins || []);
    }
}
