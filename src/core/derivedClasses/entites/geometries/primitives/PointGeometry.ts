import * as THREE from 'three';

interface PointGeometryParams {
  position?: THREE.Vector3;
}

export class PointGeometry extends THREE.BufferGeometry {
  constructor({
    position = new THREE.Vector3(0, 0, 0),
  }: PointGeometryParams) {
    super();
    this.setFromPoints([position]);
  }

  logDetails() {
    console.log(`Point position: ${this.getAttribute('position')}`);
  }
}
