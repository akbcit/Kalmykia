import { BasicMaterial } from "./BasicMaterial";
import { PhongMaterial } from "./PhongMaterial";
import { StandardMaterial } from "./StandardMaterial";
import { ToonMaterial } from "./ToonMaterial";
import { LambertMaterial } from "./LambertMaterial";

// Example usage:
const basicMaterial = new BasicMaterial({ color: 0xffffff, wireframe: false });
const standardMaterial = new StandardMaterial({ color: 0xffaa00, roughness: 0.5, metalness: 0.8 });
const phongMaterial = new PhongMaterial({ color: 0x0000ff, shininess: 200 });
const toonMaterial = new ToonMaterial({ color: 0xffff00 });
const lambertMaterial = new LambertMaterial({ color: 0x00ff00 });
