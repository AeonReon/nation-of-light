/* Nation of Light — the portico.

   The one scene, drawn: the terrace of a Roman villa at first light, seen
   from inside the colonnade. Two Ionic columns and an entablature frame the
   view; beyond the marble parapet, umbrella pines and cypresses, a temple on
   a far hill, the hills going blue with distance, and the sun coming up. On
   the pavement an olive in a terracotta pot, a bronze brazier whose flame is
   the days you have shown up, and a laurel wreath hung on the frieze for
   every tier finished.

   Classical rules kept on purpose: one light from the upper left; the view
   opening and the columns in a golden section (270 : 60, near enough 1.618
   twice over); symmetry in the architecture, asymmetry in the life in it;
   aerial perspective (the further away, the bluer and paler); nothing
   pure black or pure white. The sky is parametric — setPhase(0..1) takes it
   from dawn through morning into a golden evening, and every colour in the
   scene that catches the light moves with it. */
(function () {
  const W = 390, H = 470, HZ = 292;
  const MARBLE = '#EFE7D6', MARBLE_L = '#FAF5EA', MARBLE_D = '#D6CBB4', MARBLE_S = '#B8AB92', MARBLE_X = '#9C8F76';
  const TERRA = '#B96742', TERRA_D = '#8C4A2C', TERRA_L = '#D18A64';
  const BRONZE = '#6E5A30', BRONZE_L = '#A38A48', BRONZE_D = '#463A1E';
  const OLIVE = '#7E9A6E', OLIVE_D = '#5C7A4E', OLIVE_L = '#A5BB93', TRUNK = '#7B6248';
  const LAUREL = '#4F7A4B', LAUREL_L = '#79A66C', LAUREL_D = '#33553A';

  /* ---- the sky through the day: dawn → morning → golden evening ---- */
  const KEYS = [
    { p: 0,   top: '#2F3D72', mid: '#7F86BA', hz: '#F2B893', sun: '#FFE3AE', sunY: 247,     glow: .95, far: '#6E76AA', mid2: '#98A0C7', near: '#B9BFDB', water: '#C8B7C9', pine: '#2E4A3E', warm: '#F7D9C0', ground: 'rgba(60,40,80,.18)', col: '#F4E4D4' },
    { p: .5, top: '#4C90CF', mid: '#A9D0EE', hz: '#F3E8D3', sun: '#FFF2C8', sunY: 92,      glow: .35, far: '#7C97B8', mid2: '#A7BDD2', near: '#CBD7E2', water: '#BFD8E8', pine: '#33573F', warm: '#FFFFFF', ground: 'rgba(60,50,40,.14)', col: '#F6F0E2' },
    { p: 1,  top: '#47508F', mid: '#C98572', hz: '#F7CB82', sun: '#FFD98A', sunY: 258,     glow: .9,  far: '#6B5E8B', mid2: '#9A7E9C', near: '#C7A6A7', water: '#E1B486', pine: '#2A3D33', warm: '#FFD9A6', ground: 'rgba(80,40,30,.22)', col: '#F6E2C8' }
  ];
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
  const rgba = (s, t, u) => s.replace(/[\d.]+\)$/, m => (parseFloat(m) + (parseFloat(u.match(/[\d.]+\)$/)[0]) - parseFloat(m)) * t).toFixed(3) + ')');
  function at(p) {
    p = Math.max(0, Math.min(1, p));
    let a = KEYS[0], b = KEYS[1];
    if (p > .5) { a = KEYS[1]; b = KEYS[2]; }
    const t = (p - a.p) / (b.p - a.p), o = {};
    for (const k in a) {
      if (k === 'p') continue;
      const va = a[k], vb = b[k];
      o[k] = typeof va === 'number' ? va + (vb - va) * t : va.startsWith('rgba') ? rgba(va, t, vb) : mix(va, vb, t);
    }
    return o;
  }

  /* ---- pieces ---- */
  function column(cx, w, top, bot, tone) {
    const x = cx - w / 2, shaft = [];
    // fluting: seven flutes, lit on the left, in shade on the right
    for (let i = 0; i < 7; i++) {
      const fx = x + 3 + i * ((w - 6) / 7), fw = (w - 6) / 7;
      const light = i < 3 ? .55 - i * .15 : 0, dark = i > 3 ? (i - 3) * .12 : 0;
      shaft.push(`<rect x="${fx.toFixed(1)}" y="${top + 26}" width="${fw.toFixed(1)}" height="${bot - top - 40}" fill="${tone}" />`);
      if (light) shaft.push(`<rect x="${fx.toFixed(1)}" y="${top + 26}" width="${(fw * .45).toFixed(1)}" height="${bot - top - 40}" fill="#fff" opacity="${light.toFixed(2)}"/>`);
      if (dark) shaft.push(`<rect x="${(fx + fw * .5).toFixed(1)}" y="${top + 26}" width="${(fw * .5).toFixed(1)}" height="${bot - top - 40}" fill="${MARBLE_X}" opacity="${dark.toFixed(2)}"/>`);
      shaft.push(`<rect x="${(fx + fw - 1).toFixed(1)}" y="${top + 26}" width="1" height="${bot - top - 40}" fill="${MARBLE_S}" opacity=".5"/>`);
    }
    const vol = (vx, vy, dir) => `<g transform="translate(${vx} ${vy}) scale(${dir} 1)">
        <circle r="7.5" fill="${tone}" stroke="${MARBLE_S}" stroke-width="1"/>
        <path d="M0 -5.5 A5.5 5.5 0 1 1 -5.2 1.8 A3.6 3.6 0 1 0 -0.2 -2.6 A1.6 1.6 0 1 1 1.4 -0.4" fill="none" stroke="${MARBLE_X}" stroke-width="1.1"/>
        <circle r="1.3" fill="${MARBLE_X}"/></g>`;
    return `<g class="col">
      <rect x="${x - 6}" y="${top}" width="${w + 12}" height="6" fill="${MARBLE_L}"/>
      <rect x="${x - 6}" y="${top + 5}" width="${w + 12}" height="2" fill="${MARBLE_S}" opacity=".5"/>
      <path d="M${x - 4} ${top + 7} H${x + w + 4} V${top + 20} Q${cx} ${top + 26} ${x - 4} ${top + 20} Z" fill="${tone}"/>
      ${vol(x - 1, top + 16, 1)}${vol(x + w + 1, top + 16, -1)}
      <path d="M${x + 3} ${top + 19} q${w / 2 - 3} 9 ${w - 6} 0" fill="none" stroke="${MARBLE_S}" stroke-width="1"/>
      ${[0, 1, 2, 3].map(i => `<ellipse cx="${x + 7 + i * (w - 14) / 3}" cy="${top + 22}" rx="2.6" ry="3.4" fill="${MARBLE_L}" stroke="${MARBLE_S}" stroke-width=".6"/>`).join('')}
      <rect x="${x + 2}" y="${top + 26}" width="${w - 4}" height="${bot - top - 40}" fill="${tone}"/>
      ${shaft.join('')}
      <rect x="${x + 2}" y="${top + 26}" width="${w - 4}" height="${bot - top - 40}" fill="url(#gShaft)"/>
      <rect x="${x}" y="${bot - 14}" width="${w}" height="5" rx="2" fill="${MARBLE_L}"/>
      <rect x="${x - 3}" y="${bot - 10}" width="${w + 6}" height="5" rx="2.5" fill="${tone}"/>
      <rect x="${x - 6}" y="${bot - 6}" width="${w + 12}" height="6" fill="${MARBLE_D}"/>
      <rect x="${x - 6}" y="${bot - 1}" width="${w + 12}" height="1.5" fill="${MARBLE_S}"/>
    </g>`;
  }

  function entablature(tone) {
    const meander = [];
    for (let x = 6; x < W; x += 22) meander.push(`<path d="M${x} 62 v-8 h14 v5 h-8 v-2 h5" fill="none" stroke="${MARBLE_X}" stroke-width="1.3" opacity=".75"/>`);
    const dentils = [];
    for (let x = 4; x < W; x += 12) dentils.push(`<rect x="${x}" y="34" width="6" height="6" fill="${MARBLE_D}"/>`);
    return `<g class="ent">
      <rect x="0" y="0" width="${W}" height="30" fill="${MARBLE_L}"/>
      <rect x="0" y="0" width="${W}" height="30" fill="url(#gCeiling)"/>
      <rect x="0" y="28" width="${W}" height="4" fill="${MARBLE_S}" opacity=".55"/>
      <rect x="0" y="32" width="${W}" height="10" fill="${tone}"/>${dentils.join('')}
      <rect x="0" y="42" width="${W}" height="2" fill="${MARBLE_S}" opacity=".6"/>
      <rect x="0" y="44" width="${W}" height="22" fill="${MARBLE_L}"/>${meander.join('')}
      <rect x="0" y="66" width="${W}" height="2" fill="${MARBLE_S}" opacity=".6"/>
      <rect x="0" y="68" width="${W}" height="7" fill="${tone}"/>
      <rect x="0" y="75" width="${W}" height="2" fill="${MARBLE_S}" opacity=".4"/>
    </g>`;
  }

  function cypress(x, base, h, tone) {
    return `<path d="M${x} ${base} Q${x - 6} ${base - h * .45} ${x} ${base - h} Q${x + 6} ${base - h * .45} ${x} ${base} Z" fill="${tone}"/>`;
  }
  function pine(x, base, h, tone, tone2) {
    return `<g><path d="M${x} ${base} L${x + 1.5} ${base - h * .55} L${x - 1.5} ${base - h * .55} Z" fill="#5A4636"/>
      <path d="M${x - h * .42} ${base - h * .55} Q${x} ${base - h * 1.15} ${x + h * .42} ${base - h * .55} Q${x} ${base - h * .42} ${x - h * .42} ${base - h * .55} Z" fill="${tone}"/>
      <path d="M${x - h * .3} ${base - h * .62} Q${x - h * .05} ${base - h * 1.05} ${x + h * .25} ${base - h * .7}" fill="none" stroke="${tone2}" stroke-width="2.2" opacity=".5"/></g>`;
  }
  function temple(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})" opacity=".85">
      <path d="M0 0 h40 v-14 h-40 Z" fill="var(--far)"/>
      <path d="M-3 -14 L20 -26 L43 -14 Z" fill="var(--far)"/>
      ${[3, 10, 17, 24, 31].map(c => `<rect x="${c}" y="-13" width="3" height="13" fill="var(--hz)" opacity=".7"/>`).join('')}
    </g>`;
  }
  function wreath(cx, cy, r) {
    const leaves = [];
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, rot = (a * 180 / Math.PI) + 90 + (i % 2 ? 28 : -28);
      leaves.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="2.4" ry="4.6" fill="${i % 3 ? LAUREL : LAUREL_L}" stroke="${LAUREL_D}" stroke-width=".5" transform="rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`);
    }
    return `<g class="wreath"><path d="M${cx} ${cy - r - 10} v10" stroke="${GOLD_RIBBON}" stroke-width="1.4"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${LAUREL_D}" stroke-width="2.2"/>${leaves.join('')}
      <path d="M${cx - 3} ${cy + r - 1} l3 5 l3 -5 M${cx} ${cy + r + 4} l-4 8 M${cx} ${cy + r + 4} l4 8" fill="none" stroke="${GOLD_RIBBON}" stroke-width="1.6" stroke-linecap="round"/></g>`;
  }
  const GOLD_RIBBON = '#C9A227', GOLD = '#C9A227', GOLD_D = '#8F6F12';

  function olive() {
    const leaf = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="4.2" fill="${OLIVE_L}" transform="rotate(${r} ${x} ${y})" opacity=".9"/>`;
    const leaves = [];
    for (let i = 0; i < 44; i++) { const a = i * 2.39, rr = 5 + (i % 9) * 3.6; leaves.push(leaf(48 + Math.cos(a) * rr * 1.3, 326 + Math.sin(a) * rr * .85, (a * 57) % 180)); }
    return `<g class="olive">
      <path d="M26 400 L70 400 L64 452 L32 452 Z" fill="${TERRA}"/>
      <path d="M54 400 L70 400 L64 452 L56 452 Z" fill="${TERRA_D}" opacity=".55"/>
      <path d="M30 404 L38 404 L36 448 L33 448 Z" fill="${TERRA_L}" opacity=".5"/>
      <rect x="23" y="394" width="50" height="8" rx="2" fill="${TERRA_L}"/>
      <rect x="23" y="400" width="50" height="2" fill="${TERRA_D}" opacity=".5"/>
      <ellipse cx="48" cy="398" rx="20" ry="3" fill="#5B4A3B" opacity=".6"/>
      <path d="M45 398 Q43 374 40 356 Q46 360 50 350 Q53 372 53 398 Z" fill="${TRUNK}"/>
      <path d="M46 376 Q36 364 28 352 M50 370 Q60 356 68 348 M48 362 Q50 348 46 338" stroke="${TRUNK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="48" cy="328" rx="36" ry="24" fill="${OLIVE}"/><ellipse cx="34" cy="336" rx="18" ry="13" fill="${OLIVE}"/><ellipse cx="64" cy="338" rx="16" ry="12" fill="${OLIVE}"/>
      <ellipse cx="40" cy="318" rx="22" ry="14" fill="${OLIVE_L}" opacity=".55"/>
      <ellipse cx="60" cy="332" rx="20" ry="12" fill="${OLIVE_D}" opacity=".55"/>
      ${leaves.join('')}
      <circle cx="36" cy="330" r="1.6" fill="#3E4A2C"/><circle cx="58" cy="322" r="1.6" fill="#3E4A2C"/><circle cx="50" cy="338" r="1.6" fill="#4A5A34"/>
    </g>`;
  }
  function brazier() {
    return `<g class="brazier" transform="translate(362 0)">
      <ellipse cx="0" cy="446" rx="26" ry="4.5" fill="rgba(40,30,20,.22)"/>
      <path d="M-14 444 L-6 396 M14 444 L6 396 M0 446 L0 400" stroke="${BRONZE}" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M-14 444 L-6 396 M0 446 L0 400" stroke="${BRONZE_L}" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>
      <circle cx="-14" cy="444" r="3" fill="${BRONZE_D}"/><circle cx="14" cy="444" r="3" fill="${BRONZE_D}"/><circle cx="0" cy="446" r="3" fill="${BRONZE_D}"/>
      <path d="M-24 392 Q0 414 24 392 L26 386 L-26 386 Z" fill="${BRONZE}"/>
      <path d="M-24 392 Q-12 404 -4 408 L-2 386 L-26 386 Z" fill="${BRONZE_L}" opacity=".45"/>
      <ellipse cx="0" cy="386" rx="26" ry="5" fill="${BRONZE_L}"/>
      <ellipse cx="0" cy="386" rx="22" ry="3.4" fill="${BRONZE_D}"/>
      <ellipse cx="0" cy="386" rx="18" ry="2.6" fill="#3A2A14"/>
      <g class="embers"><circle cx="-6" cy="385" r="1.4" fill="#FF9A3C"/><circle cx="5" cy="384" r="1.2" fill="#FFB45A"/><circle cx="0" cy="386" r="1.1" fill="#FFD27A"/></g>
      <g class="flame">
        <path class="fl fl3" d="M0 386 Q-13 366 -4 350 Q-1 362 2 352 Q12 366 0 386 Z" fill="#FF8A2A" opacity=".85"/>
        <path class="fl fl2" d="M0 386 Q-9 370 -2 358 Q0 366 3 359 Q8 370 0 386 Z" fill="#FFB43C" opacity=".95"/>
        <path class="fl fl1" d="M0 385 Q-4 376 0 368 Q4 376 0 385 Z" fill="#FFF0A8"/>
      </g>
      <ellipse class="flameglow" cx="0" cy="376" rx="34" ry="30" fill="url(#gFlame)"/>
    </g>`;
  }

  /* a lyre on a peg on the right column; tap it and it plays a while */
  function lyre() {
    const strings = []; for (let i = 0; i < 7; i++) { const x = 361 + i * 3.4; strings.push(`<path class="str" d="M${x} 296 L${(x - 361) * .55 + 363} 325" stroke="#FFF3C4" stroke-width=".8" opacity=".9"/>`); }
    return `<g class="lyre">
      <rect x="350" y="278" width="44" height="58" rx="8" fill="#000" opacity="0"/>
      <circle cx="372" cy="283" r="1.8" fill="${BRONZE_D}"/>
      <path d="M372 285 L372 289" stroke="${BRONZE_D}" stroke-width="1.2"/>
      <path d="M358 326 Q350 300 360 289 Q364 300 362 312" fill="none" stroke="${GOLD}" stroke-width="3" stroke-linecap="round"/>
      <path d="M386 326 Q394 300 384 289 Q380 300 382 312" fill="none" stroke="${GOLD}" stroke-width="3" stroke-linecap="round"/>
      <path d="M359 296 L385 296" stroke="${GOLD_D}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M356 326 Q372 344 388 326 Q372 318 356 326 Z" fill="${GOLD}" stroke="${GOLD_D}" stroke-width="1"/>
      <ellipse cx="372" cy="328" rx="6" ry="2.6" fill="${GOLD_D}" opacity=".7"/>
      ${strings.join('')}
    </g>`;
  }
  function build() {
    const cols = column(44, 40, 76, 366, 'var(--col)') + column(346, 40, 76, 366, 'var(--col)');
    const floorLines = [];
    for (let i = -6; i <= 6; i++) {
      const x0 = 195 + i * 30, x1 = 195 + i * 92;
      floorLines.push(`<path d="M${x0} 366 L${x1} ${H}" stroke="${MARBLE_S}" stroke-width="1" opacity=".5"/>`);
    }
    for (const y of [386, 412, 446]) floorLines.push(`<path d="M0 ${y} H${W}" stroke="${MARBLE_S}" stroke-width="1" opacity=".45"/>`);
    const motes = [];
    for (let i = 0; i < 14; i++) motes.push(`<circle class="mote" cx="${60 + Math.random() * 270}" cy="${90 + Math.random() * 260}" r="${(.9 + Math.random() * 1.2).toFixed(1)}" fill="#FFF5D6" style="--d:${(6 + Math.random() * 8).toFixed(1)}s;--o:${(Math.random() * 8).toFixed(1)}s"/>`);
    return `
<svg class="scene-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <defs>
    <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" style="stop-color:var(--top)"/><stop offset=".55" style="stop-color:var(--mid)"/><stop offset="1" style="stop-color:var(--hz)"/>
    </linearGradient>
    <radialGradient id="gSun" cx=".5" cy=".5" r=".5"><stop offset="0" style="stop-color:var(--sun)" stop-opacity="1"/><stop offset=".45" style="stop-color:var(--sun)" stop-opacity=".45"/><stop offset="1" style="stop-color:var(--sun)" stop-opacity="0"/></radialGradient>
    <linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--water)"/><stop offset="1" style="stop-color:var(--near)"/></linearGradient>
    <linearGradient id="gShaft" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#6A5A44" stop-opacity=".28"/></linearGradient>
    <linearGradient id="gCeiling" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E8270" stop-opacity=".35"/><stop offset="1" stop-color="#8E8270" stop-opacity="0"/></linearGradient>
    <linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${MARBLE_D}"/><stop offset=".3" stop-color="${MARBLE}"/><stop offset="1" stop-color="${MARBLE_L}"/></linearGradient>
    <linearGradient id="gParapet" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${MARBLE_L}"/><stop offset=".6" stop-color="${MARBLE}"/><stop offset="1" stop-color="${MARBLE_D}"/></linearGradient>
    <radialGradient id="gFlame" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFB24A" stop-opacity=".55"/><stop offset="1" stop-color="#FFB24A" stop-opacity="0"/></radialGradient>
    <linearGradient id="gLight" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--warm)" stop-opacity=".38"/><stop offset="1" style="stop-color:var(--warm)" stop-opacity="0"/></linearGradient>
    <linearGradient id="gHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--hz)" stop-opacity="0"/><stop offset="1" style="stop-color:var(--hz)" stop-opacity=".7"/></linearGradient>
  </defs>

  <!-- depth 0: sky and sun -->
  <g class="lyr" data-depth="0">
    <rect x="0" y="0" width="${W}" height="${HZ + 50}" fill="url(#gSky)"/>
    <g class="sun"><circle cx="195" cy="0" r="120" fill="url(#gSun)" class="sunglow"/><circle cx="195" cy="0" r="14" style="fill:var(--sun)"/></g>
    <g class="clouds">
      <ellipse cx="90" cy="110" rx="46" ry="6" fill="#fff" opacity=".22"/><ellipse cx="300" cy="86" rx="60" ry="7" fill="#fff" opacity=".18"/><ellipse cx="220" cy="140" rx="38" ry="5" fill="#fff" opacity=".16"/>
    </g>
    <g class="birds"><path d="M0 0 q4 -4 8 0 q4 -4 8 0" fill="none" stroke="#3A3A4A" stroke-width="1.2" class="bird b1"/><path d="M0 0 q3 -3 6 0 q3 -3 6 0" fill="none" stroke="#3A3A4A" stroke-width="1" class="bird b2"/><path d="M0 0 q3 -3 6 0 q3 -3 6 0" fill="none" stroke="#3A3A4A" stroke-width="1" class="bird b3"/></g>
  </g>
  <!-- depth 1: far hills, a temple, water -->
  <g class="lyr" data-depth="1">
    <path d="M0 262 Q60 236 120 250 Q170 262 230 236 Q290 214 340 240 Q370 252 390 246 V${HZ + 50} H0 Z" style="fill:var(--far)"/>
    ${temple(184, 236, .55)}
    <path d="M0 274 Q50 256 100 268 Q160 282 220 262 Q280 246 330 266 Q360 276 390 270 V${HZ + 50} H0 Z" style="fill:var(--mid2)"/>
    <rect x="0" y="${HZ - 8}" width="${W}" height="${58}" fill="url(#gWater)"/>
    <path d="M150 ${HZ - 4} H240" style="stroke:var(--sun)" stroke-width="1.2" opacity=".55"/>
    <path d="M0 284 Q60 274 120 286 Q200 298 260 282 Q330 268 390 284 V${HZ + 50} H0 Z" style="fill:var(--near)"/>
    <rect x="0" y="200" width="${W}" height="${HZ - 200}" fill="url(#gHaze)"/>
  </g>
  <!-- depth 2: pines and cypresses beyond the parapet -->
  <g class="lyr" data-depth="2">
    ${cypress(96, 326, 74, 'var(--pine)')}${cypress(108, 326, 58, 'var(--pine)')}${cypress(292, 326, 66, 'var(--pine)')}
    ${pine(148, 326, 48, 'var(--pine)', OLIVE_L)}${pine(258, 326, 56, 'var(--pine)', OLIVE_L)}${pine(330, 326, 40, 'var(--pine)', OLIVE_L)}
    <path d="M0 322 Q60 312 120 318 Q190 324 260 314 Q330 306 390 318 V346 H0 Z" fill="${OLIVE_D}"/>
    <path d="M0 330 Q100 322 200 330 Q300 338 390 328 V346 H0 Z" fill="${LAUREL_D}" opacity=".7"/>
  </g>
  <!-- depth 3: the parapet, the columns, the entablature -->
  <g class="lyr" data-depth="3">
    <rect x="0" y="322" width="${W}" height="6" fill="${MARBLE_L}"/>
    <rect x="0" y="328" width="${W}" height="3" fill="${MARBLE_S}" opacity=".5"/>
    <rect x="0" y="331" width="${W}" height="28" fill="url(#gParapet)"/>
    ${[70, 100, 130, 160, 190, 220, 250, 280, 310].map(x => `<rect x="${x - 4}" y="334" width="8" height="22" rx="3" fill="${MARBLE_D}" opacity=".55"/><rect x="${x - 3}" y="334" width="3" height="22" rx="1.5" fill="${MARBLE_L}" opacity=".7"/>`).join('')}
    <rect x="0" y="359" width="${W}" height="7" fill="${MARBLE_D}"/>
    <rect x="0" y="364" width="${W}" height="2" fill="${MARBLE_S}"/>
    ${cols}${entablature('var(--col)')}
    <g class="wreaths"></g>
  </g>
  <!-- depth 4: the pavement, the light, the props -->
  <g class="lyr" data-depth="4">
    <rect x="0" y="366" width="${W}" height="${H - 366}" fill="url(#gFloor)"/>
    ${floorLines.join('')}
    <path d="M52 366 L120 ${H} L60 ${H} L28 366 Z" style="fill:var(--ground)"/>
    <path d="M354 366 L390 ${H} L350 ${H} L330 366 Z" style="fill:var(--ground)"/>
    <path d="M60 80 L390 250 L390 ${H} L140 ${H} Z" fill="url(#gLight)" class="lightshaft"/>
    <g class="motes">${motes.join('')}</g>
    ${olive()}
    ${brazier()}
    ${lyre()}
  </g>
