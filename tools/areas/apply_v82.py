#!/usr/bin/env python3
"""v82 — the under-sevens rewrite, and a `who` label on every ladder.

Two things, in order:
  1. the 32 adult ladders that predated the `who` field get one (Health and the
     nine area openers showed nothing where every other row showed who it is for);
  2. the seven bare under-sevens ladders are replaced by the drafts in this folder,
     and food.kitchen — already written to the standard in v43 — gets its `who`.

The little ladders keep their own shape: from four, `ctx: "with"` on every rung so
they never surface as an adult's quick thing, the `test` spoken to the child and the
`note` to the grown-up, and the other-hand twists. Idempotent.
"""
import json, pathlib, re

APP = pathlib.Path(__file__).resolve().parents[2]
P = APP / 'school.json'
HERE = pathlib.Path(__file__).resolve().parent

WHO = {
 # Health — body
 'body.breath':   'Everybody; a child and a grown-up side by side',
 'body.strength': 'Grown-ups and teenagers',
 'body.run':      'Grown-ups and anybody from about ten',
 # Health — water
 'water.swim':    'Everybody; never alone, and a grown-up with any child',
 'water.cold':    'Grown-ups and teenagers; never alone in open water',
 # Health — fit
 'fit.pressup':   'Grown-ups and anybody from about ten',
 'fit.situp':     'Grown-ups and anybody from about ten',
 'fit.pullup':    'Grown-ups and anybody from about ten',
 'fit.plank':     'Grown-ups and anybody from about ten',
 'fit.squat':     'Grown-ups and anybody from about ten',
 'fit.lift':      'Grown-ups and teenagers',
 'fit.stretch':   'Everybody; a child and a grown-up side by side',
 'fit.sprint':    'Grown-ups and anybody from about eight',
 'fit.body1':     'Grown-ups and anybody from about ten',
 'fit.body2':     'Grown-ups and anybody from about twelve',
 # Health — food and calm
 'food.real1':    'Grown-ups only',
 'food.real2':    'Grown-ups only',
 'food.knife':    'Grown-ups, and children from about eight beside one',
 'food.cook':     'From about ten with a grown-up; teens and grown-ups',
 'food.bake':     'From about six; a child and a grown-up side by side',
 'calm.still1':   'Everybody; a child and a grown-up side by side',
 'calm.sleep':    'Grown-ups, and a grown-up setting a child’s night',
 'calm.fast':     'Grown-ups only; children stop at step four',
 # the nine area openers
 'wild.door1':    'Everybody; a grown-up with a child outdoors',
 'mind.learn1':   'Grown-ups and anybody from about ten',
 'speak.people1': 'Grown-ups and teenagers',
 'speak.people2': 'Grown-ups and teenagers',
 'make.something1': 'From about eight; a child and a grown-up side by side',
 'music.play1':   'From about six; a child and a grown-up side by side',
 'money.value1':  'Grown-ups and anybody from about twelve',
 'belong.town1':  'Grown-ups and teenagers; a grown-up with a child',
 'home.works1':   'Everybody; a child and a grown-up side by side',
}

# --- the under-sevens set -----------------------------------------------------

LITTLE = ['body.hopping', 'speak.sayit', 'make.scissors', 'make.crayons',
          'music.song', 'care.helping', 'order.ownthings']
KITCHEN_WHO = 'From about four, with a grown-up beside them'

# v45 put the other-hand twist on the kitchen ladder and a later rewrite lost it.
# It is the one twist that works here: a grown-up who finds the rung easy does it
# with the hand they would never choose, and finds out what the child is feeling.
KITCHEN_TWIST = {
  3: 'The hand you would never choose.',
  4: 'The hand you would never choose.',
  5: 'The hand you would never choose.',
  7: 'One hand only.',
}

KINDS = {'skill', 'attention', 'courage', 'kindness'}

# Fixes on top of the drafts, each one a thing my read caught.
FIX = {
  # Writer W2 kept the old "From four, beside you." prefix in `line`; the other six
  # dropped it because the `who` label now says it. Level them.
  ('speak.sayit', 'line'): ('From four, beside you. ', ''),
  # Scissors rung 2 is the grip, in the air — telling the child to hold paper with a
  # thumb up reads as a second instruction for a job that has not started yet.
  ('make.scissors', 'how2'): ('The other hand holds the paper, thumb up as well.',
                              'The other hand is the one that will hold and turn the paper.'),
  # "step up" is a figure of speech; the brief bans them.
  ('care.helping', 'text'): ('is the whole step up here', 'is the whole change here'),
}

