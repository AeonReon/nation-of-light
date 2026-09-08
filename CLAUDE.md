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
