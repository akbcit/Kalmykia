import * as THREE from 'three';

// Interface to define the geometry parameters
export interface RectangularPlaneGeometryParams {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
}

export class RectangularPlaneGeometry extends THREE.PlaneGeometry {
  private width: number;
  private height: number;
  private widthSegments: number;
  private heightSegments: number;

  constructor({
    width = 1,
    height = 1,
    widthSegments = 1,
    heightSegments = 1,
  }: RectangularPlaneGeometryParams) {
    // Call the parent class constructor with the provided dimensions
    super(width, height, widthSegments, heightSegments);

    // Store the parameters locally
    this.width = width;
    this.height = height;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;

    // Log the details using the locally stored variables
    console.log(`RectangularPlaneGeometry initialized with dimensions: ${this.width} x ${this.height}`);
    console.log(`Segments: ${this.widthSegments} x ${this.heightSegments}`);
  }
}
