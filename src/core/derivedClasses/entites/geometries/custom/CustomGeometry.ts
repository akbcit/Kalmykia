import * as THREE from "three";
import { NoiseFunction } from "../../../../../utils/noise/types/NoiseFunction";

export interface CustomGeometryParams {
  center: [number, number, number]; // Center of the plane (x, y, z)
  radius: number; // Radius of the circular plane
  smoothness?: number; // Number of points for smooth interpolation
  wiggliness?: number; // Controls edge irregularity
  noiseFunction?: NoiseFunction; // Optional noise function for height displacement
  heightFactor?: number; // Intensity of the bumps
}

export class CustomGeometry {
  private geometry: THREE.BufferGeometry;
  private params: CustomGeometryParams;

  constructor(params: CustomGeometryParams) {
    this.params = params;
    const points = this.createCatmullRomPoints(); // Generate smooth points
    this.geometry = new THREE.LatheGeometry(points, 64); // Use LatheGeometry
    this.applyNoise(); // Apply noise-based height displacement
  }

  // Generate wiggly points along the circle using Catmull-Rom splines
  private createCatmullRomPoints(): THREE.Vector2[] {
    const { radius, center, smoothness = 10, wiggliness = 0.1 } = this.params;
    const [cx, , cz] = center; // Ignore Y since we are on the X-Z plane
    const segments = 32; // Number of segments along the circle

    // Create an array of smooth, wiggly points around the circle
    const points = Array.from({ length: segments }, (_, i) => {
      const angle = (i / segments) * Math.PI * 2; // Full circle in radians
      const x = (radius + this.getWigglyOffset(wiggliness)) * Math.cos(angle);
      const z = (radius + this.getWigglyOffset(wiggliness)) * Math.sin(angle);
      return new THREE.Vector2(x + cx, z + cz); // Use Vector2 for LatheGeometry
    });

    // Use a Catmull-Rom spline to smooth the points
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(p.x, 0, p.y)), // Convert to Vector3 for curve
      true // Closed curve
    );

    return curve.getPoints(smoothness * segments).map((p) => new THREE.Vector2(p.x, p.z)); // Convert back to Vector2
  }

  // Generate random offset for wiggly edges
  private getWigglyOffset(wiggliness: number): number {
    return (Math.random() - 0.5) * wiggliness;
  }

  // Apply noise-based height displacement to the geometry
  private applyNoise() {
    const { noiseFunction, heightFactor = 1, center } = this.params;
    if (!noiseFunction) return; // Skip if no noise function is provided

    const position = this.geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i) + center[0];
      const z = position.getZ(i) + center[2];
      const noise = noiseFunction(x, z) * heightFactor; // Calculate height from noise
      position.setY(i, noise + center[1]); // Adjust Y position with noise
    }

    position.needsUpdate = true; // Mark position as needing update
    this.geometry.computeVertexNormals(); // Recompute normals for shading
  }

  // Get the final geometry
  public getGeometry(): THREE.BufferGeometry {
    return this.geometry;
  }
}
