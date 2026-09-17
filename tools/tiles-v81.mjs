// v81 tiles — the 14 adult ladders that never had their own picture and were
// falling back to the room tile. Same recipe as tools/order-draw.mjs.
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const API = 'http://127.0.0.1:7859/sdapi/v1/txt2img';
const STYLE = ', soft painterly photograph, warm natural daylight, cream and honey tones, shallow depth of field, calm and inviting, no text, no writing, no logo, no people';
const NEG = 'text, words, letters, numbers, watermark, logo, signature, ugly, deformed, people, hands, blurry, oversaturated, harsh flash, clutter';
const P = {
  'track/wild.door1': 'an open front door looking out onto a sunlit path and green fields, a pair of walking boots on the step',
  'track/mind.learn1': 'an open notebook with a fountain pen resting on it beside a small pile of books on a wooden table by a window',
  'track/words.books': 'one thick open book lying face up on a soft armchair beside a reading lamp, evening light',
  'track/speak.people1': 'two empty chairs turned slightly towards each other beside a small table with two cups of tea, sunlit room',
  'track/speak.people2': 'a long wooden table set with many mismatched cups and plates ready for a gathering, sunlight across it',
  'track/speak.connect': 'a small stack of handwritten letters and postcards tied with string beside a pen on a wooden table',
  'track/make.something1': 'a workbench with paper, string, scissors, a pencil and folded card, something half made in the middle',
  'track/music.play1': 'a small stage corner with a stool, a hat and three juggling balls on the floorboards, warm light',
  'track/food.real1': 'a wooden board with whole vegetables, eggs and a loaf of bread, nothing packaged, morning light',
  'track/food.real2': 'a simple kitchen shelf with jars of beans, grains and oil, and a clean empty worktop below, warm light',
  'track/money.value1': 'a small notebook of figures beside a few coins and a jar on a wooden desk, morning light',
  'track/belong.town1': 'a quiet sunlit street of small shops and doorways with a bench in the foreground, early morning',
  'track/home.works1': 'a made bed with smooth white linen in a clear bright room, one window open, nothing on the floor',
  'track/calm.still1': 'a single cushion on a bare wooden floor in an empty sunlit room, one window, nothing else',
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
