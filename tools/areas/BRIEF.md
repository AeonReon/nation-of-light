# Light School — ladder rewrite brief (v75, area by area after Health)

Light School (nolschool.com) is a free app for adults and families in Northern Ireland. A **ladder** is a skill in 8–20 **rungs** (steps). People tap a rung, do it, tap Done. The Health area was rewritten to a standard in v73; you are rewriting ladders in the other areas to the same standard. The early ladders were written in a rush and "look dumped, not thought through". The owner's words for this round: *make sure the order makes sense, that every rung is doable, no weird language, and that it is clear whether it is for children, adults, or both.*

## Read first
- `school.json` in the app folder (`/Users/aiautomator/Documents/Documents/APPS/nation-of-light/school.json`). Find your ladders under `categories[].tracks[]` by `id`. Read the current rungs: keep what is good, fix what is not.
- For the standard in practice, read `food.real1`, `fit.body1` and `calm.still1` in the same file, and the docstring in `tools/health/lib.py`.

## The standard (not negotiable)
1. **Order.** The rungs are in the order you would actually take them. Each rung is reachable from the one before, and the one before is the training for it. No jumps, no numbers that go backwards, no rung that secretly needs a skill from later.
2. **Exactly what to do, right now.** Every `test` is one sentence with a clear finish line. Never a hypothetical the reader has to invent. If it says "somebody" or "a thing", the note names examples.
3. **Every rung has a `note`** (2–4 sentences): the how, a real example, the no-spend / no-equipment alternative, and "if you already do this, do it on purpose and count it" wherever somebody might already be past it. Use `how` (a list of 2–4 short steps) as well only where the doing genuinely needs steps.
4. **The far end** is significant but about three months away of a little most days. **The ladder's `line` must describe the last rung**, and the name must match what the ladder really is.
5. **Language.** Plain modern English, short sentences, concrete words, British spelling. **No idioms or figures of speech** ("comfort zone", "step up", "break the ice", "level up", "push yourself" all out). No jargon. Written so an adult is not talked down to and a child is not lost. Nothing that invites a joke or a double meaning. Upbeat, never guilt. No health or science claim stated as settled fact.
6. **Who it is for — say it plainly.** Put one sentence at the START of `about` saying who: "For grown-ups and teenagers.", "For anybody from about eight, with a grown-up for the first few rungs.", or "For everybody: a child and a grown-up can climb it side by side." If a ladder is only sensible from a certain age, add `"from": <age>` (a number, e.g. 12 or 16) on the ladder. Do not use `strand: "little"` (that is the separate under-sevens set). A rung a child could not safely do alone says so in its note ("a grown-up with you").
7. **Doable here.** Northern Ireland: towns, villages, weather, pounds and pence. No money needed beyond a normal household; where money or a purchase appears, give the free alternative. Nothing dangerous. Safety lines where they matter.
8. **Fields per rung:** `n` (1..N), `test`, `note`, optional `how` (list), `ctx`, `kind`, and `mins` on **rung 1 only** (an honest whole number of minutes to do it once).
   - `ctx`: `room` = doable right now, in a room, with nothing but you (a pen/phone/household item is fine) · `home` = at home but needs a particular household thing or a space · `kit` = needs a specific object people may not have · `with` = needs another person · `out` = needs to go out · `long` = spread over several days (a week of something). Be accurate: this decides what the app offers on the home page.
   - `kind`: `skill` (hands/body can now do it), `attention`, `courage`, `kindness`.
   - Keep any existing `twist` field on a rung if the rung survives in a similar form (it is the "already easy? do it with your other hand" line); drop it if the rung changes.
9. **Ladder fields:** keep `id`, `size`, `strand` exactly as they are. Write `name` (keep unless it is wrong), `line`, `about` (3–5 sentences: who it is for, what the climb looks like start to finish, why it is worth it). Keep `place` / `need` / `after` / `pic` / `warn` if present. Rung count: 12 to 20 (use 12 for a small skill, 20 for a big one). Keep the current `size` value.

## Output
For each ladder, write `tools/areas/<ladder id>.json` in the app folder: the whole track object (all fields above, `steps` complete). Then check it parses: `python3 -c "import json;json.load(open(PATH))"`.

Also write `tools/areas/<your agent letter>-notes.md`: for each ladder, three or four lines on the ORDER you chose and why, and anything you were unsure about (facts, safety, whether a rung is really doable).

Before finishing, re-read every rung against rules 1–8 and fix what fails. Do not edit school.json yourself.
