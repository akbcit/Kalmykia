import * as THREE from 'three';

interface ToonMaterialParams {
  color?: number;
  gradientMap?: THREE.Texture;
}

export class ToonMaterial extends THREE.MeshToonMaterial {
  constructor({ color = 0xffff00, gradientMap }: ToonMaterialParams) {
    super({ color, gradientMap });
  }
}