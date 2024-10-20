import * as THREE from "three";

export class BumpyPlane {
    protected geometry: THREE.BufferGeometry;

    constructor(width: number, height: number, widthSegments: number, heightSegments: number, bumpIntensity = 1, waveIntensity = 0.5, waveFrequency = 1) {
        this.geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);

        // Manually adjust the vertices to create the plane on the X-Z axis
        const positionAttribute = this.geometry.attributes.position;
        for (let i = 0; i < positionAttribute.count; i++) {
            const y = positionAttribute.getY(i);
            const z = positionAttribute.getZ(i);
            // Swap Y and Z coordinates
            positionAttribute.setY(i, z);
            positionAttribute.setZ(i, y);
        }
        positionAttribute.needsUpdate = true;

        this.addBumpiness(1);
        this.applyComplexSplinyWave(widthSegments, heightSegments, waveIntensity, waveFrequency);

        // Ensure bounding box is computed before updating UVs
        this.geometry.computeBoundingBox();
        this.updateUVs();
    }

    // Method to retrieve the geometry
    public getGeometry(): THREE.BufferGeometry {
        return this.geometry;
    }

    // Method to add bumpiness to the plane
    private addBumpiness(intensity: number): void {
        const positionAttribute = this.geometry.attributes.position;
        for (let i = 0; i < positionAttribute.count; i++) {
            const y = positionAttribute.getY(i);
            const randomOffset = (Math.random() - 0.5) * intensity;
            positionAttribute.setY(i, y + randomOffset);
        }
        positionAttribute.needsUpdate = true;
    }

    // Method to apply a complex spliny wave effect to the edges
    private applyComplexSplinyWave(widthSegments: number, heightSegments: number, intensity: number, frequency: number): void {
        const positionAttribute = this.geometry.attributes.position;
        const totalVertices = positionAttribute.count;
        const verticesPerRow = widthSegments + 1;

        for (let i = 0; i < totalVertices; i++) {
            const row = Math.floor(i / verticesPerRow);
            const col = i % verticesPerRow;

            // Apply complex spliny wave to edge vertices: top row, bottom row, first column, last column
            if (row === 0 || row === heightSegments || col === 0 || col === widthSegments) {
                const x = positionAttribute.getX(i);
                const z = positionAttribute.getZ(i);

                // Combine multiple wave layers for a more spliny effect
                const waveOffset = (
                    Math.sin(frequency * (x + z)) +
                    0.5 * Math.cos(frequency * 1.5 * (x - z)) +
                    0.25 * Math.sin(frequency * 2.5 * (x + 0.5 * z + Math.PI / 4))
                ) * intensity;

                // Apply the wave offset for smooth, spliny edges
                positionAttribute.setX(i, x + waveOffset);
                positionAttribute.setZ(i, z + waveOffset);
            }
        }
        positionAttribute.needsUpdate = true;
    }

    // Method to update UVs after modifying the vertices
    private updateUVs(): void {
        const positionAttribute = this.geometry.attributes.position;
        const uvAttribute = this.geometry.attributes.uv;

        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const z = positionAttribute.getZ(i);

            // Re-map UV coordinates based on X-Z plane
            const u = (x - this.geometry.boundingBox!.min.x) / (this.geometry.boundingBox!.max.x - this.geometry.boundingBox!.min.x);
            const v = (z - this.geometry.boundingBox!.min.z) / (this.geometry.boundingBox!.max.z - this.geometry.boundingBox!.min.z);

            uvAttribute.setXY(i, u, v);
        }
        uvAttribute.needsUpdate = true;
    }

    // Method to mark edge vertices (for debugging or reference)
    public markEdgeVertices(widthSegments: number, heightSegments: number): void {
        const positionAttribute = this.geometry.attributes.position;
        const totalVertices = positionAttribute.count;
        const verticesPerRow = widthSegments + 1;

        for (let i = 0; i < totalVertices; i++) {
            const row = Math.floor(i / verticesPerRow);
            const col = i % verticesPerRow;

            // Identify edges: top row, bottom row, first column, last column
            if (
                row === 0 || // top row
                row === heightSegments || // bottom row
                col === 0 || // first column
                col === widthSegments // last column
            ) {
                console.log(`Edge vertex: index ${i}, position: (${positionAttribute.getX(i)}, ${positionAttribute.getY(i)}, ${positionAttribute.getZ(i)})`);
            }
        }
    }
}
