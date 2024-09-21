import * as THREE from "three";

/**
 * Base interface for common material properties in Three.js
 */
export interface BaseMaterialOptions {
    alphaTest?: number; // Minimum alpha value before discarding a pixel (used for transparency).
    alphaToCoverage?: boolean; // Improves alpha blending by using multi-sampling.
    blendDst?: THREE.BlendingDstFactor; // Defines how the destination color is factored in blending.
    blendDstAlpha?: number; // Specifies the alpha factor for blending.
    blendEquation?: THREE.BlendingEquation; // Defines the equation used for blending (e.g., add, subtract).
    blendEquationAlpha?: number; // Equation for blending the alpha channel.
    blending?: THREE.Blending; // Type of blending to apply (e.g., normal, additive).
    blendSrc?: THREE.BlendingSrcFactor; // Defines how the source color is factored in blending.
    blendSrcAlpha?: number; // Specifies the alpha factor for the source in blending.
    clipIntersection?: boolean; // Controls whether to use AND or OR when clipping against planes.
    clippingPlanes?: THREE.Plane[]; // Set of planes to clip the geometry against.
    clipShadows?: boolean; // Whether shadows are clipped using the clipping planes.
    colorWrite?: boolean; // Enables or disables writing of the color buffer.
    defines?: any; // Custom defines for the shaders.
    depthFunc?: THREE.DepthModes; // Function that compares the depth of pixels (e.g., less, greater).
    depthTest?: boolean; // Enables testing the depth value for each pixel.
    depthWrite?: boolean; // Allows writing to the depth buffer.
    fog?: boolean; // Whether the material is affected by scene fog.
    name?: string; // Optional name for the material.
    opacity?: number; // Defines the transparency level of the material (0 is fully transparent).
    polygonOffset?: boolean; // Shifts polygons to avoid depth fighting (z-fighting).
    polygonOffsetFactor?: number; // Multiplies the depth offset for polygonOffset.
    polygonOffsetUnits?: number; // Adds constant depth offset for polygonOffset.
    precision?: "highp" | "mediump" | "lowp"; // Shader precision level for rendering.
    premultipliedAlpha?: boolean; // Multiplies RGB by alpha to improve blending.
    dithering?: boolean; // Adds dithering to reduce color banding.
    side?: THREE.Side; // Defines which side(s) of the faces will be rendered (front, back, double).
    shadowSide?: THREE.Side; // Which side should receive shadows.
    toneMapped?: boolean; // Whether the material is tone-mapped.
    transparent?: boolean; // Enables transparency if true.
    vertexColors?: boolean; // Indicates if vertex colors are used.
    visible?: boolean; // Controls the visibility of the material.
    stencilWrite?: boolean; // Enables writing to the stencil buffer.
    stencilWriteMask?: number; // Mask used when writing to the stencil buffer.
    stencilFunc?: THREE.StencilFunc; // Function for stencil comparison.
    stencilRef?: number; // Reference value for stencil testing.
    stencilFuncMask?: number; // Mask used for stencil testing.
    stencilFail?: THREE.StencilOp; // Action taken if stencil test fails.
    stencilZFail?: THREE.StencilOp; // Action taken if depth test fails.
    stencilZPass?: THREE.StencilOp; // Action taken if both tests pass.
}

/**
 * Interface for MeshBasicMaterial options
 */
export interface MeshBasicMaterialOptions extends BaseMaterialOptions {
    color?: THREE.ColorRepresentation; // Diffuse color of the material.
    combine?: THREE.Combine; // How the material color combines with the environment map.
    envMap?: THREE.Texture; // Texture used for environment mapping.
    fog?: boolean; // Determines if the material is affected by fog.
    map?: THREE.Texture; // Texture map for the surface.
    reflectivity?: number; // Degree of reflectivity for environment mapping.
    refractionRatio?: number; // Refraction index for environment mapping.
    specularMap?: THREE.Texture; // Texture map for specular highlights.
    wireframe?: boolean; // Renders the material as wireframe.
    wireframeLinewidth?: number; // Width of the wireframe lines.
}

