import { Entity } from "../../../parentClasses/Entity";
import { MeshComponent } from "../../components/MeshComponent";
import { CustomGeometry, CustomGeometryParams } from "../geometries/custom/CustomGeometry";
import * as THREE from "three";

export interface IrregularTerrainParams {
    terrainGeometry: CustomGeometryParams
    terrainMaterial: THREE.Material
}

export class IrregularTerrain extends Entity {

    private geometry: CustomGeometry;
    private meshComponent: MeshComponent;

    constructor(irregularTerrainParams: IrregularTerrainParams) {
        super()
        this.geometry = new CustomGeometry(irregularTerrainParams.terrainGeometry);
        this.meshComponent = new MeshComponent(this.geometry.getGeometry(), irregularTerrainParams.terrainMaterial);
        this.addComponent(this.meshComponent);
    }

    // Method to get the THREE.Object3D associated with this entity
    public getObject3D(): THREE.Object3D | null {
        const meshComponent = this.getComponent(MeshComponent);
        return meshComponent ? meshComponent.getMesh() : null;
    }

}