import { createNoise2D } from 'simplex-noise';
import { NoiseGenerator } from './NoiseGenerator';

const noise2D = createNoise2D();
export function createSimplexNoiseGenerator(scale: number = 50, detail: number = 1.5): NoiseGenerator {
    const noise2D = createNoise2D(); // Create Simplex noise
    return new NoiseGenerator({
        scale,
        detail,
        noiseFunction: noise2D, // Use Simplex noise as the noise function
    });
}
