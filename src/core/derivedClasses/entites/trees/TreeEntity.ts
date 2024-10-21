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
    const { trunkTopRadius, trunkBaseRadius, trunkHeight, trunkMaterial } = this.treeParams.trunkParams;

    // Create points for the trunk profile
    const trunkProfilePoints = [];
    const segments = 10; // Define how many segments to create along the trunk height
    for (let i = 0; i <= segments; i++) {
        const relativeHeight = i / segments;
        const radius = THREE.MathUtils.lerp(trunkBaseRadius, trunkTopRadius, relativeHeight) 
            * (1 + 0.2 * Math.sin(3 * Math.PI * relativeHeight)); // Add waviness effect
        trunkProfilePoints.push(new THREE.Vector2(radius, relativeHeight * trunkHeight));
    }

    // Use LatheGeometry to revolve the points around the Y-axis
    const radialSegments = 48;
    const trunkGeometry = new THREE.LatheGeometry(trunkProfilePoints, radialSegments);

    // Custom UV Mapping for `LatheGeometry`
    const uvs = trunkGeometry.attributes.uv;
    for (let i = 0; i < uvs.count; i++) {
        const uv = new THREE.Vector2().fromArray(uvs.array, i * 2);
        if (uv.x > 0.98) {
            uv.x = 1.0; // Force alignment to the end for seamless wrap
        }
        if (uv.x < 0.02) {
            uv.x = 0.0;
        }
        uvs.setXY(i, uv.x, uv.y);
    }
    uvs.needsUpdate = true;

    // Use MeshStandardMaterial for the trunk
    const textureMaterial = trunkMaterial as THREE.MeshStandardMaterial;
    if (textureMaterial.map) {
        textureMaterial.map.wrapS = THREE.RepeatWrapping;
        textureMaterial.map.wrapT = THREE.RepeatWrapping;
        textureMaterial.map.anisotropy = 16;
        textureMaterial.map.needsUpdate = true;
    }
    textureMaterial.transparent = false;
    textureMaterial.depthTest = true;
    textureMaterial.depthWrite = true;

    // Create the trunk mesh
    const trunkMesh = new THREE.Mesh(trunkGeometry, textureMaterial);
    this.group.add(trunkMesh);
}
  /**
   * Create and add branches with their specific material.
   */

  // Override getObject3D to return the entire tree group
  public getObject3D(): THREE.Group {
    return this.group;
  }

  // Update method to modify the tree (e.g., for animation or material switching)
  public update(delta: number): void {
    super.update(delta);
  }


}
