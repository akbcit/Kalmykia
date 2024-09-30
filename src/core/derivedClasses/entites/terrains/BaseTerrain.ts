// src/core/derivedClasses/entites/terrains/BaseTerrain.ts
import * as THREE from 'three';
import { Entity } from '../../../parentClasses/Entity';
import { NoiseFunction } from '../../../../utils/noise/types/NoiseFunction';

export interface BaseTerrainParams {
  noiseScale?: number;
  heightFactor?: number;
  baseHeight?: number;
  material?: THREE.Material;
  receiveShadow?: boolean;
  noiseFunction?: NoiseFunction | null;
  useNoise?: boolean;
  basins?: BasinParams[];
}

export interface BasinParams {
  position: THREE.Vector2;
  radius: number;
  depth: number;
  falloff?: 'linear' | 'smooth';
}

export abstract class BaseTerrain extends Entity {
  protected noise2D: ((x: number, y: number) => number) | null;
  protected useNoise: boolean;
  protected material: THREE.Material;
  protected receiveShadow: boolean;
  protected mesh: THREE.Mesh | null = null;
  protected _noiseScale: number;
  protected _heightFactor: number;
  protected _baseHeight: number;
  protected basins: BasinParams[];

  constructor({
    material = new THREE.MeshStandardMaterial({ color: 0x228b22 }),
    receiveShadow = true,
    noiseFunction = null,
    useNoise = true,
    noiseScale = 50,
    heightFactor = 5,
    baseHeight = 0, // Set baseHeight to 0 for flat ground
    basins = [],
  }: BaseTerrainParams) {
    super();

    this.noise2D = noiseFunction ? noiseFunction : null;
    this.useNoise = useNoise;
    this.material = material;
    this.receiveShadow = receiveShadow;
    this._noiseScale = noiseScale;
    this._heightFactor = heightFactor;
    this._baseHeight = baseHeight;
    this.basins = basins;

    this.applyPolygonOffsetSettings();
  }

  // Getter and Setter for noiseScale
  public get noiseScale(): number {
    return this._noiseScale;
  }

  public set noiseScale(value: number) {
    this._noiseScale = value;
    this.rebuildTerrain();
  }

  // Getter and Setter for heightFactor
  public get heightFactor(): number {
    return this._heightFactor;
  }

  public set heightFactor(value: number) {
    this._heightFactor = value;
    this.rebuildTerrain();
  }

  // Getter and Setter for baseHeight
  public get baseHeight(): number {
    return this._baseHeight;
  }

  public set baseHeight(value: number) {
    this._baseHeight = value;
    this.rebuildTerrain();
  }

  // Method to dynamically update the terrain's geometry when properties change
  public rebuildTerrain(): void {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.geometry = this.createTerrainGeometry();
      this.applyNoiseToTerrain(this.mesh.geometry);
    }
  }

  // Abstract method for creating terrain geometry
  protected abstract createTerrainGeometry(): THREE.BufferGeometry;

  // Method to add a basin dynamically
  public addBasin(basin: BasinParams): void {
    this.basins.push(basin);
    this.rebuildTerrain();
  }

  // Method to clear all basins
  public clearBasins(): void {
    this.basins = [];
    this.rebuildTerrain();
  }

  // Method to get the lowest point of a basin
  public getBasinLowestPoint(basinIndex: number): number | null {
    if (basinIndex < 0 || basinIndex >= this.basins.length) return null;

    const basin = this.basins[basinIndex];

    // Calculate the base terrain height at the center of the basin using the noise function
    const baseTerrainHeight = this.noise2D ? this.noise2D(basin.position.x / this.noiseScale, basin.position.y / this.noiseScale) * this.heightFactor : 0;

    // Calculate the lowest point considering the basin's depth
    let lowestPoint = this.baseHeight + baseTerrainHeight - basin.depth;

    // Ensure the lowest point is not below the terrain base height (or a defined minimum)
    lowestPoint = Math.max(lowestPoint, this.baseHeight - basin.depth);

    return lowestPoint;
  }

  // Utility method to apply noise to the terrain geometry
  protected applyNoiseToTerrain(geometry: THREE.BufferGeometry): void {
    if (!this.noise2D) return;

    const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const z = positionAttribute.getZ(i);

      // Apply noise to get base height if useNoise is enabled
      let baseHeight = this.useNoise ? this.noise2D(x / this._noiseScale, z / this._noiseScale) * this._heightFactor : 0;
      baseHeight = this.applyBasinsToHeight(x, z, baseHeight);

      // Ensure the base terrain stays above or at zero height, with basins being negative
      const finalHeight = Math.max(this._baseHeight, baseHeight); // Force height to be at least baseHeight for non-basin areas
      positionAttribute.setY(i, finalHeight);
    }

    positionAttribute.needsUpdate = true;
  }

  // Method to apply basins to the terrain height
  protected applyBasinsToHeight(x: number, z: number, baseHeight: number): number {
    for (const basin of this.basins) {
      const dx = x - basin.position.x;
      const dz = z - basin.position.y;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < basin.radius) {
        // Calculate basin falloff
        const falloff = (basin.radius - distance) / basin.radius;
        const falloffFactor = basin.falloff === 'smooth' ? Math.pow(falloff, 2) : falloff;

        // Set height to negative within the basin region, overriding any noise
        baseHeight = Math.min(0 - basin.depth * falloffFactor, baseHeight);
      }
    }
    return baseHeight;
  }

  private applyPolygonOffsetSettings(): void {
    const terrainMaterial = this.material;
    terrainMaterial.polygonOffsetFactor = -10;
    terrainMaterial.polygonOffsetUnits = -10;
    terrainMaterial.depthWrite = true;
    terrainMaterial.depthTest = true;
    terrainMaterial.depthFunc = THREE.LessEqualDepth;
  }

  public getObject3D(): THREE.Object3D | null {
    return this.mesh;
  }
}
