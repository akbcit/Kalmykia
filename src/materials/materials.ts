// src/materials.ts
import * as THREE from 'three';

export const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
export const standardMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.1, metalness: 0.9 });
export const phongMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 150, specular: 0xaaaaaa, reflectivity: 1 });
export const toonMaterial = new THREE.MeshToonMaterial({ color: 0xffff00 });
export const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
