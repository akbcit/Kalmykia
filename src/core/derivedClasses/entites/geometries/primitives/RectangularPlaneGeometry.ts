import * as THREE from 'three';

export interface RectangularPlaneGeometryParams {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
}

export class RectangularPlaneGeometry extends THREE.PlaneGeometry {
  constructor({
    width = 1,
    height = 1,
    widthSegments = 1,
    heightSegments = 1,
  }: RectangularPlaneGeometryParams) {
    super(width, height, widthSegments, heightSegments);
  }

  logDetails() {
    console.log(`Plane dimensions: ${this.parameters.width} x ${this.parameters.height}`);
  }
}
