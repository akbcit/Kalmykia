import * as THREE from 'three';

interface PhongMaterialParams {
  color?: number;
  shininess?: number;
  specular?: number;
  reflectivity?: number;
}

export class PhongMaterial extends THREE.MeshPhongMaterial {
  constructor({
    color = 0x0000ff,
    shininess = 150,
    specular = 0xaaaaaa,
    reflectivity = 1,
  }: PhongMaterialParams) {
    super({ color, shininess, specular, reflectivity });
  }
}