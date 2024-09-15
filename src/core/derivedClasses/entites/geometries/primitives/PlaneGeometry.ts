import * as THREE from 'three';

interface PlaneGeometryParams {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
}

export class PlaneGeometry extends THREE.PlaneGeometry {
  constructor({
    width = 1,
    height = 1,
    widthSegments = 1,
    heightSegments = 1,
  }: PlaneGeometryParams) {
    super(width, height, widthSegments, heightSegments);
  }

  logDetails() {
    console.log(`Plane dimensions: ${this.parameters.width} x ${this.parameters.height}`);
  }
}
