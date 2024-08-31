Kalmykia Game Engine
====================

Kalmykia is a lightweight and modular game engine built with Three.js and TypeScript. This project aims to provide developers, especially those new to game development, with a solid foundation for creating 3D games and environments directly in the browser using WebGL.

Purpose
-------

The primary goal of Kalmykia is to maximize the use of WebGL in the browser, offering tools to easily set up and manipulate 3D scenes, objects, lighting, and physics. This engine is designed to be user-friendly for developers with JavaScript experience but new to Three.js and game development, providing clear abstractions and utilities for common tasks.

Project Structure
-----------------

-   **src/core**: Contains the main classes like `Kalmykia`, `Scene`, `Renderer`, and `Camera`.
-   **src/utils**: Utility functions for setting up various aspects of the engine, such as scenes, cameras, lighting, etc.
-   **src/types**: TypeScript definitions for various props, including `SceneProps`, `CameraProps`, and `ScreenProps`, ensuring strong typing across the engine.
-   **src/entities**: Entity classes that define interactive objects within the 3D environment.

Getting Started
---------------

To get started with the Kalmykia game engine, clone the repository and install the dependencies:

bash

Copy code

`git clone https://github.com/your-username/kalmykia.git
cd kalmykia
npm install`

To run the development server:

bash

Copy code

`npm start`

Timeline
--------

### Weekend 1: Setup and Familiarization

-   **Set up the development environment**: Ensure all necessary dependencies are installed and the project runs without errors.
-   **Familiarize with Three.js basics**: Go through Three.js documentation to understand key concepts like scenes, cameras, and renderers.
-   **Explore the existing codebase**: Review the structure of Kalmykia, focusing on core classes (`Scene`, `Renderer`, `Camera`).

### Weekend 2: Basic Engine Features

-   **Implement basic scene features**: Work on adding background textures, grid helpers, and basic lighting.
-   **Add object manipulation**: Develop methods to add, remove, and update objects in the scene.
-   **Set up event listeners**: Integrate resize and other necessary event listeners to keep the engine responsive.

### Weekend 3: Advanced Features and Customization

-   **Lighting and Environment Maps**: Explore and implement different lighting options and environment maps for reflections.
-   **Camera Controls**: Add camera controls (e.g., orbit, first-person view) to navigate the scene.
-   **Post-processing effects**: Implement basic post-processing effects like bloom or vignette.

### Weekend 4: Testing and Optimization

-   **Performance tuning**: Optimize the engine for better performance, including handling large scenes and complex objects.
-   **Testing**: Thoroughly test all functionalities and ensure compatibility across different browsers.
-   **Documentation and Cleanup**: Document code, write a usage guide, and clean up any redundant or poorly structured code.

Contributions
-------------

Contributions are welcome! If you have ideas for features, optimizations, or bug fixes, feel free to submit a pull request.

License
-------

This project is licensed under the MIT License - see the <LICENSE> file for details.