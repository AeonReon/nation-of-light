// v74 leftovers from v73: tiles for Getting strong part one and two (they fell back to the fit
// category image) and Fasting, which still wore the Calm candle tile after moving to the Food path.
// Same recipe as tools/order-draw.mjs. Run from the app folder: node tools/daily/tiles-v74.mjs
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const API = 'http://127.0.0.1:7859/sdapi/v1/txt2img';
const STYLE = ', soft painterly photograph, warm natural daylight, cream and honey tones, shallow depth of field, calm and inviting, no text, no writing, no logo, no people';
const NEG = 'text, words, letters, numbers, watermark, logo, signature, ugly, deformed, people, hands, blurry, oversaturated, harsh flash, clutter';
const P = {
  'track/fit.body1': 'an exercise mat unrolled on a wooden floor beside a sturdy kitchen table and one chair, morning sunlight through a window, a folded towel',
  'track/fit.body2': 'a well used exercise mat, a folded towel and a glass of water on a wooden floor by an open back door onto a green garden, bright morning light',
  'track/calm.fast': 'a single glass of water and a cup of black tea on a bare clean wooden kitchen table, an empty white plate pushed aside, calm morning light',
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
