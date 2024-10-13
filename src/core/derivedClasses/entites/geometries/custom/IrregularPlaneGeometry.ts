import * as THREE from "three";
import { BaseIrregularGeometry, BaseIrregularGeometryParams } from "./BaseIrregularGeometry";

export interface IrregularPlaneGeometryParams extends BaseIrregularGeometryParams {
  width: number;
  height: number;
  widthSegments?: number;
  heightSegments?: number;
}

export class IrregularPlaneGeometry extends BaseIrregularGeometry {
  private planeParams: Required<IrregularPlaneGeometryParams>;

  constructor(params: IrregularPlaneGeometryParams) {
    super(params);
    this.planeParams = {
      ...this.params,
      width: params.width,
      height: params.height,
      widthSegments: params.widthSegments || 64,
      heightSegments: params.heightSegments || 64,
    };

    this.createGeometry(); // Create the geometry
    this.applyNoise(); // Apply noise to positions
  }

  protected createGeometry(): void {
    const { width, height, widthSegments, heightSegments } = this.planeParams;
    this.geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
  }

  protected getNormalizedCoordinates(x: number, y: number): [number, number] {
    const { width, height } = this.planeParams;
    return [(x + width / 2) / width, (y + height / 2) / height];
  }
}
