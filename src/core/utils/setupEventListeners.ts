// src/utils/setupEventListeners.ts
import * as THREE from "three";

export function setupEventListeners(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
