# Light School — writing brief for the new daily items (v74)

The app: Light School (live at nolschool.com), a free self-development app for adults and families, used in many countries. Every day the home page offers **three quick things** to do. Adults and children both read it.

You are writing items in two new pools that belong to NO ladder:

- **quick**: one small thing, done now, **3 minutes or less is the target, 5 at most**. Done alone, at home, with nothing specialised (a pen, paper, a phone, a book on a shelf, a cup, a chair, a window: fine. Anything you would have to buy, a partner, a garden, going outside: not allowed).
- **extra** ("Today's extra"): one bigger optional item for a quiet evening, **10 to 20 minutes**. It should feel like a real win, and its job is to **widen a life, not only tidy one**. Tidying and order are at most a third of the pool. The rest opens new ways of seeing: write to somebody you have not spoken to in a year, cook something from a country you have never cooked from, learn the constellations above your house, spend twenty minutes finding out how something in your house works, sit somewhere in your own town you have never sat, read about a trade you will never do. Extras may involve leaving the house for a short walk or a phone call, but must never need money beyond what is in a normal kitchen, and always give an at-home, no-spend alternative.

## Rules for every item (not negotiable)

1. **Plain modern English.** Short sentences. Concrete, literal words. **No idioms or figures of speech** (no "a breath of fresh air", "hit the ground running", "comfort zone", "level up", "treat yourself"). No jargon. Written so an adult is not talked down to and a child is not lost.
2. **The `test` says exactly what to do right now** — one sentence, a real action with a clear finish line. Never a hypothetical the reader has to invent ("think of something…" must be followed by an example of what that something is).
3. **Every item has a `note`**: two to four sentences with the how, a real example, and a no-spend / no-equipment alternative. Where somebody might already do it, add that doing it on purpose counts.
4. **Nothing that invites a joke** or a double meaning. Nothing mocking, nothing about bodily functions, nothing edgy. Family-friendly always.
5. **Joyful, no-victim voice.** Upbeat and plain. Never guilt, never "most people waste their evenings". If you mention "most people", it is about people out there who never try, never about readers who stop.
6. **Epistemic honesty**: no health or science claims stated as settled fact. Say what to do, not what it will cure.
7. **Safety**: no fasting, no knives beyond ordinary kitchen use, no heights, nothing with fire other than a normal cooker, nothing a child could not safely read. Movement items say "stop if anything hurts".
8. **No duplicates** of each other or of the existing rungs in `existing-rungs.txt` (same folder). Similar topic is fine if the action is clearly different.
9. **Variety is the whole point.** Spread across these kinds of thing: movement, mind, making, words, kindness, order, curiosity, calm, beauty, music. No run of five items that feel the same.
10. British spelling (colour, organise, tidy). No emoji.
11. Works anywhere in the world: never name a country, region, national body, currency symbol or phone number as if the reader lives there ("your weather service", "your emergency number", "20" not "£20"). No UK slang.

## Field format — write a JSON array, nothing else in the file

```json
{
  "id": "q-poem4",
  "test": "Write four lines of a poem about what you can see from where you are sitting.",
  "note": "They do not have to rhyme. Line one names a thing, line two its colour, line three a sound near it, line four how it makes the room feel. Pen and the back of an envelope is plenty; the notes app on your phone works too.",
  "mins": 3,
  "cat": "words",
  "kind": "attention",
  "area": "creativity",
  "trait": "joy"
}
```

- `id`: `q-` prefix for quick items, `x-` prefix for extras, then a short unique slug (lowercase letters, digits, hyphens).
- `mins`: a whole number, honest. quick: 1, 2, 3, 4 or 5 (aim for most at 3 or under). extra: 10, 15 or 20.
- `cat` — pick the closest (controls picture and colour): body, wild, water, fit, sky, mind, words, speak, make, music, magic, food, money, beauty, classic, nerve, deal, belong, home, care, calm, order
- `kind` — what it grows: `skill` (things your hands and body can do), `attention`, `courage`, `kindness`
- `area` — life area: health, relationships, community, prosperity, knowledge, home, creativity, experiences, spirituality, emotions
- `trait` — what it builds: courage, confidence, calm, kindness, discipline, curiosity, joy, patience

Quick items: all doable in a room at home with nothing specialised. Extras: may add `"ctx": "out"` only if it truly needs a short walk out; otherwise leave `ctx` off.

Before you finish, re-read every item against rules 1–9 and fix what fails. Check the JSON parses (`python3 -c "import json;json.load(open(PATH))"`).
