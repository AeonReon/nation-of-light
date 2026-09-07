# Nation of Light (`APPS/nation-of-light`)

The character-led, scene-first version of the Nation of Light School. Built 2026-09-07 as a
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

- Marcus's voice only ever says his own recorded words, each with its source shown. The stories
  about him are the school's words and are labelled so in the app.
- The flame dims, it never resets, it never scolds. No leagues, no hearts, no guilt copy.
- One thing done really well before the next twist. Next waves, in order: a second scene
  (evening / the study), sealed letters at milestones, the other four mentors, conversation.

## Run / test

Preview: workspace `.claude/launch.json` → `nation-of-light` (python http.server :3149).
Reset state in the console: `NOL.reset()`. State key `nol.v1` in localStorage.
