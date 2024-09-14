// src/systems/TerrainSystem.ts
import * as THREE from "three";
import { RenderSystem } from "./RenderSystem";
import { Entity } from "../Entity";
import { Scene } from "../Scene";
import { Renderer } from "../Renderer";
import { MeshComponent } from "../../derivedClasses/components/MeshComponent";
import { PositionComponent } from "../../derivedClasses/components/PositionComponent";
import { createNoise2D } from "simplex-noise"; // Correctly importing noise function

export class TerrainSystem extends RenderSystem {
    private noise2D: (x: number, y: number) => number;
    private terrainEntity: Entity;

    constructor(renderer: Renderer, scene: Scene, camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) {
        super(renderer, scene, camera);
        this.noise2D = createNoise2D(Math.random); // Initialize noise with a random seed
        this.terrainEntity = this.createTerrainEntity();
        this.addEntityToScene(this.terrainEntity); // Add the terrain entity to the scene
    }

    // Creates an entity with a terrain mesh component
    private createTerrainEntity(): Entity {
        const geometry = new THREE.PlaneGeometry(100, 100, 256, 256); // Terrain size and resolution
        geometry.rotateX(-Math.PI / 2); // Rotate to make the terrain horizontal

        // Modify vertices to create fractal terrain using Simplex Noise
        const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const z = positionAttribute.getZ(i);
            const height = this.noise2D(x / 10, z / 10); // Adjust scale for detail
            positionAttribute.setY(i, height * 10); // Set the new height
        }

        positionAttribute.needsUpdate = true; // Flag to update the vertex positions
        geometry.computeVertexNormals(); // Recalculate normals for proper lighting

        const material = new THREE.MeshStandardMaterial({ color: 0x88cc88, wireframe: false });
        const terrainMesh = new THREE.Mesh(geometry, material);

        const meshComponent = new MeshComponent(geometry, material);
        const positionComponent = new PositionComponent(0, 0, 0); // Adjust if terrain position needs to change

        // Create and return the entity with relevant components
        const terrainEntity = new Entity();
        terrainEntity.addComponent(meshComponent);
        terrainEntity.addComponent(positionComponent); // Optional, based on your ECS needs

        return terrainEntity;
    }

    // Adds an entity with a mesh component to the scene
    private addEntityToScene(entity: Entity): void {
        const meshComponent = entity.getComponent(MeshComponent);
        if (meshComponent instanceof MeshComponent) {
            this.getScene().getScene().add(meshComponent.mesh);
        }
    }

    // Update method to handle dynamic terrain updates, if needed
    public update(entities: Entity[], delta: number): void {
        super.update(entities, delta);
        // Optionally add logic to dynamically alter terrain, animate, or handle interaction
    }
}
