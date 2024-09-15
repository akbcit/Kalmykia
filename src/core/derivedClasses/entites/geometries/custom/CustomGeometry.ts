import * as THREE from 'three';

interface CustomGeometryParams {
  vertices: Float32Array;    // Custom vertex positions
  indices?: Uint16Array;     // Optional indices for defining faces
  normals?: Float32Array;    // Optional normals for lighting calculations
  uvs?: Float32Array;        // Optional UV coordinates for textures
  colors?: Float32Array;     // Optional vertex colors
}

export class CustomGeometry extends THREE.BufferGeometry {
  constructor(params: CustomGeometryParams) {
    super();
    this.setupCustomGeometry(params);
  }

  private setupCustomGeometry({ vertices, indices, normals, uvs, colors }: CustomGeometryParams) {
    // Set position attribute from provided vertices
    this.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    // Set optional indices for defining custom faces
    if (indices) {
      this.setIndex(new THREE.BufferAttribute(indices, 1));
    } else {
      // If no indices are provided, generate a simple sequential index array
      this.setIndex(this.generateDefaultIndices(vertices.length / 3));
    }

    // Optionally set normals
    if (normals) {
      this.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    } else {
      this.computeVertexNormals();  // Automatically compute normals if not provided
    }

    // Optionally set UV coordinates
    if (uvs) {
      this.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    }

    // Optionally set vertex colors
    if (colors) {
      this.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }

    // Compute bounding volumes for better performance in rendering
    this.computeBoundingBox();
    this.computeBoundingSphere();
  }

  // Generate default indices if none are provided (assumes triangles)
  private generateDefaultIndices(vertexCount: number): THREE.BufferAttribute {
    const indices = [];
    for (let i = 0; i < vertexCount; i += 3) {
      indices.push(i, i + 1, i + 2);  // Create triangles sequentially
    }
    return new THREE.BufferAttribute(new Uint16Array(indices), 1);
  }

  // Method for applying transformations (scaling, rotating, etc.)
  applyTransformation(matrix: THREE.Matrix4) {
    this.applyMatrix4(matrix);
  }

  // Utility to log details about the custom geometry
  logDetails() {
    console.log('Custom Geometry Details:', this);
  }
}
