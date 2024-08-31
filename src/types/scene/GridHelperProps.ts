import * as THREE from 'three';

export interface GridHelperProps {
    size?: number; // Size of the grid
    divisions?: number; // Number of divisions in the grid
    colorCenterLine?: THREE.Color | string | number; // Color of the center line
    colorGrid?: THREE.Color | string | number; // Color of the grid lines
}