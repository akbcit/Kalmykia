import * as THREE from 'three';

export interface FogProps {
  color: THREE.Color | string | number;
  near: number;
  far: number;
  density?: number; // Optional for exponential fog
  type?: 'linear' | 'exponential'; // Choose fog type
}