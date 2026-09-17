// node draw.mjs <out.png> <seed> "<prompt>" [init.png] [image_guidance]
import fs from 'node:fs';
const [out, seed, prompt, init, ig] = process.argv.slice(2);
const W = 704, H = 1024;
const STYLE = ', full body portrait, vertical composition, classical oil painting in the manner of the nineteenth century academic painters, rich warm golden light, fine detail, heroic and dignified, beautiful, no text';
const NEG = 'text, words, letters, watermark, logo, signature, ugly, deformed, extra fingers, extra limbs, blurry, cartoon, anime, modern clothing, gore, blood, nudity';
const body = { prompt: prompt + STYLE, negative_prompt: NEG, steps: 8, width: W, height: H, cfg_scale: 2, seed: +seed, batch_size: 1, hires_fix: false, upscaler: null };
let api = 'txt2img';
if (init) { api = 'img2img'; body.init_images = [fs.readFileSync(init).toString('base64')]; body.strength = 1; body.image_guidance = +(ig || 2); }
const t0 = Date.now();
const r = await fetch('http://127.0.0.1:7859/sdapi/v1/' + api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(1500000), body: JSON.stringify(body) });
const d = await r.json(); if (!d.images || !d.images.length) { console.log('no image', r.status, JSON.stringify(d).slice(0, 300)); process.exit(1); }
fs.writeFileSync(out, Buffer.from(d.images[0], 'base64')); console.log('ok', out, Math.round((Date.now() - t0) / 1000) + 's');
