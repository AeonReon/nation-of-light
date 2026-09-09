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
    try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.v === 1) { s.said = s.said || []; s.skipped = s.skipped || []; s.school = s.school || { done: {}, points: 0 }; return s; } } catch (e) {}
    return { v: 1, start: null, done: [], skipped: [], days: {}, sound: true, taps: 0, visits: 0, said: [], seenHelp: false, member: false, school: { done: {}, points: 0 } };
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
  function musicDuck(on) { if (MUS.paused) return; musicTo(on ? .14 : MUSV, on ? 350 : 1400); }
  function musicStop() { if (MUS.paused) return; musicTo(0, 1200); setTimeout(() => MUS.pause(), 1300); }
  [NAR, MAR].forEach(el => { el.addEventListener('play', () => musicDuck(true)); const back = () => { if (NAR.paused && MAR.paused) musicDuck(false); }; el.addEventListener('ended', back); el.addEventListener('pause', back); });

  /* Aurelia reads: the tablets, the breaks, the finish. */
  function narrate(id, after) {
    if (!voiceOn()) { if (after) setTimeout(after, 300); return; }
    NAR.pause(); NAR.src = 'audio/voice/' + id + '.mp3?v=' + C.version; NAR.onended = () => { $('readbtn').classList.remove('on'); if (after) after(); }; NAR.onerror = () => { if (after) after(); };
    NAR.play().catch(() => { if (after) after(); });
  }
  /* Marcus speaks: only a line from content.json, mouth off the audio clock. */
  let SPEAKING = null; const MQ = [];
  function marcusSay(ln, pose, after) {
    if (!ln) { if (after) after(); return; }
    if (!RIG || RIG.hidden) { if (after) after(); return; }
    if (SPEAKING) { MQ.push([ln, pose, after]); return; }
    SPEAKING = ln.id;
    if (!S.said.includes(ln.id)) { S.said.push(ln.id); save(); }
    const b = $('bubble'); b.hidden = MODE === 'welcome' || MODE === 'scene' || MODE === 'school'; b.classList.toggle('school', !ln.src);
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
    sfx('tap'); const ids = C.aurelia.lines.map(l => l.id); const pick = ids.find(i => !S.said.includes(i)) || ids[S.taps % ids.length]; S.taps++;
    if (!S.said.includes(pick)) S.said.push(pick); save();
    const ln = C.aurelia.lines.find(l => l.id === pick); const b = $('abubble'); const inSchool = MODE === 'school';
    hush(); clearTimeout(onAureliaTap._t); ARIG.nod();
    if (inSchool) { const sc = inScene(); cap('aurelia', ln.t); if (!sc) popIn('aurelia'); aureliaSay(pick, () => { capHide(1600); if (!sc) popOut('aurelia', 1500); }); return; }
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
    if (S.done.length) setTimeout(() => ambFire(true), 3000);
    $('mfig').addEventListener('click', onMarcusTap); $('afig').addEventListener('click', onAureliaTap);
    $('stage').addEventListener('pointerdown', e => { if (RIG && !RIG.hidden) RIG.lookAt(e.clientX, e.clientY); if (ARIG && !ARIG.hidden) ARIG.lookAt(e.clientX, e.clientY); }, { passive: true });
  }
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
  function popLeaf(i) { const l = $('laurelbar').children[i]; if (!l) return; l.classList.add('on'); l.classList.remove('pop'); void l.offsetWidth; l.classList.add('pop'); }

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
    v.querySelector('#sharelink').addEventListener('click', () => { sfx('tap'); sharePanel(); });
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
    v.querySelector('#doorshare').addEventListener('click', () => { sfx('tap'); sharePanel(); });
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
  let POPT = {}, CAPT = null;
  const capAll = () => [$('popcap'), $('capband'), SHOW && SHOW.querySelector('#showcap')].filter(Boolean);
  const capTarget = () => SHOW ? SHOW.querySelector('#showcap') : (inScene() ? $('capband') : $('popcap'));
  function cap(who, text, src) {
    const c = capTarget(); if (!c) return; clearTimeout(CAPT);
    capAll().forEach(x => { if (x !== c) { x.hidden = true; x.classList.remove('away'); } });
    c.hidden = false; c.classList.remove('away');
    c.innerHTML = `<b>${who === 'marcus' ? (src ? C.names.marcus : 'Marcus') : 'Aurelia'}</b>${wordSpans(text)}${src ? `<i>${src}</i>` : ''}`;
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
  const points = () => Object.keys(S.school.done).length + S.done.length;
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
  function quickCandidates() {
    const easy = (SCH.journey.find(j => j.id === 'easy') || { steps: [] }).steps.map(findStep).filter(Boolean).filter(([tr, st]) => !sdone(skey(tr, st)));
    const firsts = allTracks().map(tr => [tr, nextStep(tr)]).filter(([tr, st]) => st && st.n === 1 && !easy.some(([t2]) => t2 === tr));
    return seededShuffle(easy, daySeed()).concat(seededShuffle(firsts, daySeed() + 7));
  }
  function todayPicks() {
    const T = S.school.today; const d = today();
    if (!T || T.date !== d) S.school.today = { date: d, picks: [], skip: [] };
    const t = S.school.today; const cand = quickCandidates().map(([tr, st]) => skey(tr, st));
    t.picks = t.picks.filter(k => !sdone(k) && findStep(k));
    for (const k of cand) { if (t.picks.length >= 3) break; if (!t.picks.includes(k) && !t.skip.includes(k)) t.picks.push(k); }
    save(); return t.picks.map(findStep).filter(Boolean);
  }
  function notThis(key) { const t = S.school.today; t.skip.push(key); t.picks = t.picks.filter(k => k !== key); save(); }

  function enterSchool() {
    $('stage').classList.add('school'); $('deck').hidden = true; $('school').hidden = false; $('hud').hidden = false;
    $('shead').appendChild($('hud')); paintSchoolCount();
    if (!$('roombtn')) { $('hud').insertAdjacentHTML('afterbegin', '<button class="roombtn" id="roombtn" aria-label="The portico: sit a while"><svg viewBox="0 0 24 24" fill="none" stroke="#8F6F12" stroke-width="2" stroke-linecap="round"><path d="M3 9h18M4 9v10M9 9v10M15 9v10M20 9v10M2 19h20M12 3l9 6H3z"/></svg></button>'); $('roombtn').addEventListener('click', () => { sfx('tap'); roomView(); }); $('homebtn').querySelector('svg').outerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 18h18M5 18a7 7 0 0114 0M12 5v2M5.6 8.6l1.4 1.4M18.4 8.6L17 10M2 13h2M20 13h2"/></svg>'; }
    $('roombtn').classList.toggle('glow', (S.school.roomVisits || 0) < 2 && (S.school.visits || 0) <= 6);
    plates(false); MODE = 'school'; CUR = null; $('mfig').classList.remove('walk-in');
    const d = today(), fresh0 = !S.school.arrivedEver;
    const again = S.school.arrived === d; S.school.arrived = d; S.school.visits = (S.school.visits || 0) + 1; save(); arrival(fresh0, again);
  }
  function paintSchoolCount() { const p = points(), r = rankOf(p); $('countn').textContent = p; const of = $('countn').nextElementSibling; of.hidden = false; of.textContent = r.name; }
  /* ---- the arrival: the portico, the two of them, where you stand, three for today ---- */
  let HOMEN = 0;
  function goHome() { if ($('stage').classList.contains('arrive')) return; hush(); clearTimeout(ROOMT); HOMEN++; CAT = null; arrival(false, true, true); }
  const unpop = () => { clearTimeout(POPT.marcus); clearTimeout(POPT.aurelia); };
  function arrival(first, again, quiet) {
    const st = $('stage'); st.classList.add('arrive'); st.classList.remove('room', 'portico'); clearTimeout(ROOMT); stageBack(null); capHide(0); unpop(); dock('scene');
    $('mfig').classList.remove('popin', 'popout'); $('afig').classList.remove('popin', 'popout');
    RIG.enter(); setTimeout(() => { ARIG.show(true); $('afig').classList.remove('walk-out-l', 'walk-in-l', 'popin', 'popout'); void $('afig').offsetWidth; $('afig').classList.add('walk-in-l'); }, 350);
    $('stabs').hidden = true; $('sline').textContent = '';
    renderArrival();
    const vn = (S.school.visits || 0) + HOMEN;
    let lines = quiet ? [] : (first ? C.arrival.first : (again && C.arrival.again ? C.arrival.again[vn % C.arrival.again.length] : C.arrival.lines)); S.school.arrivedEver = true; save();
    // and something from them: one of her true lines, or one of his, in turn
    if (!first) { const hers = vn % 2 === 0; if (hers) { const ids = C.aurelia.lines.map(l => l.id); const id = ids[(S.school.visits || 0) % ids.length]; const ln = C.aurelia.lines.find(l => l.id === id); lines = lines.concat([{ who: 'aurelia', id, t: ln.t }]); } else { const all = Object.keys(LINES).filter(k => k.startsWith('m-')); const ln = fresh(all.slice((S.school.visits || 0) % all.length).concat(all)); if (ln) lines = lines.concat([{ who: 'marcus', id: ln.id, t: ln.t }]); } }
    clearTimeout(arrival._t); arrival._t = setTimeout(() => { if ($('stage').classList.contains('arrive')) speakSchool(lines); }, 1500);
  }
  function standLine() { const L = C.arrival.stand.lines || []; return L.length ? L[(daySeed() + (S.school.visits || 0) + HOMEN) % L.length] : ''; }
  function standCard() {
    const p = points(), r = rankOf(p), lit = daysLit().size, A = C.arrival.stand;
    const pct = r.next ? Math.round((p - r.at) / (r.next[0] - r.at) * 100) : 100;
    return `<div class="stand"><div><b>${lit}</b><small>${A.days}</small></div><div><b>${p}</b><small>${A.steps}</small></div><div><b>${r.name}</b><small>${r.next ? (r.next[0] - p) + ' to ' + r.next[1] : A.rank}</small></div></div>
      <div class="lvl"><i style="width:${pct}%"></i></div>`;
  }
  const SHARE_IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M12 3v13M7 8l5-5 5 5"/></svg>';
  function renderArrival() {
    const list = $('slist'); const picks = todayPicks(); const P = C.arrival, post = P.post;
    list.innerHTML = `<div class="acard standcard">${standCard()}<p class="punch">${standLine()}</p>${picks.length ? `<p class="nextp">${P.stand.next || ''}</p>` : ''}</div>` +
      (post ? `<div class="acard post"><span class="eyebrow">From the group</span><h3>${post.title}</h3><p>${post.text}</p></div>` : '') +
      `<div class="acard todaycard"><span class="eyebrow">${P.todayTitle || 'Three for today'}</span>${P.todayLede ? `<p class="lede">${P.todayLede}</p>` : ''}` +
      (picks.length ? picks.map(([tr, st]) => { const c = catOf(tr); return `<div class="pick" style="--c:${c.accent};--c2:${c.accent2}"><img src="images/track/${tr.id}.jpg" alt="" onerror="this.src='images/cat/${c.id}.jpg'"><span class="ptxt"><span class="scat">${c.name} · ${tr.name}</span><span class="stest">${st.test}</span></span><span class="pbtns"><button class="btn btn-gold sm" data-do="${skey(tr, st)}">${P.do}</button><button class="btn btn-ghost sm" data-not="${skey(tr, st)}">${P.notThis}</button></span></div>`; }).join('')
        : `<p class="lede">Every quick one is done. The long game is where the rest of you lives.</p>`) +
      `</div>` + shelfCard(true) + carryCard(3) + `<div class="gorow"><button class="btn btn-gold" id="intoschool">${P.go}</button><button class="iconbtn" id="sharearr" aria-label="${C.share.btn}">${SHARE_IC}</button></div>`;
    list.querySelector('#sharearr').addEventListener('click', () => { sfx('tap'); sharePanel(); });
    wireShelf(list);
    list.querySelectorAll('[data-do]').forEach(b => b.addEventListener('click', () => { sfx('tap'); const r = findStep(b.dataset.do); if (r) stepSheet(r[0], r[1], null, 'arrival'); }));
    list.querySelectorAll('.crow[data-step]').forEach(b => b.addEventListener('click', () => { sfx('tap'); const r = findStep(b.dataset.step); if (r) stepSheet(r[0], r[1], null, 'arrival'); }));
    list.querySelectorAll('[data-not]').forEach(b => b.addEventListener('click', () => { sfx('tap'); notThis(b.dataset.not); renderArrival(); if (line(C.arrival.another)) { hush(); marcusSay(line(C.arrival.another), 'nod'); } }));
    list.querySelector('#intoschool').addEventListener('click', () => { sfx('tap'); leaveArrival(); });
  }
  function leaveArrival() { clearTimeout(arrival._t); hush(); $('stage').classList.remove('arrive'); RIG.show(false); ARIG.show(false); $('afig').classList.remove('walk-in-l'); dock('pop'); renderSchool(); if (!S.school.toured) setTimeout(offerTour, 600); else setTimeout(entryWord, 650); }
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
    tabs.querySelectorAll('.stab').forEach(b => b.addEventListener('click', () => { sfx('tap'); TAB = b.dataset.t; CAT = null; renderSchool(); }));
    const list = $('slist'); list.scrollTop = 0; paintSchoolCount();
    const cat = SCH.categories.find(c => c.id === CAT);
    $('stage').classList.toggle('room', !!cat);
    if (cat) {
      dock('scene'); RIG.show(true); ARIG.show(true); $('mfig').classList.remove('popin', 'popout'); $('afig').classList.remove('popin', 'popout');
      tabs.hidden = true; $('sline').textContent = '';
      list.innerHTML = `<div class="roomhead" style="--c:${cat.accent};--c2:${cat.accent2}"><img src="images/cat/${cat.id}.jpg" alt=""><div><h2>${cat.name}</h2><p>${cat.line}</p></div></div>` + cat.tracks.map(trackRow).join('');
      stageBack(() => { hush(); CAT = null; renderSchool(); }); list.scrollTop = 0;
    } else {
      dock('pop'); stageBack(null);
      if (TAB === 'next') renderNext(list);
      else if (TAB === 'long') renderLong(list);
      else renderAll(list);
      list.querySelectorAll('[data-room]').forEach(el => el.addEventListener('click', () => { sfx('tap'); CAT = el.dataset.room; renderSchool(); const id = C.school.catLines[CAT]; if (id && !SAIDCAT.has(CAT)) { SAIDCAT.add(CAT); hush(); speakSchool([{ who: 'aurelia', id, t: SCH.categories.find(c => c.id === CAT).name }]); } }));
    }
    list.querySelectorAll('[data-step]').forEach(el => el.addEventListener('click', () => { sfx('tap'); const r = findStep(el.dataset.step); if (r) stepSheet(r[0], r[1]); }));
    list.querySelectorAll('[data-track]').forEach(el => el.addEventListener('click', () => { sfx('tap'); trackSheet(trackById(el.dataset.track)); }));
  }
  /* ---- the portico: nowhere to be, nothing asked. The two of them, the fire, the music, a thought a day, the group's news ---- */
  let ROOMT = null, ROOMI = 0;
  const orn = () => '<div class="orn"><i></i><b></b><i></i></div>';
  const SPK_IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none"/><path d="M15.5 8.5a5 5 0 010 7M19 5.5a9 9 0 010 13"/></svg>';
  function roomView(refreshOnly) {
    const R = C.room, list = $('slist'), keep = refreshOnly ? list.scrollTop : 0;
    if (!refreshOnly) {
      hush(); ROOM_FROM = { tab: TAB, cat: CAT }; CAT = null; const st = $('stage'); st.classList.add('portico'); st.classList.remove('room', 'arrive');
      S.school.roomVisits = (S.school.roomVisits || 0) + 1; save(); $('roombtn').classList.remove('glow');
      unpop(); dock('scene'); RIG.show(true); ARIG.show(true); $('mfig').classList.remove('popin', 'popout'); $('afig').classList.remove('popin', 'popout', 'walk-out-l');
      $('afig').classList.remove('walk-in-l'); void $('afig').offsetWidth; $('afig').classList.add('walk-in-l'); RIG.enter();
      MODE = 'school'; if (MUS.paused) musicStart(.4); ambStart(); if (points()) ambFire(true);
      stageBack(leaveRoom); $('sline').textContent = '';
    }
    const rd = R.readings[daySeed() % R.readings.length];
    const lib = ['quote', 'book', 'beauty', 'figure'].map(k => { const pool = LIB.filter(x => x.kind === k); if (!pool.length) return ''; const it = pool[(daySeed() + k.length) % pool.length]; return `<div class="acard lib ${k}"><span class="eyebrow">${R.libraryLede[k]}</span>${it.title ? `<h3>${it.title}</h3>` : ''}<p>${it.t}</p>${it.by ? `<i>${it.by}${it.src ? ' · ' + it.src : ''}</i>` : ''}</div>`; }).join('');
    list.innerHTML = `<div class="roomtitle"><h2>${R.title}</h2><p>${R.lede}</p></div>
      ${progressCard()}
      ${longCard()}
      ${shelfCard(false)}
      ${orn()}
      <div class="acard reading"><div class="rhead"><span class="eyebrow">${R.readingsLede}</span><button class="playbtn" id="readit" aria-label="Aurelia reads it">${SPK_IC}</button></div><h3>${rd.title}</h3><p>${rd.text}</p></div>
      ${lib}
      ${orn()}
      <div class="acard feedcard"><span class="eyebrow">${C.feed.title}</span>${FEED.length ? FEED.slice(0, 5).map(p => `<div class="feedpost"><small>${p.date}</small><h4>${p.title}</h4><p>${p.text}</p></div>`).join('') : `<p class="lede">${C.feed.empty}</p>`}</div>
      <div class="gorow"><button class="btn btn-ghost" id="roomshare" style="flex:1">${SHARE_IC}<span>${C.share.btn}</span></button></div>`;
    list.querySelector('#roomshare').addEventListener('click', () => { sfx('tap'); sharePanel(); });
    list.querySelector('#readit').addEventListener('click', () => { sfx('tap'); hush(); clearTimeout(ROOMT); cap('aurelia', rd.title); ARIG.nod(); aureliaSay('ui-read-' + rd.id, () => { capHide(1500); idleRoom(); }); });
    wireShelf(list); wireLong(list);
    if (refreshOnly) { list.scrollTop = keep; return; }
    setTimeout(() => speakSchool(R.enter), 1400);
    idleRoom(40000);
  }
  roomView.refresh = () => roomView(true);
  /* ---- trophies: ranks, the twenty-five, and a medal per room. Drawn, never emoji. ---- */
  function awards() {
    const AW = C.school.awards, K = AW.show || {}, out = [], p = points();
    const fmt = (t, o) => (t || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
    C.school.ranks.forEach((r, i) => { const need = Math.max(1, r[0]), earned = p >= need; out.push({ id: 'rank.' + r[1].toLowerCase(), kind: 'flame', level: i, tier: 'rank', name: r[1], short: r[1], earned, n: p, need, left: Math.max(0, need - p), line: ((C.school.rankLines || {})[r[1]] || '') + ' ' + (earned ? fmt(K.rankHave, { n: need }) : fmt(K.rankAt, { n: need })), accent: '#E0812A' }); });
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
    const m = METALS[a.metal] || METALS.gold;
    return `<svg class="tsvg" viewBox="0 0 64 80">${grad('tg-' + a.metal, m[0], m[1])}<path d="M18 0h13l4 32-11 6z" fill="${a.accent}"/><path d="M46 0H33l-4 32 11 6z" fill="${a.accent}" opacity=".7"/><circle cx="32" cy="55" r="23" fill="url(#tg-${a.metal})" stroke="${m[1]}" stroke-width="1"/><circle cx="32" cy="55" r="17.5" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.6"/><path d="M32 43.5l3.5 7.2 7.9 1-5.8 5.5 1.5 7.9L32 61.3l-7.1 3.8 1.5-7.9-5.8-5.5 7.9-1z" fill="rgba(255,255,255,.9)"/></svg>`;
  }
  function shelfCard(compact) {
    const aw = awards(), got = aw.filter(a => a.earned), next = aw.filter(a => !a.earned).sort((x, y) => (x.left - y.left) || (y.n - x.n)).slice(0, compact ? 2 : 4);
    const items = got.concat(next), AW = C.school.awards, K = AW.show || {};
    const fmt = (t, o) => (t || '').replace(/\{(\w+)\}/g, (m, k) => o[k] !== undefined ? o[k] : m);
    return `<div class="acard shelfcard"><div class="shtop"><span class="eyebrow">${AW.title}</span><small>${got.length} earned</small></div>${compact ? '' : `<p class="lede">${AW.lede}</p>`}
      <div class="shelf"><div class="shrow">${items.map(a => `<button class="tro ${a.earned ? 'on' : 'off'}" data-tro="${a.id}">${trophySVG(a)}<span>${a.short}</span><small>${a.earned ? (a.kind === 'medal' ? a.tier : K.earned || 'Earned') : fmt(K.more, { n: a.left, s: a.left === 1 ? '' : 's' })}</small></button>`).join('')}</div><i class="plank"></i></div></div>`;
  }
  function wireShelf(root) { root.querySelectorAll('[data-tro]').forEach(b => b.addEventListener('click', () => { sfx('tap'); const a = awards().find(x => x.id === b.dataset.tro); if (a) trophyShow(a); })); }
  /* the show: the trophy large, gold falling, the stand, and the two of them with a word each */
  function trophyShow(a) {
    if (SHOW) closeShow(true);
    const K = C.school.awards.show || {}, sc = inScene(); hush();
    const v = veil(`<div class="panel showcard"><div class="bigt ${a.earned ? '' : 'off'}">${trophySVG(a)}</div><div class="eyebrow"><i></i>${a.earned ? (K.earned || 'Earned') : (K.notyet || 'Not yet')}<i></i></div><h2>${a.name}</h2><p class="lede">${a.line}</p>${standCard()}${a.kind === 'flame' ? `<div class="ladderchips"><span class="eyebrow">${K.ladder || 'The ladder'}</span><div class="chips">${C.school.ranks.map((r, i) => `<span class="chip ${i < a.level || (i === a.level && a.earned) ? 'got' : ''} ${i === a.level ? 'this' : ''}">${r[1]}<small>${Math.max(1, r[0])}</small></span>`).join('')}</div></div>` : ''}<div class="showcap" id="showcap" hidden></div></div>`, 'light trophyveil');
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
  function closeShow(silent) { if (!SHOW) return; SHOW = null; hush(); if (!silent) closeVeil(); if (!inScene()) { popOut('marcus', 0); popOut('aurelia', 0); } }
  function shower() { for (let i = 0; i < 28; i++) { const l = document.createElement('i'); l.className = 'leaffall' + (i % 2 ? ' gl' : ''); l.style.left = Math.random() * 100 + '%'; l.style.animationDuration = (2.4 + Math.random() * 2.2) + 's'; l.style.animationDelay = (Math.random() * 1.2) + 's'; $('stage').appendChild(l); setTimeout(() => l.remove(), 5500); } }
  function progressCard() {
    const rooms = SCH.categories.map(c => ({ c, n: c.tracks.reduce((s, tr) => s + trackDone(tr), 0), N: c.tracks.reduce((s, tr) => s + tr.steps.length, 0) })).filter(r => r.n > 0).sort((x, y) => y.n - x.n).slice(0, 6);
    return `<div class="acard prog"><span class="eyebrow">${C.room.progressTitle}</span>${standCard()}<p class="punch">${standLine()}</p>` +
      (rooms.length ? `<div class="rooms">${rooms.map(r => `<div class="rr" style="--c:${r.c.accent};--c2:${r.c.accent2}"><span>${r.c.name}</span><i><b style="width:${Math.round(r.n / r.N * 100)}%"></b></i><small>${r.n} of ${r.N}</small></div>`).join('')}</div>` : `<p class="lede">No room climbed yet. The first step in any of them starts the count.</p>`) + `</div>`;
  }
  /* every so often one of them says something, in turn, unprompted */
  function idleRoom(delay) {
    clearTimeout(ROOMT); ROOMT = setTimeout(() => {
      if (!$('stage').classList.contains('portico')) return;
      if (SPEAKING || !NAR.paused) { idleRoom(15000); return; }
      if (ROOMI++ % 2 === 0) { const ids = C.aurelia.lines.map(l => l.id); const id = ids.find(i => !S.said.includes(i)) || ids[ROOMI % ids.length]; const ln = C.aurelia.lines.find(l => l.id === id); if (!S.said.includes(id)) { S.said.push(id); save(); } cap('aurelia', ln.t); ARIG.nod(); aureliaSay(id, () => { capHide(1500); idleRoom(35000 + Math.random() * 20000); }); }
      else { const all = Object.keys(LINES).filter(k => k.startsWith('m-')); marcusSay(fresh(all.slice(ROOMI % all.length).concat(all)), 'nod', () => idleRoom(35000 + Math.random() * 20000)); }
    }, delay || 30000);
  }
  function leaveRoom() { hush(); clearTimeout(ROOMT); $('stage').classList.remove('portico'); RIG.show(false); ARIG.show(false); $('afig').classList.remove('walk-in-l'); dock('pop'); musicStop(); if (ROOM_FROM) { TAB = ROOM_FROM.tab; CAT = ROOM_FROM.cat; ROOM_FROM = null; } renderSchool(); }
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
    const picks = todayPicks(); const pick = picks[0]; const P = C.arrival;
    const lit = daysLit(), t = today(); const days = []; for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d); }
    const dk = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const th = line(C.school.thoughts[daySeed() % C.school.thoughts.length]);
    list.innerHTML = `<div class="acard">${standCard()}</div>` +
      (pick ? (([tr, st]) => { const c = catOf(tr); return `<div class="acard one" style="--c:${c.accent};--c2:${c.accent2}"><span class="eyebrow" style="color:var(--c)">${c.name} · ${tr.name}</span><img src="images/track/${tr.id}.jpg" alt="" onerror="this.src='images/cat/${c.id}.jpg'"><div class="stestbig">${st.test}</div>${st.how ? `<p class="lede">${st.how[0]}</p>` : (st.note ? `<p class="lede">${st.note}</p>` : '')}<div class="row"><button class="btn btn-ghost" data-not="${skey(tr, st)}">${P.notThis}</button><button class="btn btn-gold" data-do="${skey(tr, st)}" style="flex:1.4">${P.do}</button></div></div>`; })(pick)
        : `<div class="acard"><p class="lede">Every quick one is done. The long game is where the rest of you lives.</p></div>`) +
      `<div class="acard week"><div class="wrow">${days.map(d => `<span class="wk ${lit.has(dk(d)) ? 'on' : ''} ${dk(d) === t ? 'td' : ''}"><i></i><b>${d.toLocaleDateString('en-GB', { weekday: 'narrow' })}</b></span>`).join('')}</div><p>${lit.size ? `<b>${lit.size}</b> day${lit.size === 1 ? '' : 's'} lit altogether` : 'One light a day is the whole habit'}${lit.has(t) ? ' · today is lit' : ''}</p></div>` +
      (th ? `<details class="thought"><summary>A thought from Marcus</summary><p>${th.t}</p><i>${C.names.marcus} · ${th.src}</i></details>` : '');
    list.querySelectorAll('[data-do]').forEach(b => b.addEventListener('click', () => { sfx('tap'); const r = findStep(b.dataset.do); if (r) stepSheet(r[0], r[1]); }));
    list.querySelectorAll('[data-not]').forEach(b => b.addEventListener('click', () => { sfx('tap'); notThis(b.dataset.not); renderSchool(); if (line(C.arrival.another)) { hush(); popIn('marcus'); marcusSay(line(C.arrival.another), 'nod', () => popOut('marcus', 1200)); } }));
  }
  /* The long game: up to three, taken on deliberately */
  const projects = () => (S.school.projects || []).map(trackById).filter(tr => tr && nextStep(tr));
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
    return `<div class="proj" style="--c:${c.accent};--c2:${c.accent2}"><div class="ptop"><img src="images/track/${tr.id}.jpg" alt="" onerror="this.src='images/cat/${c.id}.jpg'"><span><strong>${tr.name}</strong><small>${c.name} · a ladder of ${tr.steps.length} steps</small></span><button class="px" data-drop="${tr.id}" aria-label="Put this one down">×</button></div>
      <div class="ladder">
        <div class="rung ${n === 0 ? 'here' : 'done'}"><b>1</b><span><em>${n === 0 ? 'Start here' : 'Started'}</em>${first.test}</span></div>
        ${n > 0 ? `<div class="rung here"><b>${n + 1}</b><span><em>You are here</em>${st.test}</span></div>` : ''}
        <div class="rung end"><b>${tr.steps.length}</b><span><em>Ends with</em>${last.test}</span></div>
      </div>
      <div class="pdots">${tr.steps.map(s => `<i class="${sdone(skey(tr, s)) ? 'on' : ''}"></i>`).join('')}</div>
      ${pracLine(tr)}
      <div class="row"><button class="btn btn-ghost sm" data-track="${tr.id}">The whole ladder</button><button class="btn btn-gold sm" data-step="${skey(tr, st)}" style="flex:1.3">Do a bit today</button></div></div>`;
  }
  function renderLong(list) {
    $('sline').textContent = C.school.longLine; const L = C.school.long; const mine = projects();
    const room = L.max - mine.length; const sug = room > 0 ? longSuggest() : [];
    list.innerHTML = carryCard(4) + (mine.length ? `<div class="acard"><span class="eyebrow">What you are working on</span><p class="lede">${L.intro}</p>${mine.map(projectRow).join('')}</div>` : '') +
      (room > 0 ? `<div class="acard"><span class="eyebrow">${mine.length ? 'Take on another one' : 'Pick something that takes a month'}</span><p class="lede">${L.pickLine}</p>` +
        sug.map(tr => { const c = catOf(tr), st = nextStep(tr), last = tr.steps[tr.steps.length - 1]; return `<button class="pickp" style="--c:${c.accent};--c2:${c.accent2}" data-take="${tr.id}"><img src="images/track/${tr.id}.jpg" alt="" onerror="this.src='images/cat/${c.id}.jpg'"><span><strong>${tr.name}</strong><small>${c.name} · ${tr.steps.length} steps</small><small class="ladder">From <em>${st.test}</em> to <em>${last.test}</em></small></span><b class="take">Take it on</b></button>`; }).join('') +
        `<button class="what dark" id="rollp">Show me three others</button></div>` : '');
    wireLong(list);
    list.querySelectorAll('[data-take]').forEach(b => b.addEventListener('click', () => { sfx('tap'); S.school.projects = (S.school.projects || []).concat(b.dataset.take); S.school.taken = S.school.taken || {}; S.school.taken[b.dataset.take] = today(); save(); renderSchool(); }));
    list.querySelectorAll('[data-drop]').forEach(b => b.addEventListener('click', () => { sfx('tap'); S.school.projects = (S.school.projects || []).filter(id => id !== b.dataset.drop); save(); renderSchool(); }));
    const roll = list.querySelector('#rollp'); if (roll) roll.addEventListener('click', () => { sfx('tap'); S.school.roll = (S.school.roll || 0) + 1; save(); renderSchool(); });
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
    return `<div class="acard longcard"><span class="eyebrow">${K.roomTitle}</span><p class="lede">${K.roomLede}</p>` +
      (mine.length ? mine.map(tr => { const c = catOf(tr), st = nextStep(tr), n = trackDone(tr); return `<div class="lgrow" style="--c:${c.accent};--c2:${c.accent2}"><img src="images/track/${tr.id}.jpg" alt="" onerror="this.src='images/cat/${c.id}.jpg'"><span><strong>${tr.name}</strong><small>Step ${n + 1} of ${tr.steps.length} · ${st.test}</small></span>${pracLine(tr)}</div>`; }).join('')
        : `<p class="lede">${K.none}</p><button class="btn btn-ghost sm" id="pickLong">${K.pick}</button>`) + `</div>`;
  }
  function wireLong(root) {
    root.querySelectorAll('[data-prac]').forEach(b => b.addEventListener('click', () => { sfx('tap'); logPractice(trackById(b.dataset.prac)); }));
    root.querySelectorAll('[data-check]').forEach(b => b.addEventListener('click', () => { sfx('tap'); checkIn(trackById(b.dataset.check)); }));
    const pk = root.querySelector('#pickLong'); if (pk) pk.addEventListener('click', () => { sfx('tap'); ROOM_FROM = { tab: 'long', cat: null }; leaveRoom(); });
  }
  const rerender = () => { if ($('stage').classList.contains('portico')) roomView.refresh(); else if ($('stage').classList.contains('arrive')) renderArrival(); else renderSchool(); };
  function logPractice(tr) {
    const t = today(), p = prac(tr); if (p.days[t]) return;
    p.days[t] = 1; S.days[t] = (S.days[t] || 0) + 1; save();
    const n = pracDays(tr), K = K_LG(), sc = inScene();
    sfx('done'); if (sc) { sparks(); RIG.smile(1.8); ARIG.smile(1.8); }
    document.querySelectorAll(`[data-prac="${tr.id}"]`).forEach(b => { b.disabled = true; b.classList.add('did'); b.textContent = K.practisedDone; });
    document.querySelectorAll('.prac > span:first-child').forEach(() => {}); setTimeout(() => { document.querySelectorAll(`[data-prac="${tr.id}"]`).forEach(b => { const row = b.closest('.prac'); if (row) row.outerHTML = pracLine(tr); }); wireLong($('slist')); }, 50);
    const ms = (K.milestones || []).includes(n) ? 'ui-lg-m' + n : null;
    hush();
    if (ms) speakSchool([{ who: 'aurelia', id: ms, t: C.voice[ms.slice(3)] }]);
    else if (n % 2) speakSchool([{ who: 'aurelia', id: 'ui-lg-prac', t: C.voice['lg-prac'] }]);
    else speakSchool([{ who: 'marcus', id: 'c-lg-prac' }]);
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
    v.querySelector('#putdown').addEventListener('click', () => { sfx('tap'); S.school.projects = (S.school.projects || []).filter(id => id !== tr.id); save(); say('down'); });
  }
  /* Everything: families, then rooms, then ladders */
  function renderAll(list) {
    $('sline').textContent = C.school.allLine;
    list.innerHTML = SCH.groups.map(g => { const cats = g.categories.map(id => SCH.categories.find(c => c.id === id)).filter(Boolean);
      return `<div class="ghead"><h3>${g.name}</h3><p>${g.line}</p></div><div class="tiles">` + cats.map(c => { const n = c.tracks.reduce((s, tr) => s + trackDone(tr), 0), N = c.tracks.reduce((s, tr) => s + tr.steps.length, 0);
        return `<button class="tile" data-room="${c.id}" style="--c:${c.accent};--c2:${c.accent2}"><img src="images/cat/${c.id}.jpg" alt="" loading="lazy"><span class="tname">${c.name}</span><span class="tnum">${n ? n + ' of ' + N : c.tracks.length + ' tracks'}</span></button>`; }).join('') + '</div>'; }).join('');
  }
  function trackRow(tr) { const c = catOf(tr), n = trackDone(tr), N = tr.steps.length; return `<button class="srow track pic" style="--c:${c.accent};--c2:${c.accent2}" data-track="${tr.id}"><img src="images/track/${tr.id}.jpg" alt="" loading="lazy" onerror="this.src='images/cat/${c.id}.jpg'"><span class="stxt"><span class="stest">${tr.name}</span><span class="sline2">${tr.line || ''}</span><span class="sprog"><i style="width:${Math.round(n / N * 100)}%"></i></span></span><span class="snum">${n} of ${N}</span></button>`; }
  function trackSheet(tr) {
    const c = catOf(tr); const next = nextStep(tr);
    const v = veil(`<div class="panel sheet" style="--c:${c.accent};--c2:${c.accent2}">
      <div class="eyebrow"><i></i>${c.name}</div><h2>${tr.name}</h2><p class="lede">${tr.line || ''}</p>
      <div class="steps">${tr.steps.map(s => { const k = skey(tr, s), d = sdone(k), act = next && next.n === s.n; return `<button class="step ${d ? 'done' : ''} ${act ? 'act' : ''}" data-step="${k}"><b>${s.n}</b><span>${s.test}</span></button>`; }).join('')}</div>
      </div>`, 'light');
    backBtn(v, () => closeVeil());
    v.querySelectorAll('.step').forEach(el => el.addEventListener('click', () => { sfx('tap'); const r = findStep(el.dataset.step); closeVeil(() => stepSheet(r[0], r[1], tr)); }));
  }
  function stepSheet(tr, st, from, where) {
    const c = catOf(tr), k = skey(tr, st), d = sdone(k);
    const how = st.how ? `<ul class="how">${st.how.map(h => `<li>${h}</li>`).join('')}</ul>` : (st.note ? `<p class="note">${st.note}</p>` : '');
    const v = veil(`<div class="panel sheet" style="--c:${c.accent};--c2:${c.accent2}">
      <div class="eyebrow"><i></i>${c.name} · ${tr.name} · step ${st.n} of ${tr.steps.length}</div>
      <div class="stestbig">${st.test}</div>${how}
      <div class="row"><button class="btn btn-gold" id="sdone" ${d ? 'disabled' : ''}>${d ? 'Done already' : 'Done'}</button></div>
    </div>`, 'light');
    backBtn(v, () => closeVeil(from ? () => trackSheet(from) : null));
    v.querySelector('#sdone').addEventListener('click', () => {
      const before = rankOf(points()).name, awBefore = awards().filter(x => x.earned).length, hadIds = new Set(awards().filter(x => x.earned).map(x => x.id));
      S.school.done[k] = new Date().toISOString(); S.school.points++; const t = today(); S.days[t] = (S.days[t] || 0) + 1; save();
      sfx('done'); sparks(); RIG.smile(1.8); if (ARIG && !ARIG.hidden) ARIG.smile(1.8); paintSchoolCount();
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
      closeVeil(() => { if ($('stage').classList.contains('arrive')) renderArrival(); else renderSchool(); if (from) trackSheet(from); });
    });
  }
  /* ---- share: the link only, and a QR for the room ---- */
  function sharePanel() {
    const H = C.share;
    const v = veil(`<div class="panel sharecard"><div class="eyebrow"><i></i>${H.title}</div><h2>${H.btn}</h2><p class="lede">${H.lede}</p>
      <div class="qr"><img src="images/qr.svg" alt="QR code for ${H.url}"></div><p class="url">${H.url.replace('https://', '')}</p>
      <div class="row">${navigator.share ? `<button class="btn btn-gold" id="sharego" style="flex:1.3">Share</button>` : ''}<button class="btn btn-ghost" id="sharecopy" style="flex:1">${H.copy}</button></div>
      </div>`, 'light');
    backBtn(v, () => closeVeil());
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
    </div></div>`, 'light');
    S.seenHelp = true; save();
    backBtn(v, () => closeVeil());
  }

  /* ---------- boot ---------- */
  async function boot() {
    const [c, v, av, sch] = await Promise.all([fetch('content.json').then(r => r.json()), fetch('audio/marcus/visemes.json').then(r => r.json()).catch(() => null), fetch('audio/voice/visemes.json').then(r => r.json()).catch(() => null), fetch('school.json').then(r => r.json()).catch(() => null)]);
    C = c; VIS = v; AVIS = av; SCH = sch;
    fetch('feed.json?x=' + Date.now()).then(r => r.json()).then(f => { FEED = (f && f.posts) || []; if (FEED.length && C.arrival) C.arrival.post = FEED[0]; }).catch(() => {});
    fetch('library.json').then(r => r.json()).then(l => { LIB = (l && l.items) || []; }).catch(() => {});
    const ids = new Set(C.moves.map(m => m.id)); S.done = S.done.filter(id => ids.has(id)); S.skipped = S.skipped.filter(id => ids.has(id)); save();
    for (const k in C.marcus.lines) for (const l of C.marcus.lines[k]) LINES[l.id] = l;
    for (const l of (C.marcus.spoken || [])) LINES[l.id] = l;
    buildScene();
    $('donebtn').addEventListener('click', onDone); $('skipbtn').addEventListener('click', onSkip); $('readbtn').addEventListener('click', readTablet);
    $('soundbtn').addEventListener('click', () => { S.sound = !S.sound; save(); paintSound(); if (!S.sound) { hush(); musicStop(); ambStop(); } else { sfx('tap'); ambStart(); if (S.done.length) ambFire(true); } });
    capSwipe($('popcap')); capSwipe($('capband'));
    $('homebtn').addEventListener('click', () => { sfx('tap'); goHome(); });
    $('helpbtn').addEventListener('click', () => { sfx('tap'); if (MODE === 'school' && C.tour && !$('stage').classList.contains('arrive')) { if ($('stage').classList.contains('portico')) leaveRoom(); tour(); } else help(); });
    cover();
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
    window.NOL = { S, save, reset() { localStorage.removeItem(KEY); location.reload(); }, PORTICO: () => PORTICO, RIG: () => RIG, LINES, school: enterSchool, show: id => trophyShow(awards().find(a => a.id === id)), awards, quiet: quietProject, check: id => checkIn(trackById(id)), entry: entryWord, room: roomView, prac: id => logPractice(trackById(id)) };
  }
  /* iOS standalone computes the new viewport unit as if a toolbar were there; measure instead */
  document.addEventListener('DOMContentLoaded', boot);
})();
