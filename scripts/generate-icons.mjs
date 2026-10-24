import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'public/icons/icon.svg');
const out = (name) => path.join(root, 'public/icons', name);

const source = await readFile(sourcePath, 'utf8');
// iOS, Android and the PWA all mask their own icons. Ship a full-bleed square
// instead of baking rounded corners into the artwork.
const square = source.replace(/rx="118"/, 'rx="0"');
const transparent = source.replace(/\n\s*<rect width="512" height="512" rx="118"[^>]*\/>/, '');

for (const [size, name] of [
  [1024, 'icon-1024.png'],
  [512, 'icon-512.png'],
  [192, 'icon-192.png'],
  [180, 'apple-touch-icon.png'],
  [64, 'favicon-64.png'],
]) {
  await sharp(Buffer.from(square)).resize(size, size).png({ compressionLevel: 9 }).toFile(out(name));
}

// Maskable icon: full-bleed background with the art inside Android's 80 % safe zone.
const art = await sharp(Buffer.from(transparent)).resize(400, 400).png().toBuffer();
await sharp({
  create: { width: 512, height: 512, channels: 4, background: '#090714' },
})
  .composite([
    {
      input: Buffer.from(
        `<svg width="512" height="512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c1438"/><stop offset="0.55" stop-color="#120e28"/><stop offset="1" stop-color="#07050f"/></linearGradient></defs><rect width="512" height="512" fill="url(#g)"/></svg>`,
      ),
    },
    { input: art, gravity: 'centre' },
  ])
  .png({ compressionLevel: 9 })
  .toFile(out('maskable-512.png'));

console.log('Generated app icons (1024, 512, 192, 180, 64, maskable).');
