// src/core/KalmykiaBuilder.ts
import * as THREE from 'three';
import { Kalmykia, Scene } from './'; // Ensure correct import paths
import { CameraProps, CameraType } from '../types/camera/CameraProps';
import { createResizeListener } from './eventListeners/resizeListener';
import { createPanKeyListener } from './eventListeners/panKeyListener';
import { RenderSystem } from './parentClasses/systems/RenderSystem';
import { Terrain, TerrainParams } from './derivedClasses/entites/Terrain';
import { LightObject } from './derivedClasses/entites/LightObject';
import { createAmbientLight, createDirectionalLight } from '../utils/entityUtils';
import { Entity } from './parentClasses/Entity';
import { GameObject } from './derivedClasses/entites/GameObject';

export class KalmykiaBuilder {
    private engine: Kalmykia;
    private scene: Scene | null = null;

    constructor(container: HTMLElement) {
        // Initialize the Kalmykia engine without setting up a camera or scene initially
        this.engine = new Kalmykia(container, {
            screen: {
                width: window.innerWidth,
                height: window.innerHeight,
                antialias: true,
                pixelRatio: window.devicePixelRatio,
            },
        });
    }

    setCamera(config: CameraProps): KalmykiaBuilder {
        this.engine.getCameraInstance().update(config);
        return this;
    }

    addScene(name: string, backgroundColor = '#333', axesHelperSize = 5): KalmykiaBuilder {
        const scene = new Scene({ backgroundColor, axesHelper: { size: axesHelperSize } });
        this.engine.addScene(name, scene);
        this.engine.switchScene(name);
        this.scene = scene;
        return this;
    }

    addResizeListener(): KalmykiaBuilder {
        if (this.scene) {
            const resizeListenerConfig = createResizeListener(
                this.engine.getCameraInstance().getCamera(),
                this.engine.getRenderer()
            );
            this.engine.addEventListener(resizeListenerConfig);
        }
        return this;
    }

    addPanKeyListener(): KalmykiaBuilder {
        const controls = this.engine.getCameraInstance().getControls();
        if (controls) {
            const panKeyListenerConfig = createPanKeyListener(controls);
            this.engine.addEventListener(panKeyListenerConfig);
        }
        return this;
    }

    addRenderSystem(): KalmykiaBuilder {
        if (this.scene) {
            const renderSystem = new RenderSystem(
                this.engine.getRenderer(),
                this.scene,
                this.engine.getCameraInstance().getCamera()
            );
            this.engine.addSystem(renderSystem);
        }
        return this;
    }

    addEntity(entity: Entity): KalmykiaBuilder {
        if (this.scene) {
            this.scene.addEntity(entity);
        }
        return this;
    }

    addGameObject(mesh: THREE.Mesh): KalmykiaBuilder {
        if (this.scene) {
            const gameObject = new GameObject(mesh);
            this.scene.addEntity(gameObject);
        }
        return this;
    }

    addTerrain(terrain: Terrain): KalmykiaBuilder {
        if (this.scene) {
            this.scene.addEntity(terrain);
        }
        return this;
    }

    addLight(light: LightObject): KalmykiaBuilder {
        if (this.scene) {
            this.scene.addEntity(light);
        }
        return this;
    }

    addDirectionalLight(position: THREE.Vector3, intensity: number): KalmykiaBuilder {
        const directionalLight = createDirectionalLight(position, intensity);
        return this.addLight(directionalLight);
    }

    addAmbientLight(intensity: number): KalmykiaBuilder {
        const ambientLight = createAmbientLight(intensity);
        return this.addLight(ambientLight);
    }

    registerUpdateCallback(callback: (delta: number) => void): KalmykiaBuilder {
        if (this.scene) {
            this.scene.registerUpdateCallback(callback);
        }
        return this;
    }

    // New method to return the engine instance
    build(): Kalmykia {
        return this.engine;
    }
}
