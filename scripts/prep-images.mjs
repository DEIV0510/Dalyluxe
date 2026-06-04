// Image prep for DalyLuxe Lashes (vanilla build).
// Reads the real photos from Desktop/pestañas, fixes orientation,
// optimizes to WebP + JPEG, and keys the white logo background to transparent.
// Reuses `sharp` already installed in the sibling Next.js project.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(
  'C:/Users/Lenovo/OneDrive/Escritorio/Claude/Sesiones/dalyluxe-lashes/package.json'
);
const sharp = require('sharp');

const SRC = 'C:/Users/Lenovo/OneDrive/Escritorio/pestañas';
const OUT = 'C:/Users/Lenovo/OneDrive/Escritorio/Claude/Sesiones/dalyluxe-lashes-html/assets/img';

const files = fs.readdirSync(SRC);
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');
const findFile = (key) => {
  const k = norm(key);
  return files.find((f) => norm(f.replace(/\.[^.]+$/, '')) === k);
};

// key -> output basename, plus rotation fix for inverted selfies
const MAP = [
  { key: 'tecnorimel',          out: 'tecno-rimel',       rotate: 0 },
  { key: 'volumenarabe',        out: 'volumen-arabe',     rotate: 0 },
  { key: 'volumengriego',       out: 'volumen-griego',    rotate: 180 },
  { key: 'volumenegipcio5d',    out: 'volumen-egipcio',   rotate: 180 },
  { key: 'volumenhawaiano2dyy', out: 'volumen-hawaiano',  rotate: 0 },
  { key: 'efectopestañina',     out: 'efecto-pestanina',  rotate: 0 },
  { key: 'efectocomic',         out: 'efecto-comic',      rotate: 0 },
  { key: 'efectoanime',         out: 'efecto-anime',      rotate: 0 },
  { key: 'wispytecnologico',    out: 'wispy-tecnologico', rotate: 0 },
  { key: 'adicionalcolor',      out: 'adicional-color',   rotate: 0 },
  { key: 'retiropestañas',      out: 'retiro-pestanas',   rotate: 0 },
];

const MAX = 1280;

async function processPhoto({ key, out, rotate }) {
  const file = findFile(key);
  if (!file) { console.warn('MISSING source for', key); return; }
  const input = path.join(SRC, file);
  let pipe = sharp(input).rotate(rotate); // 0 = no-op
  pipe = pipe.resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true });
  const buf = await pipe.toBuffer();
  await sharp(buf).webp({ quality: 80 }).toFile(path.join(OUT, `${out}.webp`));
  await sharp(buf).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, `${out}.jpg`));
  const meta = await sharp(buf).metadata();
  console.log(`  ${out.padEnd(18)} ${meta.width}x${meta.height}`);
}

// Logo: the real source already has an alpha channel, so just trim + resize and
// PRESERVE transparency. Only key out white if the source is actually opaque.
async function processLogo() {
  const file = findFile('logo');
  if (!file) { console.warn('MISSING logo'); return; }
  const input = path.join(SRC, file);
  const probe = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const cornerAlpha = probe.data[3]; // top-left pixel alpha
  if (cornerAlpha < 16) {
    await sharp(input).trim().resize({ width: 900, withoutEnlargement: true })
      .png({ compressionLevel: 9 }).toFile(path.join(OUT, 'logo.png'));
    console.log('  logo.png (source already transparent: alpha preserved)');
    return;
  }
  // Fallback: source has a solid (white) background -> key it to transparent
  const { data, info } = await sharp(input).resize({ width: 900, withoutEnlargement: true })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  for (let i = 0; i < data.length; i += ch) {
    const w = Math.min(data[i], data[i + 1], data[i + 2]);
    data[i + 3] = w >= 240 ? 0 : w <= 205 ? 255 : Math.round((240 - w) / 35 * 255);
  }
  const keyed = await sharp(data, { raw: { width: info.width, height: info.height, channels: ch } }).png().toBuffer();
  await sharp(keyed).trim().png({ compressionLevel: 9 }).toFile(path.join(OUT, 'logo.png'));
  console.log('  logo.png (white keyed to transparent)');
}

(async () => {
  console.log('Processing photos ->', OUT);
  for (const m of MAP) await processPhoto(m);
  await processLogo();
  console.log('Done.');
})().catch((e) => { console.error(e); process.exit(1); });
