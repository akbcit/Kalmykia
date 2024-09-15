import * as THREE from 'three';

interface StandardMaterialParams {
  color?: number;
  roughness?: number;
  metalness?: number;
}

export class StandardMaterial extends THREE.MeshStandardMaterial {
  constructor({
    color = 0x00ff00,
    roughness = 0.1,
    metalness = 0.9,
  }: StandardMaterialParams) {
    super({ color, roughness, metalness });
  }
}