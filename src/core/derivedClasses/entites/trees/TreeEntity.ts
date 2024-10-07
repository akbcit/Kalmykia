import { ComplexEntity } from "../../../parentClasses/ComplexEntity";
import { MaterialFactory } from "../materials/MaterialFactory";
import { TreeParams } from "./types/TreeParams";
import * as THREE from "three";

export class TreeEntity extends ComplexEntity {
  private treeParams: TreeParams;
  private trunkGeometry: THREE.BufferGeometry | undefined;
  private materialFactory = new MaterialFactory();  // Initialize the MaterialFactory
  private group: THREE.Group = new THREE.Group();   // Create a group to hold the trunk and other parts

  constructor(treeParams: TreeParams) {
    super();
    this.treeParams = treeParams;
    this.setupTrunk();  // Call setupTrunk in the constructor to initialize
  }

  /**
   * Initializes the trunk geometry based on the trunk shape specified in treeParams.
   */
  private initializeTrunkGeometry(): void {
    switch (this.treeParams.trunkParams.trunkShape) {
      case "cylinder":
        // Create cylinder geometry for the trunk
        this.trunkGeometry = new THREE.CylinderGeometry(
          this.treeParams.trunkParams.trunkTopRadius,
          this.treeParams.trunkParams.trunkBaseRadius,
          this.treeParams.trunkParams.trunkHeight,
          this.treeParams.trunkParams.trunkSegments
        );
        break;

      case "cone":
        // Create cone geometry for the trunk
        this.trunkGeometry = new THREE.ConeGeometry(
          this.treeParams.trunkParams.trunkBaseRadius,
          this.treeParams.trunkParams.trunkHeight,
          this.treeParams.trunkParams.trunkSegments
        );
        break;

      case "custom":
        // Placeholder for custom geometry
        console.log("Custom trunk shape selected; not yet implemented.");
        this.trunkGeometry = undefined;
        break;

      default:
        console.error(`Unknown trunk shape: ${this.treeParams.trunkParams.trunkShape}`);
        this.trunkGeometry = undefined;
        break;
    }
  }

  /**
   * Sets up the trunk of the tree by creating the geometry and applying a material.
   * Adds the created trunk mesh to the internal group of the entity.
   */
  private setupTrunk(): void {
    this.initializeTrunkGeometry(); // Initialize the trunk geometry

    // Check if trunkGeometry is defined before creating the mesh
    if (this.trunkGeometry) {
      // Create the trunk material using the MaterialFactory and the provided trunkMaterialParams
      const trunkMaterial = this.materialFactory.createTrunkMaterial(this.treeParams.trunkMaterialParams);

      // Create the trunk mesh with the geometry and material
      const trunkMesh = new THREE.Mesh(this.trunkGeometry, trunkMaterial);

      // Add the trunk mesh to the group
      this.group.add(trunkMesh);
      console.log("Trunk successfully created and added to the group.");
    } else {
      console.error("Failed to create trunk mesh. Trunk geometry is undefined.");
    }
  }

  // Override getObject3D to return the group
  public getObject3D(): THREE.Group {
    return this.group;
  }

  // Override the update method to add custom behavior for GLTFEntity, if needed
  public update(delta: number): void {
    super.update(delta); // Call ComplexEntity's update method to maintain base functionality
  }
}
