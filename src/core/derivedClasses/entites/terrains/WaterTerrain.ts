import * as THREE from 'three';
import { Terrain, TerrainParams } from '../TerrainPlane';



export class WaterTerrain extends Terrain {
  constructor(params: TerrainParams) {
    super({
      ...params,
      material: new THREE.MeshStandardMaterial({
        color: 0x1e90ff, // Water color
        roughness: 0.5,
        metalness: 0.1,
      }),
      flatShading: false,
    });

    // Optionally, you can add shader effects or animations here
  }
}
