# Nation of Light (`APPS/nation-of-light`)

**THIS IS THE LIVE APP AT nolschool.com** (moved here 2026-09-15; it had been pointing at the old
`school-of-light-app` Vercel project by mistake). It is also on `nation-of-light.vercel.app`.
`APPS/school-of-light` is the OLD catalogue app — still reachable at `school-of-light-app.vercel.app`,
no longer on any custom domain.

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
- **Twist pass (2026-09-10, after v47):** the other-hand twist went onto the adult ladders
  where a hand or foot is the skill: Throwing, Drawing, Balance, Cloth and thread, Knots
  (eyes shut / behind your back), Mending, Tools (never the saw), Shapes, the one-leg squats,
  and Hopping restored after the other session's twenty-step rewrite dropped them. Not on knives.
  ~60 twists in all. Add more by hand, never by regex: a twist has to be safe and real.
- **v48 (2026-09-10, one journey, one tap):** on the child's page the step sheet carries a
  second button, "Done, me too" ("Me too, with the twist" when the rung has one): it stamps
  the rung on the PARENT's page as well (`S.kid.school` holds the parent's page while the
  child's is active) and then runs the normal Done. Copy `school.track.both/bothTwist`.
  Parked ideas, in order: a "beside them" credit on the parent's own day bar for a session
  done on the child's page; an optional age in `kidPanel` so `from` can hide the adult-only
  rungs (the phone call at about six) on the child's Everything tab; a second child (`S.kids`).
- **Who you are becoming (v51–v52, Fable session):** step `kind` (skill = Craft, attention,
  courage, kindness) counted by `traitCounts()`; four meters at home (`traitsCard`), shield
  trophies per trait in `awards()` (bronze 10 / silver 30 / gold 75, `trophySVG` kind 'trait'),
  and the page behind it (`becomingRoom`, `ROOMV = 'becoming'`, opened by `[data-becoming]`):
  headline count, the four kinds with shields, then "Things you can do now" = highest rung
  reached on every ladder touched, newest first. He called this the missing piece. The pattern
  he wants everywhere: a few at home, tap for the whole page.
- **Agreed second-half roadmap:** traits (done) → a Daily routine unlocked at Flame (repeatable
  practices per strand, with levels; needs new content) → measurable body ladders already
  exist (fit.stretch, 20 rungs). Two sessions share this tree: read `git log` before editing app.js.
- **v55 (2026-09-11, Fable session): the three thin moments, and More from us.** The other
  session's end-notes named three moments with nothing written for them; each now has its own
  slot in `school.says` (same picker, same weighting, every line voiced, Marcus's as companion
  lines): **`rusty`** (a faded step earned again; `saySlot` picks it over `done` when `rusty`),
  **`again`** (a fresh step done once more: a line now, the toast only if none), **`checkin`**
  (conditioned on `when.mood` = well / struggle / hard / down; the pool speaks FIRST and his
  real quotes m-d2 / m-x4 still follow for struggling and too hard — `CONDS.mood`, `sayState`
  carries `mood` and `days`), and **`run`** (a days-in-a-row stone earned: `trophyShow` uses
  `pickSay('run', {run: a.n})` instead of the generic trophy lines; `sayState.run` now honours
  `ctx.run`, so `{run}` and `runMin` read the trophy's count, not today's). 54 lines, 8 of them
  exchanges. Test any slot in the console: `NOL.say('checkin', {mood:'hard', days:3})`.
  **More from us** (`C.apps`): a card at home (five icons, one line, "More from us ›") and a
  room (`ROOMV = 'apps'`, `appsRoom`) with the five apps as cards that open in a new tab and
  "Talk to us" at the foot. The address is built from character codes on tap (hello@ on the
  aeonreon catch-all), never a literal in the repo — same rule as ni-apps. Icons in
  `images/apps/` (256px, copied from ni-apps and Mo & Pip). Add an app = one entry in
  `C.apps.list` + an icon. For the testers' packs.
- **v56 (2026-09-12): three corrections from his first morning with v55.** (1) More from us is
  the LAST thing at home, inside a drop-down (`appsFold`, `foldCard('apps')`), never a card in
  the flow — a card there read as promotion. (2) **No aeonreon.com address is ever public**:
  that domain is his sign-up catch-all. The contact address is `apps.contact.codes` (char codes)
  in content.json, currently hi@daysoutni.com, which is verified to deliver (Days Out catch-all →
  daysout-mailbox + the Days Out Gmail). nolschool.com has Cloudflare MX but no token here can
  read its routing rules, so it is unverified — switch the codes only after one test email lands.
  (3) **The day's picks must be different KINDS of thing** (`todayPicks`: a family not yet on
  the list, then a room not yet on it, then anything), so one of the three catches whatever
  mood you are in. Six vague first rungs rewritten to be concrete (money.run, deal.terms,
  words.sign, home.firstaid, deal.walkaway, classic.roots): a step must say exactly what to do
  right now, with a real example, never a hypothetical the reader has to invent.
- **Framing rule (his, 2026-09-12):** never "a small family of apps", "a small independent
  project", "not a big company", "labour of love" or anything that reads as a bedroom project;
  it diminishes work he considers competitive with anything out there. Never corporate either.
  The line is: part of a growing network of free apps built for families in Northern Ireland,
  to get out more, live well, and find each other. Same fix applied to daysoutni's about,
  contact, terms and privacy pages the same day.
