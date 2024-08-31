export interface PostProcessingEffectProps {
    effectType: 'bloom' | 'depthOfField' | 'motionBlur' | 'vignette'; // Types of effects
    options?: any; // Options specific to the effect type
}