/**
 * Interface for MeshLambertMaterial options
 */
export interface MeshLambertMaterialOptions extends BaseMaterialOptions {
    color?: THREE.ColorRepresentation; // Diffuse color of the material.
    emissive?: THREE.ColorRepresentation; // Emissive color (glow effect).
    emissiveIntensity?: number; // Intensity of emissive color.
    emissiveMap?: THREE.Texture; // Texture map for emissive color.
    map?: THREE.Texture; // Texture map for the surface.
    lightMap?: THREE.Texture; // Texture map for light intensity.
    lightMapIntensity?: number; // Scale of the light map intensity.
    aoMap?: THREE.Texture; // Texture map for ambient occlusion.
    aoMapIntensity?: number; // Intensity of ambient occlusion effect.
    specularMap?: THREE.Texture; // Texture map for specular highlights.
    wireframe?: boolean; // Renders the material as wireframe.
    wireframeLinewidth?: number; // Width of the wireframe lines.
    combine?: THREE.Combine; // How the material color combines with the environment map.
    fog?: boolean; // Determines if the material is affected by fog.
    reflectivity?: number; // Degree of reflectivity for environment mapping.
    refractionRatio?: number; // Refraction index for environment mapping.
}


/**
 * Interface for MeshPhongMaterial options
 */
export interface MeshPhongMaterialOptions extends BaseMaterialOptions {
    color?: THREE.ColorRepresentation; // Base color of the material.
    specular?: THREE.ColorRepresentation; // Color of the specular highlights.
    shininess?: number; // How shiny the material is (higher means shinier).
    emissive?: THREE.ColorRepresentation; // Emissive (glowing) color.
    emissiveIntensity?: number; // Strength of the emissive color.
    emissiveMap?: THREE.Texture; // Texture map for emissive color.
    bumpMap?: THREE.Texture; // Texture map to create a bump effect.
    bumpScale?: number; // Scale factor for bump map effect.
    normalMap?: THREE.Texture; // Texture for normal mapping (creates surface detail).
    normalMapType?: THREE.NormalMapTypes; // Type of normal map (TangentSpace or ObjectSpace).
    normalScale?: THREE.Vector2; // How much the normal map affects the surface.
    displacementMap?: THREE.Texture; // Displacement map for moving vertices based on texture.
    displacementScale?: number; // Scale factor for displacement map.
    displacementBias?: number; // Bias factor for displacement map.
    specularMap?: THREE.Texture; // Texture for controlling specular highlights.
    envMap?: THREE.Texture; // Texture for environment reflections.
    combine?: THREE.Combine; // How to combine environment map with color.
    reflectivity?: number; // Reflectivity of the material for environment mapping.
    refractionRatio?: number; // Index of refraction for environment map.
    wireframe?: boolean; // Renders the material as wireframe.
    wireframeLinewidth?: number; // Width of wireframe lines.
    flatShading?: boolean; // Whether to use flat shading (no smoothing).
    fog?: boolean; // Whether the material is affected by fog.
    lightMap?: THREE.Texture; // Texture map for light intensity.
    lightMapIntensity?: number; // Intensity of the light map.
    aoMap?: THREE.Texture; // Texture map for ambient occlusion.
    aoMapIntensity?: number; // Intensity of ambient occlusion effect.
    map?: THREE.Texture; // Texture for the surface of the material.
}

/**
 * Interface for MeshStandardMaterial options
 */
