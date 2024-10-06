import * as THREE from 'three';
import { Entity } from '../../../parentClasses/Entity';
import { NoiseFunction } from '../../../../utils/noise/types/NoiseFunction';
import { PartialGeometry, PartialGeometryParams } from '../geometries/custom/PartialGeometry';
import { MeshComponent } from '../../components/MeshComponent';

// Interface for Basin parameters
export interface BasinParams {
  position: THREE.Vector2;
  radius: number;
  depth: number;
  falloff?: 'linear' | 'smooth';
}

// Geometry parameter interfaces
export interface RectangularPlaneGeometryParams {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
}

export interface IrregularPlaneGeometryParams {
  radius?: number;
  segments?: number;
  boundaryDisplacementFactor?: number;
  curvatureLayers?: number;
  smoothnessFactor?: number;
}

// Enum to define geometry types
export enum GeometryType {
  Rectangular = 'Rectangular',
  Irregular = 'Irregular',
}

// Union type to represent different geometry parameters
type TerrainGeometryParams = RectangularPlaneGeometryParams | IrregularPlaneGeometryParams;

// Interface for BaseTerrain parameters
export interface TerrainParams {
  geometryType: GeometryType;
  geometryParams: TerrainGeometryParams;
  noiseScale?: number;
  heightFactor?: number;
  baseHeight?: number;
  material?: THREE.Material;
  receiveShadow?: boolean;
  noiseFunction?: NoiseFunction | null;
  useNoise?: boolean;
  basins?: BasinParams[];
}

export class Terrain extends Entity {

  protected noise2D: ((x: number, y: number) => number) | null;
  protected useNoise: boolean;
  protected material: THREE.Material;
  protected receiveShadow: boolean;
  protected mesh: THREE.Mesh | null = null;
  protected noiseScale: number;
  protected heightFactor: number;
  protected baseHeight: number;
  protected basins: BasinParams[];
  protected meshComponent: MeshComponent | null = null;
  protected geometryType: GeometryType;
  protected geometryParams: TerrainGeometryParams;

  constructor({
    geometryType,
    geometryParams,
    material = new THREE.MeshStandardMaterial({ color: 0x228b22 }),
    receiveShadow = true,
    noiseFunction = null,
    useNoise = true,
    noiseScale = 50,
    heightFactor = 5,
    baseHeight = 0, // Set baseHeight to 0 for flat ground
    basins = [],
  }: TerrainParams) {
    super();

    // Initialize properties
    this.geometryType = geometryType;
    this.geometryParams = geometryParams;
    this.noise2D = noiseFunction ? noiseFunction : null;
    this.useNoise = useNoise;
    this.material = material;
    this.receiveShadow = receiveShadow;
    this.noiseScale = noiseScale;
    this.heightFactor = heightFactor;
    this.baseHeight = baseHeight;
    this.basins = basins;

    this.applyPolygonOffsetSettings();

    // Create and add the mesh component
    this.createAndAddMesh();
  }

  // Create and add a mesh to the entity
  private createAndAddMesh(): void {
    const geometry = this.createTerrainGeometry();
    this.applyNoiseToTerrain(geometry);
  
    // Create and add MeshComponent
    this.meshComponent = new MeshComponent(geometry, this.material);
    this.addComponent(this.meshComponent);
  
    // Assign mesh to the terrain's internal mesh property for reference
    this.mesh = this.meshComponent.getMesh();
  }

  // Create geometry based on the geometry type
  protected createTerrainGeometry(): THREE.BufferGeometry {
    switch (this.geometryType) {
      case GeometryType.Rectangular: {
        const { width = 100, height = 100, widthSegments = 50, heightSegments = 50 } =
          this.geometryParams as RectangularPlaneGeometryParams;

        const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
        geometry.rotateX(-Math.PI / 2); // Rotate to be horizontal
        return geometry;
      }

      case GeometryType.Irregular: {
        const {
          radius = 50,
          segments = 30,
          boundaryDisplacementFactor = 5,
          curvatureLayers = 3,
          smoothnessFactor = 2,
        } = this.geometryParams as IrregularPlaneGeometryParams;

        const geometry = new THREE.CircleGeometry(radius, segments); // Placeholder for actual irregular geometry

        // Apply custom transformations using boundaryDisplacementFactor, curvatureLayers, and smoothnessFactor
        this.applyIrregularTerrainModifiers(geometry, boundaryDisplacementFactor, curvatureLayers, smoothnessFactor);

        return geometry;
      }

      default:
        throw new Error(`Unsupported geometry type: ${this.geometryType}`);
    }
  }

