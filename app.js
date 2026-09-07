/* Nation of Light — v1. The first scene, end to end.

   The shape of a session: Marcus walks into the portico and says one of his
   own lines. A tablet rises with one small thing to do; Aurelia, the keeper,
   reads it out. You do it, tap Done. A laurel leaf fills, the sun climbs a
   little, Marcus reacts. Five tablets make a tier, and a tier finished hangs
   a wreath on the frieze and opens a scroll: one true piece of his life, in
   the school's words. Five tablets is also a day. The brazier's flame is the
   days you have shown up; it dims if you miss one, it never goes out on you.

   The rule from the school app holds here and is not negotiable: Marcus's
   voice only ever says his own recorded words (mentors.json → content.json,
   every line with its source). Everything else is Aurelia's voice, labelled
   as the school's words. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY = 'nol.v1', SESSION = 5;
  const BUILD = 'v1';
  let C = null, VIS = null, PORTICO = null, RIG = null, CUES = null;
  const NAR = new Audio(), MAR = new Audio(); NAR.preload = 'auto'; MAR.preload = 'auto';
  let S = load();

  /* ---------- state ---------- */
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.v === 1) return s; } catch (e) {}
    return { v: 1, journey: 0, start: null, done: [], skipped: [], days: {}, sound: true, taps: 0, greeted: 0, dones: 0, scrolls: [], seenHelp: false };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const dayBefore = iso => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() - 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  function dayNumber() { if (!S.start) return 1; const a = new Date(S.start + 'T12:00:00'), b = new Date(today() + 'T12:00:00'); return Math.max(1, Math.round((b - a) / 864e5) + 1); }
  const litDays = () => Object.values(S.days).filter(n => n > 0).length;
  function flameState() {
    const t = today(); if ((S.days[t] || 0) > 0) return 'lit';
    if ((S.days[dayBefore(t)] || 0) > 0) return 'lit';           // still warm from yesterday
    return litDays() ? 'dim' : 'out';
  }
  const doneToday = () => S.days[today()] || 0;
  const remaining = () => [...C.moves.filter(m => !S.done.includes(m.id) && !S.skipped.includes(m.id)), ...C.moves.filter(m => !S.done.includes(m.id) && S.skipped.includes(m.id))];
  const tierDone = tid => C.moves.filter(m => m.tier === tid).every(m => S.done.includes(m.id));
  const tiersDone = () => C.tiers.filter(t => tierDone(t.id)).length;

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
    else if (name === 'scroll') { tone(523, t, .3, 'sine', .07, ctx); tone(659, t + .12, .35, 'sine', .07, ctx); tone(784, t + .24, .8, 'sine', .07, ctx); }
  }
  const voiceOn = () => S.sound;
  function paintSound() { $('soundbtn').classList.toggle('off', !S.sound); }
  function hush() { NAR.pause(); MAR.pause(); if (RIG) RIG.hush(); $('readbtn').classList.remove('on'); }

  /* Aurelia reads: the exercises, the tiers, the scrolls, the UI lines. */
  function narrate(id, after) {
    if (!voiceOn()) { if (after) setTimeout(after, 300); return; }
    NAR.pause(); NAR.src = 'audio/voice/' + id + '.mp3'; NAR.onended = () => { $('readbtn').classList.remove('on'); if (after) after(); }; NAR.onerror = () => { if (after) after(); };
    NAR.play().catch(() => { if (after) after(); });
  }
  /* Marcus speaks: only a line from content.json, mouth off the audio clock. */
  function marcusSay(ln, pose, after) {
    if (!RIG || RIG.hidden) { if (after) after(); return; }
    const b = $('bubble'); b.hidden = false; b.classList.remove('school');
    b.innerHTML = wordSpans(ln.t) + `<span class="src">${ln.src}</span>`;
    b.classList.remove('say'); void b.offsetWidth; b.classList.add('say');
    if (pose && RIG[pose]) RIG[pose]();
    clearTimeout(marcusSay._t);
    const finish = () => { RIG.hush(); marcusSay._t = setTimeout(() => { b.hidden = true; }, 1800); if (after) after(); };
    if (voiceOn()) {
      MAR.pause(); CUES = (VIS && VIS[ln.id]) || null; MAR.src = 'audio/marcus/' + ln.id + '.mp3';
      MAR.onended = finish; MAR.onerror = () => { RIG.talk(Math.min(12, ln.t.length / 14)); setTimeout(finish, Math.min(12000, ln.t.length * 70)); };
      RIG.talk(20); MAR.play().catch(() => { RIG.talk(Math.min(12, ln.t.length / 14)); setTimeout(finish, Math.min(12000, ln.t.length * 70)); });
    } else { RIG.talk(Math.min(12, ln.t.length / 14)); setTimeout(finish, Math.min(12000, ln.t.length * 70)); }
  }
  const wordSpans = t => t.split(/\s+/).map((w, i) => `<span style="--i:${i}">${w}</span>`).join(' ');
  const pick = (arr, n) => arr[n % arr.length];

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
    PORTICO.setWreaths(tiersDone()); PORTICO.setFlame(flameState()); PORTICO.setPhase(skyFor());
    $('mfig').addEventListener('click', onMarcusTap);
    $('stage').addEventListener('pointerdown', e => { if (RIG && !RIG.hidden) RIG.lookAt(e.clientX, e.clientY); }, { passive: true });
  }
  const skyFor = () => Math.min(1, doneToday() / SESSION) * (doneToday() >= SESSION ? 1 : .55);

  function onMarcusTap() {
    if (!RIG || RIG.hidden) return;
    $('tapme').hidden = true; sfx('tap'); S.taps++; save();
    const pose = pick(['wave', 'salute', 'think', 'nod', 'laugh'], S.taps);
    marcusSay(pick(C.marcus.lines.greet, S.taps), pose);
  }

  /* ---------- HUD + laurel ---------- */
  function paintHud() {
    $('dayn').textContent = dayNumber(); $('dayof').textContent = S.journey || 30;
    const bar = $('laurelbar'); if (!bar.children.length) for (let i = 0; i < C.moves.length; i++) { const l = document.createElement('i'); l.className = 'leaf'; bar.appendChild(l); }
    [...bar.children].forEach((l, i) => l.classList.toggle('on', i < S.done.length));
    $('laurelcount').innerHTML = `<b>${S.done.length}</b> / ${C.moves.length}`;
    paintSound();
  }
  function popLeaf(i) { const l = $('laurelbar').children[i]; if (!l) return; l.classList.add('on'); l.classList.remove('pop'); void l.offsetWidth; l.classList.add('pop'); }

  /* ---------- the tablet ---------- */
  let CUR = null;
  function showTablet(m, autoRead) {
    CUR = m; const t = $('tablet');
    const tier = C.tiers.find(x => x.id === m.tier), idx = C.moves.indexOf(m) + 1;
    $('tnum').textContent = 'Tablet ' + idx; $('tkind').textContent = m.kind; $('tkind').className = 'kind kind-' + m.kind;
    $('tierline').textContent = tier.name + ' · ' + tier.line;
    const tx = $('ttext'); tx.innerHTML = '<div class="w">' + wordSpans(m.test) + '</div>'; tx.classList.remove('say'); void tx.offsetWidth; tx.classList.add('say');
    $('donebtn').textContent = 'Done'; $('donebtn').disabled = false; $('skipbtn').hidden = false; $('readbtn').hidden = false;
    t.classList.remove('sink'); t.classList.remove('rise'); void t.offsetWidth; t.classList.add('rise'); sfx('rise');
    if (RIG && !RIG.hidden) setTimeout(() => RIG.point(), 250);
    if (autoRead) { const go = () => { if (CUR === m) readTablet(); }; if (!MAR.paused && !MAR.ended) { const once = () => { MAR.removeEventListener('ended', once); setTimeout(go, 350); }; MAR.addEventListener('ended', once); } else setTimeout(go, 700); }
  }
  function readTablet() {
    if (!CUR) return; const b = $('readbtn');
    if (!NAR.paused && NAR.src.includes('mv-' + CUR.id)) { NAR.pause(); b.classList.remove('on'); return; }
    MAR.pause(); if (RIG) RIG.hush(); b.classList.add('on'); narrate('mv-' + CUR.id);
  }
  function restTablet() {
    CUR = null; const t = $('tablet'); const next = remaining()[0];
    $('tnum').textContent = 'Day ' + dayNumber() + ' done'; $('tkind').textContent = ''; $('tkind').className = 'kind'; $('tkind').style.display = 'none';
    $('tierline').textContent = next ? 'Tomorrow: ' + C.tiers.find(x => x.id === next.tier).name : 'The first deck is done';
    const tx = $('ttext'); tx.innerHTML = '<div class="w">' + wordSpans(next ? 'The flame is lit and Marcus is here. Come back tomorrow, or do one more now if you want to.' : 'Twenty-five things, and you did every one. More tablets are being written; the portico will be here.');
    tx.classList.remove('say'); void tx.offsetWidth; tx.classList.add('say');
    $('readbtn').hidden = true; $('skipbtn').hidden = true; $('donebtn').textContent = next ? 'One more' : 'Sit with Marcus'; $('donebtn').disabled = false;
    t.classList.remove('sink'); t.classList.remove('rise'); void t.offsetWidth; t.classList.add('rise');
  }
  function nextTablet(autoRead) {
    $('tkind').style.display = ''; const r = remaining();
    if (!r.length) { restTablet(); return; }
    showTablet(r[0], autoRead);
  }

  let busy = false;
  function onDone() {
    if (busy) return;
    if (!CUR) { // the rest tablet's button
      const r = remaining(); if (r.length) { $('tablet').classList.add('sink'); setTimeout(() => nextTablet(true), 380); } else onMarcusTap();
      return;
    }
    busy = true; const m = CUR; const i = S.done.length;
    S.done.push(m.id); S.skipped = S.skipped.filter(x => x !== m.id); S.dones++;
    const t = today(); if (!S.start) S.start = t; const first = !(S.days[t] > 0); S.days[t] = (S.days[t] || 0) + 1; save();
    hush(); sfx('done'); popLeaf(i); $('laurelcount').innerHTML = `<b>${S.done.length}</b> / ${C.moves.length}`;
    $('donebtn').disabled = true;
    PORTICO.glideTo(skyFor());
    if (first) { PORTICO.setFlame('lit'); PORTICO.flare(); sfx('flame'); }
    // Marcus: every second one he speaks, the rest he answers with the body
    const speak = S.dones % 2 === 1;
    if (speak) marcusSay(pick(C.marcus.lines.done, Math.floor(S.dones / 2)), S.dones % 4 === 1 ? 'cheer' : 'nod');
    else { RIG.cheer(); }
    const wreathIdx = C.tiers.findIndex(x => x.id === m.tier);
    const finishedTier = tierDone(m.tier), finishedDay = doneToday() % SESSION === 0, finishedDeck = !remaining().length;
    $('tablet').classList.add('sink');
    setTimeout(() => {
      busy = false;
      if (finishedTier) { PORTICO.hangWreath(wreathIdx); sfx('wreath'); setTimeout(() => openScroll(wreathIdx, finishedDay, finishedDeck), 900); }
      else if (finishedDay) endOfDay(finishedDeck);
      else nextTablet(true);
    }, speak ? 1400 : 700);
  }
  function onSkip() {
    if (!CUR || busy) return; sfx('tap');
    if (!S.skipped.includes(CUR.id)) S.skipped.push(CUR.id); save();
    $('tablet').classList.add('sink'); setTimeout(() => nextTablet(true), 380);
  }

  /* ---------- overlays ---------- */
  function veil(html, cls = '') { const o = $('overlay'); o.innerHTML = `<div class="veil in ${cls}">${html}</div>`; return o.firstElementChild; }
  function closeVeil(then) { const v = $('overlay').firstElementChild; if (!v) { if (then) then(); return; } v.classList.remove('in'); v.classList.add('out'); setTimeout(() => { $('overlay').innerHTML = ''; if (then) then(); }, 480); }

  function cover() {
    const back = !!S.start;
    const v = veil(`<div class="cover">
      <h1><span class="em">Nation of Light</span>${back ? 'Welcome back.' : 'The portico at dawn.'}</h1>
      <p>${back ? `Day ${dayNumber()} of ${S.journey}. ${litDays()} ${litDays() === 1 ? 'day' : 'days'} lit. Marcus is waiting.` : 'Twenty-five small things, one at a time, with Marcus Aurelius beside you. His own words, and nothing else.'}</p>
      <button class="btn btn-gold" id="begin">${back ? 'Go in' : 'Begin'}</button>
      <div class="small">Sound on is the whole point. Headphones are lovely.</div>
    </div>`);
    v.querySelector('#begin').addEventListener('click', () => {
      ac(); MAR.muted = true; MAR.src = 'audio/marcus/m-g1.mp3'; MAR.play().then(() => { MAR.pause(); MAR.muted = false; MAR.currentTime = 0; }).catch(() => { MAR.muted = false; });
      sfx('tap');
      if (!S.journey) chooseJourney(); else closeVeil(enter);
    });
  }
  function chooseJourney() {
    const v = veil(`<div class="panel">
      <h2>How far are you going?</h2>
      <p class="lede">Pick it now, before you start. It ends, and it frees you. You can always go again.</p>
      <div class="choices">
        <button class="choice" data-j="30"><b>30</b><small>days</small><em>One tier a day. The whole first deck in a week, then on.</em></button>
        <button class="choice ninety" data-j="90"><b>90</b><small>days</small><em>A season. Long enough for a different person to walk out.</em></button>
      </div>
      <p class="foot">The flame counts the days you show up. Miss one and it dims. It does not go out on you, and it never scolds.</p>
    </div>`, 'light');
    narrate('ui-choose');
    v.querySelectorAll('.choice').forEach(b => b.addEventListener('click', () => { S.journey = +b.dataset.j; save(); sfx('tap'); NAR.pause(); closeVeil(enter); }));
  }
  function enter() {
    $('hud').hidden = false; $('deck').hidden = false; paintHud();
    RIG.enter();
    const greetIdx = S.greeted++; save();
    setTimeout(() => {
      marcusSay(pick(C.marcus.lines.greet, greetIdx), null, () => {
        if (S.taps === 0) $('tapme').hidden = false;
      });
    }, 1300);
    const restDay = doneToday() >= SESSION && doneToday() % SESSION === 0 && !S._more;
    setTimeout(() => { if (restDay) restTablet(); else nextTablet(true); }, greetIdx === 0 ? 5200 : 3800);
  }
  function openScroll(i, finishedDay, finishedDeck) {
    const s = C.story[i]; if (!S.scrolls.includes(s.id)) S.scrolls.push(s.id); save(); sfx('scroll');
    const v = veil(`<div class="panel scroll">
      <div class="eyebrow"><i></i>A scroll opens · ${i + 1} of 5</div>
      <h2>${s.title}</h2>
      <div class="text">${s.t}</div>
      <div class="who">The school's words, about him. His own words only ever come from him.</div>
      <div class="row"><button class="btn btn-gold" id="scrollok">${finishedDeck ? 'The deck is done' : finishedDay ? 'That is today' : 'On we go'}</button></div>
    </div>`, 'light');
    narrate('story-' + s.id);
    v.querySelector('#scrollok').addEventListener('click', () => { sfx('tap'); NAR.pause(); closeVeil(() => { if (finishedDeck) deckDone(); else if (finishedDay) endOfDay(false); else nextTablet(true); }); });
  }
  function endOfDay(finishedDeck) {
    const ev = pick(C.marcus.lines.evening, dayNumber() - 1);
    PORTICO.glideTo(1, 3000);
    const v = veil(`<div class="panel today">
      <svg class="flamebig" viewBox="0 0 16 20"><path d="M8 19c-3.6 0-6-2.5-6-5.8 0-2.6 1.6-4.3 2.7-5.6.6-.7 1-1.3 1.2-2 .6 1.1 1.2 2 2 2.7C9.7 10 11 11.4 11 13.6c0 1.2-.5 2.3-1.2 3 .9-.2 4.2-1.6 4.2-5.7 0-3.2-2.2-5-3.5-6.6C9.4 3 8.9 1.8 9 0c-3 1.4-3.4 4.3-3.6 5.8C4.6 4.7 4.2 3.4 4.2 2 1.7 3.8 0 7.2 0 10.6 0 15.6 3.7 19 8 19z" fill="#E0812A"/><path d="M8 19c-1.9 0-3.2-1.4-3.2-3.2 0-1.5 1-2.4 1.6-3.2.4-.5.6-.9.7-1.4.5.8.9 1.3 1.4 1.8.7.7 1.6 1.6 1.6 2.8C10.1 17.6 9.2 19 8 19z" fill="#FFD36B"/></svg>
      <h2 style="text-align:center">That is today.</h2>
      <div class="stat"><div><b>${dayNumber()}</b><small>of ${S.journey}</small></div><div><b>${litDays()}</b><small>${litDays() === 1 ? 'day' : 'days'} lit</small></div><div><b>${S.done.length}</b><small>of 25</small></div></div>
      <div class="quote" id="evq">${ev.t}<span class="src">Marcus, in his own words · ${ev.src}</span><button class="play" aria-label="Hear it"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg></button></div>
      <div class="row"><button class="btn btn-ghost" id="more">One more</button><button class="btn btn-gold" id="rest">Until tomorrow</button></div>
    </div>`, 'light');
    narrate('ui-today', () => setTimeout(() => marcusSay(ev, 'bow'), 300));
    v.querySelector('#evq .play').addEventListener('click', () => { NAR.pause(); marcusSay(ev, 'nod'); });
    v.querySelector('#more').addEventListener('click', () => { sfx('tap'); hush(); S._more = true; closeVeil(() => { PORTICO.glideTo(.1); nextTablet(true); }); });
    v.querySelector('#rest').addEventListener('click', () => { sfx('tap'); hush(); closeVeil(restTablet); });
  }
  function deckDone() {
    for (let i = 0; i < 40; i++) { const l = document.createElement('i'); l.className = 'fall'; l.style.left = Math.random() * 100 + '%'; l.style.animationDuration = (2.6 + Math.random() * 2.4) + 's'; l.style.animationDelay = (Math.random() * 1.6) + 's'; $('stage').appendChild(l); setTimeout(() => l.remove(), 6000); }
    RIG.cheer(); sfx('wreath'); PORTICO.glideTo(1, 3000);
    setTimeout(() => marcusSay(C.marcus.lines.done[0], 'cheer', () => restTablet()), 600);
  }
  function help() {
    const v = veil(`<div class="help"><div class="panel">
      <h3>What is here</h3>
      <ul>
        <li><b>Marcus</b> stands in the portico. Tap him and he speaks. Every word is his own, from the Meditations, with its source shown.</li>
        <li><b>The tablet</b> is one small thing to do, now, where you are. Aurelia reads it out. Do it, tap Done.</li>
        <li><b>The laurel</b> fills one leaf per tablet. Five tablets hang a <b>wreath</b> on the frieze and open a <b>scroll</b> of his real life.</li>
        <li><b>The flame</b> is the days you show up. Miss one and it dims. It never goes out on you.</li>
        <li>Five tablets is a day. More if you want. The sun climbs as you go.</li>
      </ul>
      <button class="btn btn-gold close" id="helpok">Back to the portico</button>
    </div></div>`, 'light');
    S.seenHelp = true; save();
    v.querySelector('#helpok').addEventListener('click', () => { sfx('tap'); closeVeil(); });
  }

  /* ---------- boot ---------- */
  async function boot() {
    const [c, v] = await Promise.all([fetch('content.json').then(r => r.json()), fetch('audio/marcus/visemes.json').then(r => r.json()).catch(() => null)]);
    C = c; VIS = v; buildScene();
    $('donebtn').addEventListener('click', onDone); $('skipbtn').addEventListener('click', onSkip); $('readbtn').addEventListener('click', readTablet);
    $('soundbtn').addEventListener('click', () => { S.sound = !S.sound; save(); paintSound(); if (!S.sound) hush(); else sfx('tap'); });
    $('helpbtn').addEventListener('click', () => { sfx('tap'); help(); });
    cover();
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
    window.NOL = { S, save, reset() { localStorage.removeItem(KEY); location.reload(); }, PORTICO: () => PORTICO, RIG: () => RIG };
  }
  document.addEventListener('DOMContentLoaded', boot);
})();
