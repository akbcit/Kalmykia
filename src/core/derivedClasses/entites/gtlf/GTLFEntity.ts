import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ComplexEntity } from "../../../parentClasses/ComplexEntity"; // Use ComplexEntity instead of Entity

export class GLTFEntity extends ComplexEntity {
    private loader: GLTFLoader;
    private modelUrl: string;
    private modelLoaded: boolean;
    private initialPosition: THREE.Vector3;
    private initialScale: THREE.Vector3;
    private group: THREE.Group; // Use Group to ensure compatibility

    constructor(
        modelUrl: string,
        position: THREE.Vector3 = new THREE.Vector3(),
        scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1)
    ) {
        super();
        this.loader = new GLTFLoader();
        this.modelUrl = modelUrl;
        this.modelLoaded = false;

        // Save initial transformations to apply after the model is loaded
        this.initialPosition = position.clone();
        this.initialScale = scale.clone();

        // Initialize the group
        this.group = new THREE.Group();
        this.group.position.copy(this.initialPosition);
        this.group.scale.set(this.initialScale.x, this.initialScale.y, this.initialScale.z);

        // Load the GLTF model when the entity is created
        this.loadModel();
    }

    // Method to load a GLTF model and add it to the Group
    private loadModel(): void {
        this.loader.load(
            this.modelUrl,
            (gltf) => {
                const model = gltf.scene;

                // Apply initial transformations to the loaded model
                model.position.set(0, 0, 0); // Reset to zero to avoid offset issues
                model.scale.set(1, 1, 1);

                // Add the GLTF model to the group
                this.group.add(model);

                this.modelLoaded = true;
                console.log(`GLTF Model successfully loaded: ${this.modelUrl} for ComplexEntity ${this.getId()}`);
            },
            (xhr) => {
                console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
            },
            (error) => {
                console.error(`Failed to load GLTF model: ${error}`);
            }
        );
    }

    // Override getObject3D to return the group
    public getObject3D(): THREE.Group {
        return this.group;
    }

    // Override the update method to add custom behavior for GLTFEntity, if needed
    public update(delta: number): void {
        if (this.modelLoaded) {
            // Perform any GLTF-specific updates here, such as animations or transformations
        }
        super.update(delta); // Call ComplexEntity's update method to maintain base functionality
    }
}