export interface MeshStandardMaterialOptions extends BaseMaterialOptions {
    color?: THREE.ColorRepresentation; // Base color of the material.
    roughness?: number; // How rough the surface is (0 = smooth, 1 = rough).
    metalness?: number; // How metallic the surface is (0 = non-metallic, 1 = fully metallic).
    map?: THREE.Texture; // Texture for the surface.
    lightMap?: THREE.Texture; // Texture map for light intensity.
    lightMapIntensity?: number; // Intensity of the light map.
    aoMap?: THREE.Texture; // Texture for ambient occlusion.
    aoMapIntensity?: number; // Intensity of ambient occlusion.
    emissive?: THREE.ColorRepresentation; // Emissive (glow) color.
    emissiveIntensity?: number; // Strength of the emissive color.
    emissiveMap?: THREE.Texture; // Texture map for emissive color.
    bumpMap?: THREE.Texture; // Texture for bump mapping.
    bumpScale?: number; // Scale factor for bump mapping.
    normalMap?: THREE.Texture; // Texture for normal mapping.
    normalMapType?: THREE.NormalMapTypes; // Type of normal map (TangentSpace or ObjectSpace).
    normalScale?: THREE.Vector2; // How much the normal map affects the surface.
    displacementMap?: THREE.Texture; // Texture for displacement mapping.
    displacementScale?: number; // Scale for displacement mapping.
    displacementBias?: number; // Bias for displacement mapping.
    roughnessMap?: THREE.Texture; // Texture map to control roughness.
    metalnessMap?: THREE.Texture; // Texture map to control metalness.
    alphaMap?: THREE.Texture; // Texture map to control transparency.
    envMap?: THREE.Texture; // Environment map for reflections.
    envMapIntensity?: number; // Intensity of environment reflections.
    wireframe?: boolean; // Renders the material as wireframe.
    wireframeLinewidth?: number; // Width of the wireframe lines.
    flatShading?: boolean; // Whether to use flat shading (no smoothing).
}

/**
 * Interface for MeshPhysicalMaterial options
 */
export interface MeshPhysicalMaterialOptions extends MeshStandardMaterialOptions {
    clearcoat?: number; // Intensity of the clearcoat layer on top of the material.
    clearcoatMap?: THREE.Texture; // Texture map for the clearcoat layer.
    clearcoatRoughness?: number; // Roughness of the clearcoat layer.
    clearcoatRoughnessMap?: THREE.Texture; // Texture map for clearcoat roughness.
    clearcoatNormalScale?: THREE.Vector2; // How much the clearcoat normal map affects the surface.
    clearcoatNormalMap?: THREE.Texture; // Normal map for the clearcoat layer.
    reflectivity?: number; // Reflectivity of the material (for environment mapping).
    ior?: number; // Index of refraction (how light bends through the material).
    sheen?: number; // Intensity of the sheen effect.
    sheenColor?: THREE.ColorRepresentation; // Color of the sheen effect.
    sheenColorMap?: THREE.Texture; // Texture map for sheen color.
    sheenRoughness?: number; // Roughness of the sheen layer.
    sheenRoughnessMap?: THREE.Texture; // Texture map for sheen roughness.
    transmission?: number; // How much light passes through the material.
    transmissionMap?: THREE.Texture; // Texture map for controlling transmission.
    thickness?: number; // Thickness of the material (used for refraction effects).
    thicknessMap?: THREE.Texture; // Texture map for controlling thickness.
    attenuationDistance?: number; // Distance over which light is attenuated (fades out).
    attenuationColor?: THREE.ColorRepresentation; // Color of light attenuation.
    specularIntensity?: number; // Intensity of the specular reflection.
    specularColor?: THREE.ColorRepresentation; // Color of the specular reflection.
    specularIntensityMap?: THREE.Texture; // Texture map for controlling specular intensity.
    specularColorMap?: THREE.Texture; // Texture map for controlling specular color.
    iridescence?: number; // Intensity of the iridescence effect (rainbow-like).
    iridescenceMap?: THREE.Texture; // Texture map for iridescence.
    iridescenceIOR?: number; // Index of refraction for iridescence.
    iridescenceThicknessRange?: [number, number]; // Range of thickness for the iridescence effect.
    iridescenceThicknessMap?: THREE.Texture; // Texture map for iridescence thickness.
}

/**
 * Interface for MeshToonMaterial options
 */
