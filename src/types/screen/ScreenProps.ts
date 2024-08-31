export interface ScreenProps {
    /**
     * Sets the width of the rendering screen or canvas.
     */
    width?: number;
  
    /**
     * Sets the height of the rendering screen or canvas.
     */
    height?: number;
  
    /**
     * Defines whether the screen should be displayed in fullscreen mode.
     */
    fullscreen?: boolean;
  
    /**
     * Sets the pixel ratio, useful for high-DPI screens.
     * Commonly set to `window.devicePixelRatio`.
     */
    pixelRatio?: number;
  
    /**
     * Enables or disables antialiasing for smoother visuals.
     */
    antialias?: boolean;
  
    /**
     * Configures the screen's refresh rate or frame rate cap.
     */
    maxFrameRate?: number;
  }
  