  // Apply irregular terrain modifications
  private applyIrregularTerrainModifiers(
    geometry: THREE.BufferGeometry,
    boundaryDisplacementFactor: number,
    curvatureLayers: number,
    smoothnessFactor: number
  ): void {
    const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < positionAttribute.count; i++) {
      let x = positionAttribute.getX(i);
      let y = positionAttribute.getY(i);

      // Apply boundary displacement factor and smoothness factor
      x += Math.sin(x * boundaryDisplacementFactor) * smoothnessFactor;
      y += Math.cos(y * boundaryDisplacementFactor) * smoothnessFactor;

      positionAttribute.setXY(i, x, y);
    }
    positionAttribute.needsUpdate = true;
  }

 // Method to dynamically update the terrain's geometry when properties change
public rebuildTerrain(): void {
  if (this.meshComponent) {
    const newGeometry = this.createTerrainGeometry();
    this.applyNoiseToTerrain(newGeometry);
    
    // Update the MeshComponent's geometry and keep the material
    this.meshComponent.updateMesh(newGeometry, this.meshComponent.getMesh().material);

    // Update the internal mesh reference as well
    this.mesh = this.meshComponent.getMesh();
  }
}

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
    const baseTerrainHeight = this.noise2D
      ? this.noise2D(basin.position.x / this.noiseScale, basin.position.y / this.noiseScale) * this.heightFactor
      : 0;
    let lowestPoint = this.baseHeight + baseTerrainHeight - basin.depth;

    lowestPoint = Math.max(lowestPoint, this.baseHeight - basin.depth);

    return lowestPoint;
  }

  // Method to apply noise to the terrain geometry
  protected applyNoiseToTerrain(geometry: THREE.BufferGeometry): void {
    if (!this.noise2D) return;

    const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const z = positionAttribute.getZ(i);

      let baseHeight = this.useNoise ? this.noise2D(x / this.noiseScale, z / this.noiseScale) * this.heightFactor : 0;
      baseHeight = this.applyBasinsToHeight(x, z, baseHeight);

      const finalHeight = Math.max(this.baseHeight, baseHeight);
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
        const falloff = (basin.radius - distance) / basin.radius;
        const falloffFactor = basin.falloff === 'smooth' ? Math.pow(falloff, 2) : falloff;
        baseHeight = Math.min(0 - basin.depth * falloffFactor, baseHeight);
      }
    }
    return baseHeight;
  }

  // Method to create partial geometry based on custom region definition
  public createPartialGeometry(params: PartialGeometryParams): THREE.BufferGeometry | null {
    const { center, radius, edgeSmoothing, noiseIntensity } = params;

    const meshComponent = this.getComponent(MeshComponent);
    if (!meshComponent) {
      console.error('MeshComponent not found on this entity.');
      return null;
    }

    const terrainGeometry = meshComponent.getGeometry();
    if (!terrainGeometry || !terrainGeometry.attributes.position) {
      console.error("Terrain geometry does not have a 'position' attribute.");
      return null;
    }

    try {
      const partialGeometry = new PartialGeometry(terrainGeometry, {
        center,
        radius,
        edgeSmoothing, noiseIntensity
      });

      return partialGeometry;
    } catch (error) {
      console.error('Error creating partial geometry:', error);
      return null;
    }
  }

  // Method to get the THREE.Object3D associated with this entity
  public getObject3D(): THREE.Object3D | null {
    const meshComponent = this.getComponent(MeshComponent);
    return meshComponent ? meshComponent.getMesh() : null;
  }

  // Apply polygon offset settings to avoid z-fighting issues
  private applyPolygonOffsetSettings(): void {
    this.material.polygonOffsetFactor = -10;
    this.material.polygonOffsetUnits = -10;
    this.material.depthWrite = true;
    this.material.depthTest = true;
    this.material.depthFunc = THREE.LessEqualDepth;
  }

  // Getter and Setter for noiseScale
  public getNoiseScale(): number {
    return this.noiseScale;
  }

  public setNoiseScale(value: number): void {
    this.noiseScale = value;
    this.rebuildTerrain();
  }

  // Getter and Setter for heightFactor
  public getHeightFactor(): number {
    return this.heightFactor;
  }

  public setHeightFactor(value: number): void {
    this.heightFactor = value;
    this.rebuildTerrain();
  }

  // Getter and Setter for baseHeight
  public getBaseHeight(): number {
    return this.baseHeight;
  }

  public setBaseHeight(value: number): void {
    this.baseHeight = value;
    this.rebuildTerrain();
  }

  // Getter and Setter for geometryParams
  public getGeometryParams(): TerrainGeometryParams {
    return this.geometryParams;
  }

  public setGeometryParams(params: TerrainGeometryParams): void {
    this.geometryParams = params;
    this.rebuildTerrain();
  }

}
