// src/utils/entityUtils.ts
import * as THREE from 'three';
  import { Entity } from '../core/parentClasses/Entity';
import { MeshComponent } from '../core/derivedClasses/components/MeshComponent';
import { CubeGeometry } from '../core/derivedClasses/entites/geometries/primitives';
import { LightObject } from '../core/derivedClasses/entites/LightObject';
import { GameObject } from '../core/derivedClasses/entites/GameObject';
  
export function createMeshGameObject(
  position: THREE.Vector3,
  material: THREE.Material,
  geometry: THREE.BufferGeometry = new THREE.BoxGeometry(1, 1, 1) // Default to a basic cube geometry
): GameObject {
  const meshComponent = new MeshComponent(geometry, material);
  meshComponent.getMesh().position.copy(position);

  // Create a GameObject and add the MeshComponent
  const gameObject = new GameObject(meshComponent.getMesh()); // Pass the mesh directly to GameObject
  gameObject.addComponent(meshComponent);

  return gameObject;
}

export function createMeshEntity(
    position: THREE.Vector3,
    material: THREE.Material,
    geometry: THREE.BufferGeometry = new THREE.BoxGeometry(1, 1, 1) // Default to a basic cube geometry
  ): Entity {
    const meshComponent = new MeshComponent(geometry, material);
    meshComponent.getMesh().position.copy(position);
  
    const entity = new Entity();
    entity.addComponent(meshComponent);
  
    return entity;
  }
  
export function createDirectionalLight(position: THREE.Vector3, intensity: number): LightObject {
    const light = new THREE.DirectionalLight(0xffffff, intensity);
    light.position.copy(position);
    return new LightObject(light);
}

export function createAmbientLight(intensity: number): LightObject {
    const light = new THREE.AmbientLight(0x404040, intensity);
    return new LightObject(light);
}
