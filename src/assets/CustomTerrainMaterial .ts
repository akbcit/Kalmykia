// src/core/derivedClasses/materials/CustomTerrainMaterial.ts
import * as THREE from 'three';

export class CustomTerrainMaterial extends THREE.ShaderMaterial {
  private startTime: number;

  constructor(colors: THREE.Color[]) {
    const MAX_COLORS = 10;

    const defaultColors = [
      new THREE.Color(0x00ff00), // Default Green
      new THREE.Color(0xffff00)  // Default Yellow
    ];

    const validColors = (colors.length >= 2 && colors.every(color => color instanceof THREE.Color))
      ? colors
      : defaultColors;

    const limitedColors = validColors.slice(0, MAX_COLORS);
    const colorArray = new Float32Array(MAX_COLORS * 3);

    limitedColors.forEach((color, index) => {
      const offset = index * 3;
      colorArray[offset] = color.r;
      colorArray[offset + 1] = color.g;
      colorArray[offset + 2] = color.b;
    });

    super({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float uTime;
        uniform vec3 colors[${MAX_COLORS}];
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          float height = vPosition.y;
          float timeFactor = sin(uTime) * 0.5 + 0.5;

          float scale = 1.0 + 2.0 * timeFactor;
          float index = mod(height * scale, float(${MAX_COLORS}) - 1.0);
          float t = mod(height * scale, 1.0);
          int idx1 = int(index);
          int idx2 = (idx1 + 1) % ${MAX_COLORS};
          vec3 color1 = colors[idx1];
          vec3 color2 = colors[idx2];
          float smoothT = smoothstep(0.0, 1.0, t);
          vec3 color = mix(color1, color2, smoothT);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        colors: { value: colorArray }
      }
    });

    this.startTime = performance.now();
  }

  public update() {
    const elapsedTime = (performance.now() - this.startTime) / 1000;
    this.uniforms.uTime.value = elapsedTime;
  }
}
