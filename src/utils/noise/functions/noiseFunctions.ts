import { NoiseFunction } from "../types/NoiseFunction";

export const seededSineWaveFunction = (frequency: number): NoiseFunction => {
  return (x: number, y: number): number => {
    const seedX = Math.random();
    const seedY = Math.random();
    return Math.sin((x + seedX) * frequency) * Math.cos((y + seedY) * frequency);
  };
};

export const seededRadialGradientFunction = (maxRadius: number = 50, maxHeight: number = 100): NoiseFunction => {
  return (x: number, y: number): number => {
    const seedX = Math.random();
    const seedY = Math.random();
    const distance = Math.sqrt((x - seedX) ** 2 + (y - seedY) ** 2);
    return Math.max(0, maxHeight - (distance / maxRadius) * maxHeight); // Scales height based on distance
  };
};

export const seededCheckerboardFunction = (
  cellSize: number = 10,
  seedRange: number = 1,
  highValue: number = 10,
  lowValue: number = 0
): NoiseFunction => {
  return (x: number, y: number): number => {
    const seedX = Math.floor(Math.random() * seedRange);
    const seedY = Math.floor(Math.random() * seedRange);
    return ((Math.floor((x + seedX) / cellSize) % 2 === 0) && (Math.floor((y + seedY) / cellSize) % 2 === 0)) ? highValue : lowValue;
  };
};

export const seededExponentialHeightFunction = (exponent: number = 2, seedFactorRange: number = 1): NoiseFunction => {
  return (x: number, y: number): number => {
    const seedFactor = Math.random() * seedFactorRange;
    return seedFactor * (Math.pow(x, exponent) + Math.pow(y, exponent));
  };
};

export const seededRidgeNoiseFunction = (ridgeHeight: number = 10, frequency: number = 0.1): NoiseFunction => {
  return (x: number, y: number): number => {
    const distance = Math.sqrt(x ** 2 + y ** 2);
    return Math.abs(Math.sin(distance * frequency)) * ridgeHeight;
  };
};

export const seededCircularWavesFunction = (
  waveFrequency: number = 0.1,
  waveAmplitude: number = 10
): NoiseFunction => {
  return (x: number, y: number): number => {
    const seedX = Math.random();
    const seedY = Math.random();
    const distance = Math.sqrt((x - seedX) ** 2 + (y - seedY) ** 2);
    return Math.sin(distance * waveFrequency) * waveAmplitude;
  };
};

export const seededTurbulenceFunction = (
  turbulenceScale: number = 0.1,
  amplitude: number = 5
): NoiseFunction => {
  return (x: number, y: number): number => {
    const seedX = Math.random();
    const seedY = Math.random();
    const smallNoiseX = Math.sin((x + seedX) * turbulenceScale) * amplitude;
    const smallNoiseY = Math.cos((y + seedY) * turbulenceScale) * amplitude;
    return smallNoiseX + smallNoiseY;
  };
};

export const seededPlateauFunction = (maxHeight: number = 50, threshold: number = 100): NoiseFunction => {
  return (x: number, y: number): number => {
    const seedFactor = Math.random() * 20 + 10; // Slight randomness for seed
    const height = Math.sqrt(x ** 2 + y ** 2);
    return Math.min(height, maxHeight < threshold ? maxHeight : threshold); // Plateau after a threshold
  };
};

export const seededRandomWalkFunction = (stepSize: number = 1): NoiseFunction => {
  return (x: number, y: number): number => {
    const seedStep = Math.random() * stepSize;
    return Math.random() < 0.5 ? x + seedStep : x - seedStep;
  };
};

export const voronoiNoiseFunction = (numCells: number = 10, amplitude: number = 1): NoiseFunction => {
  const seedPoints = Array.from({ length: numCells }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100
  }));

  return (x: number, y: number): number => {
    let minDistance = Infinity;

    // Find the closest seed point
    seedPoints.forEach(point => {
      const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
      if (distance < minDistance) {
        minDistance = distance;
      }
    });

    return amplitude * minDistance; // Distance from closest seed point
  };
};