export interface MeshToonMaterialOptions extends BaseMaterialOptions {
    color?: THREE.ColorRepresentation; // Color of the material.
    map?: THREE.Texture; // Texture for the surface of the material.
    gradientMap?: THREE.Texture; // Gradient map used for shading.
    lightMap?: THREE.Texture; // Texture map for light intensity.
    lightMapIntensity?: number; // Intensity of the light map.
    aoMap?: THREE.Texture; // Texture for ambient occlusion.
    aoMapIntensity?: number; // Intensity of ambient occlusion.
    emissive?: THREE.ColorRepresentation; // Emissive (glowing) color.
    emissiveIntensity?: number; // Strength of the emissive color.
    emissiveMap?: THREE.Texture; // Texture map for emissive color.
    bumpMap?: THREE.Texture; // Texture map to create a bump effect.
    bumpScale?: number; // Scale factor for the bump map.
    normalMap?: THREE.Texture; // Texture for normal mapping.
    normalMapType?: THREE.NormalMapTypes; // Type of normal map (TangentSpace or ObjectSpace).
    normalScale?: THREE.Vector2; // How much the normal map affects the surface.
    displacementMap?: THREE.Texture; // Texture for displacement mapping.
    displacementScale?: number; // Scale for displacement mapping.
    displacementBias?: number; // Bias for displacement mapping.
    alphaMap?: THREE.Texture; // Texture map to control transparency.
    wireframe?: boolean; // Renders the material as wireframe.
    wireframeLinewidth?: number; // Width of the wireframe lines.
}

/**
 * Interface for MeshNormalMaterial options
 */
export interface MeshNormalMaterialOptions extends BaseMaterialOptions {
    bumpMap?: THREE.Texture; // Texture map to create a bump effect.
    bumpScale?: number; // Scale factor for the bump map.
    normalMap?: THREE.Texture; // Texture for normal mapping.
    normalMapType?: THREE.NormalMapTypes; // Type of normal map (TangentSpace or ObjectSpace).
    normalScale?: THREE.Vector2; // How much the normal map affects the surface.
    displacementMap?: THREE.Texture; // Texture for displacement mapping.
    displacementScale?: number; // Scale for displacement mapping.
    displacementBias?: number; // Bias for displacement mapping.
    wireframe?: boolean; // Renders the material as wireframe.
    wireframeLinewidth?: number; // Width of the wireframe lines.
    flatShading?: boolean; // Whether to use flat shading (no smoothing).
}

/**
 * Interface for MeshMatcapMaterial options
 */
export interface MeshMatcapMaterialOptions extends BaseMaterialOptions {
    color?: THREE.ColorRepresentation; // Base color of the material.
    matcap?: THREE.Texture; // Texture for Matcap (Matte Cap) shading.
    map?: THREE.Texture; // Texture for the surface of the material.
    bumpMap?: THREE.Texture; // Texture map for bump effect.
    bumpScale?: number; // Scale factor for bump effect.
    normalMap?: THREE.Texture; // Texture for normal mapping.
    normalMapType?: THREE.NormalMapTypes; // Type of normal map (TangentSpace or ObjectSpace).
    normalScale?: THREE.Vector2; // How much the normal map affects the surface.
    displacementMap?: THREE.Texture; // Texture for displacement mapping.
    displacementScale?: number; // Scale for displacement mapping.
    displacementBias?: number; // Bias for displacement mapping.
    alphaMap?: THREE.Texture; // Texture map to control transparency.
    flatShading?: boolean; // Whether to use flat shading (no smoothing).
}

/**
 * Interface for MeshDepthMaterial options
 */
export interface MeshDepthMaterialOptions extends BaseMaterialOptions {
    map?: THREE.Texture; // Texture for the surface of the material.
    alphaMap?: THREE.Texture; // Texture map to control transparency.
    depthPacking?: THREE.DepthPackingStrategies; // Controls how depth is packed into RGBA.
    displacementMap?: THREE.Texture; // Texture for displacement mapping.
    displacementScale?: number; // Scale for displacement mapping.
    displacementBias?: number; // Bias for displacement mapping.
    wireframe?: boolean; // Renders the material as wireframe.
    wireframeLinewidth?: number; // Width of the wireframe lines.
}

