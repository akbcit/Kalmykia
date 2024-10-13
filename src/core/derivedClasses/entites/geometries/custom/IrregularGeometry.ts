import * as THREE from "three";
import { NoiseFunction } from "../../../../../utils/noise/types/NoiseFunction";

export interface IrregularGeometryParams {
  width: number;
  height: number;
  widthSegments?: number;
  heightSegments?: number;
  position?: [number, number, number];
  noiseFunction: NoiseFunction;
  heightFactor?: number;
}

export class IrregularGeometry {
  private geometry: THREE.BufferGeometry;
  private params: Required<IrregularGeometryParams>;

  constructor(params: IrregularGeometryParams) {
    this.params = {
      width: params.width,
      height: params.height,
      widthSegments: params.widthSegments || 64,
      heightSegments: params.heightSegments || 64,
      position: params.position || [0, 0, 0],
      noiseFunction: params.noiseFunction,
      heightFactor: params.heightFactor || 1
    };

    this.geometry = new THREE.PlaneGeometry(
      this.params.width,
      this.params.height,
      this.params.widthSegments,
      this.params.heightSegments
    );

    this.applyNoise();
    this.rotateToXZPlane();
    this.positionPlane();
  }

  private applyNoise(): void {
    const positions = this.geometry.attributes.position as THREE.BufferAttribute;
    const { width, height, noiseFunction, heightFactor } = this.params;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      // Normalize x and y to 0-1 range for noise function
      const nx = (x + width / 2) / width;
      const ny = (y + height / 2) / height;

      // Apply noise to z-coordinate (which will become y after rotation)
      const noiseValue = noiseFunction(nx, ny) * heightFactor;
      positions.setZ(i, z + noiseValue);
    }

    positions.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  private rotateToXZPlane(): void {
    this.geometry.rotateX(-Math.PI / 2);
  }

  private positionPlane(): void {
    const [x, y, z] = this.params.position;
    this.geometry.translate(x, y, z);
  }

  public getGeometry(): THREE.BufferGeometry {
    return this.geometry;
  }
}