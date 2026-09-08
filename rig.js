/* Nation of Light — the Marcus rig.

   A drawn Marcus Aurelius who stands in the portico, alive. Every joint is a
   spring and every pose is an impulse, so nothing ever plays the same twice:
   he breathes, blinks, glances about, looks at what you touch, his cloak
   lags behind his shoulders and overshoots, and his mouth follows the baked
   Rhubarb viseme track off the audio clock so it can never drift.
   The engine is the one under Mo & Pip and the Franklin figure in the
   school app; the figure is new. Nothing here is an image file.

   He is drawn from the Louvre bust (about 170 AD): the tight curls, the full
   beard, the level brows, the steady eyes. Fit and rested, the way a man who
   rode, wrestled and boxed as a boy would look — a tunic with the senator's
   twin stripes, a crimson cloak pinned at the shoulder, bare arms, sandals,
   and the little book in his hand. Light from the upper left, like the
   colonnade behind him. */
(function () {
  const SKIN = '#EBBD93', SKIN_D = '#D19E73', SKIN_L = '#F6D7B8',
    HAIR = '#3A2A1F', HAIR_L = '#5B4433', HAIR_D = '#241911',
    TUNIC = '#F8F2E4', TUNIC_D = '#DFD4BE', TUNIC_S = '#CFC2A8', CLAVUS = '#7B2A3A',
    CLOAK = '#93313D', CLOAK_D = '#6E2230', CLOAK_L = '#AE4451',
    GOLD = '#C9A227', GOLD_D = '#9A7A14', LEATHER = '#7A4E2B', LEATHER_D = '#5A3720',
    BOOK = '#8A4B3C', PAGE = '#F1E7D2', EYE = '#4E3422', INK = '#1E140E';

  // curls: little clusters of circles, so the hair reads as the bust does
  const curl = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const HAIR_TOP = [
    [80, 74, 9], [90, 64, 9.5], [102, 58, 10], [116, 57, 10], [129, 62, 9.5], [140, 72, 9], [146, 84, 8],
    [76, 88, 8], [84, 66, 7], [96, 60, 7], [110, 55, 7.5], [124, 57, 7], [136, 65, 7], [144, 77, 7],
    [72, 100, 7], [148, 98, 7], [88, 72, 6], [122, 64, 6], [104, 64, 6]
  ].map(([x, y, r], i) => curl(x, y, r, i % 3 === 1 ? HAIR_L : HAIR)).join('');
  const BEARD_LO = [
    [86, 132, 7], [94, 140, 7.5], [104, 145, 7.5], [116, 145, 7.5], [126, 140, 7.5], [134, 132, 7],
    [90, 128, 5.5], [130, 128, 5.5], [100, 138, 5], [120, 138, 5], [110, 141, 5.5],
    [98, 148, 5], [110, 150, 5.5], [122, 148, 5]
  ].map(([x, y, r], i) => curl(x, y, r, i % 4 === 2 ? HAIR_L : i % 4 === 3 ? HAIR_D : HAIR)).join('');
  const BEARD_SIDE = [
    [80, 112, 6], [78, 122, 6.5], [140, 112, 6], [142, 122, 6.5], [83, 104, 5], [137, 104, 5]
  ].map(([x, y, r], i) => curl(x, y, r, i % 2 ? HAIR_L : HAIR)).join('');

  const MARCUS_SVG = `
<svg viewBox="0 0 220 330" class="rig-svg" aria-hidden="true">
  <defs>
    <linearGradient id="mgTunic" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${TUNIC}"/><stop offset=".62" stop-color="${TUNIC}"/><stop offset="1" stop-color="${TUNIC_D}"/></linearGradient>
    <linearGradient id="mgCloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${CLOAK_L}"/><stop offset=".55" stop-color="${CLOAK}"/><stop offset="1" stop-color="${CLOAK_D}"/></linearGradient>
    <radialGradient id="mgFace" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="${SKIN_L}"/><stop offset=".55" stop-color="${SKIN}"/><stop offset="1" stop-color="${SKIN_D}"/></radialGradient>
  </defs>
  <ellipse class="r-shadow" cx="110" cy="312" rx="56" ry="8" fill="rgba(60,40,20,.2)"/>
  <g class="r-root">
    <!-- the cloak's long fall down the back: sprung from the shoulder pin -->
    <g class="r-hair r-hair-r">
      <path d="M146 152 Q176 186 172 276 Q150 284 132 270 Q140 214 138 168 Z" fill="url(#mgCloak)"/>
      <path d="M160 176 Q168 226 164 272" stroke="${CLOAK_D}" stroke-width="2" fill="none" opacity=".55"/>
      <path d="M150 170 Q156 226 152 268" stroke="${CLOAK_L}" stroke-width="1.4" fill="none" opacity=".5"/>
    </g>
    <!-- legs: shaped calves, a sandal sole and thin crossed straps -->
    <g class="r-legs">
      <path d="M88 246 Q82 262 86 278 Q88 292 90 300 L106 300 Q108 290 108 276 Q110 260 106 246 Z" fill="${SKIN}"/>
      <path d="M100 248 Q104 264 104 278 Q104 292 106 300 L108 300 Q110 286 108 272 Q108 258 106 246 Z" fill="${SKIN_D}" opacity=".55"/>
      <path d="M114 246 Q110 260 112 276 Q112 290 114 300 L130 300 Q132 292 134 278 Q138 262 132 246 Z" fill="${SKIN}"/>
      <path d="M126 248 Q130 264 130 278 Q130 292 130 300 L134 300 Q136 288 136 274 Q138 258 132 246 Z" fill="${SKIN_D}" opacity=".55"/>
      <g stroke="${LEATHER}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".95">
        <path d="M88 268 L106 276 M106 268 L88 276 M88 284 L106 292 M106 284 L88 292 M87 296 H107"/>
        <path d="M114 268 L132 276 M132 268 L114 276 M114 284 L132 292 M132 284 L114 292 M113 296 H133"/>
      </g>
      <path d="M82 302 Q84 297 96 298 L108 298 Q112 302 108 308 L84 308 Q78 306 82 302 Z" fill="${LEATHER}"/>
      <path d="M112 302 Q114 297 126 298 L138 298 Q142 302 138 308 L114 308 Q108 306 112 302 Z" fill="${LEATHER}"/>
      <path d="M84 306 H108 M114 306 H138" stroke="${LEATHER_D}" stroke-width="1.6"/>
      <path d="M92 298 L96 302 L100 298 M122 298 L126 302 L130 298" stroke="${LEATHER_D}" stroke-width="1.3" fill="none"/>
    </g>
    <g class="r-body">
      <!-- left arm (viewer's left): bare, relaxed, holding the little book -->
      <g class="r-arm r-arm-l">
        <path d="M72 158 Q52 190 54 236 L74 240 Q76 200 88 168 Z" fill="${SKIN}"/>
        <path d="M60 172 Q52 200 56 236 L64 238 Q62 204 70 176 Z" fill="${SKIN_D}" opacity=".35"/>
        <ellipse cx="64" cy="246" rx="10" ry="9" fill="${SKIN}"/>
        <g transform="translate(64 249) rotate(-10)">
          <rect x="-12" y="-9" width="24" height="17" rx="2" fill="${BOOK}"/>
          <rect x="-10" y="-7" width="20" height="13" rx="1" fill="${PAGE}"/>
          <path d="M-7 -3 H7 M-7 0 H5 M-7 3 H6" stroke="#B9A98B" stroke-width="1"/>
        </g>
      </g>
      <!-- the tunic: short sleeves, twin senator's stripes, belted -->
      <path d="M78 148 Q110 134 142 148 L158 178 L150 250 L70 250 L62 178 Z" fill="url(#mgTunic)"/>
      <path d="M142 148 L158 178 L150 250 L130 250 L136 182 Z" fill="${TUNIC_D}" opacity=".7"/>
      <path d="M80 150 L62 178 L70 250 L86 250 L84 184 Z" fill="${TUNIC_S}" opacity=".3"/>
      <path d="M99 152 L103 152 L100 250 L96 250 Z" fill="${CLAVUS}" opacity=".9"/>
      <path d="M117 152 L121 152 L124 250 L120 250 Z" fill="${CLAVUS}" opacity=".9"/>
      <!-- folds falling from the belt -->
      <path d="M90 214 Q92 232 90 250 M110 214 Q110 232 110 250 M130 214 Q128 232 130 250" stroke="${TUNIC_S}" stroke-width="1.4" fill="none" opacity=".8"/>
      <!-- the belt -->
      <path d="M68 206 Q110 214 152 206 L152 214 Q110 222 68 214 Z" fill="${LEATHER}"/>
      <path d="M68 206 Q110 214 152 206 L152 209 Q110 217 68 209 Z" fill="${LEATHER_D}" opacity=".5"/>
      <rect x="104" y="204" width="12" height="12" rx="2" fill="${GOLD}"/>
      <rect x="107" y="207" width="6" height="6" rx="1" fill="${GOLD_D}"/>
      <!-- chest and neckline: a fit man's frame -->
      <path d="M96 150 Q110 160 124 150 Q118 172 110 176 Q102 172 96 150 Z" fill="${SKIN}"/>
      <path d="M110 160 Q114 168 110 176 Q106 168 110 160 Z" fill="${SKIN_D}" opacity=".35"/>
      <!-- the cloak's front swag over the viewer's-left shoulder -->
      <g class="r-hair r-hair-l">
        <path d="M76 150 Q64 170 68 214 Q82 220 90 208 Q88 178 96 154 Z" fill="url(#mgCloak)"/>
        <path d="M80 162 Q76 190 80 210" stroke="${CLOAK_D}" stroke-width="1.6" fill="none" opacity=".5"/>
      </g>
      <!-- the cloak across the shoulders, and the fibula that pins it -->
      <path d="M74 150 Q110 132 148 150 L146 160 Q110 146 78 160 Z" fill="${CLOAK}"/>
      <path d="M118 144 Q134 140 148 150 L146 160 Q130 152 118 154 Z" fill="${CLOAK_D}" opacity=".45"/>
      <circle cx="146" cy="154" r="6" fill="${GOLD}"/><circle cx="146" cy="154" r="3.2" fill="${GOLD_D}"/><circle cx="144.5" cy="152.5" r="1.2" fill="#FFF3C4"/>
      <!-- right arm (viewer's right): the one that gestures, pivot at the shoulder -->
      <g class="r-arm r-arm-r">
        <path d="M148 158 Q170 188 168 234 L148 240 Q146 202 136 168 Z" fill="${SKIN}"/>
        <path d="M158 174 Q168 206 164 236 L168 234 Q170 200 160 172 Z" fill="${SKIN_D}" opacity=".45"/>
        <ellipse cx="158" cy="245" rx="10" ry="9" fill="${SKIN}"/>
        <path d="M150 243 Q158 236 166 243" stroke="${SKIN_D}" stroke-width="1.2" fill="none" opacity=".6"/>
      </g>
    </g>
    <g class="r-head">
      <!-- neck -->
      <path d="M98 118 L122 118 L126 152 L94 152 Z" fill="${SKIN_D}"/>
      <path d="M98 118 L110 118 L110 152 L94 152 Z" fill="${SKIN}" opacity=".6"/>
      <!-- the hair behind the head -->
      <path d="M72 92 Q66 132 80 150 L140 150 Q154 132 148 92 Z" fill="${HAIR_D}"/>
      <!-- face -->
      <ellipse cx="110" cy="100" rx="35" ry="41" fill="url(#mgFace)"/>
      <path d="M126 64 Q146 84 143 116 Q142 132 130 140 Q141 118 138 96 Q136 78 126 64 Z" fill="${SKIN_D}" opacity=".35"/>
      <!-- the side beard, close to the cheeks -->
      ${BEARD_SIDE}
      <!-- the jaw: the lower beard drops a touch when he speaks -->
      <g class="r-jaw">
        <ellipse cx="110" cy="132" rx="26" ry="14" fill="${SKIN}"/>
        ${BEARD_LO}
        <g class="r-mouth"><ellipse class="r-mouth-shape" cx="0" cy="0" rx="8" ry="1.5" fill="#6E3A30"/><path class="r-smile" d="M-9 -1 Q0 7 9 -1" fill="none" stroke="#6E3A30" stroke-width="2.2" stroke-linecap="round" opacity="0"/></g>
      </g>
      <!-- moustache, sitting over the top of the mouth -->
      <path d="M96 122 Q104 116 110 121 Q116 116 124 122 Q118 126 110 124 Q102 126 96 122 Z" fill="${HAIR}"/>
      <path d="M99 121 Q104 118 108 121" stroke="${HAIR_L}" stroke-width="1.4" fill="none"/>
      <!-- cheek warmth, nose, level brows -->
      <ellipse cx="86" cy="110" rx="7" ry="4.5" fill="#E28B7A" opacity=".28"/>
      <ellipse cx="134" cy="110" rx="7" ry="4.5" fill="#E28B7A" opacity=".28"/>
      <path d="M108 94 Q104 108 108 114 Q112 116 116 112 Q117 104 112 94" fill="${SKIN_D}" opacity=".7"/>
      <path d="M106 96 Q104 106 108 112" stroke="${SKIN_L}" stroke-width="1.4" fill="none" opacity=".7"/>
      <path d="M84 86 Q94 80 103 85" stroke="${HAIR}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <path d="M117 85 Q126 80 136 86" stroke="${HAIR}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <!-- eyes: steady, brown -->
      <ellipse cx="95" cy="96" rx="8" ry="5.6" fill="#FFFDF8"/>
      <ellipse cx="125" cy="96" rx="8" ry="5.6" fill="#FFFDF8"/>
      <g class="r-eye r-eye-l"><circle cx="96" cy="96.5" r="4.4" fill="${EYE}"/>
        <circle cx="96" cy="96.5" r="2.2" fill="${INK}"/><circle class="r-shine" cx="97.5" cy="95" r="1.2" fill="#fff"/></g>
      <g class="r-eye r-eye-r"><circle cx="126" cy="96.5" r="4.4" fill="${EYE}"/>
        <circle cx="126" cy="96.5" r="2.2" fill="${INK}"/><circle class="r-shine" cx="127.5" cy="95" r="1.2" fill="#fff"/></g>
      <path d="M87 93 Q95 89 103 93" stroke="${SKIN_D}" stroke-width="1.2" fill="none" opacity=".8"/>
      <path d="M117 93 Q125 89 133 93" stroke="${SKIN_D}" stroke-width="1.2" fill="none" opacity=".8"/>
      <!-- the curls on top, drawn last so they sit over the brow -->
      ${HAIR_TOP}
    </g>
  </g>
</svg>`;


  /* ---- Aurelia, keeper of the flame. Drawn, not painted, because nobody
     ever painted the real woman. Healthy, radiant, classical: a white stola
     to the ankle with a gold cord, a pale palla over one shoulder that lags
     behind her, fair hair in a low knot with a gold fillet and two loose
     strands, warm skin, clear eyes, and the small bronze lamp she carries. ---- */
  const A_SKIN = '#F2CDA8', A_SKIN_D = '#DBAA82', A_SKIN_L = '#FBE3CB', A_HAIR = '#E2B860', A_HAIR_L = '#F3D485', A_HAIR_D = '#B9903E',
    STOLA = '#FBF7EE', STOLA_D = '#E6DECD', STOLA_S = '#D2C8B3', PALLA = '#DCE8F0', PALLA_D = '#B9CEDD', PALLA_L = '#F1F6FA',
    A_EYE = '#3F7A7C', A_LIP = '#C4606A', LAMP = '#8C7238', LAMP_D = '#5C4A22';
  const AURELIA_SVG = `
<svg viewBox="0 0 220 330" class="rig-svg" aria-hidden="true">
  <defs>
    <linearGradient id="agStola" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${STOLA}"/><stop offset=".62" stop-color="${STOLA}"/><stop offset="1" stop-color="${STOLA_D}"/></linearGradient>
    <linearGradient id="agPalla" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${PALLA_L}"/><stop offset=".6" stop-color="${PALLA}"/><stop offset="1" stop-color="${PALLA_D}"/></linearGradient>
    <radialGradient id="agFace" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="${A_SKIN_L}"/><stop offset=".55" stop-color="${A_SKIN}"/><stop offset="1" stop-color="${A_SKIN_D}"/></radialGradient>
    <radialGradient id="agLamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFC461" stop-opacity=".55"/><stop offset="1" stop-color="#FFC461" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse class="r-shadow" cx="110" cy="312" rx="52" ry="8" fill="rgba(60,40,20,.2)"/>
  <g class="r-root">
    <!-- the palla's long fall down her back, sprung from the shoulder -->
    <g class="r-hair r-hair-r">
      <path d="M142 152 Q168 190 160 286 Q140 292 126 280 Q136 214 134 166 Z" fill="url(#agPalla)"/>
      <path d="M150 176 Q156 230 150 282" stroke="${PALLA_D}" stroke-width="1.6" fill="none" opacity=".6"/>
    </g>
    <!-- feet in sandals under the hem -->
    <g class="r-legs">
      <path d="M86 300 Q88 295 100 296 L110 296 Q114 302 110 308 L88 308 Q82 306 86 300 Z" fill="${A_SKIN}"/>
      <path d="M112 300 Q114 295 126 296 L136 296 Q140 302 136 308 L114 308 Q108 306 112 300 Z" fill="${A_SKIN}"/>
      <path d="M88 306 H110 M114 306 H136" stroke="${LAMP}" stroke-width="1.6"/>
      <path d="M96 298 L100 302 L104 298 M122 298 L126 302 L130 298" stroke="${LAMP}" stroke-width="1.2" fill="none"/>
    </g>
    <g class="r-body">
      <!-- left arm (viewer's left): bare from the shoulder pin, holding the lamp -->
      <g class="r-arm r-arm-l">
        <path d="M74 158 Q56 190 58 236 L76 240 Q78 200 88 168 Z" fill="${A_SKIN}"/>
        <path d="M62 174 Q56 202 60 236 L66 238 Q64 204 72 178 Z" fill="${A_SKIN_D}" opacity=".3"/>
        <ellipse cx="66" cy="246" rx="9" ry="8" fill="${A_SKIN}"/>
        <g transform="translate(66 236)">
          <ellipse cx="0" cy="-14" rx="26" ry="22" fill="url(#agLamp)"/>
          <path d="M-14 -4 Q-16 4 -8 6 L8 6 Q16 4 14 -4 Q6 -8 -6 -8 Z" fill="${LAMP}"/>
          <path d="M-14 -4 Q-8 -1 0 -1 Q8 -1 14 -4 Q6 -8 -6 -8 Z" fill="${LAMP_D}" opacity=".5"/>
          <path d="M-13 -5 L-20 -8 L-14 -2 Z" fill="${LAMP}"/>
          <path class="fl" d="M17 -6 Q13 -12 16 -18 Q18 -12 21 -16 Q23 -10 17 -6 Z" fill="#FFB43C"/>
          <path d="M17 -6 Q15 -10 17 -13 Q19 -10 17 -6 Z" fill="#FFF0A8"/>
        </g>
      </g>
      <!-- the stola: to the ankle, gathered under a gold cord, a soft overfold -->
      <path d="M80 150 Q110 138 140 150 L154 180 L156 300 L64 300 L66 180 Z" fill="url(#agStola)"/>
      <path d="M140 150 L154 180 L156 300 L132 300 L134 186 Z" fill="${STOLA_D}" opacity=".6"/>
      <path d="M80 150 L66 180 L64 300 L82 300 L84 186 Z" fill="${STOLA_S}" opacity=".28"/>
      <path d="M92 212 Q90 256 92 300 M110 212 Q110 256 110 300 M128 212 Q130 256 128 300" stroke="${STOLA_S}" stroke-width="1.3" fill="none" opacity=".8"/>
      <path d="M72 200 Q110 214 148 200 L148 230 Q110 242 72 230 Z" fill="${STOLA}" opacity=".9"/>
      <path d="M72 226 Q110 240 148 226" stroke="${STOLA_S}" stroke-width="1.2" fill="none" opacity=".7"/>
      <!-- the gold cord -->
      <path d="M70 200 Q110 212 150 200" stroke="${GOLD}" stroke-width="3" fill="none"/>
      <path d="M110 206 l-4 14 M110 206 l5 15" stroke="${GOLD}" stroke-width="2" stroke-linecap="round" fill="none"/>
      <circle cx="106" cy="221" r="2" fill="${GOLD_D}"/><circle cx="115" cy="222" r="2" fill="${GOLD_D}"/>
      <!-- the neckline and collarbones -->
      <path d="M94 150 Q110 164 126 150 Q120 176 110 178 Q100 176 94 150 Z" fill="${A_SKIN}"/>
      <path d="M100 160 Q110 166 120 160" stroke="${A_SKIN_D}" stroke-width="1.2" fill="none" opacity=".6"/>
      <!-- the palla over the viewer's-right shoulder, and its brooch -->
      <path d="M118 148 Q136 140 150 150 L156 176 Q136 166 118 160 Z" fill="url(#agPalla)"/>
      <circle cx="146" cy="154" r="5" fill="${GOLD}"/><circle cx="146" cy="154" r="2.4" fill="${GOLD_D}"/>
      <!-- right arm (viewer's right): bare, the one that gestures -->
      <g class="r-arm r-arm-r">
        <path d="M146 158 Q166 188 164 232 L146 238 Q144 202 134 168 Z" fill="${A_SKIN}"/>
        <path d="M156 176 Q164 206 160 234 L164 232 Q166 200 156 172 Z" fill="${A_SKIN_D}" opacity=".35"/>
        <ellipse cx="155" cy="243" rx="9" ry="8" fill="${A_SKIN}"/>
        <path d="M124 154 Q140 150 146 158" stroke="${GOLD}" stroke-width="2" fill="none" opacity=".7"/>
      </g>
    </g>
    <g class="r-head">
      <path d="M100 118 L120 118 L124 152 L96 152 Z" fill="${A_SKIN_D}"/>
      <path d="M100 118 L110 118 L110 152 L96 152 Z" fill="${A_SKIN}" opacity=".6"/>
      <!-- hair behind the head, and the low knot -->
      <path d="M74 92 Q68 130 82 148 L138 148 Q152 130 146 92 Z" fill="${A_HAIR_D}"/>
      <ellipse cx="144" cy="126" rx="11" ry="13" fill="${A_HAIR}"/>
      <ellipse cx="146" cy="123" rx="6" ry="7" fill="${A_HAIR_L}" opacity=".55"/>
      <!-- a loose strand each side, sprung -->
      <g class="r-hair r-hair-l">
        <path d="M78 96 Q66 120 70 150 Q78 154 84 146 Q80 122 84 100 Z" fill="${A_HAIR}"/>
        <path d="M78 100 Q72 122 76 146" stroke="${A_HAIR_L}" stroke-width="1.4" fill="none" opacity=".7"/>
      </g>
      <!-- face -->
      <ellipse cx="110" cy="100" rx="32" ry="39" fill="url(#agFace)"/>
      <path d="M124 66 Q142 84 140 114 Q139 128 128 136 Q138 116 136 96 Q134 78 124 66 Z" fill="${A_SKIN_D}" opacity=".3"/>
      <!-- the jaw: chin, and the mouth that moves -->
      <g class="r-jaw">
        <ellipse cx="110" cy="128" rx="20" ry="11" fill="${A_SKIN}"/>
        <path d="M100 138 Q110 143 120 138" stroke="${A_SKIN_D}" stroke-width="1" fill="none" opacity=".5"/>
        <g class="r-mouth"><ellipse class="r-mouth-shape" cx="0" cy="0" rx="7" ry="1.6" fill="${A_LIP}"/><path class="r-smile" d="M-8 -1 Q0 6 8 -1" fill="none" stroke="${A_LIP}" stroke-width="2.2" stroke-linecap="round" opacity="0"/></g>
      </g>
      <ellipse cx="89" cy="112" rx="6.5" ry="4" fill="#F0A0A0" opacity=".24"/>
      <ellipse cx="131" cy="112" rx="6.5" ry="4" fill="#F0A0A0" opacity=".24"/>
      <path d="M108 94 Q105 106 108 111 Q111 113 114 110 Q115 104 112 94" fill="${A_SKIN_D}" opacity=".55"/>
      <path d="M86 86 Q95 81 103 86" stroke="${A_HAIR_D}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M117 86 Q125 81 134 86" stroke="${A_HAIR_D}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="96" cy="97" rx="7.5" ry="5.4" fill="#FFFDF8"/>
      <ellipse cx="124" cy="97" rx="7.5" ry="5.4" fill="#FFFDF8"/>
      <g class="r-eye r-eye-l"><circle cx="97" cy="97.5" r="4.2" fill="${A_EYE}"/><circle cx="97" cy="97.5" r="2.1" fill="${INK}"/><circle class="r-shine" cx="98.4" cy="96" r="1.2" fill="#fff"/></g>
      <g class="r-eye r-eye-r"><circle cx="125" cy="97.5" r="4.2" fill="${A_EYE}"/><circle cx="125" cy="97.5" r="2.1" fill="${INK}"/><circle class="r-shine" cx="126.4" cy="96" r="1.2" fill="#fff"/></g>
      <path d="M89 94 Q96 90 103 94" stroke="${A_HAIR_D}" stroke-width="1.3" fill="none" opacity=".8"/>
      <path d="M117 94 Q124 90 131 94" stroke="${A_HAIR_D}" stroke-width="1.3" fill="none" opacity=".8"/>
      <!-- the hair over the brow, parted, and the gold fillet -->
      <path d="M76 100 Q80 62 110 58 Q140 62 144 100 Q138 80 122 74 Q112 72 110 76 Q108 72 98 74 Q82 80 76 100 Z" fill="${A_HAIR}"/>
      <path d="M84 86 Q94 68 110 64 Q126 68 136 86" stroke="${A_HAIR_L}" stroke-width="2.4" fill="none" opacity=".7"/>
      <path d="M110 60 L110 76" stroke="${A_HAIR_D}" stroke-width="1" opacity=".5"/>
      <path d="M80 84 Q110 62 140 84" stroke="${GOLD}" stroke-width="2.4" fill="none"/>
      <circle cx="110" cy="68" r="2.2" fill="${GOLD_D}"/>
      <!-- the strand on the viewer's right, over the knot -->
      <g class="r-hair r-hair-l">
        <path d="M140 98 Q150 122 146 150 Q140 152 136 146 Q140 122 136 102 Z" fill="${A_HAIR}" opacity=".95"/>
      </g>
    </g>
  </g>
</svg>`;
  const AURELIA_PIVOTS = { neck: [110, 152], feet: [110, 310], hairL: [80, 96], hairR: [142, 152], armL: [78, 160], armR: [146, 160], mouth: [110, 128] };

  const VISEME_MOUTH = {
    X: { rx: 8,   ry: 1.5, y: 0,   jaw: 0 },
    A: { rx: 9,   ry: 1,   y: 0,   jaw: 0 },
    B: { rx: 7.5, ry: 3,   y: 0.5, jaw: 0.6 },
    C: { rx: 8,   ry: 5.5, y: 1.2, jaw: 1.8 },
    D: { rx: 8.5, ry: 8,   y: 1.8, jaw: 3 },
    E: { rx: 6,   ry: 4.8, y: 1,   jaw: 1.2 },
    F: { rx: 4.4, ry: 4.2, y: 1,   jaw: 0.8 },
    G: { rx: 7.5, ry: 2.4, y: 0.5, jaw: 0.6 },
    H: { rx: 6.5, ry: 5,   y: 1,   jaw: 1.2 }
  };

  class Spring {
    constructor(v, stiff, damp) { this.v = v; this.rest = v; this.target = v; this.vel = 0; this.stiff = stiff; this.damp = damp; }
    to(t) { this.target = t; }
    kick(f) { this.vel += f; }
    home() { this.target = this.rest; }
    tick(dt) { const a = (this.target - this.v) * this.stiff - this.vel * this.damp; this.vel += a * dt; this.v += this.vel * dt; return this.v; }
  }
  const Ticker = {
    rigs: [], last: 0, running: false,
    add(r) { this.rigs.push(r); if (!this.running) this.start(); },
    remove(r) { this.rigs = this.rigs.filter(x => x !== r); },
    start() {
      this.running = true;
      const step = now => {
        const dt = Math.min((now - this.last) / 1000 || 0.016, 0.05);
        this.last = now;
        for (const r of this.rigs) if (!r.hidden) r.tick(dt, now / 1000);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  };

  class Figure {
    constructor(host, svg, pivots) {
      host.innerHTML = svg || MARCUS_SVG;
      this.el = host; this.svg = host.querySelector('svg');
      const q = s => this.svg.querySelector(s);
      this.p = { root: q('.r-root'), body: q('.r-body'), head: q('.r-head'), hairL: q('.r-hair-l'), hairR: q('.r-hair-r'),
        armL: q('.r-arm-l'), armR: q('.r-arm-r'), eyeL: q('.r-eye-l'), eyeR: q('.r-eye-r'),
        jaw: q('.r-jaw'), mouth: q('.r-mouth'), shape: q('.r-mouth-shape'), smile: q('.r-smile'), shadow: q('.r-shadow') };
      // pivots: neck, feet, the two cloak pieces (shoulder pins), the shoulders, the mouth
      this.pivot = pivots || { neck: [110, 152], feet: [110, 310], hairL: [80, 152], hairR: [146, 154], armL: [76, 160], armR: [148, 160], mouth: [110, 130] };
      this.s = {
        y: new Spring(0, 190, 15), rot: new Spring(0, 150, 13), sx: new Spring(1, 240, 17), sy: new Spring(1, 240, 17),
        head: new Spring(0, 170, 12), headY: new Spring(0, 200, 15),
        hairL: new Spring(0, 70, 6), hairR: new Spring(0, 60, 5.5),        // cloth: soft, underdamped, lags and overshoots
        armL: new Spring(0, 160, 13), armR: new Spring(0, 140, 12),
        lid: new Spring(1, 520, 26), eyeX: new Spring(0, 160, 16), eyeY: new Spring(0, 160, 16),
        mrx: new Spring(8, 300, 20), mry: new Spring(1.5, 300, 20), my: new Spring(0, 300, 20), jaw: new Spring(0, 260, 18),
        smile: new Spring(0, 120, 11)
      };
      this.smileUntil = 0;
      this.phase = Math.random() * 10; this.talkUntil = 0; this.nextBeat = 0;
      this.nextBlink = 1 + Math.random() * 3; this.blinkT = 0; this.doubleBlink = false;
      this.nextDart = 2 + Math.random() * 4; this.hidden = false; this.mood = null; this.moodUntil = 0;
      this.visemeAt = null;               // the app supplies () => 'A'..'X' from the audio clock
      Ticker.add(this);
    }
    tick(dt, now) {
      const S = this.s, P = this.p;
      this.phase += dt;
      const breath = Math.sin(this.phase * 0.95), sway = Math.sin(this.phase * 0.5 + 1.3);
      this.nextBlink -= dt;
      if (this.nextBlink <= 0 && this.blinkT <= 0) { this.blinkT = 0.16; this.doubleBlink = Math.random() < 0.2; this.nextBlink = 2.5 + Math.random() * 4.5; }
      if (this.blinkT > 0) {
        this.blinkT -= dt; S.lid.to(this.blinkT > 0.08 ? 0.06 : 1);
        if (this.blinkT <= 0 && this.doubleBlink) { this.blinkT = 0.16; this.doubleBlink = false; }
      } else S.lid.to(1);
      this.nextDart -= dt;
      if (this.nextDart <= 0) { S.eyeX.to((Math.random() - 0.5) * 3); S.eyeY.to((Math.random() - 0.5) * 2); this.nextDart = 1.6 + Math.random() * 3.5; }
      if (now < this.talkUntil) {
        S.smile.to(0);
        const v = (this.visemeAt && this.visemeAt()) || 'X';
        const m = VISEME_MOUTH[v] || VISEME_MOUTH.X;
        S.mrx.to(m.rx); S.mry.to(m.ry); S.my.to(m.y); S.jaw.to(m.jaw);
        if (now > this.nextBeat) {
          this.nextBeat = now + 0.8 + Math.random() * 1;
          // a measured speaker: the hand lifts a little, the head settles, no flapping
          if (!this.mood) { S.armR.to(-(14 + Math.random() * 22)); S.head.kick((Math.random() - 0.5) * 22); S.headY.kick(-5); }
          setTimeout(() => { if (!this.mood) S.armR.to(-8); }, 460);
        }
      } else {
        S.mrx.to(VISEME_MOUTH.X.rx); S.mry.to(VISEME_MOUTH.X.ry); S.my.to(0); S.jaw.to(0);
        if (now < this.smileUntil) { S.smile.to(1); if (this.blinkT <= 0) S.lid.to(.74); } else S.smile.to(0);
        if (!this.mood && this.nextBeat) { S.armR.home(); this.nextBeat = 0; }
      }
      if (this.mood && now > this.moodUntil) this._clearMood();
      const v = {}; for (const k in S) v[k] = S[k].tick(dt);
      // cloth swings, but it is pinned: never more than a few degrees either way
      v.hairL = Math.max(-11, Math.min(11, v.hairL)); v.hairR = Math.max(-13, Math.min(13, v.hairR));
      // the cloak follows the body and the head, late
      S.hairL.to(-v.head * 0.35 - v.rot * 0.6 - v.armL * 0.15); S.hairR.to(-v.head * 0.3 - v.rot * 0.7 + v.armR * 0.08);
      const t = (el, s) => { if (el) el.setAttribute('transform', s); };
      const [nx, ny] = this.pivot.neck, [fx, fy] = this.pivot.feet;
      t(P.root, `translate(0 ${(v.y + breath * 1.2).toFixed(2)}) rotate(${(v.rot + sway * 0.45).toFixed(2)} ${fx} ${fy})`);
      const sx = v.sx + breath * 0.004, sy = v.sy - breath * 0.003;
      t(P.body, `translate(${fx} ${fy}) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(${-fx} ${-fy})`);
      const headDrop = (1 - sy) * (fy - 152);
      t(P.head, `translate(0 ${(v.headY + headDrop + breath * 0.6).toFixed(2)}) rotate(${v.head.toFixed(2)} ${nx} ${ny})`);
      t(P.hairL, `rotate(${(v.hairL + sway * 0.9).toFixed(2)} ${this.pivot.hairL[0]} ${this.pivot.hairL[1]})`);
      t(P.hairR, `rotate(${(v.hairR + sway * 1.1).toFixed(2)} ${this.pivot.hairR[0]} ${this.pivot.hairR[1]})`);
      t(P.armL, `rotate(${(-v.armL).toFixed(2)} ${this.pivot.armL[0]} ${this.pivot.armL[1]})`);
      t(P.armR, `rotate(${v.armR.toFixed(2)} ${this.pivot.armR[0]} ${this.pivot.armR[1]})`);
      t(P.jaw, `translate(0 ${v.jaw.toFixed(2)})`);
      const [mx, my] = this.pivot.mouth;
      t(P.mouth, `translate(${mx} ${(my + v.my).toFixed(2)})`);
      if (P.shape) { const sm = Math.max(0, Math.min(1, v.smile)); P.shape.setAttribute('rx', Math.max(1, v.mrx).toFixed(2)); P.shape.setAttribute('ry', Math.max(0.6, v.mry * (1 - sm * .6)).toFixed(2)); P.shape.setAttribute('opacity', (1 - sm).toFixed(2)); if (P.smile) { P.smile.setAttribute('opacity', sm.toFixed(2)); P.smile.setAttribute('transform', `scale(${(0.8 + sm * .3).toFixed(3)})`); } }
      if (P.shadow) {
        const lift = Math.min(1, Math.abs(Math.min(0, v.y)) / 40);
        P.shadow.setAttribute('transform', `translate(${fx} ${fy + 4}) scale(${(1 - lift * 0.4).toFixed(3)}) translate(${-fx} ${-(fy + 4)})`);
        P.shadow.setAttribute('opacity', (1 - lift * 0.5).toFixed(3));
      }
      [P.eyeL, P.eyeR].forEach(e => {
        if (!e) return;
        const c = e.firstElementChild, cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy');
        const ex = v.eyeX, ey = v.eyeY, lid = Math.max(0.05, v.lid);
        if (e._wx !== undefined && Math.abs(ex - e._wx) < 0.12 && Math.abs(ey - e._wy) < 0.12 && Math.abs(lid - e._wl) < 0.03) return;
        e._wx = ex; e._wy = ey; e._wl = lid;
        const tr = `translate(${(Math.round(ex * 10) / 10).toFixed(1)} ${(Math.round(ey * 10) / 10).toFixed(1)}) translate(${cx} ${cy}) scale(1 ${(Math.round(lid * 50) / 50).toFixed(2)}) translate(${-cx} ${-cy})`;
        if (e._t !== tr) { e._t = tr; e.setAttribute('transform', tr); }
      });
    }
    _clearMood() { this.mood = null; ['rot', 'sx', 'sy', 'head', 'headY', 'armL', 'armR', 'y'].forEach(k => this.s[k].home()); }
    _mood(name, secs) { this.mood = name; this.moodUntil = performance.now() / 1000 + secs; }
    show(on = true) { this.hidden = !on; this.el.classList.toggle('is-hidden', !on); }
    talk(seconds) { this.talkUntil = performance.now() / 1000 + Math.min(Math.max(seconds || 1, 0.3), 20); }
    hush() { this.talkUntil = 0; }
    /* ---- poses: impulses, not animations ---- */
    nod() { this.s.headY.kick(-70); this.s.head.kick(40); }
    /* graceful, not cheesy: the mouth curves, the eyes soften, the head lifts a touch */
    smile(secs) { this.smileUntil = performance.now() / 1000 + (secs || 1.6); this.s.headY.kick(-30); this.s.head.kick((Math.random() - .5) * 16); }
    wave() {
      this._mood('wave', 1.5); const S = this.s; S.armR.to(-150); S.head.to(-6);
      let n = 0; const wag = () => { if (this.mood !== 'wave') return; S.armR.to(n % 2 ? -150 : -125); if (++n < 5) setTimeout(wag, 220); };
      setTimeout(wag, 220);
    }
    point() { this._mood('point', 1.6); this.s.armR.to(-82); this.s.head.to(6); this.s.eyeX.to(-3); }
    cheer() {
      this._mood('cheer', 1.7); const S = this.s;
      S.sy.to(0.93); S.sx.to(1.06);
      setTimeout(() => { S.sy.to(1.05); S.sx.to(0.96); S.y.kick(-280); S.armR.to(-165); S.armL.to(-150); S.head.to(-8); S.hairR.kick(-28); S.hairL.kick(18); }, 110);
      setTimeout(() => { S.sy.to(1); S.sx.to(1); }, 420);
    }
    salute() { this._mood('salute', 1.5); const S = this.s; S.armR.to(-120); S.head.to(-3); S.headY.kick(-20); setTimeout(() => { if (this.mood === 'salute') S.armR.to(-40); }, 700); }
    bow() { this._mood('bow', 1.4); const S = this.s; S.head.to(18); S.headY.to(8); S.rot.to(3); S.armR.to(-36); S.armL.to(-16); S.hairR.kick(14); }
    think() { this._mood('think', 2); this.s.armR.to(-118); this.s.head.to(-7); this.s.eyeY.to(-2); this.s.eyeX.to(2); }
    laugh() { this._mood('laugh', 1.2); const S = this.s; S.head.to(-10); S.headY.to(-4); let n = 0; const sh = () => { if (this.mood !== 'laugh') return; S.y.kick(-60); S.sy.kick(-0.5); if (++n < 4) setTimeout(sh, 160); }; sh(); }
    enter() {
      this.show(true);
      this.el.classList.remove('walk-in'); void this.el.offsetWidth; this.el.classList.add('walk-in');
      this.s.hairR.kick(-22);
      setTimeout(() => this.bow(), 950);
    }
    lookAt(clientX, clientY) {
      const r = this.el.getBoundingClientRect();
      const dx = (clientX - (r.left + r.width / 2)) / Math.max(r.width, 1), dy = (clientY - (r.top + r.height * 0.3)) / Math.max(r.height, 1);
      this.s.eyeX.to(Math.max(-3, Math.min(3, dx * 4))); this.s.eyeY.to(Math.max(-2, Math.min(2.4, dy * 3)));
      this.s.head.to(Math.max(-8, Math.min(8, dx * 8)));
      this.nextDart = 1.6 + Math.random() * 2;
      clearTimeout(this._lookT); this._lookT = setTimeout(() => { if (!this.mood) this.s.head.home(); }, 1500);
    }
  }
  window.MarcusRig = { Figure, MARCUS_SVG, AURELIA_SVG, AURELIA_PIVOTS, Spring, Ticker };
})();
