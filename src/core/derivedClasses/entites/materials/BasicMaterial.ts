import * as THREE from 'three';

interface BasicMaterialParams {
  color?: number;
  wireframe?: boolean;
}

export class BasicMaterial extends THREE.MeshBasicMaterial {
  constructor({ color = 0xff0000, wireframe = true }: BasicMaterialParams) {
    super({ color, wireframe });
  }
}