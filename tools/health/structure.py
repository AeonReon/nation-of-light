# -*- coding: utf-8 -*-
"""Health, cleanly categorised and opened in phases.

His two asks: one side is food, the other side is fitness, and the mix (sleep,
breath, cold water) sits somewhere of its own; and not everything is open at the
start — it opens in phases as you climb.

So a life area now has `paths`, and a ladder can carry `need: n` = the number of
steps done in that life area before it opens. `after` still means a part two
waiting on its part one. Both survive the thirty-day everything-opens gate on
purpose: the phases are the shape of the area, not a trial period.
"""
import lib
d = lib.load()

PATHS = [
  ('food', 'Food', 'What you eat, and cooking it yourself.', [
      ('food.real1',   None), ('food.real2', None), ('calm.fast', None),
      ('food.kitchen', 0),
      ('food.knife',  12), ('food.cook', 25), ('food.bake', 40),
  ]),
  ('fitness', 'Fitness', 'A body that can do things.', [
      ('fit.body1', None), ('fit.body2', None),
      ('fit.stretch', 12),
      ('fit.pressup', 25), ('fit.squat', 25),
      ('fit.plank', 40), ('fit.situp', 40), ('body.run', 40),
      ('fit.pullup', 60), ('fit.lift', 60), ('body.strength', 60),
      ('fit.sprint', 60), ('water.swim', 60),
  ]),
  ('rest', 'Rest and recovery', 'Sleep, breath, and cold water.', [
      ('calm.sleep', None), ('body.breath', 12), ('water.cold', 25),
  ]),
]

area = [a for a in d['areas'] if a['id'] == 'health'][0]
area['name'] = 'Health'
area['line'] = 'Food on one side, fitness on the other, and rest holding both of them up.'
area['open'] = ['food.real1', 'fit.body1', 'calm.sleep']
area['paths'] = [{'id': pid, 'name': name, 'line': line, 'tracks': [t for t, _ in trs]}
                 for pid, name, line, trs in PATHS]
area['tracks'] = [t for _, _, _, trs in PATHS for t, _ in trs]

for _, _, _, trs in PATHS:
    for tid, need in trs:
        t = lib.track(d, tid)
        if need:
            t['need'] = need
        else:
            t.pop('need', None)

# the two new fitness programmes need a home in What it builds, as everything does
for tr in d['traits']:
    for tid in ('fit.body1', 'fit.body2'):
        if tid in tr['tracks']:
            tr['tracks'].remove(tid)
disc = [t for t in d['traits'] if t['id'] == 'discipline'][0]
i = disc['tracks'].index('fit.pressup')
disc['tracks'][i:i] = ['fit.body1', 'fit.body2']

lib.save(d)

# ---- check the invariants the app relies on -------------------------------
ids = {t['id'] for c in d['categories'] for t in c['tracks']}
seen = {}
for a in d['areas']:
    for t in a['tracks']:
        seen[t] = seen.get(t, 0) + 1
bad = [t for t in ids if seen.get(t, 0) != 1]
tin = {}
for a in d['traits']:
    for t in a['tracks']:
        tin[t] = tin.get(t, 0) + 1
bad2 = [t for t in ids if tin.get(t, 0) != 1]
assert not bad, f"not in exactly one area: {bad}"
assert not bad2, f"not in exactly one trait: {bad2}"
for a in d['areas']:
    if a.get('paths'):
        flat = [t for p in a['paths'] for t in p['tracks']]
        assert flat == a['tracks'], a['id']
print(f"{len(ids)} ladders, every one in exactly one area and one quality.")
print()
for p in area['paths']:
    print(f"  {p['name']}:")
    for tid in p['tracks']:
        t = lib.track(d, tid)
        gate = ('after ' + t['after']) if t.get('after') else (f"at {t['need']} steps" if t.get('need') else 'OPEN')
        print(f"    {tid:16s} {len(t['steps']):2d} rungs  {gate:22s} {t['name']}")
