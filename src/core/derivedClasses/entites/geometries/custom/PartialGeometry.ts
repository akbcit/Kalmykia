import * as THREE from 'three';

export interface PartialGeometryParams {
  center: [number, number]; // Tuple representing the XZ coordinates
  radius: number;           // Radius to include vertices
}

export class PartialGeometry extends THREE.BufferGeometry {
  constructor(originalGeometry: THREE.BufferGeometry, params: PartialGeometryParams) {
    super();

    const {
      center,
      radius,
    } = params;

    // Convert the tuple to a THREE.Vector3 with Y = 0
    const center3D = new THREE.Vector3(center[0], 0, center[1]);

    // Clip the geometry based on radius
    let clippedGeometry = this.clipGeometry(
      originalGeometry,
      center3D,
      radius,
    );

    // Apply smoothing to the edge vertices
    clippedGeometry = this.smoothEdgeVertices(clippedGeometry, center3D, radius);

    // Copy the resulting geometry into this instance
    this.copy(clippedGeometry);
  }

  private clipGeometry(
    originalGeometry: THREE.BufferGeometry,
    center: THREE.Vector3,
    radius: number,
  ): THREE.BufferGeometry {
    const geom = originalGeometry.clone();
    const { position, uv, index } = this.extractAttributes(geom);

    const { newPositions, newIndices, newUVs, vertexMap } = this.processVertices(
      position, uv, center, radius
    );

    if (newPositions.length === 0) {
      console.warn('No vertices found within the specified region. Returning an empty geometry.');
      return new THREE.BufferGeometry();
    }

    this.addTrianglesToBuffers(index, vertexMap, newIndices);
    return this.createGeometryFromBuffers(newPositions, newIndices, newUVs);
  }

  private extractAttributes(geom: THREE.BufferGeometry) {
    const position = geom.attributes.position as THREE.BufferAttribute;
    const uv = geom.attributes.uv as THREE.BufferAttribute | undefined;
    const index = geom.index;

    return { position, uv, index };
  }

  private processVertices(
    position: THREE.BufferAttribute,
    uv: THREE.BufferAttribute | undefined,
    center: THREE.Vector3,
    radius: number,
  ) {
    const newPositions: number[] = [];
    const newIndices: number[] = [];
    const newUVs: number[] = [];
    const vertexMap: Map<number, number> = new Map();

    let newIndex = 0;

    for (let i = 0; i < position.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(position, i);
      const distanceXZ = new THREE.Vector2(vertex.x, vertex.z).distanceTo(
        new THREE.Vector2(center.x, center.z)
      );

      // Only keep vertices within the specified radius
      if (distanceXZ <= radius) {
        newPositions.push(vertex.x, vertex.y, vertex.z);

        if (uv) {
          const u = uv.getX(i);
          const v = uv.getY(i);
          newUVs.push(u, v);
        }

        vertexMap.set(i, newIndex++);
      }
    }

    return { newPositions, newIndices, newUVs, vertexMap };
  }

  private createGeometryFromBuffers(
    newPositions: number[],
    newIndices: number[],
    newUVs: number[]
  ): THREE.BufferGeometry {
    const newGeometry = new THREE.BufferGeometry();
    newGeometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));

    if (newUVs.length > 0) {
      newGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));
    }

    newGeometry.setIndex(newIndices);
    newGeometry.computeVertexNormals(); // Recompute normals for smooth shading

    return newGeometry;
  }

  private smoothEdgeVertices(
    geometry: THREE.BufferGeometry,
    center: THREE.Vector3,
    radius: number,
    smoothFactor: number = 0.3 // Adjust as needed to control how much the edges are rounded
  ): THREE.BufferGeometry {
    const positions = geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(positions, i);
      const distanceXZ = new THREE.Vector2(vertex.x, vertex.z).distanceTo(
        new THREE.Vector2(center.x, center.z)
      );

      // If the vertex is near the edge, smooth it by pulling it inward
      if (distanceXZ >= radius - smoothFactor && distanceXZ <= radius) {
        const direction = new THREE.Vector3(vertex.x - center.x, 0, vertex.z - center.z).normalize();
        vertex.sub(direction.multiplyScalar(smoothFactor));
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals(); // Recompute normals for smooth shading
    return geometry;
  }

  // Helper: Add triangles to buffers based on indices
  private addTrianglesToBuffers(
    index: THREE.BufferAttribute | null,
    vertexMap: Map<number, number>,
    newIndices: number[]
  ): void {
    if (index) {
      for (let i = 0; i < index.count; i += 3) {
        const a = index.getX(i);
        const b = index.getX(i + 1);
        const c = index.getX(i + 2);

        if (vertexMap.has(a) && vertexMap.has(b) && vertexMap.has(c)) {
          newIndices.push(vertexMap.get(a)!, vertexMap.get(b)!, vertexMap.get(c)!);
        }
      }
    }
  }
}
