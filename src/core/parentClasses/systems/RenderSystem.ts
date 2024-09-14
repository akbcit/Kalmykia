// src/core/systems/RenderSystem.ts
import { Entity } from "../Entity";
import { PositionComponent } from "../../derivedClasses/components/PositionComponent";
import { MeshComponent } from "../../derivedClasses/components/MeshComponent";
import { LightComponent } from "../../derivedClasses/components/LightComponent"; // Import LightComponent
import { Renderer } from "../Renderer";
import { Scene } from "../Scene";
import * as THREE from "three";

export class RenderSystem {
    private renderer: Renderer; // The renderer used to draw the scene
    private scene: Scene; // The Three.js scene where objects are added
    private camera: THREE.Camera; // The camera through which the scene is viewed

    constructor(renderer: Renderer, scene: Scene, camera: THREE.Camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
    }

    // Method to expose the scene to subclasses
    protected getScene(): Scene {
        return this.scene;
    }

    // The update method, called every frame to update and render entities
    public update(entities: Entity[], delta: number): void {
        entities.forEach(entity => {
            // Retrieve PositionComponent and MeshComponent from the entity
            const position = entity.getComponent(PositionComponent);
            const meshComponent = entity.getComponent(MeshComponent);
    
            // Check for PositionComponent and MeshComponent to update mesh position and rotation
            if (position instanceof PositionComponent && meshComponent instanceof MeshComponent) {
                // Update mesh position based on PositionComponent
                meshComponent.mesh.position.set(position.x, position.y, position.z);

                // Optional: Apply rotation or other transformations
                meshComponent.mesh.rotation.y += delta * 0.1; // Example rotation logic

                // Add mesh to the scene if not already present
                if (!this.scene.getScene().children.includes(meshComponent.mesh)) {
                     this.scene.getScene().add(meshComponent.mesh);
                }
            }

            // Retrieve LightComponent from the entity
            const lightComponent = entity.getComponent(LightComponent);

            // Check for LightComponent and add light to the scene if necessary
            if (lightComponent instanceof LightComponent) {
                // Add light to the scene if not already present
                if (!this.scene.getScene().children.includes(lightComponent.light)) {
                     this.scene.getScene().add(lightComponent.light);
                }
            }
        });

        // Render the updated scene with the camera
        this.renderer.getRenderer().render(this.scene.getScene(), this.camera);
    }

    // Method to remove a mesh associated with an entity from the scene
    public removeEntityMesh(entity: Entity): void {
        const meshComponent = entity.getComponent(MeshComponent);
        if (meshComponent) {
             this.scene.getScene().remove(meshComponent.mesh);
        }
    }

    // Method to remove a light associated with an entity from the scene
    public removeEntityLight(entity: Entity): void {
        const lightComponent = entity.getComponent(LightComponent);
        if (lightComponent) {
            console.log('Removing light from scene:', lightComponent.light); // Debug log
            this.scene.getScene().remove(lightComponent.light);
        }
    }
}
