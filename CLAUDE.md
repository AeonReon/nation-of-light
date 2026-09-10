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
- **Who you become (v28):** the vision, sold in three doses: a fold at home (`C.vision`: four
  paragraphs Aurelia reads, `ui-vision`, ~84 s; then "They did many things", seven real polymaths
  with verifiable lines), open on the first two visits; and nine short vision lines woven into
  the entry pool every third slot (ui-env*, c-env*). The twenty-five's ending was left as he
  approved it. Claims stay checkable: no "30 seconds less smart", no digs at schools by name.
- **v29:** the vision is read in TURN (`vision.read`: Aurelia 1 and 3, Marcus 2 and 4 as
  companion lines c-vis2/c-vis4), the paragraph being read lit on the page, the caption carrying
  only the title (`CAPLITE`); at home the nocturne ducks to .26 not .14 so the music stays in
  the room under the voices. Named "Who you can become". Polymath list = only names he knows
  and has checked (Leonardo, Franklin, Jefferson, Michelangelo, Marcus); add others only after
  he has vetted them.
- **v30:** a phone held sideways turns the stage back upright (`html[data-rot]`, the Mo & Pip
  lock: coarse pointer + landscape → rotate the stage about its top-left; `vh` heights get `vw`
  twins under `[data-rot]`); `-webkit-text-size-adjust:100%` stops text growing after a turn.
  Six quick things a day (three shown, three in a "Three more" fold). A long skill at home is
  anything taken on OR started (a step done), so it shows from the first step; "put it down"
  adds to `S.school.dropped`; the carry-on card left home (still in the long tab).
- **v31 (open loops):** a long skill is ONLY what was chosen (`S.school.projects`, max 3; v30's
  "started = long skill" was wrong and felt like eight open loops). The choosing moment is
  `offerLong(tr)`: after a step on a ladder not yet taken on, one small card, once per ladder
  (`S.school.noAsk`), only while there is room. Quick things are play and never shown as
  unfinished; the carry-on card is gone from the long tab too. His psychology rule: very few
  open loops, chosen on purpose, visible daily; everything else is a menu, not a debt.
- **v32 traps:** never reuse a layout class name as a state class. `.pop` (the pop layer) vs a
  leaf's `pop` animation state → a screen-wide green X; `.school` (the container, a flex column)
  vs the bubble's `school` kind → words stacked one per line. State classes are now `popping`
  and `companion`. When a screenshot shows something huge and green, suspect a class collision.
- **v33 commitment:** taking a long skill on is a scene (`commitCard(tr, from)`): the ladder in
  front of you, Aurelia asks out loud (`lg-ask`), "I am taking this on" / "Not yet"; yes seals
  the card (gold seal), gold and laurel fall, Marcus (`c-lg-take`) then Aurelia (`lg-took`),
  then it closes and the skill wears a gold frame + "Taken on" seal on the long page and at
  home. Reached from: after a step on an untaken ladder (once, `noAsk`), the long page's Take
  it on, or a ladder sheet. The long page = intro line, "Taken on · n of 3" (sealed cards),
  then "Choose a long skill": ladders you have tried, then good ones to start with, Look / Take
  it on, and "Every room in the school". No accidental commitments, and no list of open loops.
- **v34:** quick things are split by `ctx` in school.json: `room`/`home` = doable now with
  nothing but you (the picks, 6 a day, room first); `kit`/`with`/`out` = need a thing, somebody
  or a place, offered in a separate fold with a label, never as the headline; `long` never as a
  quick thing. His reason: one "I can't do that right now" is enough to end a journey. Next
  thing = one clear card + "Three more easy ones" fold + the needs fold. Long-page section
  headings are 19px display with a gold rule. Characters: swipe down on a popped-up figure
  sends both off; `S.popins=false` (help panel toggle) stops pop-ins in the tabs; home is
  always the full scene. Parked, an architecture call: longer ladders (more, smaller rungs)
  per track by learning method, starting with the most-tried skills.
- **v37 (another session shipped v35–v36 in this tree meanwhile: the ladder page `.tk`, twenty-
  step ladders; check `git log` before editing app.js).** The ask is timed to interest:
  nothing after one step; after the second step of an untaken ladder a SOFT card (one tap out,
  `S.school.soft`); after the third, the ceremony once (`afterStep`). Quick things are `room`
  only; `home` joined the needs fold. "Level two" fold in Next thing = ladders with one step
  done whose next step needs nothing. **The day**: goal 3 (quick steps + practices today), a gold
  bar in the school header and at home (`dayBar/paintDay/checkDay`); reaching 3 once a day =
  gold falling, wreath sound, one of them (`ui-day` / `c-day`); 7 = "Blazing". The points pill
  left the header; the face button (Marcus) toggles pop-ins with a line through it.
- **v43 (2026-09-10, the little ones — content only):** the under-sevens are NOT a separate app
  and never a hand-over app (that contradicts one-journey; Mo & Pip is the hand-over kind). His
  decision after the Scouts/Guides evidence (Squirrels 4–6, Rainbows 4–7, Brownies from 7): same
  grammar, smaller rungs, the parent as the interface. Eight ladders in existing rooms, six rungs
  each, `strand: "little"`, `from: 4`, every step `ctx: "with"` so they never surface as an adult's
  quick thing: make.scissors, make.crayons, body.hopping, music.song, order.ownthings,
  speak.sayit, food.kitchen, care.helping. Line on each: "From four, beside you." He reads the
  rungs first; if the words hold, next is a second small profile (the child's own leaf and flame
  on the parent's phone) and a `from` chip on the row and page. No track tiles drawn yet
  (category image fallback).
- **v45 (2026-09-10, the other-hand twist):** his idea on reading the little ladders: the same rung
  serves a child and a grown-up, and a grown-up who finds it easy does it with the hand or foot
  they would never choose, so they feel what the child is feeling (and most adults cannot cut
  along a line either). `twist` on a step in school.json (25 so far, on the little ladders: hand
  for scissors/crayons/kitchen, foot/eyes/backwards for hopping, a new song, a stranger, no ums);
  label `school.track.twist` ("Already easy?"); drawn as `.twist` under the note on the ladder
  page's next-step card and in the step sheet. Adults keep seeing the little ladders in the rooms
  on purpose (everybody starts at one); the twist is what keeps them honest. Still parked: the
  child profile (a door at home that gathers the from-four ladders, own leaf and flame), and
  the other direction, adult rungs a child cannot do yet (a phone call at ~six), which the
  profile would hide by `from`.
- **v47 (2026-09-10, the little one's page):** a child SHARES the parent's phone and account
  (his call: never a hand-over app). `S.kid = {name, made, school}` and `S.who`; `switchTo(who)`
  SWAPS `S.kid.school` into `S.school`, so every tick, rank, project, practice log and today's
  picks below read the active page with no idea who holds the phone. `S.days` (the flame) is
  shared on purpose: the family's flame. The twenty-five do not count on the child's page
  (`points()`). Home: a who strip (You / name, or "+ With a little one" → `kidPanel`, name
  optional), "{name}'s day" on the stand card, a "For {name}, from four" card of the little
  ladders as `.crow` rows. School: the home button carries the child's name in gold
  (`paintWho`, no room for another pill), Everything tab lists the little ladders first
  (`littleTracks()`), and quick picks put little ladders first whatever their ctx (`fits()`,
  the parent is there by definition) with no "with somebody" label. Aurelia: `ui-kid-made`,
  `ui-kid-back` (Kokoro, no visemes). A new child's school starts `toured/howSeen/visionSeen`
  true. One child for now; more is a `S.kids` array later if asked.
