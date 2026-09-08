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
  let C = null, VIS = null, AVIS = null, PORTICO = null, RIG = null, ARIG = null, CUES = null, ACUES = null, LINES = {};
  const NAR = new Audio(), MAR = new Audio(), MUS = new Audio(); NAR.preload = 'auto'; MAR.preload = 'auto'; MUS.preload = 'auto'; MUS.src = 'audio/music/dawn.mp3';
  let S = load();

  /* ---------- state ---------- */
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.v === 1) { s.said = s.said || []; s.skipped = s.skipped || []; return s; } } catch (e) {}
    return { v: 1, start: null, done: [], skipped: [], days: {}, sound: true, taps: 0, visits: 0, said: [], seenHelp: false };
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
  function hush() { NAR.pause(); MAR.pause(); if (RIG) RIG.hush(); if (ARIG) ARIG.hush(); $('readbtn').classList.remove('on'); musicDuck(false); clearTimeout(marcusSay._t); $('bubble').hidden = true; }
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
    NAR.pause(); NAR.src = 'audio/voice/' + id + '.mp3'; NAR.onended = () => { $('readbtn').classList.remove('on'); if (after) after(); }; NAR.onerror = () => { if (after) after(); };
    NAR.play().catch(() => { if (after) after(); });
  }
  /* Marcus speaks: only a line from content.json, mouth off the audio clock. */
  function marcusSay(ln, pose, after) {
    if (!ln || !RIG || RIG.hidden) { if (after) after(); return; }
    if (!S.said.includes(ln.id)) { S.said.push(ln.id); save(); }
    const b = $('bubble'); b.hidden = MODE === 'welcome' || MODE === 'scene'; b.classList.toggle('school', !ln.src);
    b.innerHTML = wordSpans(ln.t) + (ln.src ? `<span class="who">Marcus Aurelius</span><span class="src">${ln.src}</span>` : `<span class="who">Marcus</span>`);
    b.classList.remove('say'); void b.offsetWidth; b.classList.add('say');
    if (pose && RIG[pose]) RIG[pose]();
    clearTimeout(marcusSay._t);
    const finish = () => { RIG.hush(); marcusSay._t = setTimeout(() => { b.hidden = true; }, 1800); if (after) after(); };
    const est = Math.min(12000, ln.t.length * 70);
    if (voiceOn()) {
      MAR.pause(); CUES = (VIS && VIS[ln.id]) || null; MAR.src = 'audio/marcus/' + ln.id + '.mp3';
      MAR.onended = finish; MAR.onerror = () => { RIG.talk(est / 1000); setTimeout(finish, est); };
      RIG.talk(20); MAR.play().catch(() => { RIG.talk(est / 1000); setTimeout(finish, est); });
    } else { RIG.talk(est / 1000); setTimeout(finish, est); }
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
    $('mfig').addEventListener('click', onMarcusTap);
    $('stage').addEventListener('pointerdown', e => { if (RIG && !RIG.hidden) RIG.lookAt(e.clientX, e.clientY); if (ARIG && !ARIG.hidden) ARIG.lookAt(e.clientX, e.clientY); }, { passive: true });
  }
  /* dawn at the first tablet, full morning by the middle, gold at the twenty-fifth */
  const skyFor = () => Math.min(1, S.done.length / C.moves.length);

  function onMarcusTap() {
    if (!RIG || RIG.hidden) return;
    sfx('tap'); S.taps++; save();
    const key = MODE + ':' + (CUR ? CUR.id : '-');
    if (onMarcusTap._helped !== key) {
      onMarcusTap._helped = key;
      if (MODE === 'scene') return;
      const id = MODE === 'break' ? 'c-help-break' : MODE === 'rest' ? 'c-help-rest' : (S.done.length === 0 ? 'c-help-task' : 'c-help-go');
      if (line(id)) { hush(); marcusSay(line(id), 'point'); return; }
    }
    const poses = ['wave', 'salute', 'think', 'nod', 'laugh'];
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
    $('tnum').textContent = 'Tablet ' + idx; $('tkind').textContent = m.kind; $('tkind').className = 'kind kind-' + m.kind; $('tkind').hidden = false;
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
    $('tfall').innerHTML = ''; $('readbtn').hidden = true; $('skipbtn').hidden = true; $('donebtn').textContent = next ? 'Next tablet' : 'Sit with Marcus'; $('donebtn').disabled = false;
    riseTablet();
  }
  function nextTablet(autoRead) { const r = remaining(); if (!r.length) { restTablet(); return; } showTablet(r[0], autoRead); }

  let busy = false;
  function onDone() {
    if (busy) return;
    if (MODE === 'welcome') { sfx('tap'); welcomeDone(); return; }
    if (MODE === 'break') { $('tablet').classList.add('sink'); sfx('tap'); hush(); setTimeout(() => { const t = breakCard._then; breakCard._then = null; if (t) t(); else nextTablet(true); }, 380); return; }
    if (MODE === 'rest') { const r = remaining(); if (r.length) { $('tablet').classList.add('sink'); setTimeout(() => nextTablet(true), 380); } else onMarcusTap(); return; }
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
      breakCard({ t: C.finale.t, after: 'finale' }, () => restTablet()); $('tnum').textContent = 'Twenty-five'; $('donebtn').textContent = 'Sit with Marcus';
      setTimeout(() => aureliaSay('ui-deck', () => ARIG.cheer()), 600);
    }));
    setTimeout(() => { if (C.finale.say && line(C.finale.say)) marcusSay(line(C.finale.say), 'cheer', () => setTimeout(last, 400)); else last(); }, 800);
  }

  /* ---------- overlays ---------- */
  function veil(html, cls = '') { const o = $('overlay'); o.innerHTML = `<div class="veil in ${cls}">${html}</div>`; return o.firstElementChild; }
  function closeVeil(then) { const v = $('overlay').firstElementChild; if (!v) { if (then) then(); return; } v.classList.remove('in'); v.classList.add('out'); setTimeout(() => { $('overlay').innerHTML = ''; if (then) then(); }, 480); }

  function cover() {
    const back = S.done.length > 0, cv = C.cover, left = C.moves.length - S.done.length;
    const v = veil(`<div class="cover">
      <h1><span class="em">${cv.em}</span><span class="t">${cv.title}</span></h1>
      <p class="tag">${back ? (left ? `Welcome back. ${S.done.length} of ${C.moves.length} done, ${left} to go. Marcus is waiting.` : 'Welcome back. The twenty-five are done. Marcus is waiting.') : cv.tag}</p>
      <button class="btn btn-gold" id="begin">${back ? 'Go in' : cv.begin}</button>
      <button class="what" id="what">${cv.what}</button>
      <div class="small">Sound on is the whole point. Headphones are lovely.</div>
    </div>`);
    v.querySelector('#begin').addEventListener('click', () => {
      ac(); MAR.muted = true; MAR.src = 'audio/marcus/m-g1.mp3'; MAR.play().then(() => { MAR.pause(); MAR.muted = false; MAR.currentTime = 0; }).catch(() => { MAR.muted = false; });
      musicStart(); ambStart();
      if (back) { sfx('tap'); NAR.muted = true; NAR.src = 'audio/voice/ui-first.mp3'; NAR.play().then(() => { NAR.pause(); NAR.muted = false; }).catch(() => { NAR.muted = false; }); closeVeil(enter); }
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
      <button class="btn btn-gold close" id="helpok">Back to the portico</button>
    </div></div>`, 'light');
    S.seenHelp = true; save();
    v.querySelector('#helpok').addEventListener('click', () => { sfx('tap'); closeVeil(); });
  }

  /* ---------- boot ---------- */
  async function boot() {
    const [c, v, av] = await Promise.all([fetch('content.json').then(r => r.json()), fetch('audio/marcus/visemes.json').then(r => r.json()).catch(() => null), fetch('audio/voice/visemes.json').then(r => r.json()).catch(() => null)]);
    C = c; VIS = v; AVIS = av;
    for (const k in C.marcus.lines) for (const l of C.marcus.lines[k]) LINES[l.id] = l;
    for (const l of (C.marcus.spoken || [])) LINES[l.id] = l;
    buildScene();
    $('donebtn').addEventListener('click', onDone); $('skipbtn').addEventListener('click', onSkip); $('readbtn').addEventListener('click', readTablet);
    $('soundbtn').addEventListener('click', () => { S.sound = !S.sound; save(); paintSound(); if (!S.sound) { hush(); musicStop(); ambStop(); } else { sfx('tap'); ambStart(); if (S.done.length) ambFire(true); } });
    $('helpbtn').addEventListener('click', () => { sfx('tap'); help(); });
    cover();
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
    window.NOL = { S, save, reset() { localStorage.removeItem(KEY); location.reload(); }, PORTICO: () => PORTICO, RIG: () => RIG, LINES };
  }
  document.addEventListener('DOMContentLoaded', boot);
})();
