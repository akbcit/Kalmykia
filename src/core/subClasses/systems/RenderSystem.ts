// src/core/systems/RenderSystem.ts
import { Entity } from "../Entity";
import { PositionComponent } from "../components/PositionComponent";
import { MeshComponent } from "../components/MeshComponent";
import { Renderer } from "../Renderer";
import { Scene } from "../Scene";
import * as THREE from "three";

export class RenderSystem {
    private renderer: Renderer;
    private scene: Scene;
    private camera: THREE.Camera; // Include the camera as part of the render system

    constructor(renderer: Renderer, scene: Scene, camera: THREE.Camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
    }

    // The update method, called every frame to update and render entities
    public update(entities: Entity[], delta: number): void {
        entities.forEach(entity => {
            const position = entity.getComponent(PositionComponent);
            const meshComponent = entity.getComponent(MeshComponent);

            if (position && meshComponent) {
                meshComponent.mesh.position.set(position.x, position.y, position.z);
                meshComponent.mesh.rotation.y += delta * 0.1;

                if (!this.scene.getScene().children.includes(meshComponent.mesh)) {
                    this.scene.getScene().add(meshComponent.mesh);
                }
            }
        });

        // Render the scene using the camera
        this.renderer.getRenderer().render(this.scene.getScene(), this.camera);
    }

    public removeEntityMesh(entity: Entity): void {
        const meshComponent = entity.getComponent(MeshComponent);
        if (meshComponent) {
            this.scene.getScene().remove(meshComponent.mesh);
        }
    }
}
