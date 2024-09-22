// src/utils/NoiseGenerator.ts

export interface NoiseParams {
    scale?: number;  // Controls how "stretched" the noise is
    detail?: number; // Controls the intensity of the noise
    noiseFunction?: (x: number, y: number) => number; // Generic noise function to support any library
}

export class NoiseGenerator {
    private noiseFunction: (x: number, y: number) => number;
    private scale: number = 1; // Initialize with a default value
    private detail: number = 1; // Initialize with a default value

    constructor({
        scale = 1,
        detail = 1,
        noiseFunction = (x, y) => 0, // Default to a flat surface (no noise)
    }: NoiseParams = {}) {
        this.noiseFunction = noiseFunction;
        this.scale = scale;
        this.detail = detail;
    }

    // Generates the noise for a given x and y using the provided noise function
    generateNoise(x: number, y: number): number {
        return this.noiseFunction(x / this.scale, y / this.scale) * this.detail;
    }

    // Validates and updates the scale dynamically
    setScale(scale: number): void {
        if (scale <= 0) {
            throw new Error('Scale must be a positive number greater than 0.');
        }
        this.scale = scale;
    }

    // Validates and updates the detail dynamically
    setDetail(detail: number): void {
        if (detail < 0) {
            throw new Error('Detail must be a non-negative number.');
        }
        this.detail = detail;
    }

    // Resets noise parameters back to defaults
    resetParams(): void {
        this.scale = 1;
        this.detail = 1;
    }

    // Optionally add a way to serialize the state
    serialize(): NoiseParams {
        return {
            scale: this.scale,
            detail: this.detail,
        };
    }

    // Optionally add a way to load from saved state
    load(params: NoiseParams): void {
        this.setScale(params.scale ?? 1);
        this.setDetail(params.detail ?? 1);
    }
}