# Place words that assume where the reader lives. "Lough" is the Irish and Scottish
# word for a lake and was left behind by the v77 pass, which only looked for names.
LOCAL = [
  ('Stand in the sea or a lough up to your ankles',
   'Stand in the sea or a lake up to your ankles'),
  ('moves out to the sea or a lough.', 'moves out to the sea or a lake.'),
  ('downstream to the lough or the sea', 'downstream to the lake or the sea'),
  ('Find out which reservoir or lough the water in your kitchen tap comes from.',
   'Find out which lake, river or reservoir the water in your kitchen tap comes from.'),
]

BAN = [' NI ', 'Northern Ireland', 'Ulster', '£', 'Met Office', 'NHS', 'ring 999',
       'call 999', 'chippy', 'postie', 'car boot', 'comfort zone', 'step up',
       'break the ice', 'level up', 'push yourself', 'finish line']


def little_tracks():
    out = {}
    for tid in LITTLE:
        t = json.loads((HERE / f'{tid}.json').read_text())
        assert t['id'] == tid, t['id']

        # apply the fixes
        f = FIX.get((tid, 'line'))
        if f and f[0] in t['line']:
            t['line'] = t['line'].replace(*f)
        f = FIX.get((tid, 'how2'))
        if f:
            for s in t['steps']:
                if s.get('how'):
                    s['how'] = [f[1] if h == f[0] else h for h in s['how']]
        f = FIX.get((tid, 'text'))
        if f:
            for s in t['steps']:
                for k in ('test', 'note'):
                    s[k] = s[k].replace(*f)

        # the shape of a little ladder
        assert t['strand'] == 'little' and t['from'] == 4, tid
        assert len(t['steps']) == 12, (tid, len(t['steps']))
        assert t.get('about') and t.get('who') and t.get('line'), tid
        assert len(t['who']) <= 60, (tid, len(t['who']))
        for i, s in enumerate(t['steps'], 1):
            assert s['n'] == i, (tid, s['n'], i)
            assert s['ctx'] == 'with', (tid, i, s['ctx'])
            assert s['kind'] in KINDS, (tid, i, s['kind'])
            assert s.get('note'), f'{tid} rung {i} has no note'
            assert ('mins' in s) == (i == 1), f'{tid} rung {i} mins'
            if s.get('how'):
                assert isinstance(s['how'], list) and 2 <= len(s['how']) <= 4, (tid, i)
        blob = json.dumps(t, ensure_ascii=False)
        for b in BAN:
            assert b.lower() not in blob.lower(), f'{tid}: banned wording {b!r}'
        out[tid] = t
    return out


def sync_first_mins(new):
    """first_mins.py is the hand-read table of rung-1 minutes; keep it in step so
    re-running it cannot undo a ladder rewritten here."""
    f = HERE.parent / 'daily' / 'first_mins.py'
    s = f.read_text()
    for tid, t in new.items():
        m = t['steps'][0]['mins']
        pat = re.compile(r"('%s':\s*)(\d+|None)" % re.escape(tid))
        assert pat.search(s), f'{tid} not in first_mins.py'
        s = pat.sub(lambda mo: mo.group(1) + str(m), s, count=1)
    f.write_text(s)


def main():
    d = json.loads(P.read_text())
    ix = {t['id']: t for c in d['categories'] for t in c['tracks']}

    missing = [k for k in WHO if k not in ix]
    assert not missing, f'unknown ladders: {missing}'
    for k, v in WHO.items():
        assert len(v) <= 60, f'{k} who is {len(v)} chars'
        ix[k]['who'] = v

    new = little_tracks()
    ix['food.kitchen']['who'] = KITCHEN_WHO
    for s in ix['food.kitchen']['steps']:
        if s['n'] in KITCHEN_TWIST:
            s['twist'] = KITCHEN_TWIST[s['n']]
    for c in d['categories']:
        for i, t in enumerate(c['tracks']):
            if t['id'] in new:
                c['tracks'][i] = new[t['id']]

    s = json.dumps(d, ensure_ascii=False, indent=1) + '\n'
    for a, b in LOCAL:
        s = s.replace(a, b)
    P.write_text(s)
    sync_first_mins(new)

    d = json.loads(P.read_text())
    tracks = [t for c in d['categories'] for t in c['tracks']]
    nowho = [t['id'] for t in tracks if not t.get('who')]
    nonote = [t['id'] for t in tracks
              if any(not s.get('note') for s in t['steps'])]
    little = [t for t in tracks if t.get('strand') == 'little']
    print(f'who set on {len(WHO)} adult ladders + food.kitchen')
    print(f'under-sevens rewritten: {len(new)} ladders, {sum(len(t["steps"]) for t in new.values())} rungs')
    print(f'{len(tracks)} ladders, {len(little)} of them under-sevens')
    print(f'without a who: {nowho or "none"}')
    print(f'with a rung missing its note: {nonote or "none"}')
    blob = P.read_text()
    left = [w for w in ('lough',) if re.search(r'\b' + w, blob, re.I)]
    print(f'place words assuming where the reader lives: {left or "none"}')

main()
