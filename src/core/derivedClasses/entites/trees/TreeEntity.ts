import * as THREE from "three";
import { ComplexEntity } from "../../../parentClasses/ComplexEntity";
import { TreeParams } from "./types/TreeParams";

export class TreeEntity extends ComplexEntity {
  private treeParams: TreeParams;
  private group: THREE.Group = new THREE.Group();  // Group to hold the tree parts

  constructor(treeParams: TreeParams) {
    super();
    this.treeParams = treeParams;
    this.setupTree();  // Setup the tree with trunk, branches, and leaves
  }

  /**
   * Sets up the entire tree, including trunk, branches, and leaves.
   */
  private setupTree(): void {
    this.createTrunk();   // Initialize trunk with its material
   }

  /**
   * Create and add the trunk with its material.
   */
  private createTrunk(): void {
    const { trunkTopRadius, trunkBaseRadius, trunkHeight, trunkSegments, trunkMaterial } = this.treeParams.trunkParams;

    console.log(trunkMaterial)
    const trunkGeometry = new THREE.CylinderGeometry(trunkTopRadius, trunkBaseRadius, trunkHeight, trunkSegments);
    
    // Ensure the material updates correctly
    trunkMaterial.needsUpdate = true;

    const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunkMesh.position.y = trunkHeight / 2;  // Align base with y = 0
    this.group.add(trunkMesh);
  }

  /**
   * Create and add branches with their specific material.
   */
  private createBranches(): void {
    const { branchMaterialProperties, branchLevels, branchBaseRadius, branchTopRadius } = this.treeParams.branchParams;

    const branchGeometry = new THREE.CylinderGeometry(branchTopRadius, branchBaseRadius, 10, 8);
    const branchMaterial = new THREE.MeshStandardMaterial(branchMaterialProperties);

    // Update the material to reflect changes
    branchMaterial.needsUpdate = true;

    for (let i = 0; i < branchLevels; i++) {
      const branchMesh = new THREE.Mesh(branchGeometry, branchMaterial);
      branchMesh.position.y = 15 + i * 10; // Offset each branch
      branchMesh.rotation.z = i * 0.3;     // Rotate slightly for natural look
      this.group.add(branchMesh);
    }
  }

  /**
   * Create leaves with their material and add them to the tree.
   */
  private createLeaves(): void {
    const { leafDensity, leafSize, leafMaterialProperties } = this.treeParams.leafParams;

    const leafGeometry = new THREE.SphereGeometry(leafSize, 8, 8);
    const leafMaterial = new THREE.MeshBasicMaterial(leafMaterialProperties);

    // Ensure the material gets recompiled
    leafMaterial.needsUpdate = true;

    for (let i = 0; i < leafDensity; i++) {
      const leafMesh = new THREE.Mesh(leafGeometry, leafMaterial);
      leafMesh.position.set(
        Math.random() * 5 - 2.5,
        Math.random() * 20 + 10,
        Math.random() * 5 - 2.5
      );
      this.group.add(leafMesh);
    }
  }

  // Override getObject3D to return the entire tree group
  public getObject3D(): THREE.Group {
    return this.group;
  }

  // Update method to modify the tree (e.g., for animation or material switching)
  public update(delta: number): void {
    super.update(delta);
  }

  /**
   * Switch material for debugging purposes.
   * This function demonstrates material switching dynamically.
   */
  public switchMaterial(newMaterial: THREE.Material): void {
    this.group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = newMaterial;
        newMaterial.needsUpdate = true; // Notify WebGL to recompile the shader
      }
    });
  }
}
