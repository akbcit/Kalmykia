import { createNoise2D } from 'simplex-noise';  
import { NoiseFunction } from '../noise/types/NoiseFunction';

// Define a type for the mask function
export type MaskFunction = (x: number, z: number) => boolean;

/**
 * Creates a Radial Noise Mask function using any noise function
 * This function generates a mask that combines a radial falloff function with a passed NoiseFunction
 * to create a highly irregular, natural-looking boundary.
 *
 * @param centerX - X coordinate of the center of the shape
 * @param centerZ - Z coordinate of the center of the shape
 * @param baseRadius - Radius defining the base distance for the boundary
 * @param noiseFunction - The noise function to use for generating the boundary irregularity
 * @param noiseFrequency - Frequency multiplier for the passed noise function
 * @param threshold - Threshold value to determine the boundary cutoff
 * @returns MaskFunction - A function that returns true if a point (x, z) is within the defined irregular boundary
 */
export const createRadialNoiseMask = (
  centerX: number = 0,
  centerZ: number = 0,
  baseRadius: number = 50,
  noiseFunction: NoiseFunction = createNoise2D(Math.random), // Default to Simplex noise
  noiseFrequency: number = 0.1,
  threshold: number = 0.2
): MaskFunction => {
  return (x: number, z: number): boolean => {
    // Calculate distance from the center (Euclidean distance)
    const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);

    // Apply a radial falloff function to ensure a smoother transition from center to boundary
    const falloff = Math.max(0, 1 - distanceFromCenter / baseRadius); // 1 at the center, 0 at the edge

    // Generate a noise value to add irregularity using the passed noise function
    const noiseValue = noiseFunction(x * noiseFrequency, z * noiseFrequency); // Use frequency parameter

    // Define the shape using a combination of falloff and noise
    // Return true if the combined value exceeds the threshold
    return falloff + noiseValue > threshold;
  };
};
