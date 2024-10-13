import { Entity } from "../../../parentClasses/Entity";
import { MeshComponent } from "../../components/MeshComponent";
import * as THREE from "three";
import { IrregularCircularGeometry, IrregularCircularGeometryParams } from "../geometries/custom/IrregularCircularGeometry";

export interface IrregularCircularTerrainParams {
    terrainGeometry: IrregularCircularGeometryParams;
    terrainMaterial: THREE.Material;
}

export class IrregularCircularTerrain extends Entity {

    private geometry: IrregularCircularGeometry;
    private meshComponent: MeshComponent;

    constructor(irregularTerrainParams: IrregularCircularTerrainParams) {
        super();
        
        // Create circular geometry with noise and terrain material
        this.geometry = new IrregularCircularGeometry(irregularTerrainParams.terrainGeometry);
        this.meshComponent = new MeshComponent(this.geometry.getGeometry(), irregularTerrainParams.terrainMaterial);

        // Add the mesh component to the entity
        this.addComponent(this.meshComponent);
    }

    // Method to get the THREE.Object3D associated with this entity
    public getObject3D(): THREE.Object3D | null {
        const meshComponent = this.getComponent(MeshComponent);
        return meshComponent ? meshComponent.getMesh() : null;
    }
}
