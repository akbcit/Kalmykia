import { Camera } from '../parentClasses/Camera'; // Your custom Camera class
import { Renderer } from '../parentClasses/Renderer';
import { EventListenerConfig } from '../../types/eventListeners/EventListenerConfig';
import * as THREE from "three";

// Function to create a resize event listener configuration
export const createResizeListener = (threeCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera, renderer: Renderer): EventListenerConfig => {
    const resizeHandler = () => {
        if (threeCamera instanceof THREE.PerspectiveCamera) {
            threeCamera.aspect = window.innerWidth / window.innerHeight;
            threeCamera.updateProjectionMatrix();
        } else if (threeCamera instanceof THREE.OrthographicCamera) {
            const aspect = window.innerWidth / window.innerHeight;
            const viewSize = 10;
            threeCamera.left = -aspect * viewSize / 2;
            threeCamera.right = aspect * viewSize / 2;
            threeCamera.top = viewSize / 2;
            threeCamera.bottom = -viewSize / 2;
            threeCamera.updateProjectionMatrix();
        }

        renderer.getRenderer().setSize(window.innerWidth, window.innerHeight);
    };

    return {
        target: window,
        type: 'resize',
        listener: resizeHandler,
        id: 'resizeListener', // Optional: Assign a unique ID
    };
};