- **v57 (2026-09-12): a number is its own count against a round target.** He made a coin
  vanish, got a Craft bronze, and the card showed "23 done" (the whole school) — so it read as
  the wrong award, and the shelf's "8 more steps" changed with every tick and looked random.
  Now: the trophy card shows ITS count against ITS target (`awardProgress`: "5 of 10 Craft
  steps", "25 of 25 done", "3 of 7 days in a row") with its own bar; the shelf says "6 of 10";
  the four meters say "30 for silver"; the stand card says "Flame at 50". Never "n more" and
  never the overall points on another award's card. Units in `awards.show.units`. Craft =
  step kind `skill` = "things your hands and body can now do", so a coin vanish IS Craft; the
  card's definition line is what tells the reader that. The event rung (money.run 1) rewritten
  a second time with the hypothetical named and the note listing what "a thing" can be: a step
  with a hypothetical must name it and give examples, or it reads as a riddle.
- **v62 (2026-09-15, Fable session): the three torches, and the day-done celebration.** His:
  the three flames were "floating" (they were an HTML overlay at 64% up the band with nothing
  under them) and finishing the three "felt very underwhelming, I would have liked more praise".
  Now: three bronze torchères stand ON the parapet in the scene SVG (`torch()` in scene.js,
  `TORCH_X = [150,195,240]`, cups at y 232 so the flames sit between and just above the two
  heads at home; `.torch{display:none}` except `.stage.school.arrive`); `PORTICO.setLamps(n,
  anim)` lights n of them, `paintFlames()` is called at the top of `checkDay()` so a practice
  lights one too (it used to light only on a step Done). The third light runs `dayCelebrate
  (after)`: `sfx('fanfare')` + `shower()`, the sky glides to golden and STAYS golden for the
  rest of the day (`skyFor()` returns 1 when `S.school.celebrated === today()`), both of them
  `cheer()`, `fireworks(host, ms)` (a canvas of rockets and gold/white/laurel bursts, made in
  code, `sfx('burst')` per burst, skipped under reduced-motion), then a `.dayhail` over the sky
  above the torches (eyebrow `goal.hail` + the run `goal.hailRun`/`goal.hailFirst`, big
  `goal.hailBig`), and only THEN the spoken dayDone line and the tomorrow ask. Away from the
  scene (the tabs) the same runs over the page with the hail on a dark plate (`.plate`).
  Test from the console: `NOL.fw()` (fireworks only), `NOL.day(()=>0)` (the whole moment).
- **v63 (2026-09-15, Fable session): Everything, two ways — LIFE AREAS.** His: the rooms are
  good but "not nicely organised for my brain" (boats next to lighting a fire next to money);
  he wants a drop-down/switch between life areas and everything, a plain orderly list of bars
  with a picture on the left like Classical Mind, and an organised pathway inside each. Built as
  a TEST to feel: `school.json.areas` = ten areas (people, work, health, courage, calm, home,
  outdoors, learning, making, play), every one of the 161 ladders in EXACTLY one area (the
  patch asserts it), `tracks` in order easiest-first. A `.seg` switch at the top of the
  Everything tab (`C.school.allViews`, remembered in `S.school.allView`, life areas default),
  `renderAreas` (bars = `.srow.pic.area`, 84x62 picture) / `renderRooms` (the old tiles), and
  an area page (`AREA`, same shape as a room page: roomhead + `C.school.areaOrder` line +
  trackRows; Back clears `AREA`). Pictures reuse the room tiles for now (`image` per area);
  "Friends and family" uses care.jpg (hands + seedling) and needs a real one generated. The
  rooms are untouched: same ladders, a different view. Not done: per-area pathway stages, an
  area's own voice line, the destination line per ladder.
- **v64 (2026-09-15, Fable session): the seven-day gate, pop-ups off for real, the band positions.**
  (1) **The gate.** His: people should stay on the home page until they have done about seven
  days consistently, then the next section opens, the way the twenty-five got people into the
  first room. `C.school.gate` (`days: 7`, copy); `schoolOpen()` = `S.school.opened` or a best
  run ≥ 7 or ≥ 10 steps already done inside (grandfathers testers and him); once true it is
  saved and never re-locks. `renderSchool` shows `gateCard` instead of the tabs while shut
  (search cleared too); a ladder, room or area page opened from home still works. The home
  door reads "The school opens at seven days · n of 7" as a ghost button. Test: `NOL.open()`,
  or `NOL.S.school.opened = false; NOL.save()` to feel it. (2) **Pop-ups off leaked.** With
  the face button off, some paths still stood the figures up in the tabs (a rig pose calls
  show(true)). Now `dock()` and the toggle stamp `.quiet` on the stage and
  `.stage.popmode.quiet .mfig/.afig/.bubble/.abubble{display:none!important}`: in the tabs
  nothing can show them; in the scene band (home, room, area, ladder page) they stay. Also
  `checkDay` no longer speaks the fallback line after `saySlot` already returned quiet.
  (3) **Room band positions** now share home's centres: Aurelia left 12% (was 5%), Marcus
  left 47% (was 50%), widths unchanged because the band is shorter.
- **His direction for the next wave (2026-09-15, not built):** the entry level stays wide (three
  things a day from every part of life at home); after the gate, TWO main pathways open first
  (meet new people / build a network, and get your health in order), each thought through as
  a real programme with rungs that explain themselves, the other areas opening stage by stage;
  and the Becoming chart should point people at the side they are weak on with one or two easy
  strong tracks for it. Many current rungs "look dumped, not perfectly thought through".
- **v65 (2026-09-16, Fable session): they stay in their room; two programmes; one or two open per area.**
  (1) **The pop-up button was hiding them at home.** His rule, now: the button ONLY stops pop-ups
  in the tabs; at home and in the scene band they always stand there. `arrival()` always
  enters them; the toggle only pops them out when `!inScene()`. (2) **Two programmes written
  as real courses**, twenty rungs each with a `note` on every rung (the how, an example, and
  the alternative): `speak.people1` "Meeting people, part one" (smile → hello → a name → the
  time → directions → a shop question without buying → a compliment → one minute → a
  recommendation → two phone calls, small then bigger → two messages to people whose work
  you enjoy, then local → a neighbour → two minutes of listening → a cheerful odd question →
  one useful thing → a contact with a reason → send what you promised → a second
  conversation) and `food.real1` "Real food, part one" (`from: 16`; labels → drinks → slow
  meal → one swap → 3h after waking → 3h before bed → no snacks → no sugar → five
  ingredients → cook real → both edges → 12h window → carbs = vegetables → skip a meal →
  two meals → real-food shop → three days no snacks → 10h → 16h once → 8h window, with a
  doctor line at the end). His rules baked in: where money or eating is involved the note
  gives a no-spend alternative; "if this is already how you live, do it on purpose and count
  it" so nobody gets stuck on a rung they already do. `speak.strangers` rung 1 now says
  "somebody", not "a child". (3) **Stage by stage.** `areas[].open` = one or two ladders per
  area (people: people1; health: real1 + stretch; others a placeholder pair);
  `everythingOpen()` = `S.school.everything` true/false wins, else ten steps done inside
  keeps the whole school; `isOpen(tr)` also keeps anything started, taken on, or little for a
  child. While closed: no Life areas / Every room switch (areas only), area page = "Open now"
  + "{n} more open later, with a facilitator", long game suggests the open ones, search
  skips held-back ladders and rooms. Feel it: `NOL.S.school.everything=false; NOL.save()`;
  `NOL.all()` reports. No track tiles drawn yet for the two new ladders (room image
  fallback).
- **v66 (2026-09-16, Fable session): the builder's view, the place tag, everything at a month.**
  (1) **See it as they will** (`C.help.builder`, in the ? panel): four stage buttons (Day one /
  The first week / After seven days / Everything open) and "Play the day-done celebration".
  `previewStage(id)` puts the real account aside at `KEY + '.mine'`, writes a `freshState()` at
  that stage (`S.preview = id`; member for all but day one; seven lit days + `opened` for seven
  and all; `everything` true only for all) and reloads; `paintPreview()` in boot pins a
  `.previewbar` at the top ("Seeing it as: … · Back to my own account") which restores and
  removes `.mine`. `freshState` is a hoisted function because `load()` runs before the consts.
  Shown to everyone for now (not public yet); hide behind `S.member` or a code before launch.
  (2) **`place`** on a ladder or a rung (school.json: water.pools/fish/row/sail/cold, wild.camp/
  shelter/fire/forage/tracks, food.firecook, care.animals; rungs body.strength#14, body.run#14,
  body.ride#8, fit.sprint#6, wild.weather#6-8): `placeOf(tr, st)`; `quickCandidates` skips them
  so the home picks never hand out a rock pool or a tent. His rule: in the first period pick only
  what pretty much everyone can do. Later: a place profile that lets the right ones back in.
  (3) **Everything opens** at 30 days lit or 100 points (`gate.all`), the `S.school.everything`
  flag still wins either way; accounts from before v66 with ten steps done get the flag set once
  in `load()` so nobody who is already inside loses the school. The help panel's own pop-up
  toggle got the same no-hiding-at-home rule as the face button.
- **v67 (2026-09-16, Fable session): Next thing gone, Home is a tab, the long game from day one, the Everything drop-down, clean life areas.**
  His: the Next thing tab was a weaker copy of home. `renderNext` deleted; `school.tabs` = Home /
  The long game / Everything (`TAB` defaults to `long`); the Home tab calls `goHome()` and carries
  the child's name in gold (`paintWho`), and `#homebtn` in the header is hidden (`enterSchool`),
  which frees the top. The long game is reachable through the gate (`TAB !== 'long'` in the guard):
  while everything is shut it suggests `C.school.long.first` (twelve inspiring at-home skills: the
  cube, juggling, card and coin tricks, drawing, an instrument, calligraphy, skipping, singing,
  chess, memory, clay), all counted open by `isOpen`; the "Every room in the school" button is
  gone (it duplicated the tab). At home with nothing taken on, `homeOne()` shows ONE of those by
  day (`candRow`: Look / Take it on) plus "A different one" → the long tab; Look opens the ladder
  with `{ home: true }` so Back returns home (`closeTrack`). Everything (only when everything is
  open) has a `<select>` (`.viewsel`): By life area / By topic (rooms) / By kind (`renderKinds`,
  each ladder under the kind most of its rungs are). The ten areas were rebuilt as CLEAN life
  areas (his: courage is a skill, not a life area): health, family, network, prosperity, mind,
  home, making, play, adventure, spirit; every ladder in exactly one (asserted). The tour lost
  its Next-thing step and `ui-t-1` was re-voiced (Kokoro, gen_voice.py; step 5 points at the
  Home tab). music.instrument already IS the "one recognisable tune, then a song for people"
  ladder he asked about, so no new piano ladder.
- **v68 (2026-09-16, Fable session): a beginner programme in every life area.** Eight more
  twenty-rung "part one" ladders, each with a `note` per rung (the how, an example, the
  no-spend alternative, and "already doing it counts" where it applies), none of them
  place-bound: `belong.town1` Your town (network), `money.value1` Money and value
  (prosperity), `mind.learn1` Learning to learn, `home.works1` A home that works,
  `make.something1` Make something, `music.play1` Play, `wild.door1` Out the door
  (adventure, all doable from a town street), `calm.still1` Stillness (spirit). With
  `speak.people1` and `food.real1` that is ten. Each sits first in its area's `open` pair
  (the second is an existing ladder). 171 ladders. No track tiles drawn for the ten
  programmes yet (room image fallback): draw them with tools/order-draw.mjs when he has
  read the rungs. Part two of each is the next content wave.
- **v69 (2026-09-16, Fable session): ONE band, the tabs under it, nothing pops up; big long-game cards.**
  His call, on my recommendation: the room and the two of them stay at the top of every school
  page in one fixed position (34dvh), the three tabs sit right under and never move, the pop-ins
  are gone. `dock()` forces 'scene' in the school and shows both rigs; `popIn/popOut` are no-ops
  in the school; `inScene()` is true whenever the stage is `.school`; the caption band is moved
  UNDER the tabs (`enterSchool`) so a spoken line never shifts the buttons. The header lives in
  the scene's `.hud` over the sky (rank pill left; search, face, sound, help right); `.shead` is
  hidden. `paintTabs(active)` renders the tabs at home (Home lit) and in the school; tabs stay on
  room, area, ladder and search pages (Back on the band). Home lost its "Into the school"
  button. Torches show on every school page. `.stage.school.arrive/.room` overrides for scene,
  figures and hud were removed; sizes are `.stage.school .mfig{38%/47%} .afig{35%/12%}`.
  The long-game candidate card (`candRow`) is now a 104x78 picture, the name and line, a meta
  line, and a `<details class="more">` "More about this" (`tr.about`, written for the twelve
  `long.first` and the ten programmes; 22 in school.json) with the from/to line inside; when a
  ladder has no `about` the from/to shows plain. `nerve.asking` tile redrawn: a person from
  behind with a brass megaphone in a town square (Draw Things, seed 11, recipe as
  tools/order-draw.mjs but with people allowed). **Session rule:** close the preview TAB
  (tabs_close), not just the server; the app's ambience keeps playing in an open tab.
- **v70 (2026-09-16, Fable session): part two of People and Real food; the tidy-up pass.**
  `speak.people2` "Meeting people, part two" (reconnect, invite, host a pot of tea, organise,
  run a small regular thing three times, an event of six or more, count the people you could
  call on a bad day) and `food.real2` "Real food, part two" (`from: 16`; weeks not days: real
  breakfasts, five days no snacks, a sugar-free week then month, 12h → 10h → 16:8 for a week,
  a real-food kitchen, one 24-hour fast on a quiet day with the doctor line, ends by writing
  down your way of eating). Both carry `after: <part one id>`: `partDone(tr)` gates `isOpen`
  (all rungs of part one done) and a part two inherits its part one's open place; the area
  page shows a waiting part two greyed under its part one (`lockedRow`, `C.school.areaAfter`
  "Opens when {name} is done"). Design, his list: (1) the three tabs are equal thirds
  (`.stab.homet{flex:1}`); (2) the header was under the phone's status bar: `.hud` top is now
  `env(safe-area-inset-top) + 9px` and the school band grows by the inset
  (`calc(34dvh + env(safe-area-inset-top))`), viewport already has `viewport-fit=cover`;
  (3) the torches moved DOWN (`top = 262` in scene.js) so the flames sit just above the two
  heads and under the header, visible on a real phone; the day-done hail is a plate at the
  bottom of the band (`bottom:3%`), never under the notch; (4) the long game's explanation is a
  `foldCard('longhow', …)` drop-down ("How the long game works"); Look / Take it on are two
  equal buttons; the drop-down's doubled chevron fixed (`::-webkit-details-marker`); (5) home
  picks are clear boxes (`.pick` card with the room's colour ring, 104px picture filling the
  box height, buttons `white-space:nowrap`). 173 ladders.
- **v71 (2026-09-16, Fable session): his list after a day with v70.** (1) The quiet/face button
  is gone (they are always there; the sound button is the mute): `quietFolk()` is always false,
  the help-panel toggle removed. (2) **Everything = three groupings as segmented buttons**
  (`.seg`, always shown): **Life areas** (rebuilt to HIS categories: Health, Relationships,
  Community, Prosperity, Knowledge, Home, Fun and creativity, New experiences, Spirituality,
  Emotions — `school.json.areas`, every ladder in exactly one), **What it builds** (eight
  qualities, `school.json.traits`: Courage, Confidence, Calm, Kindness, Discipline, Curiosity,
  Joy, Patience — every ladder in exactly one, `renderTraits`), and **Everything** (the rooms;
  a room page lists only open ladders + "n more open later"). `renderKinds` is kept but unused.
  (3) The mute button has a red line (`.round.off::after`). (4) "More about this" is right-
  aligned (thumb side). (5) The "0 · Spark" rank pill became the **day pill**: "Day n" = days
  lit + (today not lit ? 1 : 0), tap → the days room (`paintDayPill`, `C.school.dayPill`); rank
  stays on the stand card at home. (6) **Their words no longer push the page**: `#capband`
  lives INSIDE `#scene`, absolute over the foot of the band. (7) **The tuck handle** at the foot
  of the band (`#tuckbtn`, `setTucked(on)`, `S.school.tucked`): the band folds to
  `env(safe-area-inset-top) + 60px` showing the entablature (`preserveAspectRatio` flips to
  `xMidYMin`), figures/torches/caption/hud hidden, chevron flips; remembered.
- **v72 (2026-09-16, Fable session): audio only, sentences finish, where you stand, the streak card, picks that move on.**
  (1) In the school the two of them are AUDIO ONLY: `.stage.school .capband/.bubble/.abubble` hidden (his: the
  text popping up is distracting; the voice alone feels natural). The cover/twenty-five keep their captions.
  (2) **A page change no longer cuts them off**: `hushSoft()` (SPK++, clear the queue, keep the current
  sentence) replaces `hush()` in leaveArrival, goHome, closeTrack and the area/room Back; `speakSchool` starts
  through `whenQuiet(fn)` (polls every 300 ms until nothing is playing, 18 s cap). A Done still interrupts.
  (3) **Where you stand** (`becomingRoom`, the Becoming door at home): one bar per LIFE AREA with steps done,
  tap → that area's page (`data-go="area:id"`), then What it builds bars (tap → the traits view), then
  "Things you can do now" in a fold; the old shields page is `becomingRoomOld`, unused. The days room and the
  home "Rooms climbed" fold count by life area now. (4) **The streak card** (`daycard2`): one big flame (lit
  when today is lit), the number, DAYS IN A ROW, the week strip, the day bar, and everything else inside
  "More about your days" (`runs.more`). "With a little one" and Share share one row. (5) **Picks move on**:
  a pick shown on three different days and not done rests for a fortnight (`S.school.shown[key][date]`,
  `resting()` in `todayPicks`); pool = 59 first rungs doable with nothing + 18 easy wins for home, plus the
  out/kit/with first rungs in the needs fold. (6) **Search bar** at the foot of Everything (`#qgo`,
  `search.home`) opens the search page focused. (7) `trackImg(tr)` is the one place a ladder's picture URL
  is built; `pic: N` on a track busts the cache when a tile is redrawn — nerve.asking (megaphone, it WAS live,
  his phone had the cached one) and fit.lift (redrawn: a strong back holding a kettlebell in a garden) are 2.
- **v73 (2026-09-16): the Health rewrite — one side food, one side fitness, and phases.**
  His: "a lot of them were rushed at the beginning and they didn't really think about it logically…
  in the health section it should be very clear that one side is the food and the other side is the
  fitness, right now they're mixed up… think really carefully of the order in which you would take
  them, each one building on the last… and we don't have too many opened up at the beginning, they
  may open up in phases." Health first, then the same treatment area by area.
  **The rewrite standard** (written down in `tools/health/lib.py`, follow it for the other nine):
  a ladder sits in ONE path inside its area; the rungs are in the order you would actually take
  them and each is the training for the next; every rung says exactly what to do now; every rung
  carries a `note` (the how, an example, the no-kit/no-spend alternative, and "already doing it
  counts"); the far end is significant but about three months away; the `line` MUST match the last
  rung. **What changed.** All 21 Health ladders rewritten — 396 rungs, every one with a note, every
  ladder with an `about` (it was 40 rungs of 396 before). `body.strength` was a copy of press-ups,
  pull-ups, plank and lifting with a few carries in it; it is now **Carrying** (loads over ground)
  and `fit.lift` is **Lifting** (off the floor and up high), no rung twice. Press-ups now END at
  thirty in one go (his example: significant, not overwhelming, no equipment) instead of fifty;
  pull-ups said ten and ended at four; stretching said the splits and ended at palms flat — the
  lines now match. `calm.fast` used to repeat Real food's twelve- and sixteen-hour rungs; it starts
  where part two finishes and is `after: food.real2`. Two NEW ladders, the fitness spine that the
  food spine already had: **`fit.body1` / `fit.body2` Getting strong, part one and two** — the round
  (squat, press-up, plank, table row), nothing but a floor and a table, three numbers written down
  on rung one and again on rung twenty; part two ends by pointing at the single-move ladders.
  175 ladders. **The shape.** `areas[].paths` = named paths inside a life area (Health: Food ·
  Fitness · Rest and recovery), drawn one at a time with a gold rule, in the order you would take
  them; an area with no `paths` renders exactly as before. **Phases:** a ladder can carry
  `need: n` = steps done in ITS OWN life area before it opens (`areaOf`/`areaSteps`/`needMet` in
  `isOpen`), and like `after` it survives the thirty-day everything gate — the phases are the shape
  of the area, not a trial period. Health opens with four doors (Real food part one, Getting strong
  part one, Sleep, and In the kitchen for a little one) and then 12 / 25 / 40 / 60 steps. A ladder
  that is not open yet still SHOWS, with the reason (`C.school.areaNeed`, `areaAfter`), because the
  road ahead is the motivating part. **Two real bugs found doing it:** (1) a rung with BOTH `how`
  and `note` only ever showed the `how` — every note under a how was invisible; both are drawn now,
  the note quieter, on the ladder page and in the step sheet. (2) `.roomhead` collapsed to zero
  height on any long area page — the flex-item + `overflow:hidden` trap; it has `flex:none` now.
  **Not done:** no track tiles drawn for `fit.body1`/`fit.body2` (fit category fallback), and
  Fasting still wears the `calm` candle tile, which reads oddly now that it sits in the Food path.
- **v74 (2026-09-17, Opus session): the whole ladder from home, lengths on rungs, a deeper daily pool, Today's extra.**
  (1) **A taken-on skill opens its ladder.** At home a skill you had taken on only offered "Practised today". The
  `.lgrow` card is now `data-open` (click, Enter or Space) → `openTrack(tr, { home: true })`, so Back comes home; it
  carries "The whole ladder ›" so the tap is findable; the buttons on it (Practised today, How is it going?, ×) keep
  their own jobs (`e.target.closest('button,…')`). `.proj` on the long page does the same, returning to the tab.
  (2) **`mins` on rungs** = roughly how long that rung takes once. His rule: 3 and under is the target for a quick
  thing, 5 acceptable, 10 never one of the three. Set by hand on every ladder's FIRST rung
  (`tools/daily/first_mins.py`; `None` = days or open-ended, and stays out). **Anything without `mins` is out of both
  pools until somebody has read and timed it** (`shortStep`). (3) **The standalone daily pool.** Almost every quick
  thing was a first rung, i.e. three invitations to a three-month project. `school.json.daily.quick` = 142 things
  that belong to NO ladder (a page of a kind of book you never read, four lines of a poem, ten words of another
  language, one move, one defined surface, a thank-you, a mental-arithmetic trick…), every one doable in a room at
  home with nothing, each with a note (how, example, no-spend alternative); 123 at 3 min or under. With the 46 short
  room-ctx first rungs that is **188**. In the code they are one-rung tracks (`soloTracks()`, `tr.solo`, keys
  `daily.<id>#1`, picture = category image, eyebrow "A quick thing · 2 min") that live outside every room, area and
  ladder count, so Done, points, traits and the step sheet all just work; `findStep` is now an index (`STEPIX`).
  A standalone one comes back round 180 days after it was done. `todayPicks`: among the first three, at most ONE
  ladder rung (while standalone ones remain; not on a child's page) and at most one over 3 min; a final `loose` pass
  lifts both so a thin pool never empties the card. Pick rows show the minutes.
  (4) **Today's extra** (`extraCard`, last in the day's flow under the long skill, quieter: no picture, thin outline,
  faint type). One bigger optional thing a day, 10–20 min, for the quiet evening. **The rule that is not
  negotiable: it never counts towards the day.** It is stored apart (`S.school.extras[date] = { k, at }`), never in
  `S.school.done` and never in `S.days`, so the day bar, the three torches, the flame and the celebration cannot see
  it. It earns `extra.points` (2) in `points()`, counts in `traitCounts()` and on Where you stand (by the ladder's
  area/trait, or the item's own `area`/`trait`), puts a gold dot under that day in the week strip (`.wk.x`), and the
  days room has a 35-day grid of them ("9 in the last thirty days"). Chosen by date: `extraPool()` is a fixed
  shuffle; day n takes the next item from position n that was not done as an extra in the last `gap` (90) days, saved
  in `S.school.extra` so it holds all day. One "A different one" (from the far side of the pool), then the button
  goes. Not done = gone at midnight, no carry-over. Hidden on a child's page. Copy in `C.school.extra`; the lede
  "Twenty minutes, if you have them. A different one tomorrow either way." is the anti-debt line — do not soften it.
  **Content, 124:** 39 Creating order rungs tagged `extra: true` + `mins` + a note where they had none
  (`tools/daily/order_extras.py`; doing one as an extra does NOT tick the rung or enrol you in the ladder, and the
  sheet says so), and 85 fresh in `school.json.daily.extra` — about a third order and repair, the rest meant to widen
  a life: ring an older relative about their childhood, a letter to somebody not spoken to in a year, dal /
  shakshuka / placki from cupboard staples, Cassiopeia and the space station from the doorstep, when your street
  was built (PRONI maps), what your town's name means (PlaceNamesNI), how the fridge / cistern / lock works, a
  thatcher / cooper / Belfast shipwright, a poem by heart, go on a 9x9 board, why there is no biggest prime.
  **How the content was made:** drafted by four parallel writers against `tools/daily/BRIEF.md` (the rules: plain
  modern English, no idioms, exactly what to do now, an example and a no-spend alternative, nothing that invites a
  joke), then every item read; `tools/daily/patch_v74.py` holds the cuts (nine duplicates of each other or of
  existing rungs) and the wording fixes, asserts ids / minutes / cat / area / trait, and prints the pool sizes.
  Re-run it after editing the json drafts. Facts in the extras the writers flagged and I did not verify at source:
  the free site names (PRONI Historical Maps, Historic Environment Map Viewer, PlaceNamesNI, Ulster History Circle,
  Spot the Station, Merlin, Seek, Stellarium Web) and "a large share of the tea drunk here is grown in Kenya".
  (5) Tiles for `fit.body1`, `fit.body2` and `calm.fast` (Fasting had the Calm candle) drawn with
  `tools/daily/tiles-v74.mjs` (the order-draw recipe, no people).
- **v75 (2026-09-17, Opus session): the celebration always congratulates; Back under the two of them.**
  (1) His: the day-done moment said "Three days of three" on his day ten. The run lines were right about the run
  but read as wrong beside the Day pill. Now `checkDay` ALWAYS speaks: Aurelia opens with one of
  `goal.cheers` in turn (`ui-dd-another1..6`, "Another day of three. Well done…", Kokoro via gen_voice.py), then
  Marcus answers with a pool `dayDone` line if it is his, else `c-day`. The two run-count lines (s-m-day2,
  s-a-day4) left the pool; the hail is "Another day of three · Well done" with no count. (2) On an area/room page
  the Back button sat top left beside the Day pill and went unseen. While the band is open it is now a "Back" pill
  at the foot of the band on the left, under Aurelia (`.stage.school:not(.tucked) .backbtn`); tucked, it returns to
  the top-left circle.
- **v76 (2026-09-17, Opus session): the rewrite continues — two ladders in each of the other nine areas.**
  His: "at least two for every one of the life areas; make sure the order makes sense, it is doable, no weird
  language, and it is clear whether it is for children, adults, or both." 18 ladders, 301 rungs, every rung with a
  note, to the v73 standard (tools/health/lib.py) plus a who rule (`tools/areas/BRIEF.md`): Relationships
  speak.listen, care.giving · Community speak.strangers (now asking people what they know, ending in an interview),
  care.place (permission BEFORE planting) · Prosperity money.handling (child with pocket money and grown-up side by
  side), deal.price · Knowledge mind.findout (checking sources, AI answers included), words.books · Home
  order.bedroom (12 rungs; its evening extras are now rungs 1, 3, 4, 5), home.mend (the never-yourself list —
  gas, mains, roofs — comes before any tool) · Fun and creativity make.draw, music.sing · New experiences
  wild.weather (tide rules, hypothermia signs, turn-back time), sky.stars (all NI-latitude facts checked) ·
  Spirituality calm.gratitude, calm.attention · Emotions nerve.asking, belong.chair (renamed "Grand places, from
  home": the old name was a figure of speech). **`who` on a ladder** = a short plain label ("From about eight; a
  child and a grown-up side by side", "Grown-ups and teenagers") drawn under the line on the row (`.swho`) and on the
  ladder page (`.tk-who`); `from: n` is set too where an age applies. Health says it in its `line` instead ("For
  grown-ups."); give the rest of Health a `who` when convenient. Process: three writers in parallel against the
  brief, every rung read; `tools/areas/apply_v76.py` holds the fixes (a wrong sky fact — two hours is a twelfth of
  a circle, not a sixth — the rename, three wording fixes), asserts the fields, and keeps
  tools/daily/first_mins.py and order_extras.py in step so re-running patch_v74 cannot undo it. Writers' notes on
  the order of each ladder: tools/areas/A-/B-/C-notes.md. Unverified at source: NI gas emergency 0800 002 001
  (believed right), Stormont free tours ("has run"), council litter-pick support, Keep Northern Ireland Beautiful.
  Quick pool now 192. Next: the remaining ladders area by area, same brief.
- **v77 (2026-09-17, Opus session): the school works anywhere, not only in Northern Ireland.** His: "there will be
  others on it from other places. Just make it so it works for everywhere." A scan of school.json, content.json
  and library.json for place-specific words (NI bodies and towns, £ and pence, 999, Met Office, NHS, RNLI, PRONI,
  Libraries NI, council bodies, UK slang like chippy/postie/car boot) → 115 edits in
  `tools/global/unlocal_v77.py` (idempotent; `apply_v76.py` now runs it after itself so a re-run cannot bring NI
  wording back). Money is written with no symbol ("20", "one whole unit of your money"); services are "your
  national weather service", "your emergency number (999, 112, 911)", "your local council". `words.irish` is now
  "The old language of your place" (same rungs, "in that language"). `sky.stars` says plainly it is written for the
  northern half of the world and points the south at the Southern Cross. The More from us list still names Days Out
  NI, Conscious Parenting NI and Fuel Price NI because they are NI apps; its lede dropped "in Northern Ireland".
  **Rule from now on (in both BRIEFs): never assume where the reader lives.**
- **v78 (2026-09-17, Opus session): rewrite wave two — Relationships, Community, Spirituality, Emotions done.**
  36 ladders, 574 rungs, to `tools/areas/BRIEF.md` (worldwide rule, `who` label), writers D–I, every rung read;
  `tools/areas/apply_v78.py` (run after apply_v76.py) asserts fields, a banned-words list (£, NI, 999, UK slang,
  "finish line") and `who` under 60 chars. Relationships: care.welcome, speak.humour (kindness rule: fine in front
  of a grandparent and a small child at once), speak.story, food.host, speak.hardthing, speak.connect (now
  **Keeping in touch** — it was a third copy of Meeting people). Community: care.younger (never alone with somebody
  else's child), care.older, speak.teach, beauty.town (now **The beauty of where you live**), care.animals (no
  animal of your own needed). Spirituality: calm.still (the longer sitting practice after part one — not locked
  behind it), classic.think, classic.stories (many cultures), classic.big (traditions in their own voice, never
  tells you what to believe), classic.beautiful. Emotions: nerve.phone, nerve.walkin, nerve.no, nerve.onthespot,
  nerve.odd, speak.stage, belong.shops, belong.cars, belong.rooms, belong.carry, belong.story, calm.hard.
  Prosperity: money.earn, money.sell, deal.more, deal.phone (now **Bills by phone and email**), deal.terms,
  deal.walkaway (now **Being ready to say no to a deal**), deal.both, money.negotiate. `unlocal_v77.py` now skips
  targets a later wave rewrote. 87 of 175 ladders now to the standard; quick pool 206. **Left:** Prosperity
  money.run, money.invest; all of Knowledge (21), Home (13), Fun and creativity (30), New experiences (15); the
  under-sevens set. Writers' order notes: tools/areas/D-…I-notes.md.
- **v79 (2026-09-17, Opus session): rewrite wave three — Knowledge and Home done.** 36 ladders, 597 rungs,
  writers J–O, every rung read, facts checked (word origins, pi digits, cipher examples, geometry, the savings
  sums, chess rules, first aid against mainstream Red Cross teaching). `tools/areas/apply_v79.py` (run after
  apply_v78.py) also REGENERATES `tools/daily/order_extras.py` from school.json, because the order ladders were
  rewritten and their evening-extra rungs moved: 38 ladder extras + 85 fresh = 123. Knowledge: words.read (phonics,
  sounds not names, into words.books), words.hand, words.poems (**Poems: learning them and writing them**),
  words.lang, words.irish (the old language of your place), words.sign, mind.tables, mind.mental, mind.memory,
  mind.puzzles, mind.codes, mind.cube (seven sequences, simulated), mind.chess, classic.logic (everyday examples
  only), classic.question, classic.roots, beauty.look, beauty.shapes, beauty.symmetry, beauty.proportion (the
  golden ratio stated honestly), beauty.arches (many cultures; the pointed arch is not a European first).
  Home: order.desk, order.wardrobe (one kind of clothing at a time; the hanger test), order.broken (deciding, not
  repairing — Mending teaches repairs), order.giving, order.digital (two-step sign-in), order.forgotten (nobody
  stands on anything, products never mixed), order.keeping (the systems) vs home.keep (the jobs), home.tools
  (power tools grown-ups only), home.firstaid (says plainly an app is not a course; CPR on a cushion; a real
  course is a rung), home.safe, food.grow (windowsill, both hemispheres), food.preserve (never-do list before any
  jar). Prosperity: money.run, money.invest (educational only, never names anything to buy; points to the
  regulator). 123 of 175 at the standard; quick pool 205. **Left:** Fun and creativity (30), New experiences (15),
  and the under-sevens set.
- **v80 (2026-09-17, Opus session): rewrite wave four — every adult ladder is now to the standard (168 of 175).**
  45 ladders, 782 rungs, writers P–W, every rung read, safety and facts checked. Fun and creativity: make.knots,
  make.clay (air-drying clay is not waterproof or food-safe — those rungs are gone), make.cloth (all by hand),
  make.wood (hand tools only), words.callig (italic), make.photo (ask first; never photograph other people's
  children), music.whistle, music.rhythm, music.dance (many cultures), music.instrument, music.readmusic,
  music.songwrite, magic.coins, magic.cards, magic.mentalism (now **Mind-reading tricks** — always said to be a
  trick, never a power), magic.mime (the joke is on you or an object), magic.puppet, magic.juggleclub (soft kit,
  no fire), body.juggle, body.skip, body.balance (never above knee height), body.upside (no headstands, nothing on
  the neck), sky.throw, sky.kite, sky.birdsflight (the correct lift explanation), sky.rocket (air and water only,
  no motors), home.engines (never anything with a plug, a charger or a battery), home.bike (a grown-up checks the
  brakes), make.electric (9 volts or less; mains kills; the first bulb rung is a torch bulb, LEDs wait for the
  resistor rung), make.machines (now **Making things with code**, online safety as a rung). New experiences:
  sky.wind (watching the sky yourself; forecasts stay in wild.weather), wild.living, mind.maps, wild.wayfind
  (both hemispheres), water.pools, body.ride (now **Riding a bike**), wild.fire and food.firecook (from 12, only
  where allowed, put out cold), wild.shelter, wild.camp, wild.forage (never eat unless a person who is certain
  checked it; three easy plants only; no mushrooms), wild.tracks, water.row, water.fish, water.sail (buoyancy aid
  on every water rung, a club or instructor always). Some writers added rung-level `place` (body.balance 11–20,
  sky.throw skimming, mind.maps hill, body.ride hill) so those never surface as a home pick. Quick pool 212,
  extras 123. **Left:** the seven under-sevens ladders (strand little) — body.hopping, speak.sayit,
  make.scissors, make.crayons, music.song, care.helping, order.ownthings — which have their own shape (from four,
  beside a grown-up, twists).