/**
 * Interface for MeshDistanceMaterial options
 */
export interface MeshDistanceMaterialOptions extends BaseMaterialOptions {
    map?: THREE.Texture; // Texture for the surface of the material.
    alphaMap?: THREE.Texture; // Texture map to control transparency.
    displacementMap?: THREE.Texture; // Texture for displacement mapping.
    displacementScale?: number; // Scale for displacement mapping.
    displacementBias?: number; // Bias for displacement mapping.
    farDistance?: number; // The maximum distance for the distance material.
    nearDistance?: number; // The minimum distance for the distance material.
    referencePosition?: THREE.Vector3; // The reference position for distance calculations.
}

/**
 * Interface for SpriteMaterial options
 */
export interface SpriteMaterialOptions extends BaseMaterialOptions {
    color?: THREE.ColorRepresentation; // Color of the sprite.
    map?: THREE.Texture; // Texture for the sprite's surface.
    alphaMap?: THREE.Texture; // Texture map to control transparency.
    rotation?: number; // Rotation of the sprite in radians.
    sizeAttenuation?: boolean; // Whether the sprite size decreases with distance.
}

/**
 * Interface for ShaderMaterial options
 */
export interface ShaderMaterialOptions extends BaseMaterialOptions {
    uniforms?: { [uniform: string]: THREE.IUniform }; // Custom uniforms for the shaders.
    vertexShader?: string; // GLSL code for the vertex shader.
    fragmentShader?: string; // GLSL code for the fragment shader.
    linewidth?: number; // Width of the rendered lines.
    wireframe?: boolean; // Renders the material as wireframe.
    wireframeLinewidth?: number; // Width of the wireframe lines.
    lights?: boolean; // Whether to use lights in the shader.
    clipping?: boolean; // Enables or disables clipping.
    extensions?: { // WebGL extensions for the shader.
        derivatives?: boolean; // Enables derivatives in GLSL.
        fragDepth?: boolean; // Enables gl_FragDepth in GLSL.
        drawBuffers?: boolean; // Enables multiple render targets.
        shaderTextureLOD?: boolean; // Enables texture LOD in GLSL.
        clipCullDistance?: boolean; // Enables distance-based clipping of geometry.
        multiDraw?: boolean; // Enables the ability to issue multiple draw calls in a single WebGL call.
    };
    glslVersion?: THREE.GLSLVersion; // Specifies the version of GLSL.
}

/**
 * Interface for RawShaderMaterial options
 */
export interface RawShaderMaterialOptions extends ShaderMaterialOptions {
    // RawShaderMaterial is identical to ShaderMaterial,
    // but doesn't include Three.js's built-in uniforms and attributes.
}

/**
 * Interface for PointsMaterial options
 */
export interface PointsMaterialOptions extends BaseMaterialOptions {
    color?: THREE.ColorRepresentation; // Color of the points.
    map?: THREE.Texture; // Texture for the points' surface.
    alphaMap?: THREE.Texture; // Texture map to control transparency.
    size?: number; // Size of the points.
    sizeAttenuation?: boolean; // Whether the size of the points decreases with distance.
}

/**
 * Interface for LineBasicMaterial options
 */
export interface LineBasicMaterialOptions extends BaseMaterialOptions {
    color?: THREE.ColorRepresentation; // Color of the line.
    linewidth?: number; // Width of the line.
    linecap?: string; // Style of line caps (e.g., round, square).
    linejoin?: string; // Style of line joins (e.g., bevel, round).
}

/**
 * Interface for LineDashedMaterial options
 */
export interface LineDashedMaterialOptions extends LineBasicMaterialOptions {
    scale?: number; // Controls the scale of the dashed pattern.
    dashSize?: number; // Length of the dash.
    gapSize?: number; // Length of the gap between dashes.
}

