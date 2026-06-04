// Build a sharper hero asset from the (low-res) volumen hawaiano photo.
// Upscale with lanczos3 + unsharp mask + high quality so it holds up full-bleed.
import { createRequire } from 'module';
const require = createRequire('C:/Users/Lenovo/OneDrive/Escritorio/Claude/Sesiones/dalyluxe-lashes/package.json');
const sharp = require('sharp');

const SRC = 'C:/Users/Lenovo/OneDrive/Escritorio/pestañas/volumenhawaiano2dyy.png';
const OUT = 'C:/Users/Lenovo/OneDrive/Escritorio/Claude/Sesiones/dalyluxe-lashes-html/assets/img';

const meta = await sharp(SRC).metadata();
console.log('source:', meta.width + 'x' + meta.height);

const buf = await sharp(SRC)
  .resize({ width: 1200, kernel: 'lanczos3' })      // denser base than 538px
  .sharpen({ sigma: 1.1, m1: 0.5, m2: 2.2 })        // crispen edges (lashes)
  .modulate({ saturation: 1.06, brightness: 1.02 }) // subtle pop
  .toBuffer();

await sharp(buf).webp({ quality: 90 }).toFile(OUT + '/hero-hawaiano.webp');
await sharp(buf).jpeg({ quality: 90, mozjpeg: true }).toFile(OUT + '/hero-hawaiano.jpg');
const o = await sharp(buf).metadata();
console.log('hero out:', o.width + 'x' + o.height);
