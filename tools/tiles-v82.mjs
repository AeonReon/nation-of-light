// v82 tiles — the eight under-sevens ladders, which had no picture of their own
// and fell back on the room tile. Same recipe as tools/order-draw.mjs: no people,
// so the picture is what the child will be doing, laid out ready.
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const API = 'http://127.0.0.1:7859/sdapi/v1/txt2img';
const STYLE = ', soft painterly photograph, warm natural daylight, cream and honey tones, shallow depth of field, calm and inviting, no text, no writing, no logo, no people';
const NEG = 'text, words, letters, numbers, watermark, logo, signature, ugly, deformed, people, hands, blurry, oversaturated, harsh flash, clutter';
const P = {
  'track/body.hopping': 'a skipping rope laid out straight across a sunlit wooden floor in a clear room, a folded quilt at one end',
  'track/speak.sayit': 'two small wooden chairs turned to face each other in a sunlit room, nothing else in the space',
  'track/make.scissors': 'small child scissors with rounded ends resting on coloured paper cut into shapes on a wooden table',
  'track/make.crayons': 'a handful of broken wax crayons scattered beside a child drawing of a house on plain paper, sunlit table',
  'track/music.song': 'a wooden floor in a bright room with a small stool and an open songbook resting on it, morning light',
  'track/food.kitchen': 'a child sized apron hung over a chair beside a mixing bowl, a wooden spoon and two eggs on a kitchen table',
  'track/care.helping': 'a kitchen table half laid for a meal, spoons and a folded cloth set out ready, warm evening light',
  'track/order.ownthings': 'a low row of hooks with one small coat hung up and two little shoes side by side beneath, sunlit hallway',
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
