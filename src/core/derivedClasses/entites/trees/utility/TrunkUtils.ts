
import * as THREE from "three";

/**
 * Adjusts UVs to make the texture more realistic on the trunk.
 */
export function fixTrunkUVs(geometry: THREE.CylinderGeometry): void {
    const uvs = geometry.getAttribute('uv');

    for (let i = 0; i < uvs.count; i++) {
        const u = uvs.getX(i);
        const v = uvs.getY(i);

        // Adjust UVs slightly to reduce stretching
        uvs.setXY(i, u * 1, v * 1); // Change multiplier values if the texture looks stretched
    }

    // Update UV mapping
    uvs.needsUpdate = true;
}
