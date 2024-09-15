import * as THREE from 'three';

interface LambertMaterialParams {
  color?: number;
  emissive?: number;
}

export class LambertMaterial extends THREE.MeshLambertMaterial {
  constructor({ color = 0xff00ff, emissive = 0x000000 }: LambertMaterialParams) {
    super({ color, emissive });
  }
}
