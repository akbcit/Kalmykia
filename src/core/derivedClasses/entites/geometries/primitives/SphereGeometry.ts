import * as THREE from 'three';

interface SphereGeometryParams {
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
}

export class SphereGeometry extends THREE.SphereGeometry {
  constructor({
    radius = 1,
    widthSegments = 32,
    heightSegments = 16,
  }: SphereGeometryParams) {
    super(radius, widthSegments, heightSegments);
  }

  logDetails() {
    console.log(`Sphere radius: ${this.parameters.radius}, width segments: ${this.parameters.widthSegments}, height segments: ${this.parameters.heightSegments}`);
  }
}