</svg>`;
  }

  class Portico {
    constructor(host) {
      host.innerHTML = build(); this.el = host; this.svg = host.querySelector('svg');
      this.sun = this.svg.querySelector('.sun'); this.wreaths = this.svg.querySelector('.wreaths'); this.flame = this.svg.querySelector('.brazier');
      this.layers = [...this.svg.querySelectorAll('.lyr')];
      this.props = { brazier: this.svg.querySelector('.brazier'), olive: this.svg.querySelector('.olive'), lyre: this.svg.querySelector('.lyre') };
      this.px = 0; this.py = 0; this.tx = 0; this.ty = 0; this.setPhase(0);
      const move = (x, y) => { this.tx = Math.max(-1, Math.min(1, x)); this.ty = Math.max(-1, Math.min(1, y)); };
      window.addEventListener('pointermove', e => move((e.clientX / innerWidth - .5) * 2, (e.clientY / innerHeight - .5) * 2), { passive: true });
      window.addEventListener('deviceorientation', e => { if (e.gamma == null) return; move(e.gamma / 25, (e.beta - 45) / 30); }, { passive: true });
      const step = () => { this.px += (this.tx - this.px) * .04; this.py += (this.ty - this.py) * .04;
        for (const l of this.layers) { const d = +l.dataset.depth; const k = (4 - d) * 2.2; l.setAttribute('transform', `translate(${(-this.px * k).toFixed(2)} ${(-this.py * k * .5).toFixed(2)})`); }
        requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
    onTap(name, fn) { const el = this.props[name]; if (el) el.addEventListener('click', e => { e.stopPropagation(); fn(el); }); }
    setPhase(p) {
      const c = at(p), s = this.svg.style;
      for (const k of ['top', 'mid', 'hz', 'sun', 'far', 'mid2', 'near', 'water', 'pine', 'warm', 'ground', 'col']) s.setProperty('--' + k, c[k]);
      this.sun.setAttribute('transform', `translate(0 ${c.sunY.toFixed(1)})`);
      this.svg.querySelector('.sunglow').setAttribute('opacity', c.glow.toFixed(2));
      this.phase = p;
    }
    /* glide the sky from where it is to p over ms */
    glideTo(p, ms = 2400) {
      const from = this.phase, t0 = performance.now(); cancelAnimationFrame(this._g);
      const run = now => { const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3); this.setPhase(from + (p - from) * e); if (k < 1) this._g = requestAnimationFrame(run); };
      this._g = requestAnimationFrame(run);
    }
    setWreaths(n) {
      const xs = [110, 152, 195, 238, 280];
      this.wreaths.innerHTML = xs.slice(0, n).map(x => wreath(x, 101, 14)).join('');
    }
    hangWreath(i) { const w = this.wreaths; const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.innerHTML = wreath([110, 152, 195, 238, 280][i], 101, 14); g.classList.add('hang'); w.appendChild(g); }
    setFlame(state) { this.flame.classList.remove('lit', 'dim', 'out'); this.flame.classList.add(state); }
    flare() { this.flame.classList.remove('flare'); void this.flame.getBoundingClientRect(); this.flame.classList.add('flare'); }
  }
  window.Portico = Portico;
})();
