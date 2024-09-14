// Creating a pan listener config for arrow keys
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EventListenerConfig } from '../../types/eventListeners/EventListenerConfig';

export const createPanKeyListener = (controls: OrbitControls, panSpeed: number = 0.5): EventListenerConfig<KeyboardEvent> => {
    const panHandler = (event: KeyboardEvent) => {
        console.log(event);
        switch (event.key) {
            case 'ArrowUp':
                controls.target.z -= panSpeed;
                break;
            case 'ArrowDown':
                controls.target.z += panSpeed;
                break;
            case 'ArrowLeft':
                controls.target.x -= panSpeed;
                break;
            case 'ArrowRight':
                controls.target.x += panSpeed;
                break;
            default:
                return; // Ignore other keys
        }
        controls.update(); // Reflect the changes in the controls
    };

    return {
        target: window,
        type: 'keydown',  // Now type-safe
        listener: panHandler,
        id: 'panKeyListener',  // Optional ID for management
    };
};
