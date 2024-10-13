import { Entity } from "../../../parentClasses/Entity";
import { MeshComponent } from "../../components/MeshComponent";
import * as THREE from "three";
import { IrregularGeometry, IrregularGeometryParams } from "../geometries/custom/IrregularGeometry";

export interface IrregularRectangularTerrainParams {
    terrainGeometry: IrregularGeometryParams
    terrainMaterial: THREE.Material
}

export class IrregularRectangularTerrain extends Entity {

    private geometry: IrregularGeometry;
    private meshComponent: MeshComponent;

    constructor(irregularTerrainParams: IrregularRectangularTerrainParams) {
        super()
        this.geometry = new IrregularGeometry(irregularTerrainParams.terrainGeometry);
        this.meshComponent = new MeshComponent(this.geometry.getGeometry(), irregularTerrainParams.terrainMaterial);
        this.addComponent(this.meshComponent);
    }

    // Method to get the THREE.Object3D associated with this entity
    public getObject3D(): THREE.Object3D | null {
        const meshComponent = this.getComponent(MeshComponent);
        return meshComponent ? meshComponent.getMesh() : null;
    }

}