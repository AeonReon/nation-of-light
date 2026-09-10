/* Light School (the Nation of Light School) — v3. The twenty-five, in one sitting.

   The whole opening is one thing: get a person out of the frozen state by
   doing twenty-five tiny actions, one after another, with Marcus beside
   them, in about ten minutes. Nothing is explained that does not need to be.
   Cover (what, why, how) → Marcus speaks → a tablet → Done → the next.
   After every five, a breath: Marcus says one line that fits what was just
   done, one line of encouragement points at the next five, and on it goes.
   At twenty-five, the finish. One voice at a time, always.

   The rule that holds: Marcus's voice only ever says his own recorded words
   (content.json, every line with its source). Aurelia reads the tablets and
   the breaks in the school's words. Nothing is put in his mouth. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY = 'nol.v1';
  let C = null, SCH = null, FEED = [], VIS = null, AVIS = null, PORTICO = null, RIG = null, ARIG = null, CUES = null, ACUES = null, LINES = {};
  const NAR = new Audio(), MAR = new Audio(), MUS = new Audio(); NAR.preload = 'auto'; MAR.preload = 'auto'; MUS.preload = 'auto'; MUS.src = 'audio/music/dawn.mp3';
  let S = load();

  /* ---------- state ---------- */
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.v === 1) { s.said = s.said || []; s.skipped = s.skipped || []; s.school = s.school || { done: {}, points: 0 }; s.school.refresh = s.school.refresh || 0; return s; } } catch (e) {}
    return { v: 1, start: null, done: [], skipped: [], days: {}, sound: true, taps: 0, visits: 0, said: [], seenHelp: false, member: false, school: { done: {}, points: 0, refresh: 0 } };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const remaining = () => [...C.moves.filter(m => !S.done.includes(m.id) && !S.skipped.includes(m.id)), ...C.moves.filter(m => !S.done.includes(m.id) && S.skipped.includes(m.id))];
  const tierDone = tid => C.moves.filter(m => m.tier === tid).every(m => S.done.includes(m.id));
  const tiersDone = () => C.tiers.filter(t => tierDone(t.id)).length;
  const line = id => LINES[id];
  /* a line he has not said this sitting; if every candidate is used, the first */
  function fresh(ids) { const f = ids.find(i => !S.said.includes(i)); return line(f || ids[0]); }

  /* ---------- sound ---------- */
  let AC = null;
  function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
  function tone(f, t0, dur, type, gain, ctx) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t0);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain, t0 + .012); g.gain.exponentialRampToValueAtTime(.0008, t0 + dur);
    o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + dur + .05);
  }
  function sfx(name) {
    if (!S.sound) return; const ctx = ac(); if (!ctx) return; const t = ctx.currentTime;
    if (name === 'done') { tone(659, t, .5, 'sine', .16, ctx); tone(988, t + .09, .6, 'sine', .12, ctx); tone(1319, t + .18, .9, 'sine', .08, ctx); }
    else if (name === 'tap') { tone(520, t, .12, 'triangle', .06, ctx); }
    else if (name === 'rise') { tone(330, t, .18, 'sine', .05, ctx); tone(440, t + .06, .22, 'sine', .05, ctx); }
    else if (name === 'wreath') { tone(196, t, .5, 'triangle', .12, ctx); tone(392, t + .05, .7, 'sine', .08, ctx); tone(587, t + .25, 1.2, 'sine', .07, ctx); tone(784, t + .45, 1.4, 'sine', .05, ctx); }
    else if (name === 'flame') { const n = ctx.createBufferSource(), b = ctx.createBuffer(1, ctx.sampleRate * .5, ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2); n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = .8; const g = ctx.createGain(); g.gain.value = .18; n.connect(f); f.connect(g); g.connect(ctx.destination); n.start(t); tone(262, t + .05, 1.4, 'sine', .07, ctx); tone(392, t + .2, 1.6, 'sine', .05, ctx); }
    else if (name === 'begin') { const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09, t + 1.6); g.gain.exponentialRampToValueAtTime(.0008, t + 4.2); g.connect(ctx.destination);
      [130.8, 196, 261.6, 329.6, 392, 523.3].forEach((f, i) => { const o = ctx.createOscillator(); o.type = i < 2 ? 'triangle' : 'sine'; o.frequency.setValueAtTime(f * .94, t); o.frequency.exponentialRampToValueAtTime(f, t + 1.8); const og = ctx.createGain(); og.gain.value = i < 2 ? .5 : .35; o.connect(og); og.connect(g); o.start(t + i * .12); o.stop(t + 4.4); });
      tone(1046.5, t + 1.5, 1.6, 'sine', .04, ctx); tone(1568, t + 1.7, 1.8, 'sine', .03, ctx); }
    else if (name === 'scroll') { tone(523, t, .3, 'sine', .07, ctx); tone(659, t + .12, .35, 'sine', .07, ctx); tone(784, t + .24, .8, 'sine', .07, ctx); }
  }
  /* ---- the room: birds beyond the parapet, the brazier, a breath of wind. Made in code. ---- */
  const AMB = { on: false, nodes: [], timers: [] };
  function noiseBuffer(ctx, secs) { const b = ctx.createBuffer(1, ctx.sampleRate * secs, ctx.sampleRate), d = b.getChannelData(0); let last = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } return b; }
  function ambStart() {
    if (AMB.on || !S.sound) return; const ctx = ac(); if (!ctx) return; AMB.on = true;
    const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination); AMB.master = master;
    master.gain.linearRampToValueAtTime(1, ctx.currentTime + 4);
    // wind: brown noise through a low-pass, slowly breathing
    const wind = ctx.createBufferSource(); wind.buffer = noiseBuffer(ctx, 6); wind.loop = true;
    const wf = ctx.createBiquadFilter(); wf.type = 'lowpass'; wf.frequency.value = 260; const wg = ctx.createGain(); wg.gain.value = .05;
    const lfo = ctx.createOscillator(); lfo.frequency.value = .07; const lg = ctx.createGain(); lg.gain.value = .025; lfo.connect(lg); lg.connect(wg.gain);
    wind.connect(wf); wf.connect(wg); wg.connect(master); wind.start(); lfo.start(); AMB.nodes.push(wind, lfo);
    // the brazier: a bed of hiss and the odd pop, only once the flame is lit
    const fire = ctx.createBufferSource(); fire.buffer = noiseBuffer(ctx, 4); fire.loop = true;
    const ff = ctx.createBiquadFilter(); ff.type = 'bandpass'; ff.frequency.value = 1400; ff.Q.value = .6; const fg = ctx.createGain(); fg.gain.value = 0; AMB.fire = fg;
    fire.connect(ff); ff.connect(fg); fg.connect(master); fire.start(); AMB.nodes.push(fire);
    const pop = () => { if (!AMB.on) return; if (AMB.fire.gain.value > 0) { const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(900 + Math.random() * 1400, t); o.frequency.exponentialRampToValueAtTime(200, t + .04); g.gain.setValueAtTime(.05 + Math.random() * .05, t); g.gain.exponentialRampToValueAtTime(.0005, t + .06); o.connect(g); g.connect(master); o.start(t); o.stop(t + .08); } AMB.timers.push(setTimeout(pop, 250 + Math.random() * 1600)); };
    pop();
    // birds: two of them, out beyond the parapet, left and right
    const chirp = (pan) => { const t = ctx.currentTime, n = 2 + Math.floor(Math.random() * 4), base = 2300 + Math.random() * 1500;
      for (let i = 0; i < n; i++) { const t0 = t + i * (.09 + Math.random() * .07), o = ctx.createOscillator(), g = ctx.createGain(), p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        o.type = 'sine'; o.frequency.setValueAtTime(base, t0); o.frequency.exponentialRampToValueAtTime(base * (1.25 + Math.random() * .3), t0 + .05); o.frequency.exponentialRampToValueAtTime(base * .9, t0 + .1);
        g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.022, t0 + .015); g.gain.exponentialRampToValueAtTime(.0005, t0 + .11);
        o.connect(g); if (p) { p.pan.value = pan; g.connect(p); p.connect(master); } else g.connect(master); o.start(t0); o.stop(t0 + .13); } };
    const bird = (pan) => { if (!AMB.on) return; chirp(pan); AMB.timers.push(setTimeout(() => bird(pan), 2500 + Math.random() * 7000)); };
    AMB.timers.push(setTimeout(() => bird(-.6), 1200), setTimeout(() => bird(.7), 4200));
  }
  function ambFire(on) { if (AMB.fire) AMB.fire.gain.linearRampToValueAtTime(on ? .09 : 0, ac().currentTime + 1.5); }
  function ambStop() { if (!AMB.on) return; AMB.on = false; AMB.timers.forEach(clearTimeout); AMB.timers = []; try { AMB.master.gain.linearRampToValueAtTime(0, ac().currentTime + .8); } catch (e) {} setTimeout(() => { AMB.nodes.forEach(n => { try { n.stop(); } catch (e) {} }); AMB.nodes = []; }, 900); }
  const voiceOn = () => S.sound;
  function paintSound() { $('soundbtn').classList.toggle('off', !S.sound); }
  function hush() { SPK++; NAR.pause(); MAR.pause(); if (RIG) RIG.hush(); if (ARIG) ARIG.hush(); $('readbtn').classList.remove('on'); musicDuck(false); clearTimeout(marcusSay._t); $('bubble').hidden = true; $('abubble').hidden = true; if ($('popcap')) capHide(0); SPEAKING = null; MQ.length = 0; }
  /* the music: one nocturne, in on Begin, under every voice, out on its own */
  let MUSV = 0, MUST = null;
  function musicTo(v, ms) { clearInterval(MUST); const from = MUS.volume, t0 = performance.now(); MUST = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / ms); MUS.volume = from + (v - from) * k; if (k >= 1) clearInterval(MUST); }, 50); }
  function musicStart(v) { if (!S.sound) return; MUSV = v || .55; MUS.volume = 0; MUS.currentTime = 0; MUS.play().then(() => musicTo(MUSV, 2600)).catch(() => {}); }
  function musicDuck(on) { lyreDuck(on); if (MUS.paused) return; musicTo(on ? (atHome() ? .26 : .14) : MUSV, on ? 350 : 1400); }
  function musicStop() { if (MUS.paused) return; musicTo(0, 1200); setTimeout(() => MUS.pause(), 1300); }
  [NAR, MAR].forEach(el => { el.addEventListener('play', () => musicDuck(true)); const back = () => { if (NAR.paused && MAR.paused) musicDuck(false); }; el.addEventListener('ended', back); el.addEventListener('pause', back); });

  /* Aurelia reads: the tablets, the breaks, the finish. */
  function narrate(id, after) {
    if (!voiceOn()) { if (after) setTimeout(after, 300); return; }
    NAR.pause(); NAR.src = 'audio/voice/' + id + '.mp3?v=' + C.version; NAR.onended = () => { $('readbtn').classList.remove('on'); if (after) after(); }; NAR.onerror = () => { if (after) after(); };
    NAR.play().catch(() => { if (after) after(); });
  }
  /* Marcus speaks: only a line from content.json, mouth off the audio clock. */
  let SPEAKING = null; const MQ = []; const QSAID = new Set();
  function marcusSay(ln, pose, after) {
    if (!ln) { if (after) after(); return; }
    if (!RIG || RIG.hidden) { if (after) after(); return; }
    if (SPEAKING) { MQ.push([ln, pose, after]); return; }
    SPEAKING = ln.id;
    if (!S.said.includes(ln.id)) { S.said.push(ln.id); save(); }
    const b = $('bubble'); b.hidden = MODE === 'welcome' || MODE === 'scene' || MODE === 'school'; b.classList.toggle('companion', !ln.src);
    b.innerHTML = wordSpans(ln.t) + (ln.src ? `<span class="who">Marcus Aurelius</span><span class="src">${ln.src}</span>` : `<span class="who">Marcus</span>`);
    if (MODE === 'school') cap('marcus', ln.t, ln.src);
    b.classList.remove('say'); void b.offsetWidth; b.classList.add('say');
    if (pose && RIG[pose]) RIG[pose]();
    clearTimeout(marcusSay._t);
    const finish = () => { if (SPEAKING !== ln.id) return; SPEAKING = null; RIG.hush(); marcusSay._t = setTimeout(() => { b.hidden = true; }, 1800); if (MODE === 'school') capHide(1600); if (after) after(); const nx = MQ.shift(); if (nx) setTimeout(() => marcusSay(nx[0], nx[1], nx[2]), 350); };
    const est = Math.min(12000, ln.t.length * 70);
    if (voiceOn()) {
      MAR.pause(); CUES = (VIS && VIS[ln.id]) || null; MAR.src = 'audio/marcus/' + ln.id + '.mp3?v=' + C.version;
      MAR.onended = finish; MAR.onerror = () => { RIG.talk(est / 1000); setTimeout(finish, est); };
      RIG.talk(20); MAR.play().catch(() => { RIG.talk(est / 1000); setTimeout(finish, est); });
    } else { RIG.talk(est / 1000); setTimeout(finish, est); }
  }
  function onAureliaTap() {
    if (!ARIG || ARIG.hidden || MODE === 'scene' || MODE === 'welcome') return;
    if (MODE === 'school') { /* fine: she answers */ }
    sfx('tap'); const inSchool = MODE === 'school';
    const own = C.aurelia.lines.map(l => ({ id: l.id, t: l.t, src: '' }));
    const qs = inSchool ? LIB.filter(x => x.kind === 'quote' && x.id).map(q => ({ id: 'ui-q-' + q.id, t: q.t, src: q.by ? q.by + (q.src ? ' · ' + q.src : '') : '' })) : [];
    const start = (daySeed() * 5 + S.taps) % Math.max(1, qs.length);
    let ln = own.find(l => !S.said.includes(l.id)) || null;
    if (!ln) { for (let i = 0; i < qs.length; i++) { const c = qs[(start + i) % qs.length]; if (!QSAID.has(c.id)) { ln = c; break; } } }
    if (!ln) { if (qs.length) { QSAID.clear(); ln = qs[start]; } else ln = own[S.taps % own.length]; }
    S.taps++; if (ln.src) QSAID.add(ln.id); else if (!S.said.includes(ln.id)) S.said.push(ln.id); save();
    const pick = ln.id, b = $('abubble');
    hush(); clearTimeout(onAureliaTap._t); ARIG.nod();
    if (inSchool) { const sc = inScene(); cap('aurelia', ln.t, ln.src); if (!sc) popIn('aurelia'); aureliaSay(pick, () => { capHide(ln.src ? 2600 : 1600); if (!sc) popOut('aurelia', 1500); }); return; }
    b.hidden = false; b.innerHTML = wordSpans(ln.t) + '<span class="who">Aurelia</span>'; b.classList.remove('say'); void b.offsetWidth; b.classList.add('say');
    aureliaSay(pick, () => { onAureliaTap._t = setTimeout(() => { b.hidden = true; }, 1800); });
  }
  function aureliaSay(id, after) {
    if (!ARIG || ARIG.hidden || !voiceOn()) { narrate(id, after); return; }
    ACUES = (AVIS && AVIS[id]) || null; ARIG.talk(20);
    narrate(id, () => { ARIG.hush(); if (after) after(); });
  }
  const wordSpans = t => t.split(/\s+/).map((w, i) => `<span style="--i:${i}">${w}</span>`).join(' ');

  /* ---------- the scene ---------- */
  function buildScene() {
    PORTICO = new Portico($('portico'));
    RIG = new MarcusRig.Figure($('mfig'));
    RIG.visemeAt = () => {
      const c = CUES; if (!c || MAR.paused) return 'X';
      const t = MAR.currentTime; let lo = 0, hi = c.length - 1, best = -1;
      while (lo <= hi) { const mid = (lo + hi) >> 1; if (c[mid][0] <= t) { best = mid; lo = mid + 1; } else hi = mid - 1; }
      return best < 0 ? 'X' : c[best][1];
    };
    ARIG = new MarcusRig.Figure($('afig'), MarcusRig.AURELIA_SVG, MarcusRig.AURELIA_PIVOTS); ARIG.show(false);
    ARIG.visemeAt = () => {
      const c = ACUES; if (!c || NAR.paused) return 'X';
      const t = NAR.currentTime; let lo = 0, hi = c.length - 1, best = -1;
      while (lo <= hi) { const mid = (lo + hi) >> 1; if (c[mid][0] <= t) { best = mid; lo = mid + 1; } else hi = mid - 1; }
      return best < 0 ? 'X' : c[best][1];
    };
    PORTICO.setWreaths(tiersDone()); PORTICO.setFlame(S.done.length ? 'lit' : 'out'); PORTICO.setPhase(skyFor());
    PORTICO.onTap('brazier', tapBrazier); PORTICO.onTap('olive', tapOlive); PORTICO.onTap('lyre', tapLyre);
    if (S.done.length) setTimeout(() => ambFire(true), 3000);
    $('mfig').addEventListener('click', onMarcusTap); $('afig').addEventListener('click', onAureliaTap);
    $('stage').addEventListener('pointerdown', e => { if (RIG && !RIG.hidden) RIG.lookAt(e.clientX, e.clientY); if (ARIG && !ARIG.hidden) ARIG.lookAt(e.clientX, e.clientY); }, { passive: true });
  }
  /* ---- things to touch in the portico: the brazier flares, the olive rustles and Aurelia reads a line, the lyre plays a while ---- */
  const atHome = () => $('stage').classList.contains('arrive');
  function tapBrazier(el) {
    ac(); sfx('flame'); PORTICO.flare(); sparks(); S.taps++; save();
    if (PORTICO.flame.classList.contains('out')) { PORTICO.setFlame('lit'); ambFire(true); clearTimeout(tapBrazier._t); tapBrazier._t = setTimeout(() => { if (!S.done.length) { PORTICO.setFlame('out'); ambFire(false); } }, 9000); }
  }
  function tapOlive(el) {
    ac(); el.classList.remove('rustle'); void el.getBoundingClientRect(); el.classList.add('rustle'); sfx('tap'); chirpOnce();
    if (!atHome()) return;
    const qs = LIB.filter(x => x.kind === 'quote' && x.id); if (!qs.length) return;
    const start = (daySeed() * 3 + S.taps) % qs.length; let q = null;
    for (let i = 0; i < qs.length; i++) { const c = qs[(start + i) % qs.length]; if (!QSAID.has(c.id)) { q = c; break; } }
    if (!q) { QSAID.clear(); q = qs[start]; } QSAID.add(q.id); S.taps++; save();
    hush(); clearTimeout(ROOMT); if (!RIG.hidden) RIG.smile(3); ARIG.point();
    cap('aurelia', q.t, q.by ? q.by + (q.src ? ' · ' + q.src : '') : ''); aureliaSay('ui-q-' + q.id, () => { capHide(2600); idleRoom(); });
  }
  function chirpOnce() { const ctx = ac(); if (!ctx || !S.sound) return; const t = ctx.currentTime, n = 3 + Math.floor(Math.random() * 3), base = 2400 + Math.random() * 1200;
    for (let i = 0; i < n; i++) { const t0 = t + i * .1, o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(base, t0); o.frequency.exponentialRampToValueAtTime(base * 1.3, t0 + .05); o.frequency.exponentialRampToValueAtTime(base * .9, t0 + .1);
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.05, t0 + .015); g.gain.exponentialRampToValueAtTime(.0005, t0 + .12); o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + .14); } }
  /* the lyre: plucked strings made in code (Karplus-Strong), a slow wander over a bright scale, about a minute, then it fades */
  const LYRE = { on: false, out: null, timer: null, bufs: new Map(), notes: [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25, 739.99, 880], last: 4 };
  function lyreBuf(ctx, f) {
    if (LYRE.bufs.has(f)) return LYRE.bufs.get(f);
    const N = Math.round(ctx.sampleRate / f), len = Math.round(ctx.sampleRate * 2.4), b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0), ring = new Float32Array(N);
    for (let i = 0; i < N; i++) ring[i] = Math.random() * 2 - 1;
    let idx = 0; for (let i = 0; i < len; i++) { const cur = ring[idx], nxt = ring[(idx + 1) % N]; ring[idx] = .995 * .5 * (cur + nxt); d[i] = cur; idx = (idx + 1) % N; }
    LYRE.bufs.set(f, b); return b;
  }
  function pluck(ctx, f, t0, vol) {
    const src = ctx.createBufferSource(); src.buffer = lyreBuf(ctx, f); const g = ctx.createGain(); g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(.0005, t0 + 2.2);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2800; src.connect(lp); lp.connect(g); g.connect(LYRE.out); src.start(t0); src.stop(t0 + 2.4);
  }
  /* the lyre plays a real piece: a strum on the tap, then about a minute of Chopin (Musopen, CC0), one after another day by day */
  const LYR = new Audio(); LYR.preload = 'none';
  function vol(el, v, ms) { clearInterval(el._vt); const from = el.volume, t0 = performance.now(); el._vt = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / ms); el.volume = from + (v - from) * k; if (k >= 1) clearInterval(el._vt); }, 50); }
  function lyreStart() {
    const ctx = ac(); if (!ctx || !S.sound) return; if (LYRE.on) return; LYRE.on = true;
    const out = ctx.createGain(); out.gain.value = .5; out.connect(ctx.destination); LYRE.out = out;
    const N = LYRE.notes, t = ctx.currentTime + .05; for (let i = 0; i < N.length; i++) pluck(ctx, N[i], t + i * .045, .2);
    const P = (C.music && C.music.pieces) || []; if (!P.length) { LYRE.on = false; return; }
    const pc = P[(daySeed() + (S.lyreN || 0)) % P.length]; S.lyreN = (S.lyreN || 0) + 1; save();
    LYR.src = 'audio/music/' + pc.id + '.mp3'; LYR.volume = 0; LYR.onended = () => lyreStop(0);
    LYRE.timer = setTimeout(() => { if (!LYRE.on) return; LYR.play().then(() => vol(LYR, .75, 2200)).catch(() => { LYRE.on = false; PORTICO.props.lyre.classList.remove('play'); }); }, 700);
    PORTICO.props.lyre.classList.add('play'); if (!MUS.paused) musicTo(.05, 900);
    toast(pc.name);
  }
  function lyreStop(ms) {
    if (!LYRE.on) return; LYRE.on = false; clearTimeout(LYRE.timer);
    vol(LYR, 0, ms || 800); setTimeout(() => { LYR.pause(); }, (ms || 800) + 60);
    try { LYRE.out.gain.linearRampToValueAtTime(0, ac().currentTime + 1); } catch (e) {}
    PORTICO.props.lyre.classList.remove('play'); if (!MUS.paused) musicTo(MUSV, 2500);
  }
  function lyreDuck(on) { if (!LYRE.on || LYR.paused) return; vol(LYR, on ? .2 : .75, on ? 300 : 1200); }
  function toast(text) { const old = document.querySelector('.toast'); if (old) old.remove(); const t = document.createElement('div'); t.className = 'toast'; t.textContent = text; $('stage').appendChild(t); setTimeout(() => { t.classList.add('gone'); setTimeout(() => t.remove(), 500); }, 3400); }
  function tapLyre(el) { ac(); sfx('tap'); el.classList.remove('hint'); if (LYRE.on) lyreStop(1000); else lyreStart(); }
  /* dawn at the first tablet, full morning by the middle, gold at the twenty-fifth */
  const skyFor = () => Math.min(1, S.done.length / C.moves.length);

  function onMarcusTap() {
    if (!RIG || RIG.hidden) return;
    sfx('tap'); S.taps++; save();
    if (MODE === 'scene' || MODE === 'welcome') return;
    if (MODE === 'school') { hush(); const all = Object.keys(LINES).filter(k => k.startsWith('m-')); S.taps++; save(); const inRoom = inScene(); marcusSay(fresh(all.slice(S.taps % all.length).concat(all)), ['wave', 'salute', 'think', 'nod', 'laugh'][S.taps % 5], () => { if (!inRoom) popOut('marcus', 1400); }); return; }
    if (MODE === 'rest' && line('c-help-rest') && !S.said.includes('c-help-rest')) { hush(); marcusSay(line('c-help-rest'), 'point'); return; }
    const poses = ['wave', 'salute', 'think', 'nod', 'laugh'];
    hush();
    const all = Object.keys(LINES).filter(k => k.startsWith('m-'));
    marcusSay(fresh(all.slice(S.taps % all.length).concat(all)), poses[S.taps % poses.length]);
  }

  /* ---------- HUD + laurel ---------- */
  function paintHud() {
    $('countn').textContent = S.done.length; $('countof').textContent = C.moves.length;
    const bar = $('laurelbar'); if (!bar.children.length) for (let i = 0; i < C.moves.length; i++) { const l = document.createElement('i'); l.className = 'leaf'; bar.appendChild(l); }
    [...bar.children].forEach((l, i) => l.classList.toggle('on', i < S.done.length));
    paintSound();
  }
  function popLeaf(i) { const l = $('laurelbar').children[i]; if (!l) return; l.classList.add('on'); l.classList.remove('popping'); void l.offsetWidth; l.classList.add('popping'); }

  /* ---------- the tablet ---------- */
  let CUR = null, MODE = 'task';
  /* whatever the phone, the tablet fits: measure the overflow and take it out of the scene */
  let FIT = 0;
  function fitDeck() {
    const deck = $('deck'), scene = $('scene'), stage = $('stage'), t = $('tablet'), tx = $('ttext');
    if (deck.hidden || t.hidden) return;
    deck.classList.add('measuring');
    const floor = Math.round(stage.clientHeight * .3);
    let h = scene.getBoundingClientRect().height, guard = 0;
    while (guard++ < 12) {
      const over = Math.max(deck.scrollHeight - deck.clientHeight, tx.scrollHeight - tx.clientHeight);
      if (over <= 0 || h <= floor) break;
      h = Math.max(floor, h - over - 2); scene.style.maxHeight = h + 'px';
    }
    deck.classList.remove('measuring');
  }
  function fitSoon() { clearTimeout(FIT); FIT = setTimeout(fitDeck, 60); setTimeout(fitDeck, 900); }
  window.addEventListener('resize', () => { $('scene').style.maxHeight = ''; fitSoon(); });
  function riseTablet() { const t = $('tablet'); t.hidden = false; t.classList.remove('sink'); fitSoon(); t.classList.remove('rise'); void t.offsetWidth; t.classList.add('rise'); }
  function setText(el, text) { el.innerHTML = '<div class="w">' + wordSpans(text) + '</div>'; el.classList.remove('say'); void el.offsetWidth; el.classList.add('say'); }
  function showTablet(m, autoRead) {
    CUR = m; MODE = 'task';
    const tier = C.tiers.find(x => x.id === m.tier), idx = C.moves.indexOf(m) + 1;
    $('tnum').textContent = 'Tablet ' + idx + ' of ' + C.moves.length; $('tkind').textContent = m.kind; $('tkind').className = 'kind kind-' + m.kind; $('tkind').hidden = false;
    $('tierline').textContent = tier.name + ' · ' + tier.line;
    setText($('ttext'), m.test);
    $('tfall').innerHTML = m.fallback ? '<b>No excuses.</b> ' + m.fallback : '';
    $('donebtn').textContent = 'Done'; $('donebtn').disabled = false; $('skipbtn').hidden = false; $('readbtn').hidden = false;
    riseTablet(); sfx('rise');
    if (RIG && !RIG.hidden) setTimeout(() => RIG.point(), 250);
    const pre = C.before && C.before[m.id];
    if (pre && line(pre) && !S.said.includes(pre)) setTimeout(() => marcusSay(line(pre), 'point'), 300);
    idleWatch(m);
    if (autoRead) { const go = () => { if (CUR === m && MODE === 'task') readTablet(); }; if (!MAR.paused && !MAR.ended) { const once = () => { MAR.removeEventListener('ended', once); setTimeout(go, 350); }; MAR.addEventListener('ended', once); } else setTimeout(go, 700); }
  }
  let IDLE = null;
  function idleWatch(m) { clearTimeout(IDLE); IDLE = setTimeout(() => { if (CUR === m && MODE === 'task' && MAR.paused && NAR.paused && line('c-idle') && !S.said.includes('c-idle')) marcusSay(line('c-idle'), 'think'); }, 60000); }
  function readTablet() {
    if (!CUR) return; const b = $('readbtn');
    if (!NAR.paused && NAR.src.includes('mv-' + CUR.id)) { NAR.pause(); b.classList.remove('on'); return; }
    MAR.pause(); if (RIG) RIG.hush(); b.classList.add('on'); narrate('mv-' + CUR.id);
  }
  /* the card between fives: a breath, one line pointing at the next five */
  function breakCard(b, then) {
    CUR = null; MODE = 'break';
    $('tnum').textContent = S.done.length + ' done'; $('tkind').hidden = true;
    const nx = remaining()[0]; $('tierline').textContent = nx ? 'Next: ' + C.tiers.find(x => x.id === nx.tier).name : '';
    setText($('ttext'), b.t); $('tfall').innerHTML = '';
    $('readbtn').hidden = true; $('skipbtn').hidden = true; $('donebtn').textContent = 'Next five'; $('donebtn').disabled = false;
    riseTablet(); sfx('scroll');
    breakCard._then = then;
  }
  function restTablet() {
    CUR = null; MODE = 'rest'; const next = remaining()[0];
    $('tnum').textContent = next ? S.done.length + ' of ' + C.moves.length : 'The twenty-five'; $('tkind').hidden = true;
    $('tierline').textContent = next ? 'Next: ' + C.tiers.find(x => x.id === next.tier).name : 'Done, every one';
    setText($('ttext'), next ? 'Marcus is here and the next tablet is ready when you are.' : 'Twenty-five things, and you did every one. More is being written, and the portico will be here.');
    $('tfall').innerHTML = ''; $('readbtn').hidden = true; $('skipbtn').hidden = true; $('donebtn').textContent = next ? 'Next tablet' : (C.door ? 'The door' : 'Sit with Marcus'); $('donebtn').disabled = false; $('donebtn').hidden = false;
    riseTablet();
  }
  function nextTablet(autoRead) { const r = remaining(); if (!r.length) { restTablet(); return; } showTablet(r[0], autoRead); }

  let busy = false;
  function onDone() {
    if (busy) return;
    if (MODE === 'welcome') { sfx('tap'); welcomeDone(); return; }
    if (MODE === 'break') { $('donebtn').classList.remove('arrive'); $('tablet').classList.add('sink'); sfx('tap'); hush(); setTimeout(() => { const t = breakCard._then; breakCard._then = null; if (t) t(); else nextTablet(true); }, 380); return; }
    if (MODE === 'rest') { const r = remaining(); if (r.length) { $('tablet').classList.add('sink'); setTimeout(() => nextTablet(true), 380); } else if (C.door) doorPanel(); else onMarcusTap(); return; }
    if (!CUR) return;
    busy = true; const m = CUR, i = S.done.length;
    S.done.push(m.id); S.skipped = S.skipped.filter(x => x !== m.id);
    const t = today(); if (!S.start) S.start = t; S.days[t] = (S.days[t] || 0) + 1; save();
    hush(); sfx('done'); popLeaf(i); $('countn').textContent = S.done.length;
    RIG.smile(1.8); if (ARIG && !ARIG.hidden) ARIG.smile(1.8); sparks();
    $('donebtn').disabled = true;
    PORTICO.glideTo(skyFor());
    if (i === 0) { PORTICO.setFlame('lit'); PORTICO.flare(); sfx('flame'); ambFire(true); }
    const finishedTier = tierDone(m.tier), finishedDeck = !remaining().length, finishedFive = S.done.length % 5 === 0;
    const tierIdx = C.tiers.findIndex(x => x.id === m.tier), fiveIdx = S.done.length / 5 - 1;
    // his answer: a line that fits the thing just done, or the body alone
    const sid = C.speak[m.id];
    let spoke = false;
    if (sid && !finishedFive && !finishedDeck) { spoke = true; setTimeout(() => marcusSay(line(sid), i % 3 === 0 ? 'cheer' : 'nod'), 650); }
    else if (!finishedFive && !finishedDeck && C.affirm) { const y = fresh(C.affirm.slice(i % C.affirm.length).concat(C.affirm)); if (y) setTimeout(() => marcusSay(y, i % 2 ? 'cheer' : 'nod'), 650); else RIG.cheer(); }
    else RIG.cheer();
    $('tablet').classList.add('sink');
    setTimeout(() => {
      busy = false;
      if (finishedTier) { PORTICO.hangWreath(tierIdx); sfx('wreath'); }
      if (finishedDeck) setTimeout(finale, 700);
      else if (finishedFive) setTimeout(() => theBreak(fiveIdx), 600);
      else nextTablet(true);
    }, spoke ? 1200 : 700);
  }
  /* a few gold sparks rise from the brazier */
  function sparks() {
    const sc = $('scene'), r = sc.getBoundingClientRect();
    for (let k = 0; k < 9; k++) { const s = document.createElement('i'); s.className = 'spark'; const x = 0.86 + (Math.random() - .5) * .08, y = 0.76 + Math.random() * .05;
      s.style.left = (x * 100) + '%'; s.style.top = (y * 100) + '%'; s.style.setProperty('--dx', ((Math.random() - .5) * 40).toFixed(0) + 'px'); s.style.setProperty('--dy', (-(40 + Math.random() * 70)).toFixed(0) + 'px'); s.style.animationDelay = (Math.random() * .35) + 's';
      sc.appendChild(s); setTimeout(() => s.remove(), 1900); }
  }
  function onSkip() {
    if (MODE === 'welcome') { sfx('tap'); welcomeDone(); return; }
    if (!CUR || busy) return; sfx('tap');
    if (!S.skipped.includes(CUR.id)) S.skipped.push(CUR.id); save();
    if (S.skipped.length === 1 && line('c-skip')) marcusSay(line('c-skip'), 'think');
    $('tablet').classList.add('sink'); setTimeout(() => nextTablet(true), 380);
  }
  /* after five: Marcus first, then Aurelia's one line, then the button */
  function theBreak(tierIdx) {
    const b = C.breaks[tierIdx]; if (!b) { nextTablet(true); return; }
    const say = (b.saySkip && S.skipped.length) ? b.saySkip : b.say;
    const quote = () => marcusSay(line(b.line), 'nod', () => { breakCard(b, () => nextTablet(true)); setTimeout(() => narrate('ui-break-' + b.after), 500); });
    const scene = (b.sceneSkip && S.skipped.length) ? b.sceneSkip : b.scene;
    if (scene) {
      ARIG.show(true); $('afig').classList.remove('walk-out-l', 'walk-in-l'); void $('afig').offsetWidth; $('afig').classList.add('walk-in-l');
      MODE = 'scene'; CUR = null; const t = $('tablet'); t.classList.add('welcome');
      $('tkind').hidden = true; $('tierline').textContent = ''; $('tfall').innerHTML = ''; $('readbtn').hidden = true; $('skipbtn').hidden = true; $('donebtn').hidden = true;
      $('tnum').textContent = ''; setText($('ttext'), ''); riseTablet();
      let i = 0; const step = () => {
        const ln = scene[i++];
        if (!ln) {
          $('afig').classList.remove('walk-in-l'); $('afig').classList.add('walk-out-l'); setTimeout(() => { ARIG.show(false); $('afig').classList.remove('walk-out-l'); }, 1100);
          t.classList.remove('welcome'); $('donebtn').hidden = false; MODE = 'break'; setTimeout(quote, 500); return;
        }
        $('tnum').textContent = ln.who === 'marcus' ? C.names.marcus : C.names.aurelia; setText($('ttext'), ln.t);
        if (ln.who === 'marcus') { ARIG.smile(3); marcusSay(line(ln.id) || { id: ln.id, t: ln.t }, i % 2 ? 'point' : 'nod', () => setTimeout(step, 450)); }
        else { RIG.smile(3); ARIG[i === 1 ? 'point' : 'nod'](); aureliaSay(ln.id, () => setTimeout(step, 450)); }
      };
      setTimeout(step, 1300); return;
    }
    if (say && line(say)) marcusSay(line(say), 'salute', () => setTimeout(quote, 400)); else quote();
  }
  function finScene(then) {
    const sc = C.finale.scene; if (!sc) { then(); return; }
    ARIG.show(true); $('afig').classList.remove('walk-out-l', 'walk-in-l'); void $('afig').offsetWidth; $('afig').classList.add('walk-in-l');
    MODE = 'scene'; CUR = null; const t = $('tablet'); t.classList.add('welcome');
    $('tkind').hidden = true; $('tierline').textContent = ''; $('tfall').innerHTML = ''; $('readbtn').hidden = true; $('skipbtn').hidden = true; $('donebtn').hidden = true; $('tnum').textContent = ''; setText($('ttext'), ''); riseTablet();
    let i = 0; const step = () => {
      const ln = sc[i++];
      if (!ln) { t.classList.remove('welcome'); $('donebtn').hidden = false; MODE = 'break'; then(); return; }
      $('tnum').textContent = ln.who === 'marcus' ? C.names.marcus : C.names.aurelia; setText($('ttext'), ln.t);
      if (ln.who === 'marcus') { ARIG.smile(3); marcusSay(line(ln.id) || { id: ln.id, t: ln.t }, 'nod', () => setTimeout(step, 450)); }
      else { RIG.smile(3); ARIG.point(); aureliaSay(ln.id, () => setTimeout(step, 450)); }
    };
    setTimeout(step, 1300);
  }
  function finale() {
    for (let i = 0; i < 40; i++) { const l = document.createElement('i'); l.className = 'leaffall'; l.style.left = Math.random() * 100 + '%'; l.style.animationDuration = (2.6 + Math.random() * 2.4) + 's'; l.style.animationDelay = (Math.random() * 1.6) + 's'; $('stage').appendChild(l); setTimeout(() => l.remove(), 6000); }
    RIG.cheer(); sfx('wreath'); PORTICO.glideTo(1, 3000); musicStart(.45);
    const last = () => marcusSay(line(C.finale.line), 'salute', () => finScene(() => {
      breakCard({ t: C.finale.t, after: 'finale' }, () => door()); $('tnum').textContent = 'Twenty-five'; $('donebtn').textContent = C.finale.go || 'Go to the door';
      setTimeout(() => aureliaSay('ui-deck', () => { ARIG.cheer(); if (C.finale.godoor) setTimeout(() => { ARIG.point(); aureliaSay('ui-godoor', () => { $('donebtn').classList.add('arrive'); }); }, 500); }), 600);
    }));
    setTimeout(() => { if (C.finale.say && line(C.finale.say)) marcusSay(line(C.finale.say), 'cheer', () => setTimeout(last, 400)); else last(); }, 800);
  }

  /* ---------- overlays ---------- */
  function veil(html, cls = '') { const o = $('overlay'); o.innerHTML = `<div class="veil in ${cls}">${html}</div>`; const v = o.firstElementChild; if (cls.includes('light')) v.addEventListener('click', e => { if (e.target === v) { sfx('tap'); NAR.pause(); (v._close || closeVeil)(); } }); return v; }
  /* the back button: top left, always the same, and it goes exactly where you came from */
  const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  function backBtn(v, fn) { const b = document.createElement('button'); b.className = 'backbtn'; b.setAttribute('aria-label', 'Back'); b.innerHTML = CHEV; b.addEventListener('click', e => { e.stopPropagation(); sfx('tap'); NAR.pause(); fn(); }); v.appendChild(b); v._close = fn; return b; }
  function stageBack(fn) { const b = $('stageback'); b.hidden = !fn; b.onclick = fn ? () => { sfx('tap'); fn(); } : null; }
  function closeVeil(then) { const v = $('overlay').firstElementChild; if (!v) { if (then) then(); return; } v.classList.remove('in'); v.classList.add('out'); setTimeout(() => { $('overlay').innerHTML = ''; if (then) then(); }, 480); }

  function cover() {
    const back = S.done.length > 0, cv = C.cover, left = C.moves.length - S.done.length;
    const v = veil(`<div class="cover">
      <h1><span class="em">${cv.em}</span><span class="t">${cv.title}</span></h1>
      <p class="tag">${back ? (left ? `Welcome back. ${S.done.length} of ${C.moves.length} done, ${left} to go. Marcus is waiting.` : 'Welcome back. The twenty-five are done. Marcus is waiting.') : cv.tag}</p>
      <button class="btn btn-gold" id="begin">${(back || S.member) ? 'Go in' : cv.begin}</button>
      <button class="what" id="what">${cv.what}</button>
      <button class="what" id="codelink">${S.member ? 'Member' : (C.door && C.door.code) || 'I have a code'}</button>
      <button class="what" id="sharelink">${C.share ? C.share.btn : 'Share'}</button>
      <div class="small">Sound on is the whole point. Headphones are lovely.</div>
    </div>`);
    v.querySelector('#codelink').addEventListener('click', () => { sfx('tap'); codePanel(true); });
    v.querySelector('#sharelink').addEventListener('click', () => { sfx('tap'); sharePanel(cover); });
    v.querySelector('#begin').addEventListener('click', () => {
      ac(); MAR.muted = true; MAR.src = 'audio/marcus/m-g1.mp3'; MAR.play().then(() => { MAR.pause(); MAR.muted = false; MAR.currentTime = 0; }).catch(() => { MAR.muted = false; });
      musicStart(); ambStart();
      if (S.member && SCH) { sfx('tap'); NAR.muted = true; NAR.src = 'audio/voice/ui-first.mp3'; NAR.play().then(() => { NAR.pause(); NAR.muted = false; }).catch(() => { NAR.muted = false; }); closeVeil(enterSchool); }
      else if (back) { sfx('tap'); NAR.muted = true; NAR.src = 'audio/voice/ui-first.mp3'; NAR.play().then(() => { NAR.pause(); NAR.muted = false; }).catch(() => { NAR.muted = false; }); closeVeil(enter); }
      else { sfx('begin'); closeVeil(welcome); }
    });
    v.querySelector('#what').addEventListener('click', () => { sfx('tap'); whatIsThis(); });
  }
  /* the welcome: the two of them in the portico, in turns, the line beneath them */
  function welcome() {
    $('hud').hidden = true; $('deck').hidden = false; paintHud();
    MODE = 'welcome'; CUR = null;
    const t = $('tablet'); t.hidden = false; t.classList.add('welcome');
    $('tnum').textContent = ''; $('tkind').hidden = true; $('tierline').textContent = '';
    $('tfall').innerHTML = ''; $('readbtn').hidden = true; $('skipbtn').hidden = false; $('skipbtn').textContent = C.welcome.skip;
    $('donebtn').textContent = C.welcome.ready; $('donebtn').hidden = true;
    setText($('ttext'), '');
    plates(true); RIG.enter(); setTimeout(() => { ARIG.show(true); $('afig').classList.remove('walk-in-l'); void $('afig').offsetWidth; $('afig').classList.add('walk-in-l'); setTimeout(() => ARIG.bow(), 950); }, 500);
    let i = 0, alive = true; welcome._stop = () => { alive = false; };
    const next = () => {
      if (!alive) return;
      const ln = C.welcome.lines[i++];
      if (!ln) { $('donebtn').hidden = false; $('donebtn').classList.add('arrive'); $('skipbtn').hidden = true; return; }
      $('tnum').textContent = ln.who === 'marcus' ? 'Marcus Aurelius' : 'Aurelia, keeper of the flame';
      setText($('ttext'), ln.t);
      const after = () => setTimeout(next, 650);
      if (ln.who === 'marcus') { const l = line(ln.id) || { id: ln.id, t: ln.t }; marcusSay(l, i % 2 ? 'point' : 'nod', after); $('bubble').hidden = true; }
      else { ARIG[i === 1 ? 'wave' : 'nod'](); aureliaSay(ln.id, after); }
    };
    setTimeout(next, 2400);
  }
  function plates(on) { document.querySelectorAll('.nameplate').forEach(n => n.remove()); if (!on) return; $('scene').insertAdjacentHTML('beforeend', `<div class="nameplate a">${C.names.aurelia}</div><div class="nameplate m">${C.names.marcus}</div>`); }
  function platesFade() { document.querySelectorAll('.nameplate').forEach(n => { n.classList.add('fade'); setTimeout(() => n.remove(), 900); }); }
  function welcomeDone() {
    if (welcome._stop) welcome._stop(); hush(); $('bubble').hidden = true; platesFade();
    $('tablet').classList.remove('welcome'); $('skipbtn').textContent = 'Not this one today'; $('donebtn').hidden = false; $('donebtn').classList.remove('arrive');
    $('afig').classList.remove('walk-in-l'); $('afig').classList.add('walk-out-l'); setTimeout(() => { ARIG.show(false); $('afig').classList.remove('walk-out-l'); }, 1100);
    $('hud').hidden = false; S.visits++; save();
    $('tablet').classList.add('sink'); setTimeout(() => nextTablet(true), 500);
  }
  function whatIsThis() {
    const w = C.what;
    const v = veil(`<div class="panel whatcard">
      <h2>${w.title}</h2><p class="who">${w.who}</p>
      ${w.paras.map(p => `<p>${p}</p>`).join('')}
      <div class="row" style="margin-top:6px"><button class="btn btn-gold" id="whatok" style="flex:1">${S.done.length ? 'Go in' : 'Begin'}</button></div>
    </div>`, 'light');
    backBtn(v, () => closeVeil(cover));
    v.querySelector('#whatok').addEventListener('click', () => { sfx('tap'); closeVeil(cover); setTimeout(() => { const b = $('begin'); if (b) b.click(); }, 520); });
  }
  function enter() {
    $('hud').hidden = false; $('deck').hidden = false; paintHud();
    if (S.done.length === 0) S.said = [];            // a fresh sitting starts with every line fresh
    const visit = S.visits++; save();
    RIG.enter();
    const greet = () => marcusSay(line(S.done.length === 0 && visit === 0 ? 'c-enter' : 'c-return') || fresh(C.greet), null, () => setTimeout(() => nextTablet(true), 500));
    setTimeout(greet, 1300);
  }
  /* ---------- the door: the two of them, then the application ---------- */
  function door() {
    const D = C.door; if (!D) { restTablet(); return; }
    ARIG.show(true); $('afig').classList.remove('walk-out-l', 'walk-in-l'); void $('afig').offsetWidth; $('afig').classList.add('walk-in-l');
    MODE = 'scene'; CUR = null; const t = $('tablet'); t.classList.add('welcome');
    $('tkind').hidden = true; $('tierline').textContent = ''; $('tfall').innerHTML = ''; $('readbtn').hidden = true; $('skipbtn').hidden = true; $('donebtn').hidden = true; $('tnum').textContent = ''; setText($('ttext'), ''); riseTablet();
    let i = 0; const step = () => {
      const ln = D.scene[i++];
      if (!ln) { t.classList.remove('welcome'); MODE = 'break'; doorPanel(); return; }
      $('tnum').textContent = ln.who === 'marcus' ? C.names.marcus : C.names.aurelia; setText($('ttext'), ln.t);
      if (ln.who === 'marcus') { ARIG.smile(3); marcusSay(line(ln.id) || { id: ln.id, t: ln.t }, i === 4 ? 'point' : 'nod', () => setTimeout(step, 450)); }
      else { RIG.smile(3); ARIG[i === 5 ? 'point' : 'nod'](); aureliaSay(ln.id, () => setTimeout(step, 450)); }
    };
    setTimeout(step, 1300);
  }
  function doorPanel() {
    const D = C.door, F = D.fields, A = S.apply || {};
    const v = veil(`<div class="panel doorcard">
      <div class="eyebrow"><i></i>${D.title}</div>
      <p class="lede">${D.lede}</p>
      <form id="applyform">
        <label>${F.name}<input name="name" required autocomplete="name" value="${A.name || ''}"></label>
        <label>${F.email}<input name="email" type="email" required autocomplete="email" value="${A.email || ''}"></label>
        <label>${F.felt}<textarea name="felt" rows="3" required>${A.felt || ''}</textarea></label>
        <div class="whichl">${F.which}</div>
        <div class="which">${D.which.map(([k, l], n) => `<label class="opt"><input type="radio" name="which" value="${k}" ${(A.which || 'community') === k ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>
        <button class="btn btn-gold" type="submit" style="width:100%">${D.send}</button>
      </form>
      <button class="what dark" id="codebtn">${D.code}</button>
      <button class="what dark" id="doorshare">${C.share.btn}</button>
    </div>`, 'light');
    backBtn(v, () => closeVeil(() => { ARIG.show(false); restTablet(); }));
    v.querySelector('#applyform').addEventListener('submit', async e => {
      e.preventDefault(); sfx('tap'); const fd = new FormData(e.target); const data = Object.fromEntries(fd.entries());
      S.apply = { ...data, done: S.done.length, skipped: S.skipped.length, at: new Date().toISOString() }; save();
      const body = `Light School application\n\nName: ${data.name}\nEmail: ${data.email}\nDoor: ${data.which}\nTablets done: ${S.done.length} of ${C.moves.length}, skipped ${S.skipped.length}\n\nWhat they felt by the twenty-fifth:\n${data.felt}`;
      let sent = false;
      if (D.apply.web3forms) {
        try { const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ access_key: D.apply.web3forms, subject: 'Light School application: ' + data.name, from_name: 'Light School', name: data.name, email: data.email, message: body }) }); sent = r.ok; } catch (err) {}
      }
      if (!sent) location.href = 'mailto:' + D.apply.to + '?subject=' + encodeURIComponent('Light School application: ' + data.name) + '&body=' + encodeURIComponent(body);
      const p = v.querySelector('.doorcard'); p.innerHTML = `<div class="eyebrow"><i></i>${D.title}</div><h2>${D.sent}</h2><p class="lede">Marcus and Aurelia will be here tomorrow, and the tablets stay yours.</p><button class="btn btn-gold" id="doorback2" style="width:100%">Back to the portico</button>`;
      p.querySelector('#doorback2').addEventListener('click', () => { sfx('tap'); closeVeil(() => { ARIG.show(false); restTablet(); }); });
    });
    v.querySelector('#codebtn').addEventListener('click', () => { sfx('tap'); codePanel(); });
    v.querySelector('#doorshare').addEventListener('click', () => { sfx('tap'); sharePanel(doorPanel); });
  }
  function codePanel(fromCover) {
    const D = C.door;
    const v = veil(`<div class="panel doorcard">
      <div class="eyebrow"><i></i>${D.codeTitle}</div>
      <p class="lede">${D.codeLede}</p>
      <form id="codeform"><label>${D.codeTitle}<input name="code" required autocomplete="off" autocapitalize="characters" value="${S.code || ''}"></label>
        <button class="btn btn-gold" type="submit" style="width:100%">Open</button></form>
    </div>`, 'light');
    backBtn(v, () => closeVeil(fromCover ? cover : doorPanel));
    v.querySelector('#codeform').addEventListener('submit', e => { e.preventDefault(); sfx('tap'); S.code = new FormData(e.target).get('code').trim(); save();
      const good = (C.codes || []).some(k => k.toLowerCase() === S.code.toLowerCase());
      if (good && SCH) { S.member = true; save(); ac(); musicStart(.4); ambStart(); closeVeil(enterSchool); return; }
      const p = v.querySelector('.doorcard'); p.innerHTML = `<div class="eyebrow"><i></i>${D.codeTitle}</div><h2>Kept.</h2><p class="lede">${D.codeSoon}</p><button class="btn btn-gold" id="codeback2" style="width:100%">Back to the portico</button>`;
      p.querySelector('#codeback2').addEventListener('click', () => { sfx('tap'); closeVeil(() => { ARIG.show(false); restTablet(); }); }); });
  }
  /* where the two of them stand: in the portico, or popped in at the edge of the screen */
  function dock(where) {
    const pop = $('pop'), scene = $('scene');
    if (where === 'pop') { pop.appendChild($('afig')); pop.appendChild($('abubble')); pop.appendChild($('mfig')); pop.appendChild($('bubble')); $('stage').classList.add('popmode'); }
    else { scene.appendChild($('afig')); scene.appendChild($('abubble')); scene.appendChild($('mfig')); scene.appendChild($('bubble')); $('stage').classList.remove('popmode'); }
  }
  let POPT = {}, CAPT = null, CAPLITE = null;
  const capAll = () => [$('popcap'), $('capband'), SHOW && SHOW.querySelector('#showcap')].filter(Boolean);
  const capTarget = () => SHOW ? SHOW.querySelector('#showcap') : (inScene() ? $('capband') : $('popcap'));
  function cap(who, text, src) {
    const c = capTarget(); if (!c) return; clearTimeout(CAPT);
    capAll().forEach(x => { if (x !== c) { x.hidden = true; x.classList.remove('away'); } });
    c.hidden = false; c.classList.remove('away');
    c.innerHTML = `<b>${who === 'marcus' ? (src ? C.names.marcus : 'Marcus') : 'Aurelia'}</b>${wordSpans(CAPLITE || text)}${src && !CAPLITE ? `<i>${src}</i>` : ''}`;
    c.classList.remove('say'); void c.offsetWidth; c.classList.add('say');
  }
  function capHide(delay) { clearTimeout(CAPT); CAPT = setTimeout(() => { capAll().forEach(x => { x.hidden = true; x.classList.remove('away'); }); }, delay || 0); }
  function capAway(el) { if (el.hidden || el.classList.contains('away')) return; el.classList.add('away'); setTimeout(() => { el.hidden = true; el.classList.remove('away'); }, 260); }
  function capSwipe(el) {
    let x0 = null, y0 = null;
    el.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY; }, { passive: true });
    el.addEventListener('pointermove', e => { if (x0 === null) return; if (Math.abs(e.clientX - x0) > 18 || Math.abs(e.clientY - y0) > 18) { x0 = null; capAway(el); } }, { passive: true });
    el.addEventListener('pointerup', () => { if (x0 !== null) capAway(el); x0 = null; });
    el.addEventListener('pointercancel', () => { x0 = null; });
  }
  function popIn(who) {
    const el = $(who === 'marcus' ? 'mfig' : 'afig'), rig = who === 'marcus' ? RIG : ARIG;
    if (S.popins === false && !inScene()) return;
    clearTimeout(POPT[who]); el.classList.remove('popout'); rig.show(true); el.classList.add('popin');
  }
  function popOut(who, delay) {
    const el = $(who === 'marcus' ? 'mfig' : 'afig'), rig = who === 'marcus' ? RIG : ARIG;
    clearTimeout(POPT[who]); POPT[who] = setTimeout(() => { el.classList.remove('popin'); el.classList.add('popout'); setTimeout(() => { rig.show(false); el.classList.remove('popout'); }, 700); }, delay || 0);
  }
  /* ---------- the school: the rooms beyond the door ----------
     Three principles lifted from the school app, because they worked there:
     Next thing is ONE card and a level bar, nothing else. The long game is up
     to three things taken on deliberately, a dot per step, a bit today.
     Everything is families, then rooms, then ladders. And every day begins
     in the portico: the two of them, where you stand, three for today. */
  let TAB = 'next', CAT = null, SAIDCAT = new Set(), LONGSAID = false, LIB = [], SHOW = null, SHOWN = 0, ROOM_FROM = null;
  const inSceneNow = () => inScene();
  const inScene = () => { const c = $('stage').classList; return c.contains('room') || c.contains('arrive') || c.contains('portico'); };
  const skey = (tr, st) => tr.id + '#' + st.n;
  const sdone = k => !!S.school.done[k];
  const trackDone = tr => tr.steps.filter(s => sdone(skey(tr, s))).length;
  const nextStep = tr => tr.steps.find(s => !sdone(skey(tr, s)));
  const catOf = tr => SCH.categories.find(c => c.tracks.includes(tr));
  const allTracks = () => SCH.categories.flatMap(c => c.tracks);
  const trackById = id => allTracks().find(t => t.id === id);
  const findStep = key => { for (const tr of allTracks()) for (const st of tr.steps) if (skey(tr, st) === key) return [tr, st]; return null; };
  const points = () => Object.keys(S.school.done).length + S.done.length + (S.school.refresh || 0);
  /* ---- going rusty ----
     His rule, and it replaced the opposite one: you do NOT get to tick a step
     because you could do it once. "A lot of people might have fasted a year or
     two ago and they lost their ability to do it, or you might be able to hold
     your breath for two minutes a few years ago but now you can't." So a step
     counts from the day you actually do it, and six months later it fades and
     is worth doing again.
     What must NEVER happen here: points going down, completion going down, or
     the flame dimming for it. What falls is a ladder's SHARPNESS, which is its
     own bar. Re-earning a faded step is worth a fresh point, so keeping a skill
     pays the same as getting it and the number still only ever climbs. */
  const FADE_DAYS = 180;
  const doneAt = k => { const v = S.school.done[k], ms = v ? Date.parse(v) : NaN; return isNaN(ms) ? null : ms; };
  const isFaded = k => { const t = doneAt(k); return t !== null && (Date.now() - t) / 864e5 >= FADE_DAYS; };
  const sharpOf = tr => { const done = tr.steps.filter(st => sdone(skey(tr, st)));
    const keen = done.filter(st => !isFaded(skey(tr, st))).length;   // not `fresh` — that is a global
    return { done: done.length, fresh: keen, faded: done.length - keen,
      pct: done.length ? Math.round(keen / done.length * 100) : 100 }; };
  const whenText = k => { const t = doneAt(k); return t === null ? ''
    : new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); };
  function rankOf(p) { const R = C.school.ranks; let r = R[0], nx = null; for (let i = 0; i < R.length; i++) { if (p >= R[i][0]) { r = R[i]; nx = R[i + 1] || null; } } return { name: r[1], at: r[0], next: nx }; }
  function daysLit() { const s = new Set(Object.keys(S.days).filter(k => S.days[k] > 0)); for (const k in S.school.done) { const v = S.school.done[k]; if (typeof v === 'string') s.add(v.slice(0, 10)); } return s; }
  function seededShuffle(arr, seed) { const out = arr.slice(); let x = seed; for (let i = out.length - 1; i > 0; i--) { x = (x * 9301 + 49297) % 233280; const j = Math.floor(x / 233280 * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; } return out; }
  const daySeed = () => { const d = today(); return (+d.slice(0, 4)) * 372 + (+d.slice(5, 7)) * 31 + (+d.slice(8, 10)); };
  const started = () => allTracks().filter(tr => trackDone(tr) >= 1 && nextStep(tr) && !(S.school.projects || []).includes(tr.id)).sort((x, y) => (S.school.done[skey(y, y.steps[trackDone(y) - 1])] || '').localeCompare(S.school.done[skey(x, x.steps[trackDone(x) - 1])] || ''));
  function carryCard(limit) {
    const st = started().slice(0, limit || 4); if (!st.length) return '';
    const K = C.school.carry;
    return `<div class="acard carry"><span class="eyebrow">${K.title}</span>` + st.map(tr => { const c = catOf(tr), s = nextStep(tr), n = trackDone(tr); return `<button class="crow" style="--c:${c.accent};--c2:${c.accent2}" data-step="${skey(tr, s)}"><img src="images/track/${tr.id}.jpg" alt="" onerror="this.src='images/cat/${c.id}.jpg'"><span><strong>${tr.name}</strong><small>Step ${n + 1} of ${tr.steps.length} · ${s.test}</small></span><i class="cprog"><b style="width:${Math.round(n / tr.steps.length * 100)}%"></b></i></button>`; }).join('') + '</div>';
  }
  /* the quick ones: the journey's easy wins, then any track's first step, not yet done */
  const NOW = new Set(['room']), LATER = new Set(['kit', 'with', 'out', 'home']);
  const needsOf = st => LATER.has(st.ctx) ? st.ctx : null;
  function quickCandidates(which) {
    const ok = ([tr, st]) => which === 'later' ? LATER.has(st.ctx) : NOW.has(st.ctx);
    const easy = (SCH.journey.find(j => j.id === 'easy') || { steps: [] }).steps.map(findStep).filter(Boolean).filter(([tr, st]) => !sdone(skey(tr, st))).filter(ok);
    const firsts = allTracks().map(tr => [tr, nextStep(tr)]).filter(([tr, st]) => st && st.n === 1 && !easy.some(([t2]) => t2 === tr)).filter(ok);
    const room = firsts.filter(([tr, st]) => st.ctx === 'room'), rest = firsts.filter(([tr, st]) => st.ctx !== 'room');
    return seededShuffle(easy, daySeed()).concat(seededShuffle(room, daySeed() + 7), seededShuffle(rest, daySeed() + 11));
  }
  function todayPicks(which) {
    const T = S.school.today; const d = today();
    if (!T || T.date !== d) S.school.today = { date: d, picks: [], later: [], skip: [] };
    const t = S.school.today; t.later = t.later || [];
    const key = which === 'later' ? 'later' : 'picks', limit = which === 'later' ? 4 : 6;
    const cand = quickCandidates(which).map(([tr, st]) => skey(tr, st));
    t[key] = t[key].filter(k => { const r = findStep(k); return r && !sdone(k) && (which === 'later' ? LATER.has(r[1].ctx) : NOW.has(r[1].ctx)); });
    for (const k of cand) { if (t[key].length >= limit) break; if (!t[key].includes(k) && !t.skip.includes(k)) t[key].push(k); }
    save(); return t[key].map(findStep).filter(Boolean);
  }
  const levelTwo = () => allTracks().filter(tr => trackDone(tr) === 1 && !(S.school.projects || []).includes(tr.id)).map(tr => [tr, nextStep(tr)]).filter(([tr, st]) => st && NOW.has(st.ctx)).slice(0, 4);
  function notThis(key) { const t = S.school.today; t.skip.push(key); t.picks = t.picks.filter(k => k !== key); t.later = (t.later || []).filter(k => k !== key); save(); }

  function enterSchool() {
    $('stage').classList.add('school'); $('deck').hidden = true; $('school').hidden = false; $('hud').hidden = false;
    $('shead').appendChild($('hud')); paintSchoolCount();
    if (!$('rankbar')) { $('countpill').hidden = true; $('hud').insertAdjacentHTML('afterbegin', `<div id="rankbar" class="daywrap">${rankBar()}</div><button class="facebtn ${S.popins === false ? 'off' : ''}" id="facebtn" aria-label="${C.help ? C.help.popins : 'Pop-ups'}"><img src="images/mentors/marcus.jpg" alt=""><i></i></button>`);
      $('facebtn').addEventListener('click', () => { S.popins = S.popins === false; save(); sfx('tap'); $('facebtn').classList.toggle('off', S.popins === false); if (S.popins === false) { hush(); popOut('marcus', 0); popOut('aurelia', 0); } }); }
    if (!$('homebtn').dataset.sun) { $('homebtn').dataset.sun = '1'; $('homebtn').querySelector('svg').outerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9h18M4 9v10M9 9v10M15 9v10M20 9v10M2 19h20M12 3l9 6H3z"/></svg>'; }
    plates(false); MODE = 'school'; CUR = null; $('mfig').classList.remove('walk-in');
    const d = today(), fresh0 = !S.school.arrivedEver;
    const again = S.school.arrived === d; S.school.arrived = d; S.school.visits = (S.school.visits || 0) + 1; save(); arrival(fresh0, again);
  }
  const paintSearchBtn = () => { const b = $('searchbtn'); if (b) b.classList.toggle('on', SEARCH !== null); };
  function paintSchoolCount() { const p = points(), r = rankOf(p); $('countn').textContent = p; const of = $('countn').nextElementSibling; of.hidden = false; of.textContent = r.name; paintRank(); paintDay(); }
  /* ---- the arrival: the portico, the two of them, where you stand, three for today ---- */
  let HOMEN = 0;
  function goHome() { ROOMV = null; if ($('stage').classList.contains('arrive')) { hush(); renderArrival(); $('slist').scrollTop = 0; return; }
    hush(); clearTimeout(ROOMT); HOMEN++; CAT = null; TRK = null; SEARCH = null; paintSearchBtn(); arrival(false, true, true); }
  const todayQuick = () => { const t = today(); return Object.values(S.school.done).some(v => typeof v === 'string' && v.startsWith(t)); };
  function dayCount() { const t = today(); const q = Object.values(S.school.done).filter(v => typeof v === 'string' && v.startsWith(t)).length; const pr = Object.values(S.school.practice || {}).filter(p => p.days && p.days[t]).length; return q + pr; }
  function dayBar() { const G = C.school.goal || { n: 3 }, n = dayCount(), pct = Math.min(100, Math.round(n / G.n * 100)), over = G.overAt && n >= G.overAt; return `<div class="daybar ${n >= G.n ? 'full' : ''} ${over ? 'over' : ''}" title="${G.lede || ''}"><i style="width:${pct}%"></i><span>${over ? (G.over + ' · ' + n) : n >= G.n ? G.done : (n + ' of ' + G.n + ' ' + (G.label || 'today'))}</span></div>`; }
  function paintDay() { const b = $('daybar'); if (b) b.outerHTML = `<div id="daybar" class="daywrap">${dayBar()}</div>`; }
  /* ---- days in a row ----
     Turning up every day is its own thing and it gets its own trophies, but it
     is NOT allowed to gate the bar. Earned on your LONGEST run ever, so a
     missed day never takes one back — the old rule holds: it dims, it never
     resets, it never scolds. */
  const dayNum = k => Math.round(Date.parse(k + 'T12:00:00') / 864e5);
  function runInfo() {
    const days = [...daysLit()].map(dayNum).filter(n => !isNaN(n)).sort((a, b) => a - b);
    let best = 0, run = 0, prev = null;
    days.forEach(d => { run = (prev !== null && d === prev + 1) ? run + 1 : 1; prev = d; if (run > best) best = run; });
    const t = dayNum(today());
    const cur = days.length && (prev === t || prev === t - 1) ? run : 0;
    return { cur, best, total: days.length };
  }
  /* The bar at the top is the RANK bar, and it moves on every single thing you
     do. His argument, and it is the right one: "when I can just keep going with
     activity and see the bar racing up, it's very fun... if I have to do it by
     day it slows down the progress — it's like somebody paid by the hour versus
     a business owner who can go full speed." Nothing here caps at a day. */
  function rankBar() {
    const p = points(), r = rankOf(p);
    const pct = r.next ? Math.max(2, Math.round((p - r.at) / (r.next[0] - r.at) * 100)) : 100;
    return `<div class="daybar rankbar ${r.next ? '' : 'full'}"><i style="width:${pct}%"></i>
      <span><b>${p}</b> · ${r.name}${r.next ? ' · ' + (r.next[0] - p) + ' to ' + r.next[1] : ''}</span></div>`;
  }
  function paintRank() { const b = $('rankbar'); if (b) b.outerHTML = `<div id="rankbar" class="daywrap">${rankBar()}</div>`; }
  function checkDay() {
    const G = C.school.goal || { n: 3 }, t = today(); if (dayCount() < G.n || S.school.celebrated === t) { paintDay(); return; }
    S.school.celebrated = t; save(); paintDay();
    setTimeout(() => { hush(); sfx('wreath'); shower(); if (inScene()) { sparks(); PORTICO.flare(); } const hers = (S.school.visits || 0) % 2 === 0; speakSchool(hers ? [{ who: 'aurelia', id: 'ui-day', t: C.voice['day'] }] : [{ who: 'marcus', id: 'c-day' }]); }, 1800);
  }
  const todayLong = () => projects().some(tr => !!prac(tr).days[today()]);
  const unpop = () => { clearTimeout(POPT.marcus); clearTimeout(POPT.aurelia); };
  function arrival(first, again, quiet) {
    const st = $('stage'); st.classList.add('arrive'); st.classList.remove('room', 'portico'); clearTimeout(ROOMT); stageBack(null); capHide(0); unpop(); dock('scene');
    $('mfig').classList.remove('popin', 'popout'); $('afig').classList.remove('popin', 'popout');
    RIG.enter(); setTimeout(() => { ARIG.show(true); $('afig').classList.remove('walk-out-l', 'walk-in-l', 'popin', 'popout'); void $('afig').offsetWidth; $('afig').classList.add('walk-in-l'); }, 350);
    $('stabs').hidden = true; $('sline').textContent = ''; MODE = 'school';
    if (MUS.paused) musicStart(.4); ambStart(); if (points()) ambFire(true);
    renderArrival(); idleRoom(50000);
    if ((S.school.visits || 0) <= 4 && S.taps < 3) setTimeout(() => PORTICO.props.lyre.classList.add('hint'), 2500);
    const vn = (S.school.visits || 0) + HOMEN;
    let lines = quiet ? [] : (first ? C.arrival.first : (again && C.arrival.again ? C.arrival.again[vn % C.arrival.again.length] : C.arrival.lines)); S.school.arrivedEver = true; save();
    // and something from them: one of her true lines, or one of his, in turn
    if (!first) { const hers = vn % 2 === 0; if (hers) { const ids = C.aurelia.lines.map(l => l.id); const id = ids[(S.school.visits || 0) % ids.length]; const ln = C.aurelia.lines.find(l => l.id === id); lines = lines.concat([{ who: 'aurelia', id, t: ln.t }]); } else { const all = Object.keys(LINES).filter(k => k.startsWith('m-')); const ln = fresh(all.slice((S.school.visits || 0) % all.length).concat(all)); if (ln) lines = lines.concat([{ who: 'marcus', id: ln.id, t: ln.t }]); } }
    clearTimeout(arrival._t); arrival._t = setTimeout(() => { if ($('stage').classList.contains('arrive')) speakSchool(lines); }, 1500);
  }
  function standLine() { const L = C.arrival.stand.lines || []; return L.length ? L[(daySeed() + (S.school.visits || 0) + HOMEN) % L.length] : ''; }
  /* Two things, not three numbers in a row. He could not tell what the bar was
     measuring because DAYS sat on the left of it — so how far you have come is
     its own block now, and turning up every day is its own block under it, and
     both of them open. "I'd like that's just its own thing that looks really
     exciting... and even if it has its own page so if you tap on it you can see
     progress. Right now you can't tap on it." */
  function standCard(inPanel) {
    const p = points(), r = rankOf(p), A = C.arrival.stand;
    const pct = r.next ? Math.max(2, Math.round((p - r.at) / (r.next[0] - r.at) * 100)) : 100;
    const body = `<div class="rankface"><span class="rf-n"><b>${p}</b><small>${A.steps}</small></span>
        <span class="rf-r"><strong>${r.name}</strong>${r.next
          ? `<small><b>${r.next[0] - p}</b> to ${r.next[1]}</small>` : `<small>${A.rank}</small>`}</span></div>
      <div class="lvl"><i style="width:${pct}%"></i></div>
      <p class="lvlcap">${r.next ? fmt1(A.lvlcap || 'Every single thing you do moves this. {n} more to {name}.',
        { n: r.next[0] - p, name: r.next[1] }) : (A.lvlcapTop || 'The top of the list, and the school keeps growing.')}</p>`;
    return inPanel ? body : `<button class="standtap" data-panel="progress">${body}<span class="tapmore">${A.seeProgress || 'See how far you have come'} ›</span></button>`;
  }
  /* the run, in the shape he already likes from the Next thing tab */
  function weekStrip() {
    const lit = daysLit(), t = today(), days = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d); }
    const dk = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    return `<div class="wrow">${days.map(d => `<span class="wk ${lit.has(dk(d)) ? 'on' : ''} ${dk(d) === t ? 'td' : ''}"><i></i><b>${d.toLocaleDateString('en-GB', { weekday: 'narrow' })}</b></span>`).join('')}</div>`;
  }
  function runCard(inPanel) {
    const run = runInfo(), A = C.arrival.stand, R = C.school.runs || {}, lit = daysLit();
    const nx = (R.levels || []).find(l => run.best < l[0]);
    const body = `<div class="runtop"><span class="rt-n"><b>${run.cur}</b><small>${A.run || 'days in a row'}</small></span>
        <span class="rt-t">${run.best ? `<strong>${run.best}</strong><small>${R.bestLabel || 'your longest'}</small>` : ''}</span></div>
      ${weekStrip()}
      <p class="runcap">${lit.size ? fmt1(R.lit || '{n} day{s} lit altogether.', { n: lit.size, s: lit.size === 1 ? '' : 's' }) : (R.none || 'One light a day is the whole habit.')}${
        nx ? ' ' + fmt1(R.toNext || '{n} more in a row for {name}.', { n: nx[0] - run.best, name: nx[1] }) : ''}</p>`;
    return inPanel ? body : `<button class="standtap runtap" data-panel="run">${body}<span class="tapmore">${R.see || 'Days in a row, and what they earn'} ›</span></button>`;
  }
  /* Two doors off the home page. Both are read-only, both close on Back, and
     both put a character on the screen with a word, because a number on its own
     never made anybody want to do the next thing. */
  const HORN_IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1z"/><path d="M15 9.5a3.5 3.5 0 010 5M18 7a7 7 0 010 10"/></svg>';
  /* ONE room, not two veils. The veils ran up under the notch and read as
     broken, and he is right that they are the same room anyway: "the trophy
     room and the progress room almost go together in one big progress room —
     the characters at the top, then underneath much more emphasis on the
     progress and the trophies with a lot more detail." So it renders into the
     list under the portico, exactly like a ladder page does, and Back goes
     home. Both cards on the home page open it; the streak card lands you on
     the streak. */
  let ROOMV = null;
  function openRoom(at) { ROOMV = at || 'top'; hush(); renderArrival();
    setTimeout(() => { const el = at === 'run' ? $('runsec') : null;
      $('slist').scrollTop = el ? Math.max(0, el.offsetTop - 8) : 0; }, 30); }
  function closeRoom() { ROOMV = null; hush(); renderArrival(); $('slist').scrollTop = 0; }
  const troBtn = a => `<button class="tro ${a.earned ? 'on' : 'off'}" data-tro="${a.id}">${trophySVG(a)}
    <span>${a.short}</span><small>${a.earned ? (a.kind === 'medal' ? a.tier : (a.kind === 'stone' ? a.need + ' days' : 'Earned'))
      : (a.kind === 'stone' ? a.left + ' more day' + (a.left === 1 ? '' : 's') : a.left + ' more')}</small></button>`;
  function progressRoom(list) {
    const p = points(), r = rankOf(p), A = C.arrival.stand, RK = C.school.ranks, R = C.school.runs || {};
    const run = runInfo(), aw = awards(), lvl = RK.findIndex(x => x[1] === r.name);
    const ranks = aw.filter(a => a.kind === 'flame'), stones = aw.filter(a => a.kind === 'stone');
    const meds = aw.filter(a => a.kind === 'medal'), special = aw.filter(a => a.kind === 'wreath');
    const gotM = meds.filter(a => a.earned), nextM = meds.filter(a => !a.earned).sort((x, y) => x.left - y.left).slice(0, 6);
    const rooms = SCH.categories.map(c => ({ c, n: c.tracks.reduce((s2, tr) => s2 + trackDone(tr), 0), N: c.tracks.reduce((s2, tr) => s2 + tr.steps.length, 0) })).sort((x, y) => y.n - x.n);
    const earned = aw.filter(a => a.earned).length;
    list.innerHTML =
      `<div class="acard prheadcard"><span class="eyebrow">${A.progressTitle || 'How far you have come'}</span>
        ${standCard(true)}</div>` +
      `<div class="acard"><span class="eyebrow">${(C.school.awards.show || {}).ladder || 'The ladder'}</span>
        <div class="chips">${RK.map((x, i) => `<span class="chip ${i <= lvl ? 'got' : ''} ${i === lvl ? 'this' : ''}">${x[1]}<small>${Math.max(1, x[0])}</small></span>`).join('')}</div>
        <p class="rule">${(C.school.rankLines || {})[r.name] || ''}</p></div>` +
      `<div class="acard" id="runsec"><span class="eyebrow">${R.title || 'Days in a row'}</span>${runCard(true)}</div>` +
      `<div class="acard"><span class="eyebrow">${R.shelfTitle || 'What days in a row earn'}</span>
        <p class="lede">${R.lede || ''}</p>
        <div class="stonelist">${stones.map(a => `<button class="stonerow ${a.earned ? 'on' : ''}" data-tro="${a.id}">
          ${trophySVG(a)}<span><strong>${a.name}</strong><small>${a.earned ? (R.got || 'Earned') + ' · ' + a.need + ' days'
            : fmt1(R.away || '{n} more day{s} in a row', { n: a.left, s: a.left === 1 ? '' : 's' })}</small></span>
          <i class="stonebar"><b style="width:${Math.min(100, Math.round(run.best / a.need * 100))}%"></b></i></button>`).join('')}</div></div>` +
      `<div class="acard"><div class="shtop"><span class="eyebrow">${C.school.awards.title}</span><small>${earned} earned</small></div>
        <h4 class="prsub">${A.ranksTitle || 'Ranks'}</h4><div class="trogrid">${ranks.map(troBtn).join('')}</div>
        ${special.length ? `<h4 class="prsub">${A.specialTitle || 'The twenty-five'}</h4><div class="trogrid">${special.map(troBtn).join('')}</div>` : ''}
        <h4 class="prsub">${A.medalsTitle || 'Rooms'} <em>${gotM.length} of ${meds.length}</em></h4>
        <div class="trogrid">${gotM.concat(nextM).map(troBtn).join('')}</div>
        ${meds.length > gotM.length + nextM.length ? `<p class="rule">${fmt1(A.medalsMore || '{n} more room medals to come. Every room has three.', { n: meds.length - gotM.length - nextM.length })}</p>` : ''}</div>` +
      `<div class="acard prog"><span class="eyebrow">${(C.arrival.folds || {}).rooms || 'Rooms climbed'}</span>
        <div class="rooms">${rooms.map(x => `<div class="rr" style="--c:${x.c.accent};--c2:${x.c.accent2}"><span>${x.c.name}</span><i><b style="width:${x.N ? Math.round(x.n / x.N * 100) : 0}%"></b></i><small>${x.n} of ${x.N}</small></div>`).join('')}</div></div>`;
    wireShelf(list);
    stageBack(closeRoom);
    if (!SAIDPR) { SAIDPR = true; setTimeout(() => { ARIG.nod();
      cap('aurelia', fmt1(A.progressSay || 'Look at it written down. {n} things you have actually done.', { n: p }));
      capHide(4600); }, 700); }
  }
  let SAIDPR = false;
  const SHARE_IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M12 3v13M7 8l5-5 5 5"/></svg>';
  let VISREAD = false;
  function readVision(root) {
    const V = C.vision, seq = V.read || [], ps = [...root.querySelectorAll('.visioncard p')]; if (!seq.length) return;
    hush(); clearTimeout(ROOMT); VISREAD = true; const my = ++SPK; CAPLITE = V.title;
    if (MUS.paused) musicStart(.4);
    let i = 0; const done = () => { VISREAD = false; CAPLITE = null; ps.forEach(p => p.classList.remove('now')); capHide(1200); idleRoom(); };
    const step = () => {
      if (my !== SPK) { VISREAD = false; CAPLITE = null; ps.forEach(p => p.classList.remove('now')); return; }
      const ln = seq[i]; if (!ln) { done(); return; }
      ps.forEach((p, k) => p.classList.toggle('now', k === i)); if (ps[i]) ps[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      i++;
      if (ln.who === 'marcus') { if (!ARIG.hidden) ARIG.smile(4); marcusSay(line(ln.id), i % 2 ? 'point' : 'nod', () => setTimeout(step, 500)); }
      else { if (!RIG.hidden) RIG.smile(4); ARIG[i === 1 ? 'point' : 'nod'](); cap('aurelia', V.title); aureliaSay(ln.id, () => setTimeout(step, 500)); }
    };
    step();
  }
  function foldCard(key, title, inner, open) { return `<details class="fold" data-fold="${key}" ${open ? 'open' : ''}><summary>${title}</summary><div class="fbody">${inner}</div></details>`; }
  const pickRow = ([tr, st]) => { const c = catOf(tr), P = C.arrival, nd = needsOf(st); return `<div class="pick" style="--c:${c.accent};--c2:${c.accent2}"><img src="images/track/${tr.id}.jpg" alt="" onerror="this.src='images/cat/${c.id}.jpg'"><span class="ptxt"><span class="scat">${c.name} · ${tr.name}${nd ? ` <b class="need ${nd}">${(P.needs || {})[nd] || nd}</b>` : ''}</span><span class="stest">${st.test}</span></span><span class="pbtns"><button class="btn btn-gold sm wide" data-do="${skey(tr, st)}">${P.do}</button><button class="btn btn-ghost sm" data-not="${skey(tr, st)}">${P.notThis}</button></span></div>`; };
  function renderArrival() {
    const list = $('slist'), keep = list.scrollTop;
    if (ROOMV) { progressRoom(list); return; }
    stageBack(null); const picks = todayPicks(), later = todayPicks('later'); const P = C.arrival, R = C.room, F = P.folds || {};
    // the feed: newest post, and whether it has been seen
    S.feed = S.feed || { posts: [], seen: [] }; const post = FEED[0] || null; const isNew = post && !S.feed.seen.includes(post.id);
    // today's ticks
    const q = todayQuick(), l = todayLong(), hasLong = projects().length > 0;
    const nextLine = (q && (l || !hasLong)) ? P.stand.done : (q ? P.stand.nextLong : P.stand.next);
    const ticks = `<div class="ticks"><span class="${q ? 'on' : ''}"><i></i>${P.ticks.quick}</span>${hasLong ? `<span class="${l ? 'on' : ''}"><i></i>${P.ticks.long}</span>` : ''}</div>`;
    const visits = (S.school.visits || 0);
    const rd = R.readings[daySeed() % R.readings.length];
    const lib = ['quote', 'book', 'beauty', 'figure'].map(k => { const pool = LIB.filter(x => x.kind === k); if (!pool.length) return ''; const it = pool[(daySeed() + k.length) % pool.length]; return `<div class="acard lib ${k}"><span class="eyebrow">${R.libraryLede[k]}</span>${it.title ? `<h3>${it.title}</h3>` : ''}<p>${it.t}</p>${it.by ? `<i>${it.by}${it.src ? ' · ' + it.src : ''}</i>` : ''}</div>`; }).join('');
    const rooms = SCH.categories.map(c => ({ c, n: c.tracks.reduce((s, tr) => s + trackDone(tr), 0), N: c.tracks.reduce((s, tr) => s + tr.steps.length, 0) })).filter(r => r.n > 0).sort((x, y) => y.n - x.n).slice(0, 8);
    const earlier = FEED.slice(1, 6);
    list.innerHTML = `<div class="acard standcard">${standCard()}<p class="punch">${standLine()}</p>${ticks}<div class="daywrap home">${dayBar()}</div><p class="nextp ${q && (l || !hasLong) ? 'done' : ''}">${nextLine}</p></div>` +
      `<div class="acard runcard">${runCard()}</div>` +
      (P.how ? foldCard('how', P.how.title, `<ol class="howlist">${P.how.lines.map(x => `<li>${x}</li>`).join('')}</ol>`, visits <= 3 && !S.school.howSeen) : '') +
      (C.vision ? foldCard('vision', C.vision.title, `<div class="acard visioncard"><div class="rhead"><span class="eyebrow">${C.vision.lede}</span><button class="playbtn" id="visionread" aria-label="Aurelia reads it">${SPK_IC}</button></div>${C.vision.paras.map(x => `<p>${x}</p>`).join('')}</div><div class="acard polycard"><span class="eyebrow">${C.vision.polyTitle}</span><p class="lede">${C.vision.polyLede}</p>${C.vision.polymaths.map(x => `<div class="poly"><b>${x.name}</b><span>${x.line}</span></div>`).join('')}<p class="close">${C.vision.close}</p></div>`, visits <= 2 && !S.school.visionSeen) : '') +
      (post ? foldCard('post', `<span class="foldic">${HORN_IC}</span>${C.feed.title}${isNew ? '<b class="dot">New</b>' : ''}`,
        `<div class="acard post ${isNew ? 'new' : ''}"><h3>${post.title}</h3><small>${post.date}</small><p>${post.text}</p></div>`, isNew) : '') +
      `<div class="acard todaycard"><span class="eyebrow">${P.todayTitle || 'Three for today'}</span>${P.todayLede ? `<p class="lede">${P.todayLede}</p>` : ''}` +
      (picks.length ? picks.slice(0, 3).map(pickRow).join('') + (picks.length > 3 ? `<details class="more"><summary>${P.more || 'Three more'}</summary>${picks.slice(3).map(pickRow).join('')}</details>` : '')
        : `<p class="lede">Every quick one is done. The long game is where the rest of you lives.</p>`) +
      `</div>` + (later.length ? foldCard('later', P.laterTitle || 'With people, outside, or with a thing', `<p class="lede" style="padding:0 6px">${P.laterLede || ''}</p><div class="acard" style="padding-top:4px">${later.map(pickRow).join('')}</div>`) : '') + longCard() + shelfCard(true) +
      foldCard('reading', F.reading || 'A reading from Aurelia', `<div class="acard reading"><div class="rhead"><span class="eyebrow">${R.readingsLede}</span><button class="playbtn" id="readit" aria-label="Aurelia reads it">${SPK_IC}</button></div><h3>${rd.title}</h3><p>${rd.text}</p></div>`) +
      (lib ? foldCard('library', F.library || 'From the library', lib) : '') +
      (rooms.length ? foldCard('rooms', F.rooms || 'Rooms climbed', `<div class="acard prog"><div class="rooms">${rooms.map(r => `<div class="rr" style="--c:${r.c.accent};--c2:${r.c.accent2}"><span>${r.c.name}</span><i><b style="width:${Math.round(r.n / r.N * 100)}%"></b></i><small>${r.n} of ${r.N}</small></div>`).join('')}</div></div>`) : '') +
      (earlier.length ? foldCard('earlier', C.feed.earlier || 'Earlier', `<div class="acard feedcard">${earlier.map(p => `<div class="feedpost"><small>${p.date}</small><h4>${p.title}</h4><p>${p.text}</p></div>`).join('')}</div>`) : '') +
      `<div class="gorow"><button class="btn btn-gold" id="intoschool">${P.go}</button><button class="iconbtn" id="sharearr" aria-label="${C.share.btn}">${SHARE_IC}</button></div>`;
    if (post && isNew) { S.feed.seen.push(post.id); save(); }
    list.querySelector('#sharearr').addEventListener('click', () => { sfx('tap'); sharePanel(); });
    list.querySelectorAll('.fold').forEach(d => d.addEventListener('toggle', () => { if (d.dataset.fold === 'how' && !d.open) { S.school.howSeen = true; save(); } if (d.dataset.fold === 'vision' && !d.open) { S.school.visionSeen = true; save(); } }));
    const vr = list.querySelector('#visionread'); if (vr) vr.addEventListener('click', () => { sfx('tap'); if (VISREAD) { hush(); return; } readVision(list); });
    const rb = list.querySelector('#readit'); if (rb) rb.addEventListener('click', () => { sfx('tap'); hush(); clearTimeout(ROOMT); cap('aurelia', rd.title); ARIG.nod(); aureliaSay('ui-read-' + rd.id, () => { capHide(1500); idleRoom(); }); });
    wireShelf(list); wireLong(list);
    list.querySelectorAll('[data-panel]').forEach(b => b.addEventListener('click', () => { sfx('open');
      openRoom(b.dataset.panel === 'run' ? 'run' : 'top'); }));
    list.querySelectorAll('[data-do]').forEach(b => b.addEventListener('click', () => { sfx('tap'); const r = findStep(b.dataset.do); if (r) stepSheet(r[0], r[1], null, 'arrival'); }));
    list.querySelectorAll('.crow[data-step]').forEach(b => b.addEventListener('click', () => { sfx('tap'); const r = findStep(b.dataset.step); if (r) stepSheet(r[0], r[1], null, 'arrival'); }));
    list.querySelectorAll('[data-not]').forEach(b => b.addEventListener('click', () => { sfx('tap'); notThis(b.dataset.not); renderArrival(); if (line(C.arrival.another)) { hush(); marcusSay(line(C.arrival.another), 'nod'); } }));
    list.querySelector('#intoschool').addEventListener('click', () => { sfx('tap'); leaveArrival(); });
    list.scrollTop = keep;
  }
  function leaveArrival() { ROOMV = null; clearTimeout(arrival._t); clearTimeout(ROOMT); hush(); musicStop(); lyreStop(800); $('stage').classList.remove('arrive'); RIG.show(false); ARIG.show(false); $('afig').classList.remove('walk-in-l'); dock('pop'); renderSchool(); if (!S.school.toured) setTimeout(offerTour, 600); else setTimeout(entryWord, 650); }
  /* going in: one of them pops up with a word for the day ahead. Never the same one twice in a sitting, a different start each day, loosely his and hers in turn. */
  const ENTRYSAID = new Set();
  function entryWord() {
    if (!$('stage').classList.contains('school') || inScene()) return;
    const q = quietProject(); if (q) { hush(); prac(q).asked = today(); save(); speakSchool([{ who: 'aurelia', id: 'ui-lg-check', t: C.voice['lg-check'] }], () => checkIn(q)); return; }
    const E = C.school.entry || []; if (!E.length) return;
    const start = (daySeed() * 7 + (S.school.visits || 0) + HOMEN) % E.length;
    let ln = null; for (let i = 0; i < E.length; i++) { const c = E[(start + i) % E.length]; if (!ENTRYSAID.has(c.id)) { ln = c; break; } }
    if (!ln) { ENTRYSAID.clear(); ln = E[start]; }
    ENTRYSAID.add(ln.id); hush(); speakSchool([ln]);
  }
  /* a line from either of them: from the portico when it is showing, popped in at the edge when not */
  let SPK = 0;   /* a running chain dies when hush() moves this on */
  function speakSchool(lines, after) {
    const sc = inScene(); let i = 0; const my = ++SPK;
    const who = new Set(lines.map(l => l.who));
    if (!sc) who.forEach(w => popIn(w));
    const step = () => {
      if (my !== SPK) return;
      const ln = lines[i++];
      if (!ln) { if (!sc) who.forEach(w => popOut(w, 1500)); if (after) setTimeout(after, 500); return; }
      if (ln.who === 'marcus') { if (!ARIG.hidden) ARIG.smile(3); marcusSay(line(ln.id) || { id: ln.id, t: ln.t }, 'nod', () => setTimeout(step, 400)); }
      else { if (!RIG.hidden) RIG.smile(3); ARIG.nod(); cap('aurelia', ln.t); aureliaSay(ln.id, () => { capHide(1600); setTimeout(step, 400); }); }
    };
    setTimeout(step, sc ? 300 : 900);
  }
  /* ---- the three pages ---- */
  function renderSchool() {
    const tabs = $('stabs'); tabs.hidden = false; tabs.innerHTML = C.school.tabs.map(([k, l]) => `<button class="stab ${TAB === k ? 'on' : ''}" data-t="${k}">${l}</button>`).join('');
    tabs.querySelectorAll('.stab').forEach(b => b.addEventListener('click', () => { sfx('tap'); TAB = b.dataset.t; CAT = null; SEARCH = null; renderSchool(); }));
    const list = $('slist'); list.scrollTop = 0; paintSchoolCount();
    if (SEARCH !== null) {
      dock('pop'); $('stage').classList.remove('room'); $('stage').classList.add('searching');
      tabs.hidden = true; $('sline').textContent = '';
      renderSearch(list); stageBack(closeSearch); paintSearchBtn();
      return;
    }
    $('stage').classList.remove('searching');
    const trk = TRK ? trackById(TRK) : null;
    const cat = trk ? null : SCH.categories.find(c => c.id === CAT);
    $('stage').classList.toggle('room', !!cat || !!trk);
    if (trk) {
      dock('scene'); RIG.show(true); ARIG.show(true);
      $('mfig').classList.remove('popin', 'popout'); $('afig').classList.remove('popin', 'popout');
      tabs.hidden = true; $('sline').textContent = '';
      trackPage(list, trk);
      stageBack(closeTrack); list.scrollTop = 0;
    } else if (cat) {
      dock('scene'); RIG.show(true); ARIG.show(true); $('mfig').classList.remove('popin', 'popout'); $('afig').classList.remove('popin', 'popout');
      tabs.hidden = true; $('sline').textContent = '';
      list.innerHTML = `<div class="roomhead" style="--c:${cat.accent};--c2:${cat.accent2}"><img src="images/cat/${cat.id}.jpg" alt=""><div><h2>${cat.name}</h2><p>${cat.line}</p></div></div>` + cat.tracks.map(trackRow).join('');
      stageBack(() => { hush(); CAT = null;
        if (CAT_FROM && CAT_FROM.search !== undefined) { SEARCH = CAT_FROM.search; CAT_FROM = null; }
        renderSchool(); }); list.scrollTop = 0;
    } else {
      dock('pop'); stageBack(null);
      if (TAB === 'next') renderNext(list);
      else if (TAB === 'long') renderLong(list);
      else renderAll(list);
      list.querySelectorAll('[data-room]').forEach(el => el.addEventListener('click', () => { sfx('tap'); CAT = el.dataset.room; renderSchool(); const id = C.school.catLines[CAT]; if (id && !SAIDCAT.has(CAT)) { SAIDCAT.add(CAT); hush(); speakSchool([{ who: 'aurelia', id, t: SCH.categories.find(c => c.id === CAT).name }]); } }));
    }
    wireRows(list);
  }
  /* the rows that appear in more than one place — a room, a tab, the track
     page, the search results — all wired once, here */
  function wireRows(list) {
    list.querySelectorAll('[data-step]').forEach(el => el.addEventListener('click', () => { sfx('tap'); const r = findStep(el.dataset.step); if (r) stepSheet(r[0], r[1], null, TRK ? 'track' : undefined); }));
    list.querySelectorAll('[data-track]').forEach(el => el.addEventListener('click', () => { sfx('tap'); openTrack(trackById(el.dataset.track)); }));
    list.querySelectorAll('[data-commit]').forEach(el => el.addEventListener('click', () => { sfx('tap'); commitCard(trackById(el.dataset.commit), TRK ? 'track' : 'long'); }));
    list.querySelectorAll('[data-room]').forEach(el => el.addEventListener('click', () => { sfx('tap');
      CAT_FROM = SEARCH !== null ? { search: SEARCH } : null; SEARCH = null; CAT = el.dataset.room; renderSchool(); }));
    wireLong(list);
  }
  let ROOMT = null, ROOMI = 0;
  const orn = () => '<div class="orn"><i></i><b></b><i></i></div>';
  const SPK_IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none"/><path d="M15.5 8.5a5 5 0 010 7M19 5.5a9 9 0 010 13"/></svg>';
  /* ---- trophies: ranks, the twenty-five, and a medal per room. Drawn, never emoji. ---- */
  function awards() {
    const AW = C.school.awards, K = AW.show || {}, out = [], p = points();
    const fmt = (t, o) => (t || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
    C.school.ranks.forEach((r, i) => { const need = Math.max(1, r[0]), earned = p >= need; out.push({ id: 'rank.' + r[1].toLowerCase(), kind: 'flame', level: i, tier: 'rank', name: r[1], short: r[1], earned, n: p, need, left: Math.max(0, need - p), line: ((C.school.rankLines || {})[r[1]] || '') + ' ' + (earned ? fmt(K.rankHave, { n: need }) : fmt(K.rankAt, { n: need })), accent: '#E0812A' }); });
    /* consistency, on its own shelf and its own metaphor — the flame is taken
       by rank, so turning up every day builds something in stone instead. */
    const R = C.school.runs, ri = runInfo();
    if (R && R.levels) R.levels.forEach(([need, name, why], i) => {
      out.push({ id: 'run.' + need, kind: 'stone', level: i, tier: 'run', name,
        short: name.replace(/^The /, ''), earned: ri.best >= need, n: ri.best, need,
        left: Math.max(0, need - ri.best), accent: '#8E7A50',
        line: why + ' ' + (ri.best >= need ? fmt(R.have, { n: ri.best, s: ri.best === 1 ? '' : 's' })
                                           : fmt(R.need, { n: need, s: need === 1 ? '' : 's' })) });
    });
    (AW.special || []).forEach(sp => { if (sp.id === 'twentyfive') { const n = S.done.length, N = C.moves.length; out.push({ id: sp.id, kind: 'wreath', tier: 'special', name: sp.name, short: 'The 25', earned: n >= N, n, need: N, left: Math.max(0, N - n), line: K.twentyfive || sp.line, accent: '#C9A227' }); } });
    SCH.categories.forEach(c => { const n = c.tracks.reduce((s, tr) => s + trackDone(tr), 0), N = c.tracks.reduce((s, tr) => s + tr.steps.length, 0);
      AW.tiers.forEach(([id, tname, at]) => { const need = at === null ? N : at, earned = n >= need; out.push({ id: c.id + '.' + id, kind: 'medal', metal: id, tier: id, room: c.name, name: c.name + ' ' + tname.toLowerCase(), short: c.name, earned, n, need, left: Math.max(0, need - n), line: earned ? fmt(K.room, { n, N, room: c.name }) : fmt(K.roomNeed, { n, need, room: c.name }), accent: c.accent, accent2: c.accent2 || c.accent }); }); });
    return out;
  }
  const HUD_FLAME = '<path d="M8 19c-3.6 0-6-2.5-6-5.8 0-2.6 1.6-4.3 2.7-5.6.6-.7 1-1.3 1.2-2 .6 1.1 1.2 2 2 2.7C9.7 10 11 11.4 11 13.6c0 1.2-.5 2.3-1.2 3 .9-.2 4.2-1.6 4.2-5.7 0-3.2-2.2-5-3.5-6.6C9.4 3 8.9 1.8 9 0c-3 1.4-3.4 4.3-3.6 5.8C4.6 4.7 4.2 3.4 4.2 2 1.7 3.8 0 7.2 0 10.6 0 15.6 3.7 19 8 19z" fill="#E0812A"/><path d="M8 19c-1.9 0-3.2-1.4-3.2-3.2 0-1.5 1-2.4 1.6-3.2.4-.5.6-.9.7-1.4.5.8.9 1.3 1.4 1.8.7.7 1.6 1.6 1.6 2.8C10.1 17.6 9.2 19 8 19z" fill="#FFD36B"/>';
  const METALS = { bronze: ['#E8B48C', '#8A4E22'], silver: ['#FFFFFF', '#8E939B'], gold: ['#FFE9A0', '#B8860B'] };
  function trophySVG(a) {
    const grad = (id, c1, c2) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>`;
    if (a.kind === 'flame') {
      const k = (1.5 + a.level * .12).toFixed(2), glow = a.level >= 4 ? `<circle cx="32" cy="${(34 - a.level * 1.2).toFixed(0)}" r="${(16 + a.level * 2.2).toFixed(0)}" fill="url(#tg-glow)" opacity="${Math.min(.95, .2 + a.level * .07).toFixed(2)}"/>` : '';
      return `<svg class="tsvg" viewBox="0 0 64 80">${grad('tg-gold', METALS.gold[0], METALS.gold[1])}<defs><radialGradient id="tg-glow"><stop offset="0" stop-color="#FFF3C4"/><stop offset=".5" stop-color="#FFD36B" stop-opacity=".55"/><stop offset="1" stop-color="#FFD36B" stop-opacity="0"/></radialGradient></defs>${glow}<rect x="12" y="68" width="40" height="9" rx="2.5" fill="#D6CBB4"/><rect x="17" y="63" width="30" height="6" rx="1.5" fill="#EFE7D6"/><rect x="28" y="54" width="8" height="10" fill="url(#tg-gold)"/><path d="M14 44h36l-5 12H19z" fill="url(#tg-gold)"/><rect x="12" y="41" width="40" height="5" rx="2" fill="#B8860B"/><g transform="translate(32 42) scale(${k}) translate(-8 -19)">${HUD_FLAME}</g></svg>`;
    }
    if (a.kind === 'wreath') {
      let leaves = ''; for (let i = 0; i < 15; i++) { const th = (300 + i * 20) * Math.PI / 180, x = 32 + 22 * Math.cos(th), y = 44 + 22 * Math.sin(th); leaves += `<ellipse rx="3.4" ry="7.6" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(300 + i * 20 + 115).toFixed(0)})" fill="url(#tg-gold)" stroke="#8F6F12" stroke-width=".5"/>`; }
      return `<svg class="tsvg" viewBox="0 0 64 80">${grad('tg-gold', METALS.gold[0], METALS.gold[1])}${leaves}<path d="M22 66l-4 12h8l2-8zM42 66l4 12h-8l-2-8z" fill="#93313D"/><text x="32" y="50" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-weight="600" font-size="17" fill="#8F6F12">25</text></svg>`;
    }
    if (a.kind === 'stone') {
      /* An arch of seven voussoirs on two piers, filling one stone per level.
         The reason it is an arch and not another flame: an arch is nothing at
         all until the last stone is in, which is exactly what a run of days is. */
      const N = 7, on = Math.min(N, a.level + 1);
      let arch = '';
      for (let i = 0; i < N; i++) {
        const th = 180 - (i + 0.5) * (180 / N), rad = th * Math.PI / 180, r = 21;
        const x = 32 + r * Math.cos(rad), y = 46 - r * Math.sin(rad), lit = i < on;
        arch += `<rect x="-4.6" y="-5.4" width="9.2" height="10.8" rx="1.1"
          transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(90 - th).toFixed(0)})"
          fill="${lit ? 'url(#tg-stone)' : '#EAE3D4'}" stroke="${lit ? '#8E7A50' : '#D8D0BE'}" stroke-width=".7"/>`;
      }
      return `<svg class="tsvg" viewBox="0 0 64 80">${grad('tg-stone', '#F4E9CE', '#A8873C')}
        <rect x="7" y="45" width="12" height="28" rx="1.4" fill="url(#tg-stone)" stroke="#8E7A50" stroke-width=".7"/>
        <rect x="45" y="45" width="12" height="28" rx="1.4" fill="url(#tg-stone)" stroke="#8E7A50" stroke-width=".7"/>
        ${arch}<rect x="4" y="73" width="56" height="5" rx="1.6" fill="#D6CBB4"/></svg>`;
    }
    const m = METALS[a.metal] || METALS.gold;
    return `<svg class="tsvg" viewBox="0 0 64 80">${grad('tg-' + a.metal, m[0], m[1])}<path d="M18 0h13l4 32-11 6z" fill="${a.accent}"/><path d="M46 0H33l-4 32 11 6z" fill="${a.accent}" opacity=".7"/><circle cx="32" cy="55" r="23" fill="url(#tg-${a.metal})" stroke="${m[1]}" stroke-width="1"/><circle cx="32" cy="55" r="17.5" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.6"/><path d="M32 43.5l3.5 7.2 7.9 1-5.8 5.5 1.5 7.9L32 61.3l-7.1 3.8 1.5-7.9-5.8-5.5 7.9-1z" fill="rgba(255,255,255,.9)"/></svg>`;
  }
  function shelfCard(compact) {
    const aw = awards(), got = aw.filter(a => a.earned), next = aw.filter(a => !a.earned).sort((x, y) => (x.left - y.left) || (y.n - x.n)).slice(0, compact ? 2 : 4);
    const items = got.concat(next), AW = C.school.awards, K = AW.show || {};
    const fmt = (t, o) => (t || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
    return `<div class="acard shelfcard"><div class="shtop"><span class="eyebrow">${AW.title}</span><small>${got.length} earned</small></div>${compact ? '' : `<p class="lede">${AW.lede}</p>`}
      <div class="shelf"><div class="shrow">${items.map(a => `<button class="tro ${a.earned ? 'on' : 'off'}" data-tro="${a.id}">${trophySVG(a)}<span>${a.short}</span><small>${a.earned ? (a.kind === 'medal' ? a.tier : (a.kind === 'stone' ? a.need + ' days' : (K.earned || 'Earned')))
        : (a.kind === 'stone' ? a.left + ' more day' + (a.left === 1 ? '' : 's') : fmt(K.more, { n: a.left, s: a.left === 1 ? '' : 's' }))}</small></button>`).join('')}</div><i class="plank"></i></div></div>`;
  }
  function wireShelf(root) { root.querySelectorAll('[data-tro]').forEach(b => b.addEventListener('click', () => { sfx('tap'); const a = awards().find(x => x.id === b.dataset.tro); if (a) trophyShow(a); })); }
  /* the show: the trophy large, gold falling, the stand, and the two of them with a word each */
  function trophyShow(a) {
    if (SHOW) closeShow(true);
    const K = C.school.awards.show || {}, sc = inScene(); hush();
    const v = veil(`<div class="panel showcard"><div class="bigt ${a.earned ? '' : 'off'}">${trophySVG(a)}</div><div class="eyebrow"><i></i>${a.earned ? (K.earned || 'Earned') : (K.notyet || 'Not yet')}<i></i></div><h2>${a.name}</h2><p class="lede">${a.line}</p>${standCard(true)}${a.kind === 'flame' ? `<div class="ladderchips"><span class="eyebrow">${K.ladder || 'The ladder'}</span><div class="chips">${C.school.ranks.map((r, i) => `<span class="chip ${i < a.level || (i === a.level && a.earned) ? 'got' : ''} ${i === a.level ? 'this' : ''}">${r[1]}<small>${Math.max(1, r[0])}</small></span>`).join('')}</div></div>` : ''}<div class="showcap" id="showcap" hidden></div></div>`, 'light trophyveil');
    backBtn(v, () => closeShow());
    if (sc) { const scn = $('scene'); v.style.top = (scn.offsetTop + scn.offsetHeight) + 'px'; }
    SHOW = v;
    if (a.earned) { sfx('wreath'); shower(); if (sc) { sparks(); PORTICO.flare(); } } else sfx('scroll');
    const n = SHOWN++;
    const mid = a.earned ? ['c-tr1', 'c-tr2', 'c-tr4'][n % 3] : 'c-tr3', aid = a.earned ? ['tr2', 'tr3', 'tr4'][n % 3] : 'tr-no';
    if (!sc) { popIn('marcus'); popIn('aurelia'); }
    setTimeout(() => {
      if (SHOW !== v) return;
      if (a.earned) { RIG.cheer(); ARIG.cheer(); }
      const her = () => { if (SHOW !== v) return; cap('aurelia', C.voice[aid]); ARIG.nod(); aureliaSay('ui-' + aid, () => { capHide(1800); if (!sc) { popOut('marcus', 1600); popOut('aurelia', 1600); } }); };
      if (line(mid)) marcusSay(line(mid), a.earned ? 'cheer' : 'nod', () => setTimeout(her, 350)); else her();
    }, sc ? 500 : 900);
  }
  function closeShow(silent) { if (!SHOW) return; const wasCommit = !!SHOW.querySelector('.commitcard'); SHOW = null; hush(); if (!silent) closeVeil(wasCommit ? rerender : null); if (!inScene()) { popOut('marcus', 0); popOut('aurelia', 0); } }
  function shower() { for (let i = 0; i < 28; i++) { const l = document.createElement('i'); l.className = 'leaffall' + (i % 2 ? ' gl' : ''); l.style.left = Math.random() * 100 + '%'; l.style.animationDuration = (2.4 + Math.random() * 2.2) + 's'; l.style.animationDelay = (Math.random() * 1.2) + 's'; $('stage').appendChild(l); setTimeout(() => l.remove(), 5500); } }
  /* every so often one of them says something, in turn, unprompted */
  function idleRoom(delay) {
    clearTimeout(ROOMT); ROOMT = setTimeout(() => {
      if (!$('stage').classList.contains('arrive')) return;
      if (SPEAKING || !NAR.paused) { idleRoom(15000); return; }
      if (ROOMI++ % 2 === 0) { const ids = C.aurelia.lines.map(l => l.id); const id = ids.find(i => !S.said.includes(i)) || ids[ROOMI % ids.length]; const ln = C.aurelia.lines.find(l => l.id === id); if (!S.said.includes(id)) { S.said.push(id); save(); } cap('aurelia', ln.t); ARIG.nod(); aureliaSay(id, () => { capHide(1500); idleRoom(35000 + Math.random() * 20000); }); }
      else { const all = Object.keys(LINES).filter(k => k.startsWith('m-')); marcusSay(fresh(all.slice(ROOMI % all.length).concat(all)), 'nod', () => idleRoom(35000 + Math.random() * 20000)); }
    }, delay || 30000);
  }
  /* ---- the tour: Aurelia shows the school round, one thing lit at a time ---- */
  function offerTour() {
    const T = C.tour; if (!T) return;
    const v = veil(`<div class="panel offer"><h2>Shall I show you round?</h2><p class="lede">Five things, a minute, and you will know where everything is.</p><div class="row"><button class="btn btn-ghost" id="tourno">${T.skip}</button><button class="btn btn-gold" id="touryes" style="flex:1.3">${T.start}</button></div></div>`, 'light');
    v.querySelector('#tourno').addEventListener('click', () => { sfx('tap'); S.school.toured = true; save(); closeVeil(); });
    v.querySelector('#touryes').addEventListener('click', () => { sfx('tap'); S.school.toured = true; save(); closeVeil(tour); });
  }
  function tour() {
    const T = C.tour; TAB = 'next'; CAT = null; renderSchool(); hush();
    const layer = document.createElement('div'); layer.className = 'tour'; layer.innerHTML = '<div class="hole"></div><div class="tcap" id="tcap"></div>'; $('stage').appendChild(layer);
    const hole = layer.querySelector('.hole'); let i = 0;
    const place = (el) => { const r = el.getBoundingClientRect(), s = $('stage').getBoundingClientRect(); hole.style.left = (r.left - s.left - 6) + 'px'; hole.style.top = (r.top - s.top - 6) + 'px'; hole.style.width = (r.width + 12) + 'px'; hole.style.height = (r.height + 12) + 'px';
      const capEl = layer.querySelector('#tcap'); const below = r.bottom - s.top + 14; capEl.style.top = ''; capEl.style.bottom = '';
      if (below + 170 < s.height) capEl.style.top = below + 'px'; else capEl.style.bottom = (s.height - (r.top - s.top) + 14) + 'px'; };
    const step = () => {
      const st = T.steps[i];
      if (!st) { layer.remove(); popIn('marcus'); setTimeout(() => marcusSay(line(T.done) || null, 'salute', () => popOut('marcus', 1400)), 600); return; }
      const el = document.querySelector(st.sel); if (!el) { i++; step(); return; }
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTimeout(() => { place(el); const capEl = layer.querySelector('#tcap'); capEl.innerHTML = `<b>Aurelia · ${i + 1} of ${T.steps.length}</b>${wordSpans(st.t)}<div class="row"><button class="btn btn-ghost" id="tskip">Skip</button><button class="btn btn-gold" id="tnext">${i === T.steps.length - 1 ? 'Done' : 'Next'}</button></div>`;
        capEl.querySelector('#tnext').addEventListener('click', () => { sfx('tap'); NAR.pause(); i++; step(); });
        capEl.querySelector('#tskip').addEventListener('click', () => { sfx('tap'); NAR.pause(); layer.remove(); });
        narrate(st.id); }, 450);
    };
    step();
  }
  /* Next thing: the bar, ONE card, the week, a thought folded shut. Nothing else. */
  function renderNext(list) {
    $('sline').textContent = C.school.nextLine;
    const picks = todayPicks(), later = todayPicks('later'); const pick = picks[0]; const P = C.arrival;
    const lit = daysLit(), t = today(); const days = []; for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d); }
    const dk = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const th = line(C.school.thoughts[daySeed() % C.school.thoughts.length]);
    list.innerHTML = `<div class="acard">${standCard(true)}</div>` +
      (pick ? (([tr, st]) => { const c = catOf(tr); return `<div class="acard one" style="--c:${c.accent};--c2:${c.accent2}"><span class="eyebrow" style="color:var(--c)">${c.name} · ${tr.name}</span><img src="images/track/${tr.id}.jpg" alt="" onerror="this.src='images/cat/${c.id}.jpg'"><div class="stestbig">${st.test}</div>${st.how ? `<p class="lede">${st.how[0]}</p>` : (st.note ? `<p class="lede">${st.note}</p>` : '')}<div class="row"><button class="btn btn-gold" data-do="${skey(tr, st)}" style="flex:1.6">${P.do}</button><button class="btn btn-ghost" data-not="${skey(tr, st)}">${P.notThis}</button></div></div>`; })(pick)
        : `<div class="acard"><p class="lede">Every quick one is done. The long game is where the rest of you lives.</p></div>`) +
      (picks.length > 1 ? foldCard('more', C.school.nextMore || 'Three more easy ones', `<div class="acard" style="padding-top:4px">${picks.slice(1, 4).map(pickRow).join('')}</div>`) : '') +
      (later.length ? foldCard('later', P.laterTitle || 'With people, outside, or with a thing', `<p class="lede" style="padding:0 6px">${P.laterLede || ''}</p><div class="acard" style="padding-top:4px">${later.map(pickRow).join('')}</div>`) : '') +
      (levelTwo().length ? foldCard('two', C.school.twoTitle || 'Level two', `<p class="lede" style="padding:0 6px">${C.school.twoLede || ''}</p><div class="acard" style="padding-top:4px">${levelTwo().map(pickRow).join('')}</div>`) : '') +
      `<div class="acard week"><div class="wrow">${days.map(d => `<span class="wk ${lit.has(dk(d)) ? 'on' : ''} ${dk(d) === t ? 'td' : ''}"><i></i><b>${d.toLocaleDateString('en-GB', { weekday: 'narrow' })}</b></span>`).join('')}</div><p>${lit.size ? `<b>${lit.size}</b> day${lit.size === 1 ? '' : 's'} lit altogether` : 'One light a day is the whole habit'}${lit.has(t) ? ' · today is lit' : ''}</p></div>` +
      (th ? `<details class="thought"><summary>A thought from Marcus</summary><p>${th.t}</p><i>${C.names.marcus} · ${th.src}</i></details>` : '');
    list.querySelectorAll('[data-do]').forEach(b => b.addEventListener('click', () => { sfx('tap'); const r = findStep(b.dataset.do); if (r) stepSheet(r[0], r[1]); }));
    list.querySelectorAll('[data-not]').forEach(b => b.addEventListener('click', () => { sfx('tap'); notThis(b.dataset.not); renderSchool(); if (line(C.arrival.another)) { hush(); popIn('marcus'); marcusSay(line(C.arrival.another), 'nod', () => popOut('marcus', 1200)); } }));
  }
  /* The long game: up to three, taken on deliberately */
  const projects = () => (S.school.projects || []).map(trackById).filter(tr => tr && nextStep(tr)).slice(0, C.school.long.max || 3);
  function longSuggest() {
    const on = new Set(S.school.projects || []);
    const started = allTracks().filter(tr => trackDone(tr) >= 1 && nextStep(tr)).sort((x, y) => trackDone(y) - trackDone(x));
    const long = C.school.long.list.map(trackById).filter(tr => tr && nextStep(tr));
    const out = [], seen = new Set();
    [...started, ...long].forEach(tr => { if (on.has(tr.id) || seen.has(tr.id)) return; seen.add(tr.id); out.push(tr); });
    return seededShuffle(out, daySeed() + (S.school.roll || 0) * 13).slice(0, 3);
  }
  function projectRow(tr) {
    const c = catOf(tr), st = nextStep(tr), n = trackDone(tr);
    const last = tr.steps[tr.steps.length - 1], first = tr.steps[0];
    return `<div class="proj taken" style="--c:${c.accent};--c2:${c.accent2}"><div class="seal"><i></i>${C.school.long.page.taken}</div><div class="ptop"><img src="images/track/${tr.id}.jpg" alt="" onerror="this.src='images/cat/${c.id}.jpg'"><span><strong>${tr.name}</strong><small>${c.name} · ${tr.steps.length} steps</small><small class="szl sz-${tr.size || 'months'}">${sizeOf(tr).name}</small></span><button class="px" data-drop="${tr.id}" aria-label="Put this one down">×</button></div>
      <div class="ladder">
        <div class="rung ${n === 0 ? 'here' : 'done'}"><b>1</b><span><em>${n === 0 ? 'Start here' : 'Started'}</em>${first.test}</span></div>
        ${n > 0 ? `<div class="rung here"><b>${n + 1}</b><span><em>You are here</em>${st.test}</span></div>` : ''}
        <div class="rung end"><b>${tr.steps.length}</b><span><em>Ends with</em>${last.test}</span></div>
      </div>
      <div class="pdots">${tr.steps.map(s => `<i class="${sdone(skey(tr, s)) ? 'on' : ''}"></i>`).join('')}</div>
      ${pracLine(tr)}
      <div class="row"><button class="btn btn-ghost sm" data-track="${tr.id}">The whole ladder</button><button class="btn btn-gold sm" data-step="${skey(tr, st)}" style="flex:1.3">Do a bit today</button></div></div>`;
  }
  function candRow(tr) {
    const c = catOf(tr), st = nextStep(tr), last = tr.steps[tr.steps.length - 1], n = trackDone(tr), K = C.school.long.page;
    return `<div class="cand" style="--c:${c.accent};--c2:${c.accent2}"><img src="images/track/${tr.id}.jpg" alt="" onerror="this.src='images/cat/${c.id}.jpg'"><span><strong>${tr.name}</strong><small>${c.name} · ${tr.steps.length} steps${n ? ` · ${n} done` : ''}</small><small class="szl sz-${tr.size || 'months'}">${sizeOf(tr).name}</small><small class="ladder">From <em>${tr.steps[0].test}</em> to <em>${last.test}</em></small></span><span class="cbtns"><button class="btn btn-ghost sm" data-track="${tr.id}">${K.look}</button><button class="btn btn-gold sm" data-commit="${tr.id}">${K.take}</button></span></div>`;
  }
  function renderLong(list) {
    const L = C.school.long, K = L.page, mine = projects(), on = new Set(mine.map(t => t.id));
    $('sline').textContent = '';
    const started = allTracks().filter(tr => !on.has(tr.id) && trackDone(tr) >= 1 && nextStep(tr)).sort((x, y) => trackDone(y) - trackDone(x)).slice(0, 6);
    const sug = L.list.map(trackById).filter(tr => tr && nextStep(tr) && !on.has(tr.id) && !started.includes(tr)).slice(0, 6);
    list.innerHTML = `<p class="intro">${K.intro}</p>` +
      `<div class="acard takencard"><span class="eyebrow">${K.takenTitle} · ${mine.length} of ${L.max}</span>` + (mine.length ? mine.map(projectRow).join('') : `<p class="lede">${K.takenNone}</p>`) + `</div>` +
      `<div class="acard"><span class="eyebrow">${K.chooseTitle}</span>` +
      (started.length ? `<h4 class="sub">${K.startedTitle}</h4>` + started.map(candRow).join('') : '') +
      `<h4 class="sub">${K.suggestedTitle}</h4>` + sug.map(candRow).join('') +
      `<button class="what dark" id="seeall">${K.seeAll}</button></div>`;
    list.querySelectorAll('[data-commit]').forEach(b => b.addEventListener('click', () => { sfx('tap'); commitCard(trackById(b.dataset.commit), 'long'); }));
    list.querySelector('#seeall').addEventListener('click', () => { sfx('tap'); TAB = 'all'; CAT = null; renderSchool(); });
    wireLong(list);
    if (!LONGSAID && line('c-long')) { LONGSAID = true; hush(); popIn('marcus'); setTimeout(() => marcusSay(line('c-long'), 'point', () => popOut('marcus', 1400)), 700); }
  }
  /* ---- the long skills: a day counted each time you practise, and the two of them asking how it goes ---- */
  const K_LG = () => C.school.long.check;
  function prac(tr) { S.school.practice = S.school.practice || {}; const id = typeof tr === 'string' ? tr : tr.id; return S.school.practice[id] = S.school.practice[id] || { days: {} }; }
  const pracDays = tr => Object.keys(prac(tr).days).length;
  const lastPrac = tr => Object.keys(prac(tr).days).sort().pop() || null;
  function daysAgo(d) { if (!d) return null; const a = new Date(d + 'T12:00:00'), b = new Date(today() + 'T12:00:00'); return Math.round((b - a) / 864e5); }
  const agoText = n => n === 0 ? 'today' : n === 1 ? 'yesterday' : n + ' days ago';
  function quietProject() {
    const K = K_LG(), q = K.quiet || 3, t = today(); S.school.taken = S.school.taken || {};
    return projects().find(tr => { const p = prac(tr); if (p.asked === t) return false; const since = daysAgo(lastPrac(tr) || S.school.taken[tr.id] || (S.school.taken[tr.id] = t)); return since !== null && since >= q; }) || null;
  }
  function pracLine(tr) {
    const K = K_LG(), n = pracDays(tr), l = lastPrac(tr), done = l === today();
    const fmt = (t, o) => (t || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
    return `<div class="prac"><span>${n ? fmt(K.days, { n, s: n === 1 ? '' : 's' }) + (l ? ' · ' + fmt(K.last, { d: agoText(daysAgo(l)) }) : '') : K.never}</span><span class="pbtn"><button class="btn btn-ghost sm ${done ? 'did' : ''}" data-prac="${tr.id}" ${done ? 'disabled' : ''}>${done ? K.practisedDone : K.practised}</button><button class="what dark sm" data-check="${tr.id}">${K.how}</button></span></div>`;
  }
  function longCard() {
    const K = K_LG(), mine = projects();
    return `<div class="acard longcard"><span class="eyebrow">${K.roomTitle}</span><p class="lede">${mine.length ? K.roomLede : K.none}</p>` +
      (mine.length ? mine.map(tr => { const c = catOf(tr), st = nextStep(tr), n = trackDone(tr); return `<div class="lgrow taken" style="--c:${c.accent};--c2:${c.accent2}"><div class="seal"><i></i>${C.school.long.page.taken}</div><button class="px" data-drop="${tr.id}" aria-label="Put this one down">&#215;</button><img src="images/track/${tr.id}.jpg" alt="" onerror="this.src='images/cat/${c.id}.jpg'"><span><strong>${tr.name}</strong><small>Step ${n + 1} of ${tr.steps.length} · ${st.test}</small></span>${pracLine(tr)}</div>`; }).join('') + `<p class="rule">${K.capLine || ''}</p>`
        : `<button class="btn btn-ghost sm" id="pickLong">${K.pick}</button><p class="rule">${K.capLine || ''}</p>`) + `</div>`;
  }
  function wireLong(root) {
    /* The × on a taken-on skill was drawn from the start and never wired to
       anything, so there was no way out of a commitment except a "Put it down"
       hidden inside How is it going. Taking one on is a ceremony, so putting
       one down asks once — but it does ask, and then it goes. */
    root.querySelectorAll('[data-drop]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); sfx('tap'); dropAsk(trackById(b.dataset.drop)); }));
    root.querySelectorAll('[data-prac]').forEach(b => b.addEventListener('click', () => { sfx('tap'); logPractice(trackById(b.dataset.prac)); }));
    root.querySelectorAll('[data-check]').forEach(b => b.addEventListener('click', () => { sfx('tap'); checkIn(trackById(b.dataset.check)); }));
    const pk = root.querySelector('#pickLong'); if (pk) pk.addEventListener('click', () => { sfx('tap'); TAB = 'long'; leaveArrival(); });
    root.querySelectorAll('[data-commit]').forEach(b => b.addEventListener('click', () => { sfx('tap'); commitCard(trackById(b.dataset.commit), 'long'); }));
  }
  const rerender = () => { if ($('stage').classList.contains('arrive')) renderArrival(); else renderSchool(); };
  function logPractice(tr) {
    const t = today(), p = prac(tr); if (p.days[t]) return;
    p.days[t] = 1; S.days[t] = (S.days[t] || 0) + 1; save();
    const n = pracDays(tr), K = K_LG(), sc = inScene();
    sfx('done'); if (sc) { sparks(); RIG.smile(1.8); ARIG.smile(1.8); }
    document.querySelectorAll(`[data-prac="${tr.id}"]`).forEach(b => { b.disabled = true; b.classList.add('did'); b.textContent = K.practisedDone; });
    document.querySelectorAll('.prac > span:first-child').forEach(() => {}); setTimeout(() => { document.querySelectorAll(`[data-prac="${tr.id}"]`).forEach(b => { const row = b.closest('.prac'); if (row) row.outerHTML = pracLine(tr); }); wireLong($('slist')); }, 50);
    const ms = (K.milestones || []).includes(n) ? 'ui-lg-m' + n : null;
    hush(); checkDay();
    if (ms) speakSchool([{ who: 'aurelia', id: ms, t: C.voice[ms.slice(3)] }]);
    else if (n % 2) speakSchool([{ who: 'aurelia', id: 'ui-lg-prac', t: C.voice['lg-prac'] }]);
    else speakSchool([{ who: 'marcus', id: 'c-lg-prac' }]);
  }
  function dropAsk(tr) {
    if (!tr) return;
    const D = (C.school.long.drop || {}), c = catOf(tr), n = trackDone(tr);
    const v = veil(`<div class="panel sheet" style="--c:${c.accent};--c2:${c.accent2}">
      <div class="eyebrow"><i></i>${tr.name}</div><h2>${D.title || 'Put this one down?'}</h2>
      <p class="lede">${fmt1(D.lede || 'Everything you have done on it stays done — {n} step{s} — and you can take it on again any day you like. It just stops sitting on your home page.', { n, s: n === 1 ? '' : 's' })}</p>
      <div class="row"><button class="btn btn-ghost" id="dno" style="flex:1">${D.no || 'Keep it'}</button>
        <button class="btn btn-gold" id="dyes" style="flex:1">${D.yes || 'Put it down'}</button></div></div>`, 'light');
    backBtn(v, () => closeVeil());
    v.querySelector('#dno').addEventListener('click', () => { sfx('tap'); closeVeil(); });
    v.querySelector('#dyes').addEventListener('click', () => { sfx('tap');
      S.school.projects = (S.school.projects || []).filter(id => id !== tr.id);
      S.school.dropped = (S.school.dropped || []).concat(tr.id); save();
      closeVeil(() => { rerender(); toast(fmt1(D.done || '{name} put down. Nothing lost.', { name: tr.name })); });
    });
  }
  function checkIn(tr) {
    const K = K_LG(), c = catOf(tr), n = pracDays(tr), st = nextStep(tr), done = trackDone(tr);
    const fmt = (t, o) => (t || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
    const v = veil(`<div class="panel sheet checkcard" style="--c:${c.accent};--c2:${c.accent2}">
      <div class="eyebrow"><i></i>${K.eyebrow} · ${tr.name}</div><h2>${K.title}</h2>
      <p class="lede">${n ? fmt(K.days, { n, s: n === 1 ? '' : 's' }) : K.never} · step ${done + 1} of ${tr.steps.length}${st ? ': ' + st.test : ''}</p>
      <div class="moods"><button class="btn btn-gold" data-mood="well">${K.well}</button><button class="btn btn-ghost" data-mood="struggle">${K.struggle}</button><button class="btn btn-ghost" data-mood="hard">${K.hard}</button></div>
      <button class="what dark" id="putdown">${K.down}</button></div>`, 'light');
    backBtn(v, () => closeVeil());
    const say = (mood) => { const L = (K.lines || {})[mood] || []; const lines = L.map(([who, id]) => who === 'aurelia' ? { who, id, t: C.voice[id.replace(/^ui-/, '')] || '' } : { who, id }); closeVeil(() => { rerender(); hush(); setTimeout(() => speakSchool(lines), 300); }); };
    v.querySelectorAll('[data-mood]').forEach(b => b.addEventListener('click', () => { sfx('tap'); const p = prac(tr); p.mood = p.mood || {}; p.mood[today()] = b.dataset.mood; p.asked = today(); save(); say(b.dataset.mood); }));
    v.querySelector('#putdown').addEventListener('click', () => { sfx('tap'); S.school.projects = (S.school.projects || []).filter(id => id !== tr.id); S.school.dropped = (S.school.dropped || []).concat(tr.id); save(); say('down'); });
  }
  /* Everything: families, then rooms, then ladders */
  function renderAll(list) {
    $('sline').textContent = C.school.allLine;
    list.innerHTML = SCH.groups.map(g => { const cats = g.categories.map(id => SCH.categories.find(c => c.id === id)).filter(Boolean);
      return `<div class="ghead"><h3>${g.name}</h3><p>${g.line}</p></div><div class="tiles">` + cats.map(c => { const n = c.tracks.reduce((s, tr) => s + trackDone(tr), 0), N = c.tracks.reduce((s, tr) => s + tr.steps.length, 0);
        return `<button class="tile" data-room="${c.id}" style="--c:${c.accent};--c2:${c.accent2}"><img src="images/cat/${c.id}.jpg" alt="" loading="lazy"><span class="tname">${c.name}</span><span class="tnum">${n ? n + ' of ' + N : c.tracks.length + ' tracks'}</span></button>`; }).join('') + '</div>'; }).join('');
  }
  /* ---- one ladder, its own page (v35) ----
     It used to be a veil: a name and a column of little step buttons. Honest
     for six steps and a lie for twenty, because learning to juggle or a
     language is one of the larger things a person does in a year and it was
     being shown at the weight of a checklist. So the ladder gets a page — the
     picture, the percentage, the medals, the days you turned up — and the
     steps sit under all of it instead of being all of it. Everything reads off
     steps.length, so a ladder can be six or twenty with no code change. */
  let TRK = null, TRK_FROM = null;
  const trackCopy = () => (C.school.track || {});
  /* How long this one really takes, said out loud at the top of the ladder.
     His words: "playing a song on a guitar in front of a group is a major
     undertaking whereas juggling might be a medium" — so the scale is time,
     not difficulty, and the honest answer goes where you cannot miss it.
     A person who knows a thing is a year long does not quit it in week two
     thinking they are slow. Defined in school.json `sizes`; every ladder
     carries a `size`. */
  const SIZES = () => (SCH && SCH.sizes) || {};
  const sizeOf = tr => (SIZES()[tr && tr.size] || SIZES().months
    || { name: '', line: '', steps: 6 });
  const fmt1 = (t, o) => (t || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
  /* Bronze a third of the way, silver two thirds, gold the lot — the same three
     the rooms use, so a person meets one vocabulary and not two. These live on
     the ladder's own page; they are not on the trophy shelf, because a hundred
     and fifty ladders times three would bury the shelf that matters. */
  function ladderAwards(tr) {
    const N = tr.steps.length, n = trackDone(tr), c = catOf(tr), K = trackCopy();
    const AW = C.school.awards, tiers = AW.tiers || [['bronze','Bronze',5],['silver','Silver',15],['gold','Gold',null]];
    const at = [Math.max(1, Math.ceil(N / 3)), Math.max(2, Math.ceil(N * 2 / 3)), N];
    const out = [];
    tiers.forEach(([id, tname], i) => {
      const need = at[i];
      if (i && need <= at[i - 1]) return;             // a two-step ladder must not hand out the same medal twice
      out.push({ id: 'lad.' + tr.id + '.' + id, kind: 'medal', metal: id, tier: id,
        name: tr.name + ' ' + tname.toLowerCase(), short: tname, earned: n >= need, n, need,
        left: Math.max(0, need - n), accent: c.accent, accent2: c.accent2 || c.accent,
        line: n >= need ? fmt1(AW.show.room, { n, N, room: tr.name })
                        : fmt1(AW.show.roomNeed, { n, need, room: tr.name }) });
    });
    return out;
  }
  /* Long ladders get chapters. Twenty steps in one unbroken column reads as a
     wall and you cannot see where you stand in it; the same twenty under five
     headings reads as "most of the way through the third part". Short ladders
     stay a plain list — a heading over two rows is noise. */
  const CHAPTER_FROM = 10;
  function stepBands(tr) {
    const names = trackCopy().bands || ['Spark', 'Flame', 'Lantern', 'Beacon', 'Lighthouse'];
    const N = tr.steps.length, out = []; let from = 1;
    names.forEach((name, i) => {
      const at = Math.max(from, Math.round(N * (i + 1) / names.length));
      if (at > N || from > N) return;
      out.push({ name, steps: tr.steps.filter(s => s.n >= from && s.n <= at) });
      from = at + 1;
    });
    return out.filter(b => b.steps.length);
  }
  /* A ring, not a bar. A bar at 30% looks like a thing that failed to fill;
     a ring at 30% looks like a thing that is under way. */
  function pctRing(pct, accent, sub) {
    const r = 42, L = 2 * Math.PI * r;
    return `<svg class="tk-ring" viewBox="0 0 100 100" role="img" aria-label="${pct} per cent done">
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--line)" stroke-width="9"/>
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="${accent}" stroke-width="9" stroke-linecap="round"
        stroke-dasharray="${L.toFixed(1)}" stroke-dashoffset="${(L * (1 - pct / 100)).toFixed(1)}"
        transform="rotate(-90 50 50)"/>
      <text x="50" y="${sub ? 48 : 57}" text-anchor="middle" class="tk-ring-n">${pct}%</text>
      ${sub ? `<text x="50" y="65" text-anchor="middle" class="tk-ring-s">${sub}</text>` : ''}
    </svg>`;
  }
  const firstDone = tr => { let best = null; tr.steps.forEach(s => { const v = S.school.done[skey(tr, s)];
    if (typeof v === 'string' && (best === null || v < best)) best = v; }); return best; };
  function openTrack(tr, from) {
    if (!tr) return;
    TRK = tr.id;
    TRK_FROM = from || (SEARCH !== null ? { search: SEARCH } : (CAT ? { cat: CAT } : { tab: TAB }));
    SEARCH = null;                       // or renderSchool would show the results again
    hush(); renderSchool(); $('slist').scrollTop = 0;
  }
  function closeTrack() {
    const f = TRK_FROM || {}; TRK = null; TRK_FROM = null;
    if (f.search !== undefined) { SEARCH = f.search; CAT = null; }
    else if (f.cat) CAT = f.cat;
    else { CAT = null; if (f.tab) TAB = f.tab; }
    hush(); renderSchool();
  }
  function trackPage(list, tr) {
    const c = catOf(tr), K = trackCopy(), N = tr.steps.length, n = trackDone(tr), st = nextStep(tr);
    const pct = N ? Math.round(n / N * 100) : 0;
    const pts = n, maxPts = N;                       // one point a step in this app
    const taken = (S.school.projects || []).includes(tr.id);
    const days = Object.keys((((S.school.practice || {})[tr.id]) || {}).days || {}).length;
    const cups = ladderAwards(tr), got = cups.filter(a => a.earned), up = cups.find(a => !a.earned);
    const since = firstDone(tr);
    const long = N >= CHAPTER_FROM;
    const s = k => k === 1 ? '' : 's';

    let h = `<div class="tk" style="--c:${c.accent};--c2:${c.accent2}">`;
    const sz = sizeOf(tr);
    h += `<div class="tk-hero"><img src="images/track/${tr.id}.jpg" alt="" onerror="this.src='images/cat/${c.id}.jpg'">
      ${n === N ? '<span class="tk-crown"></span>' : ''}
      <div class="tk-heroin"><span class="tk-chip">${c.name}</span><h2>${tr.name}</h2><p>${tr.line || ''}</p></div></div>`;
    h += `<div class="tk-size sz-${tr.size || 'months'}"><b>${sz.name}</b><span>${sz.line}</span></div>`;
    /* One ladder in the school needs a guard, and a guard nobody reads is not
       one — so it sits above the trophies and the next step, not under them. */
    if (tr.warn) h += `<div class="tk-warn"><b>Read this first</b><span>${tr.warn}</span></div>`;

    h += `<div class="acard tk-card"><div class="tk-top">${pctRing(pct, c.accent, fmt1(K.ringSub, { n, N }))}
      <div class="tk-topt"><strong>${n === N ? K.finished : (got.length ? got[got.length - 1].short : K.notStarted)}</strong>
        <small>${n === N ? K.finishedLine : (up ? fmt1(K.toNext, { n: up.left, s: s(up.left), name: up.short }) : '')}</small>
        ${since ? `<em>${fmt1(K.started, { d: new Date(since).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) })}</em>` : ''}</div></div>
      <div class="tk-stats"><span><b>${n}/${N}</b>${K.statSteps}</span><span><b>${days}</b>${K.statDays}</span>
        <span><b>${pts}/${maxPts}</b>${K.statPoints}</span><span><b>${got.length}/${cups.length}</b>${K.statCups}</span></div>
      ${taken ? pracLine(tr) : (st ? `<p class="lede tk-takel">${fmt1(K.takeLede, { n: N, how: sz.name.toLowerCase() })}</p>
        <button class="btn btn-gold sm" data-commit="${tr.id}">${K.takeBtn}</button>` : '')}
    </div>`;

    h += `<div class="acard tk-cups"><span class="eyebrow">${K.cupsTitle}</span>
      <div class="tk-cuprow">${cups.map(a => `<button class="tro ${a.earned ? 'on' : 'off'}" data-lad="${a.id}">
        ${trophySVG(a)}<span>${a.short}</span><small>${a.earned ? K.cupGot : fmt1(K.cupAt, { n: a.need })}</small></button>`).join('')}</div>
      <p class="lede">${got.length ? fmt1(K.cupsSome, { n: got.length, N: cups.length })
        : fmt1(K.cupsNone, { n: cups[0].need, s: s(cups[0].need) })}</p></div>`;

    if (st) h += `<div class="acard one tk-next"><span class="eyebrow">${fmt1(K.nextTitle, { n: st.n, N })}</span>
      <div class="stestbig">${st.test}</div>
      ${st.how ? `<p class="lede">${st.how[0]}</p>` : (st.note ? `<p class="lede">${st.note}</p>` : '')}
      <div class="row"><button class="btn btn-gold" data-step="${skey(tr, st)}" style="flex:1">${K.doIt}</button></div></div>`;

    const sh = sharpOf(tr);
    if (sh.done) h += `<div class="acard tk-sharp ${sh.faded ? 'dull' : ''}">
      <span class="eyebrow">${K.sharpTitle || 'Keeping it sharp'}</span>
      <div class="shbar"><i style="width:${sh.pct}%"></i></div>
      <p class="lede">${sh.faded
        ? fmt1(K.sharpSome, { n: sh.faded, m: sh.done, s: sh.faded === 1 ? '' : 's', is: sh.faded === 1 ? 'is' : 'are' })
        : (K.sharpAll || 'Everything you have done here is still fresh.')}</p></div>`;
    h += `<p class="tk-note">${K.tickNote}</p>`;
    const row = x => { const k = skey(tr, x), d = sdone(k), act = st && st.n === x.n, old = d && isFaded(k);
      const when = d && typeof S.school.done[k] === 'string' ? new Date(S.school.done[k]).toLocaleDateString('en-GB') : null;
      return `<button class="step tk-step ${d ? 'done' : ''} ${old ? 'faded' : ''} ${act ? 'act' : ''}" data-step="${k}">
        <b>${d ? '&#10003;' : x.n}</b><span>${x.test}${when
          ? `<em>${when}${old ? ` · ${K.fadedTag || 'worth doing again'}` : ''}</em>` : ''}</span></button>`; };
    h += `<div class="steps tk-steps">${long
      ? stepBands(tr).map(b => { const dn = b.steps.filter(x => sdone(skey(tr, x))).length;
          return `<h4 class="tk-band ${dn === b.steps.length ? 'full' : ''}"><span>${b.name}</span><em>${dn}/${b.steps.length}</em></h4>`
            + b.steps.map(row).join(''); }).join('')
      : tr.steps.map(row).join('')}</div>`;
    /* Why it stops here. His rule: nothing in the school runs for years,
       because a chain you cannot finish stops being a chain — so a ladder ends
       at something real about three months in and hands you over. Without this
       line the last step just looks like the place we ran out of ideas. */
    if (sz.after) h += `<div class="tk-after"><b>${K.afterTitle || 'And after that'}</b><span>${sz.after}</span></div>`;
    h += `<p class="tk-feeds">${fmt1(K.feeds, { room: c.name, n: N })}</p></div>`;
    list.innerHTML = h;
    list.querySelectorAll('[data-lad]').forEach(b => b.addEventListener('click', () => { sfx('tap');
      const a = ladderAwards(tr).find(x => x.id === b.dataset.lad); if (a) trophyShow(a); }));
  }

  /* ---- search ----
     A hundred and fifty-two ladders in twenty-two rooms and no way to ask for
     one by name. He shipped four new ones and could not find them, which is
     the whole argument. Searching the STEPS as well as the names is the part
     that matters: "fast" should find the fasting ladder, and "phone number"
     should find the one step in the school that is about memorising one. */
  let SEARCH = null, CAT_FROM = null;
  const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const norm = t => String(t || '').toLowerCase().replace(/[‘’]/g, "'");
  const QMAX = 40;
  /* "read" must find Reading before it finds Cloth and thREAD. So a match at
     the start of a word beats a match buried inside one, and both beat a match
     that was only in the room name or the one-line description. */
  const atWord = (text, w) => new RegExp('(^|[^a-z0-9])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(norm(text));
  const score = (text, words) => {
    const n = norm(text);
    if (!words.every(w => n.includes(w))) return null;
    if (n.startsWith(words[0])) return 0;
    return words.every(w => atWord(n, w)) ? 1 : null;
  };
  function searchAll(q) {
    const t = norm(q).trim();
    if (t.length < 2) return null;
    const words = t.split(/\s+/);
    const hit = x => { const n = norm(x); return words.every(w => n.includes(w)); };
    const rooms = SCH.categories.filter(c => hit(c.name + ' ' + (c.line || '')));
    const ladders = [], steps = [];
    SCH.categories.forEach(c => c.tracks.forEach(tr => {
      const byName = score(tr.name, words);
      const byRest = score(tr.name + ' ' + (tr.line || '') + ' ' + c.name + ' ' + (sizeOf(tr).name || ''), words);
      if (byName !== null || byRest !== null) ladders.push({ tr, rank: byName !== null ? byName : 3 });
      tr.steps.forEach(st => { const sc = score(st.test + ' ' + (st.note || ''), words);
        if (sc !== null) steps.push({ tr, st, rank: sc }); });
    }));
    ladders.sort((a, b) => a.rank - b.rank || a.tr.name.localeCompare(b.tr.name));
    steps.sort((a, b) => a.rank - b.rank);
    return { rooms, ladders: ladders.map(x => x.tr), steps };
  }
  function searchBody() {
    const K = C.school.search || {};
    if (SEARCH === null || norm(SEARCH).trim().length < 2)
      return `<p class="qhint">${K.hint || ''}</p><div class="qchips">${(K.examples || []).map(x =>
        `<button class="qchip" data-q="${esc(x)}">${esc(x)}</button>`).join('')}</div>`;
    const r = searchAll(SEARCH);
    const n = r.rooms.length + r.ladders.length + r.steps.length;
    if (!n) return `<p class="qhint">${(K.none || 'Nothing with that in it. Try a shorter word.')}</p>
      <div class="qchips">${(K.examples || []).map(x => `<button class="qchip" data-q="${esc(x)}">${esc(x)}</button>`).join('')}</div>`;
    let h = '';
    if (r.rooms.length) h += `<h4 class="qh">${K.rooms || 'Rooms'}</h4>` + r.rooms.map(c =>
      `<button class="qroom" data-room="${c.id}" style="--c:${c.accent};--c2:${c.accent2}">
        <img src="images/cat/${c.id}.jpg" alt="" loading="lazy"><span><strong>${c.name}</strong><small>${c.line || ''}</small></span></button>`).join('');
    if (r.ladders.length) h += `<h4 class="qh">${K.ladders || 'Ladders'} <em>${r.ladders.length}</em></h4>`
      + r.ladders.map(trackRow).join('');
    if (r.steps.length) {
      const shown = r.steps.slice(0, QMAX);
      h += `<h4 class="qh">${K.steps || 'Single steps'} <em>${r.steps.length}</em></h4>`
        + shown.map(({ tr, st }) => { const c = catOf(tr), d = sdone(skey(tr, st));
          return `<button class="qstep ${d ? 'done' : ''}" data-step="${skey(tr, st)}" style="--c:${c.accent}">
            <b>${d ? '&#10003;' : st.n}</b><span><em>${tr.name}</em>${st.test}</span></button>`; }).join('');
      /* never truncate quietly — a list that stops without saying so reads as
         "that is all of them" */
      if (r.steps.length > QMAX) h += `<p class="qmore">${(K.more || 'Showing the first {n} of {N}. Add another word to narrow it.')
        .replace('{n}', QMAX).replace('{N}', r.steps.length)}</p>`;
    }
    return h;
  }
  function paintSearch() {
    const el = $('qres'); if (!el) return;
    el.innerHTML = searchBody(); wireRows(el);
    el.querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => {
      sfx('tap'); SEARCH = b.dataset.q; const box = $('qbox'); if (box) box.value = SEARCH; paintSearch(); }));
    const x = $('qclear'); if (x) x.hidden = !SEARCH;
  }
  function renderSearch(list) {
    const K = C.school.search || {};
    list.innerHTML = `<div class="qbar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg>
      <input id="qbox" type="search" enterkeyhint="search" autocomplete="off" autocorrect="off" autocapitalize="none"
        spellcheck="false" placeholder="${esc(K.placeholder || 'Search the whole school')}" value="${esc(SEARCH || '')}">
      <button class="qx" id="qclear" aria-label="Clear" hidden>&#215;</button></div>
    <div id="qres"></div>`;
    const box = $('qbox');
    box.addEventListener('input', () => { SEARCH = box.value; paintSearch(); });
    box.addEventListener('keydown', e => { if (e.key === 'Enter') box.blur(); });
    $('qclear').addEventListener('click', () => { sfx('tap'); SEARCH = ''; box.value = ''; box.focus(); paintSearch(); });
    paintSearch();
    setTimeout(() => { try { box.focus(); } catch (e) {} }, 80);
  }
  function openSearch() { SEARCH = SEARCH || ''; TRK = null; CAT = null; hush(); renderSchool(); }
  function closeSearch() { SEARCH = null; hush(); renderSchool(); }

  function trackRow(tr) { const c = catOf(tr), n = trackDone(tr), N = tr.steps.length; return `<button class="srow track pic" style="--c:${c.accent};--c2:${c.accent2}" data-track="${tr.id}"><img src="images/track/${tr.id}.jpg" alt="" loading="lazy" onerror="this.src='images/cat/${c.id}.jpg'"><span class="stxt"><span class="stest">${tr.name}</span><span class="sline2">${tr.line || ''}</span><span class="szr sz-${tr.size || 'months'}">${sizeOf(tr).name}</span><span class="sprog"><i style="width:${Math.round(n / N * 100)}%"></i></span></span><span class="snum">${n} of ${N}</span></button>`; }
  /* The old veil. Kept as a name only, so any caller left anywhere lands on
     the page instead of a dead end. */
  const trackSheet = tr => openTrack(tr);
  function stepSheet(tr, st, from, where) {
    const c = catOf(tr), k = skey(tr, st), d = sdone(k), K = trackCopy();
    const rusty = d && isFaded(k);
    const how = st.how ? `<ul class="how">${st.how.map(h => `<li>${h}</li>`).join('')}</ul>` : (st.note ? `<p class="note">${st.note}</p>` : '');
    /* "Done already" used to be a dead grey button, which said the step was
       finished with. Nothing here is finished with — you can always do it
       again, and once it has gone rusty doing it again is worth a point, the
       same as getting it the first time. */
    /* NOT `line` — that is the app's global lookup for a spoken line, and
       shadowing it here threw "line is not a function" the moment the Done
       handler reached for one, which left the sheet open and the list stale. */
    const againLine = !d ? '' : `<p class="againline ${rusty ? 'rusty' : ''}">${rusty
      ? fmt1(K.doneLong || 'Done {d} — over six months ago. Can you still?', { d: whenText(k) })
      : fmt1(K.doneOn || 'Done {d}.', { d: whenText(k) })}</p>`;
    const v = veil(`<div class="panel sheet" style="--c:${c.accent};--c2:${c.accent2}">
      <div class="eyebrow"><i></i>${c.name} · ${tr.name} · step ${st.n} of ${tr.steps.length}</div>
      <div class="stestbig">${st.test}</div>${how}${againLine}
      <div class="row"><button class="btn ${(!d || rusty) ? 'btn-gold' : 'btn-ghost'}" id="sdone">${
        d ? ((K.again || 'Done it again') + (rusty ? ' · +1' : '')) : 'Done'}</button></div>
    </div>`, 'light');
    backBtn(v, () => closeVeil());
    v.querySelector('#sdone').addEventListener('click', () => {
      /* already done and still fresh: re-date it and say so. No second point —
         the point is already yours and it has not gone anywhere. */
      if (d && !rusty) {
        S.school.done[k] = new Date().toISOString();
        const t0 = today(); S.days[t0] = (S.days[t0] || 0) + 1; save();
        sfx('done'); if (inSceneNow()) sparks();
        closeVeil(() => { rerender(); toast(K.againFresh || 'Marked again for today. Still yours.'); });
        return;
      }
      const before = rankOf(points()).name, awBefore = awards().filter(x => x.earned).length, hadIds = new Set(awards().filter(x => x.earned).map(x => x.id));
      S.school.done[k] = new Date().toISOString(); S.school.points++;
      if (rusty) S.school.refresh = (S.school.refresh || 0) + 1;   // a re-earned point; the total only ever climbs
      const t = today(); S.days[t] = (S.days[t] || 0) + 1; save();
      sfx('done'); sparks(); RIG.smile(1.8); if (ARIG && !ARIG.hidden) ARIG.smile(1.8); paintSchoolCount(); checkDay();
      const inScene = inSceneNow();
      const up = rankOf(points()).name !== before || awards().filter(x => x.earned).length > awBefore;
      const gotAward = awards().filter(x => x.earned).length > awBefore;
      const n = Object.keys(S.school.done).length;
      const hers = !up && where !== 'arrival' && n % 3 === 2 && C.aurelia.affirm && C.aurelia.affirm.length;
      const both = n % 5 === 0;
      const won = awards().find(x => x.earned && !hadIds.has(x.id));
      if (won) { closeVeil(() => { if ($('stage').classList.contains('arrive')) renderArrival(); else renderSchool(); setTimeout(() => trophyShow(won), 450); }); return; }
      if (hers) {
        const al = C.aurelia.affirm[Math.floor(n / 3) % C.aurelia.affirm.length];
        if (!inScene) { popIn('aurelia'); if (both) popIn('marcus'); }
        setTimeout(() => { cap('aurelia', al.t); if (!RIG.hidden) RIG.smile(3); ARIG.nod(); aureliaSay(al.id, () => { capHide(1500); if (!inScene) { popOut('aurelia', 1400); if (both) popOut('marcus', 1400); } }); }, inScene ? 400 : 900);
      } else {
        const y = gotAward && line('c-award') ? 'c-award' : (where === 'arrival' ? C.arrival.after : (up ? 'c-rank' : C.school.affirm[(n - 1) % C.school.affirm.length]));
        if (line(y)) { if (!inScene) { popIn('marcus'); if (both) popIn('aurelia'); } setTimeout(() => { if (!ARIG.hidden) ARIG.smile(3); marcusSay(line(y), up ? 'cheer' : (n % 2 ? 'cheer' : 'nod'), () => { if (!inScene) { popOut('marcus', 1400); if (both) popOut('aurelia', 1400); } }); }, inScene ? 400 : 900); }
      }
      closeVeil(() => { if ($('stage').classList.contains('arrive')) renderArrival(); else renderSchool(); if (where !== 'track') setTimeout(() => afterStep(tr), 700); });
    });
  }
  /* the ask, timed to interest: nothing after one step; after the second, a soft yes or no, one tap out; after the third, the proper moment, once */
  function afterStep(tr) {
    if (SHOW) return; S.school.noAsk = S.school.noAsk || []; S.school.soft = S.school.soft || {};
    if ((S.school.projects || []).includes(tr.id) || S.school.noAsk.includes(tr.id) || !nextStep(tr) || tr.steps.length < 4 || projects().length >= (C.school.long.max || 3)) return;
    const n = trackDone(tr);
    if (n === 2 && !S.school.soft[tr.id]) softOffer(tr);
    else if (n === 3) commitCard(tr, 'offer');
  }
  function softOffer(tr) {
    const O = C.school.long.soft; if (!O) return; const c = catOf(tr);
    const fmt = (t, o) => (t || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
    const v = veil(`<div class="panel sheet softcard" style="--c:${c.accent};--c2:${c.accent2}"><div class="eyebrow"><i></i>${c.name} · ${tr.name}</div><h2>${fmt(O.title, { name: tr.name })}</h2><p class="lede">${O.lede}</p>
      <div class="row"><button class="btn btn-ghost" id="softno">${O.no}</button><button class="btn btn-gold" id="softyes" style="flex:1.2">${O.yes}</button></div></div>`, 'light');
    const no = () => { S.school.soft[tr.id] = 'no'; save(); closeVeil(); };
    backBtn(v, no); v.querySelector('#softno').addEventListener('click', () => { sfx('tap'); no(); });
    v.querySelector('#softyes').addEventListener('click', () => { sfx('tap'); S.school.soft[tr.id] = 'yes'; save(); closeVeil(() => commitCard(tr, 'soft')); });
  }
  /* taking a long skill on is a moment: the two of them, the question out loud, the ladder in front of you, and a real yes */
  function commitCard(tr, from) {
    const K = C.school.long.commit, max = C.school.long.max || 3, c = catOf(tr), sc = inScene(), have = projects().length, full = have >= max;
    const fmt = (t, o) => (t || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
    const first = tr.steps[0], last = tr.steps[tr.steps.length - 1], n = trackDone(tr), st = nextStep(tr);
    if (SHOW) closeShow(true); hush();
    const v = veil(`<div class="panel sheet commitcard" style="--c:${c.accent};--c2:${c.accent2}"><div class="eyebrow"><i></i>${c.name}</div><h2>${tr.name}</h2><div class="tk-size sz-${tr.size || 'months'} inline"><b>${sizeOf(tr).name}</b><span>${sizeOf(tr).line}</span></div>${tr.warn ? `<div class="tk-warn inline"><b>Read this first</b><span>${tr.warn}</span></div>` : ''}<p class="lede">${fmt(K.lede, { n: tr.steps.length })}</p>
      <div class="ladder"><div class="rung ${n === 0 ? 'here' : 'done'}"><b>1</b><span><em>${n === 0 ? 'Start here' : 'Started'}</em>${first.test}</span></div>${n > 0 && st ? `<div class="rung here"><b>${n + 1}</b><span><em>You are here</em>${st.test}</span></div>` : ''}<div class="rung end"><b>${tr.steps.length}</b><span><em>Ends with</em>${last.test}</span></div></div>
      <div class="showcap" id="showcap" hidden></div>
      ${full ? `<p class="lede full">${K.full}</p><div class="row"><button class="btn btn-ghost" id="cno" style="flex:1">${K.no}</button></div>` : `<div class="row"><button class="btn btn-ghost" id="cno">${K.no}</button><button class="btn btn-gold" id="cyes" style="flex:1.4">${K.yes}</button></div><p class="have">${fmt(K.have, { have, max })}</p>`}
    </div>`, 'light trophyveil');
    if (sc) { const scn = $('scene'); v.style.top = (scn.offsetTop + scn.offsetHeight) + 'px'; }
    SHOW = v;
    const no = () => { if (from === 'offer') { S.school.noAsk = S.school.noAsk || []; if (!S.school.noAsk.includes(tr.id)) S.school.noAsk.push(tr.id); save(); } closeShow(); };
    backBtn(v, no); v.querySelector('#cno').addEventListener('click', () => { sfx('tap'); no(); });
    if (!sc) { popIn('marcus'); popIn('aurelia'); }
    if (!full) setTimeout(() => { if (SHOW !== v) return; ARIG.point(); if (!RIG.hidden) RIG.think(); cap('aurelia', C.voice['lg-ask']); aureliaSay('ui-lg-ask', () => capHide(1800)); }, sc ? 500 : 900);
    const yes = v.querySelector('#cyes'); if (yes) yes.addEventListener('click', () => {
      sfx('tap'); yes.disabled = true; v.querySelector('#cno').disabled = true;
      S.school.projects = (S.school.projects || []).concat(tr.id); S.school.dropped = (S.school.dropped || []).filter(id => id !== tr.id); S.school.noAsk = (S.school.noAsk || []).filter(id => id !== tr.id);
      S.school.taken = S.school.taken || {}; S.school.taken[tr.id] = today(); save();
      hush(); sfx('wreath'); shower(); if (sc) { sparks(); PORTICO.flare(); } RIG.cheer(); ARIG.cheer();
      v.querySelector('.commitcard').classList.add('sealed'); v.querySelector('h2').insertAdjacentHTML('beforebegin', `<div class="seal big"><i></i>${C.school.long.page.taken}</div>`);
      setTimeout(() => { if (SHOW !== v) return; marcusSay(line('c-lg-take'), 'cheer', () => { if (SHOW !== v) return; cap('aurelia', C.voice['lg-took']); ARIG.nod(); aureliaSay('ui-lg-took', () => { capHide(1200); setTimeout(() => { if (SHOW === v) closeShow(); }, 600); }); }); }, 700);
    });
  }
  /* ---- share: the link only, and a QR for the room ---- */
  function sharePanel(back) {
    const H = C.share;
    const v = veil(`<div class="panel sharecard"><div class="eyebrow"><i></i>${H.title}</div><h2>${H.btn}</h2><p class="lede">${H.lede}</p>
      <div class="qr"><img src="images/qr.svg" alt="QR code for ${H.url}"></div><p class="url">${H.url.replace('https://', '')}</p>
      <div class="row">${navigator.share ? `<button class="btn btn-gold" id="sharego" style="flex:1.3">Share</button>` : ''}<button class="btn btn-ghost" id="sharecopy" style="flex:1">${H.copy}</button></div>
      </div>`, 'light');
    backBtn(v, () => closeVeil(back || null));
    const go = v.querySelector('#sharego'); if (go) go.addEventListener('click', async () => { sfx('tap'); try { await navigator.share({ url: H.url }); } catch (e) {} });
    v.querySelector('#sharecopy').addEventListener('click', async () => { sfx('tap'); try { await navigator.clipboard.writeText(H.url); v.querySelector('#sharecopy').textContent = H.copied; } catch (e) { prompt('Copy this link', H.url); } });
  }
  function help() {
    const v = veil(`<div class="help"><div class="panel">
      <h3>What is here</h3>
      <ul>
        <li><b>Marcus</b> stands in the portico. Tap him and he speaks. Every word is his own, from the Meditations, with its source shown.</li>
        <li><b>The tablet</b> is one small thing to do, now, where you are. Aurelia reads it out. Do it, tap Done, and the next one comes.</li>
        <li><b>Twenty-five</b> in one sitting, about ten minutes. The laurel fills a leaf each. Every five hangs a wreath and Marcus has a word.</li>
        <li><b>No excuses</b> is the line under each one: what to use when you don't have the thing.</li>
        <li>The flame lights on your first Done. The sun climbs as you go.</li>
      </ul>
      ${C.help ? `<label class="toggle"><input type="checkbox" id="popins" ${S.popins === false ? '' : 'checked'}><span>${C.help.popins}</span><small>${C.help.popinsHint}</small></label>` : ''}
    </div></div>`, 'light');
    S.seenHelp = true; save();
    backBtn(v, () => closeVeil());
    const pi = v.querySelector('#popins'); if (pi) pi.addEventListener('change', () => { S.popins = pi.checked; save(); sfx('tap'); const fb = $('facebtn'); if (fb) fb.classList.toggle('off', !pi.checked); if (!pi.checked) { popOut('marcus', 0); popOut('aurelia', 0); } });
  }

  /* ---------- boot ---------- */
  async function boot() {
    const [c, v, av, sch] = await Promise.all([fetch('content.json', { cache: 'no-cache' }).then(r => r.json()), fetch('audio/marcus/visemes.json', { cache: 'no-cache' }).then(r => r.json()).catch(() => null), fetch('audio/voice/visemes.json', { cache: 'no-cache' }).then(r => r.json()).catch(() => null), fetch('school.json', { cache: 'no-cache' }).then(r => r.json()).catch(() => null)]);
    C = c; VIS = v; AVIS = av; SCH = sch;
    S.feed = S.feed || { posts: [], seen: [] }; FEED = S.feed.posts || [];
    fetch('feed.json?x=' + Date.now()).then(r => r.json()).then(f => { FEED = (f && f.posts) || []; S.feed.posts = FEED; save(); if ($('stage').classList.contains('arrive')) renderArrival(); }).catch(() => {});
    fetch('library.json', { cache: 'no-cache' }).then(r => r.json()).then(l => { LIB = (l && l.items) || []; }).catch(() => {});
    const ids = new Set(C.moves.map(m => m.id)); S.done = S.done.filter(id => ids.has(id)); S.skipped = S.skipped.filter(id => ids.has(id)); save();
    for (const k in C.marcus.lines) for (const l of C.marcus.lines[k]) LINES[l.id] = l;
    for (const l of (C.marcus.spoken || [])) LINES[l.id] = l;
    buildScene();
    $('donebtn').addEventListener('click', onDone); $('skipbtn').addEventListener('click', onSkip); $('readbtn').addEventListener('click', readTablet);
    $('soundbtn').addEventListener('click', () => { S.sound = !S.sound; save(); paintSound(); if (!S.sound) { hush(); musicStop(); ambStop(); } else { sfx('tap'); ambStart(); if (S.done.length) ambFire(true); } });
    capSwipe($('popcap')); capSwipe($('capband'));
    /* swipe down on either of them while they are popped up: both go, and the words with them */
    ['mfig', 'afig'].forEach(id => { const el = $(id); let y0 = null; el.addEventListener('pointerdown', e => { y0 = $('stage').classList.contains('popmode') ? e.clientY : null; }, { passive: true }); el.addEventListener('pointermove', e => { if (y0 !== null && e.clientY - y0 > 36) { y0 = null; hush(); popOut('marcus', 0); popOut('aurelia', 0); capHide(0); } }, { passive: true }); el.addEventListener('pointerup', () => { y0 = null; }); });
    $('homebtn').addEventListener('click', () => { sfx('tap'); goHome(); });
    $('searchbtn').addEventListener('click', () => { sfx('tap'); if (SEARCH === null) openSearch(); else closeSearch(); });
    $('helpbtn').addEventListener('click', () => { sfx('tap'); if (MODE === 'school' && C.tour && !S.school.toured2) { S.school.toured2 = true; save(); if ($('stage').classList.contains('arrive')) leaveArrival(); tour(); } else help(); });
    cover();
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
    window.NOL = { S, save, reset() { localStorage.removeItem(KEY); location.reload(); }, PORTICO: () => PORTICO, RIG: () => RIG, LINES, school: enterSchool, show: id => trophyShow(awards().find(a => a.id === id)), awards, quiet: quietProject, check: id => checkIn(trackById(id)), entry: entryWord, home: goHome, lyr: () => ({ on: LYRE.on, paused: LYR.paused, src: LYR.src.split('/').pop(), vol: +LYR.volume.toFixed(2) }), prac: id => logPractice(trackById(id)), track: id => openTrack(trackById(id)), tracks: () => allTracks().map(t => t.id) };
  }
  /* a phone held sideways: the stage turns back by ninety degrees and stays upright, which reads as "this app is this way up" */
  const rot = () => {
    const mq = window.matchMedia && window.matchMedia('(pointer: coarse)'); const held = mq ? mq.matches : Math.min(innerWidth, innerHeight) < 600;
    if (!(innerWidth > innerHeight && held)) { delete document.documentElement.dataset.rot; return; }
    const a = (screen.orientation && typeof screen.orientation.angle === 'number') ? screen.orientation.angle : (window.orientation || 0);
    document.documentElement.dataset.rot = (a === 90) ? 'l' : 'r';
  };
  rot(); window.addEventListener('resize', rot); window.addEventListener('orientationchange', () => setTimeout(rot, 60));
  if (screen.orientation && screen.orientation.addEventListener) screen.orientation.addEventListener('change', () => setTimeout(rot, 60));
  /* iOS standalone computes the new viewport unit as if a toolbar were there; measure instead */
  document.addEventListener('DOMContentLoaded', boot);
})();
