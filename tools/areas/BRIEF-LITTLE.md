# Light School — the under-sevens ladders (v81)

Light School (nolschool.com) is a free app for adults and families, used in many countries.
A **ladder** is a skill in 12 **rungs**. The eight ladders with `"strand": "little"` are the
under-sevens set. They are DIFFERENT from the adult ladders and must keep their own shape:

- **From four.** Every one has `"from": 4`.
- **The grown-up holds the phone.** The child does the rung; a grown-up reads it, sets it up and
  says when it is done. Every rung is `"ctx": "with"`.
- **Two voices in one rung.** The `test` speaks to the CHILD: short, plain, one thing, no
  explaining. The `note` (and `how`) speak to the GROWN-UP: how to set it up, what to let the
  child struggle with, what not to do, why the rung matters.
- **Twists stay.** A `twist` is the "already easy? try it like this" line, spoken to the child
  ("Eyes shut.", "The foot you would never choose."). Keep every existing twist where the rung
  survives in a similar form. Add one where an obvious one exists.

## The model — read it first
`food.kitchen` in `school.json` is already written to this standard. Read all twelve of its rungs
and its `about` before you write a word. Match that voice exactly. Everything below describes
what it already does.

## Your job
The seven other little ladders have bare `test` lines and nothing else: no `note`, no `about`, no
`who`. Give each one the full treatment, and fix the order and any rung that does not work.

## The standard (not negotiable)
1. **Order.** The rungs are in the order a child would actually take them. Each one is reachable
   from the one before. No jumps. If the existing order is wrong, change it — say so in your notes.
2. **Every rung has a `note`**, two to four sentences, to the grown-up:
   - what to set up or say, in practical words;
   - what to let the child do badly and finish themselves;
   - the free / no-equipment alternative where the rung needs anything at all;
   - what the rung is really teaching, in one plain sentence, where it is not obvious.
   Never talk down to the grown-up and never tell them their child's feelings.
3. **`how`** (a list of 2–4 very short lines) only where the doing genuinely needs steps — as in
   `food.kitchen` rungs 1, 4, 5, 7. Most rungs do not need it. Do not pad.
4. **`test` stays short.** One sentence a four-year-old understands when it is read out. Fix any
   that are vague or that need a skill from a later rung. Keep the good ones as they are.
5. **Language.** Plain modern English, short sentences, concrete words, British spelling.
   **No idioms or figures of speech.** Nothing that invites a joke or a double meaning. Upbeat,
   never guilt, never a warning about what happens if you do not do it. No claim about child
   development stated as settled science — say what happens in the room, not what the research says.
6. **Doable anywhere in the world.** Never name a country, region, town, national body, shop chain,
   currency symbol or phone number. No local slang. No money needed beyond a normal household;
   where an object appears, give the thing most homes already have. If a rung depends on climate or
   season, give the other case.
7. **Safety.** A grown-up is there for all of it, so say the one thing that matters and no more.
   Nothing sharp without naming how it is held. Nothing above standing height. Nothing a four-year-old
   could do to themselves while the grown-up is reading the next rung.
8. **Fields per rung:** `n` (1..12), `test`, `note`, optional `how` (list), optional `twist`,
   `ctx` (always `"with"`), `kind` (`skill` / `attention` / `courage` / `kindness`), and `mins` on
   **rung 1 only** — an honest whole number of minutes to do that rung once.
9. **Ladder fields:** keep `id`, `size`, `strand`, `from` exactly as they are. Keep `name` unless it
   is wrong. Rewrite `line` so it describes the last rung. Write `about`: 3–5 sentences, starting
   with who it is for ("For a child of about four and upwards, with a grown-up beside them."), then
   what the climb looks like from the first rung to the last, then why it is worth doing. Add `who`:
   a short plain label **under 60 characters**, e.g. "From about four, with a grown-up beside them".
   Twelve rungs, no more, no fewer.

## Output
For each ladder write `tools/areas/<ladder id>.json` in the app folder (`/Users/aiautomator/Documents/Documents/APPS/nation-of-light`): the whole track object, `steps` complete.
Check it parses: `python3 -c "import json;json.load(open(PATH))"`.

Also write `tools/areas/<your agent letter>-notes.md`: for each ladder, three or four lines on the
order you chose and why, plus anything you were unsure about (is this rung really doable at four?
is it safe? does the twist work?).

Before finishing, re-read every rung against rules 1–9 and fix what fails. Do not edit school.json.
