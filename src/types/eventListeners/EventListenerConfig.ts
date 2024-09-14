// src/types/eventListeners/EventListenerConfig.ts
export type EventListenerConfig<E extends Event = Event> = {
    target: HTMLElement | Window | Document;  // Target element for the event listener
    type: 'resize' | 'click' | 'keydown' | 'keyup' | 'keypress' | 'mousemove' | 'mousedown' | 'mouseup'; // Specific event types
    listener: (event: E) => void;  // Event listener callback function, refined to handle specific event types
    id?: string;  // Optional identifier for easier management
};
