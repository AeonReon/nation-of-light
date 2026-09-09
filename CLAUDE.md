# Nation of Light (`APPS/nation-of-light`)

The character-led, scene-first version of Light School (full name: the Nation of Light School). Built 2026-09-07 as a
SEPARATE app from `APPS/school-of-light` (the catalogue app live at nolschool.com) so the new
delivery can be felt on its own before anything is merged. Same exercises, same mentor rule,
a different front: one drawn scene, a living mentor, one tablet at a time.

## What is here (v1)

- `scene.js` — the portico at dawn, all SVG, parametric sky (`setPhase(0..1)`: dawn → morning →
  golden evening), parallax on pointer/tilt, the brazier flame (days shown up), wreaths on the
  frieze (tiers finished).
- `rig.js` — Marcus Aurelius, a spring rig on the Mo & Pip / Franklin engine: breathes, blinks,
  looks at what you touch, cloak follows through, mouth driven by baked Rhubarb visemes off the
  audio clock. Poses are impulses (`nod wave point cheer salute bow think laugh`).
- `app.js` — the day: choose 30/90 → Marcus enters and greets → tablets (25 moves in 5 tiers from
  the school's Momentum deck) → Done fills a leaf, raises the sun, Marcus reacts → 5 done hangs a
  wreath and opens a scroll (a true piece of his life) → "That is today" with his evening line.
- `content.json` — built from `school-of-light/tracks.json` (moves) + `mentors.json` (lines).
  Regenerate by hand if the source changes; keep the sources on every line.
- `audio/marcus/` — his 10 Chatterbox clips + `visemes.json`, COPIED from school-of-light.
  Never generate his voice here; new lines are made there (`gen_mentors.py`) and copied over.
- `audio/voice/` — Aurelia the narrator (Kokoro `af_heart` (his choice over bf_emma: "much more pleasant"), local :8765). `python3 gen_voice.py`.

## Rules carried over, not negotiable

- Two kinds of Marcus line, never mixed in one bubble (his call, 2026-09-07 evening): a QUOTE is
  his own recorded words and always shows its source (serif bubble); a COMPANION line is the
  school's words in his character (congratulations, tips, the word about skipping) and shows no
  source (sans bubble). Quotes come from school-of-light; companion lines are `marcus.spoken` in
  content.json, voiced here by `gen_marcus.py` with the same pinned reference voice.
- The flame dims, it never resets, it never scolds. No leagues, no hearts, no guilt copy.
- One thing done really well before the next twist. Next waves, in order: a second scene
  (evening / the study), sealed letters at milestones, the other four mentors, conversation.

## Run / test

Preview: workspace `.claude/launch.json` → `nation-of-light` (python http.server :3149).
Reset state in the console: `NOL.reset()`. State key `nol.v1` in localStorage.

## Navigation and captions (v20, 2026-09-08)

- **Back is one button, top left, everywhere.** `backBtn(veil, fn)` puts it on any card and makes
  tap-outside do the same thing; `stageBack(fn)` shows `#stageback` over the scene (portico room,
  category room). Never add a "Back to the portico" text button; the finish states of the door and
  code forms are the only forward-looking exceptions.
- **Home** = the arrival (`goHome()` → `arrival(first, again, quiet)`), from the header pill. The
  fire icon is the portico room (`roomView`, remembers `ROOM_FROM` so Back returns to the same tab/room).
- **Captions** route through `cap()`: `#capband` (in flow under the scene) when `inScene()`, the
  trophy show's own `#showcap` when one is open, otherwise `#popcap`. Both cards swipe or tap away.
- **Trophies** = `awards()` (ranks as flames, the 25 as a wreath, a medal per room), drawn in
  `trophySVG`, shelved by `shelfCard(compact)`, shown by `trophyShow(a)`; `NOL.show('rank.spark')` to test.
- **Wording rule (his, important):** "most people" lines are about the people out there who never
  take action, never a hint that people come here and leave. Keep it exciting: a special group.
- **Ranks (v21):** twelve, on points = school steps + the twenty-five (877 is everything): Spark 1 ·
  Ember 25 · Flame 60 · Torch 100 · Lantern 150 · Hearth 220 · Beacon 300 · Bonfire 400 ·
  Lighthouse 520 · Blaze 650 · Sun 780 · Radiant 877. Names + a line each in `school.ranks` /
  `school.rankLines`; the flame trophy grows and glows by level; a rank's show carries the ladder.
- **Banned phrasing (his, 2026-09-08):** never "wide first, then deep", "go wide then deep", "taste
  wide", "width"/"go deep" as the method line. It invites jokes and this is also for children. Say
  it plainly: try many things, then give real time to the ones that light you up.
- **Entry word (v22):** going Into the school, one of them pops up with one line from `school.entry`
  (24: 14 hers `ui-en*`, 10 his `c-en*`, loosely in turn), chosen by day + visit, never repeated in
  a sitting (`entryWord`). His brief: not "welcome back" again; encouragement, "let us do something
  good today", or a reason why (poetic language brings magic, buildings bring beauty). Add lines
  here first when the pool needs to grow; keep them under fifteen words.
- **Long skills (v23):** a practice log per project (`S.school.practice[trackId].days`, one per
  day; `taken[trackId]` = the day it was taken on). "Practised today" on every project row (long
  tab) and in the portico's "Your long skills" card; milestones 5/10/20/30 days get their own
  Aurelia line, otherwise the two of them alternate. `checkIn(tr)` = How is it going? (well /
  struggling / too hard / put it down) → lines in `school.long.check.lines` (struggling and too
  hard get his real quotes m-d2 and m-x4). Going in after a skill has had `quiet` (3) days with
  nothing logged, Aurelia asks and the card opens, once a day. His brief: flip the reinforcement
  tools to the good, then wean people off needing them; three short + three long is the adult rhythm.
- The header: Home pill = sunrise icon, the portico room = the columns icon (he could not read a
  flame), and it glows for six pulses on the first few visits until the room has been opened twice.
- `speakSchool` chains carry a generation token; `hush()` kills a running chain (they used to
  keep going into the next screen).
- **One room (v24).** The portico room and the arrival were the same idea twice, so the room is
  gone: HOME is the arrival, and the sit-a-while parts (a reading, the library, rooms climbed,
  earlier news) are `<details class="fold">` drop-downs beneath the day. Music plays at home and
  fades on going in; the two of them speak unprompted at home (`idleRoom` now checks `arrive`).
  A Today row of ticks (one quick thing / a long skill practised) and a "Next:" line say what a
  finished day looks like; "How this works" is open for the first three visits.
- **The feed** (`feed.json`, newest first) is kept in `S.feed.posts` so it shows offline; fetched
  fresh on every open when online; a post not yet seen carries a New dot. To post: add to
  feed.json and push (auto-deploys). No community needed for the app to make sense.
- **Things to touch (v25):** `PORTICO.onTap(name, fn)` over `props` {brazier, olive, lyre}. Brazier
  = flare + sparks (lights for 9 s if out). Olive = rustle, a chirp, and Aurelia reads one sourced
  line from library.json quotes (52, all voiced `ui-q-*`, never twice in a sitting). Lyre (drawn on
  the right column) = a strum, then ~78 s of Karplus-Strong plucks over a D pentatonic made in
  code, ducked under voices, stopped by a second tap or by leaving home; it hints (wobbles) on the
  first visits. Keep it to these three; his rule is a little interaction, not a toy box.
- Quotes read by Aurelia always show the source in the caption (`cap(who, text, src)`). New quotes
  go in library.json (kind quote, plain modern English) and content.json voice `q-<id>`.
- **v26:** taps land only on what is painted (`.afig,.mfig{pointer-events:none}` + `svg *
  {visiblePainted}`), so the olive behind Aurelia can be tapped; hollow props need an invisible
  painted rect as a hit area (the lyre has one). Aurelia's tap rotates through her four own lines
  then all 52 quotes with the source in the caption. The lyre plays REAL music: four ~70 s Chopin
  excerpts in `audio/music/` (Musopen CC0, see CREDIT.txt; `music.pieces` in content.json), one
  per tap in turn, a toast names the piece; the nocturne at home ducks under it. Add pieces by
  trimming with ffmpeg (`-nostdin` inside loops) and appending to CREDIT.txt.
- **Creating order (v27):** a ROOM (`order`, family "Everyday life"), not one long ladder: eight
  ladders of 6–7 steps (bedroom, desk, wardrobe, broken things, giving away, the phone and the
  inbox, the forgotten places, keeping it), 50 steps. His brief: orderliness is central to the
  classical world view; clear, mend, give away, digital too, the forgotten places, then keep it.
  Long ladders stay 6–8 rungs because the long game draws a ladder as start / here / end and a
  medal comes at 5, 15 and all; a big undertaking is a room of ladders. Tiles drawn with Draw
  Things via `tools/order-draw.mjs` (same recipe as school-of-light/tools/track-draw.mjs).
  Data files are fetched with `cache: 'no-cache'` so an edited school.json shows on next open.
- **Share from the cover or the door** must pass the way back (`sharePanel(cover)`); a veil
  replaces the overlay, so anything opened from another veil needs its way home or the screen
  is left empty and looks frozen.