export const diamondSquareFunction = (gridSize: number = 16, roughness: number = 1): NoiseFunction => {
  // Initialize the grid with undefined values first, and specify the type as number | undefined
  const grid: (number | undefined)[][] = Array.from({ length: gridSize + 1 }, () =>
    Array.from({ length: gridSize + 1 }, () => undefined)
  );

  // Seed the corners of the grid with random values
  grid[0][0] = Math.random() * 2 - 1;
  grid[0][gridSize] = Math.random() * 2 - 1;
  grid[gridSize][0] = Math.random() * 2 - 1;
  grid[gridSize][gridSize] = Math.random() * 2 - 1;

  // Utility function to handle modulus for negative numbers
  const mod = (n: number, m: number): number => ((n % m) + m) % m;

  // Diamond-Square function
  const diamondSquare = (size: number, roughness: number) => {
    const half = size / 2;
    if (half < 1) return; // Base case for recursion

    // Diamond step: find the midpoint of each square
    for (let i = half; i < gridSize; i += size) {
      for (let j = half; j < gridSize; j += size) {
        const avg = (grid[i - half]![j - half]! +
                     grid[i - half]![j + half]! +
                     grid[i + half]![j - half]! +
                     grid[i + half]![j + half]!) / 4;
        grid[i][j] = avg + (Math.random() * 2 - 1) * roughness; // Midpoint displacement
      }
    }

    // Square step: fill in the edges of each square
    for (let i = 0; i <= gridSize; i += half) {
      for (let j = (i + half) % size; j <= gridSize; j += size) {
        const avg = (
          grid[mod(i - half, gridSize)]![j]! +
          grid[mod(i + half, gridSize)]![j]! +
          grid[i]![(j + half) % gridSize]! +
          grid[i]![(j - half + gridSize) % gridSize]!
        ) / 4;
        grid[i][j] = avg + (Math.random() * 2 - 1) * roughness;
      }
    }

    // Recursively run the algorithm on smaller squares
    diamondSquare(size / 2, roughness);
  };

  // Initialize and run the algorithm on the full grid
  diamondSquare(gridSize, roughness);

  // Return the noise function for use in terrain
  return (x: number, y: number): number => {
    // Ensure x and y are within grid bounds
    const i = mod(Math.floor(x), gridSize);
    const j = mod(Math.floor(y), gridSize);

    // Return the grid value, and ensure no undefined values are returned
    return grid[i]![j] !== undefined ? grid[i]![j]! : 0;
  };
};


export const ridgedMultifractalNoise = (
  baseNoiseFunction: NoiseFunction,
  octaves: number = 4,
  persistence: number = 0.5,
  lacunarity: number = 2.0,
  scale: number = 1.0
): NoiseFunction => {
  return (x: number, y: number): number => {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      const noiseValue = baseNoiseFunction(x * frequency, y * frequency);
      const ridgeValue = 1 - Math.abs(noiseValue); // Reflect values to create ridges
      total += ridgeValue * ridgeValue * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return (total / maxValue) * scale;
  };
};

export const fractalBrownianMotion = (
  baseNoiseFunction: NoiseFunction,
  octaves: number = 4,
  persistence: number = 0.5,
  lacunarity: number = 2.0,
  scale: number = 1.0
): NoiseFunction => {
  return (x: number, y: number): number => {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += baseNoiseFunction(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return (total / maxValue) * scale;
  };
};

export const warpedNoise = (
  baseNoiseFunction: NoiseFunction,
  warpFunction: NoiseFunction,
  warpStrength: number = 0.5
): NoiseFunction => {
  return (x: number, y: number): number => {
    // Use the warp function to distort the input coordinates
    const warpedX = x + warpFunction(x, y) * warpStrength;
    const warpedY = y + warpFunction(x, y) * warpStrength;

    // Apply the base noise function to the warped coordinates
    return baseNoiseFunction(warpedX, warpedY);
  };
};

export const blendedNoise = (
  noiseFunction1: NoiseFunction,
  noiseFunction2: NoiseFunction,
  blendFactor: number = 0.5
): NoiseFunction => {
  return (x: number, y: number): number => {
    // Blend two noise functions using the blend factor
    return (noiseFunction1(x, y) * blendFactor) + (noiseFunction2(x, y) * (1 - blendFactor));
  };
};

export const turbulentNoise = (
  baseNoiseFunction: NoiseFunction,
  turbulenceFunction: NoiseFunction,
  turbulenceScale: number = 0.1,
  turbulenceAmplitude: number = 1.0
): NoiseFunction => {
  return (x: number, y: number): number => {
    // Apply random displacements to the input coordinates
    const displacedX = x + turbulenceFunction(x, y) * turbulenceScale;
    const displacedY = y + turbulenceFunction(x, y) * turbulenceScale;

    // Apply the base noise function to the displaced coordinates
    return baseNoiseFunction(displacedX, displacedY) * turbulenceAmplitude;
  };
};

export const octaveCombiner = (
  noiseFunction1: NoiseFunction,
  noiseFunction2: NoiseFunction,
  octaves: number = 4,
  persistence: number = 0.5,
  lacunarity: number = 2.0,
  scale: number = 1.0
): NoiseFunction => {
  return (x: number, y: number): number => {
    let total1 = 0;
    let total2 = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total1 += noiseFunction1(x * frequency, y * frequency) * amplitude;
      total2 += noiseFunction2(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    // Combine both noise functions and scale
    return ((total1 + total2) / (2 * maxValue)) * scale;
  };
};

export const thresholdNoise = (
  baseNoiseFunction: NoiseFunction,
  threshold: number = 0.5,
  lowerValue: number = 0,
  upperValue: number = 1
): NoiseFunction => {
  return (x: number, y: number): number => {
    const noiseValue = baseNoiseFunction(x, y);
    return noiseValue > threshold ? upperValue : lowerValue;
  };
};
