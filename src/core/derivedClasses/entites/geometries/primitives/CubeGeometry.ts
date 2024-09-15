import * as THREE from 'three';

interface CubeGeometryParams {
  width?: number;
  height?: number;
  depth?: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
}

export class CubeGeometry extends THREE.BoxGeometry {
  constructor({
    width = 1,
    height = 1,
    depth = 1,
    widthSegments = 1,
    heightSegments = 1,
    depthSegments = 1,
  }: CubeGeometryParams) {
    // Call the parent class constructor with provided parameters
    super(width, height, depth, widthSegments, heightSegments, depthSegments);
  }

  // Optional: Add custom methods specific to CubeGeometry if needed
  logDimensions() {
    console.log(`Cube dimensions: ${this.parameters.width} x ${this.parameters.height} x ${this.parameters.depth}`);
  }
}

// Usage example (commented out):
// const cube = new CubeGeometry({ width: 2, height: 2, depth: 2 });
// scene.add(new THREE.Mesh(cube, new THREE.MeshBasicMaterial({ color: 0x00ff00 })));
