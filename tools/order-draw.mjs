// Tiles for the Creating order room, drawn with Draw Things (same recipe as school-of-light/tools/track-draw.mjs).
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const API = 'http://127.0.0.1:7859/sdapi/v1/txt2img';
const STYLE = ', soft painterly photograph, warm natural daylight, cream and honey tones, shallow depth of field, calm and inviting, no text, no writing, no logo, no people';
const NEG = 'text, words, letters, numbers, watermark, logo, signature, ugly, deformed, people, hands, blurry, oversaturated, harsh flash, clutter';
const P = {
  'cat/order': 'a calm tidy sunlit room with one clear wooden table, a single chair and an open window, everything in its place',
  'track/order.bedroom': 'a neatly made bed with white linen in a quiet bedroom, morning light through the window, bare clear bedside table',
  'track/order.desk': 'a clear wooden desk with only a notebook, a pen and a small lamp, sunlight across it',
  'track/order.wardrobe': 'an open wardrobe with a few well chosen clothes hung neatly with space between them, soft light',
  'track/order.broken': 'a small screwdriver and a jar of screws beside a wooden chair being mended on a workbench',
  'track/order.giving': 'a cardboard box of folded clothes and books by an open front door, sunlight on the step',
  'track/order.digital': 'a phone face down on a clean wooden table beside a cup of tea and a closed notebook',
  'track/order.forgotten': 'a bright clean window with fresh white curtains moving in a breeze, sunlight on a clean sill',
  'track/order.keeping': 'a tidy hallway with a row of hooks, each holding one coat, and shoes in a neat line beneath',
};
for (const [id, p] of Object.entries(P)) {
  const out = path.join('images', id + '.jpg'); if (fs.existsSync(out) && !process.argv.includes('--force')) continue;
  const t0 = Date.now();
  try {
    const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(900000),
      body: JSON.stringify({ prompt: p + STYLE, negative_prompt: NEG, steps: 8, width: 768, height: 512, cfg_scale: 2, seed: 11, batch_size: 1 }) });
    const d = await r.json(); if (!d.images || !d.images.length) { console.log('x', id, 'no image'); continue; }
    fs.writeFileSync('/tmp/_nol.png', Buffer.from(d.images[0], 'base64'));
    execFileSync('sips', ['-s', 'format', 'jpeg', '--resampleHeight', '448', '/tmp/_nol.png', '--out', '/tmp/_nol.jpg'], { stdio: 'ignore' });
    execFileSync('sips', ['-c', '448', '720', '/tmp/_nol.jpg', '--out', out], { stdio: 'ignore' });
    console.log('ok', id, Math.round((Date.now() - t0) / 1000) + 's');
  } catch (e) { console.log('x', id, e.message); }
}
console.log('done');
