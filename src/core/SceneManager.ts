// src/core/SceneManager.ts
import { SceneProps } from "../types/scene/SceneProps";
import { Scene } from "./parentClasses/Scene";

export class SceneManager {
    private scenes: Map<string, Scene> = new Map();
    private currentScene: Scene | null = null;

    // Adds a scene to the manager
    public addScene(name: string, scene: Scene): void {
        this.scenes.set(name, scene);
    }

    // Creates and adds a new scene using SceneProps
    public createScene(name: string, props?: SceneProps): void {
        const scene = new Scene(props);  // Creates a new Scene instance using the provided SceneProps
        this.addScene(name, scene);  // Adds the new scene to the SceneManager
    }

    // Switches to a new scene by name
    public switchScene(name: string): void {
        if (this.currentScene) {
            this.currentScene.dispose(); // Clean up the current scene
        }
        const newScene = this.scenes.get(name);
        if (newScene) {
            this.currentScene = newScene;
            this.currentScene.init(); // Initialize the new scene
        } else {
            console.error(`Scene '${name}' not found!`);
        }
    }

    // Returns the current active scene
    public getCurrentScene(): Scene | null {
        return this.currentScene;
    }
}
