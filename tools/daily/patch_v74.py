"""v74 (2026-09-17): lengths on rungs, the standalone daily pool, and Today's extra.

Run from the app folder: python3 tools/daily/patch_v74.py   (idempotent)

  * `mins` on every ladder's first rung (first_mins.py, read by hand). A rung with no mins stays
    out of both daily pools until somebody has read it and timed it.
  * `extra: true` + `mins` (+ a note where it had none) on the Creating order rungs that stand on
    their own at 10-20 minutes (order_extras.py). Doing one as an extra does not tick the rung.
  * `school.json.daily.quick` = standalone quick things (3 min target, 5 max, doable in a room at
    home with nothing), `daily.extra` = the fresh Today's extra pool. Drafted to BRIEF.md in
    quick-a/b.json and extra-a/b.json, then read one by one; the cuts and fixes below are that read.
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'health'))
from lib import load, save, track
from first_mins import MINS
from order_extras import EXTRAS

d = load()
J = lambda f: json.load(open(os.path.join(HERE, f)))
quick = J('quick-a.json') + J('quick-b.json') + J('quick-c.json')   # c: written in review, the thin kinds (kindness and courage at home)
extra = J('extra-a.json') + J('extra-b.json')

# ---- the read: duplicates of each other or of existing rungs, the weaker copy goes
CUT = {
 'q-old-teacher',        # x-thank-teacher does it properly
 'q-town-name',          # x-town-name
 'q-cloud-name',         # x-name-clouds
 'q-river-to-sea',       # x-local-river
 'x-order-daily-bag',    # q-empty-bag
 'x-order-under-sink',   # order.forgotten#3
 'x-order-bathroom-cabinet',  # order.giving#5
 'x-thank-unseen',       # q-thank-collectors
 'x-voice-note-far',     # q-voice-message
}
quick = [q for q in quick if q['id'] not in CUT]
extra = [x for x in extra if x['id'] not in CUT]
# two writers both used q-ask-help
for q in quick:
    if q['id'] == 'q-ask-help' and q['cat'] == 'nerve': q['id'] = 'q-ask-for-help'

def fix(items, iid, field, old, new):
    it = next(i for i in items if i['id'] == iid)
    if old in it[field]: it[field] = it[field].replace(old, new)
    else: assert new in it[field], (iid, old)
fix(quick, 'q-five-for-walk', 'note', 'each one paints a different picture', 'each one describes a different way of moving')
fix(extra, 'x-how-cistern', 'note', 'Put the lid down gently on a towel while you look, as it is heavy and can crack.', 'The lid is heavy and can crack, so a grown-up lifts it off and lays it on a towel.')
fix(extra, 'x-trade-thatcher', 'note', 'A short film of a thatcher at work is a good way in.', 'A short film of a thatcher at work is the easiest place to start.')
fix(extra, 'x-make-chords-ear', 'note', 'Writing down even the first two chords is a finish line.', 'Writing down the first two chords counts as done.')
fix(extra, 'x-trade-stonemason', 'note', 'For tonight, three written things is the finish line.', 'For tonight, three written things is the whole job.')
fix(extra, 'x-order-photo-check', 'note', 'and that is the win for tonight', 'and that counts as done for tonight')
fix(extra, 'x-how-washer', 'test', 'Run the washing machine, stand', 'Next time the washing machine is running, stand')
for it in extra:
    for f in ('note', 'test'):
        it[f] = it[f].replace('The finish line is ', 'You are finished when you have ').replace('is a finish line', 'counts as done')

# ---- checks
cats = {c['id'] for c in d['categories']}; areas = {a['id'] for a in d['areas']}; traits = {t['id'] for t in d['traits']}
ids = [i['id'] for i in quick + extra]
assert len(ids) == len(set(ids)), 'duplicate ids'
for q in quick:
    assert q['id'].startswith('q-') and q['mins'] in (1, 2, 3, 4, 5) and not q.get('ctx'), q['id']
for x in extra:
    assert x['id'].startswith('x-') and x['mins'] in (10, 15, 20) and x.get('ctx') in (None, 'out'), x['id']
for i in quick + extra:
    assert i['cat'] in cats and i['area'] in areas and i['trait'] in traits and i['kind'] in ('skill', 'attention', 'courage', 'kindness'), i['id']
    assert i['test'].strip() and len(i['note']) > 60, i['id']
    assert 'finish line' not in (i['test'] + i['note']), i['id']

# ---- lengths on first rungs
all_ids = [t['id'] for c in d['categories'] for t in c['tracks']]
missing = [t for t in all_ids if t not in MINS]; assert not missing, missing
for c in d['categories']:
    for t in c['tracks']:
        s = t['steps'][0]
        if MINS[t['id']] is None: s.pop('mins', None)
        else: s['mins'] = MINS[t['id']]

# ---- Creating order rungs as extras
n_ex = 0
for tid, rungs in EXTRAS.items():
    tr = track(d, tid)
    for n, m, note in rungs:
        st = tr['steps'][n - 1]; assert st['n'] == n and 10 <= m <= 20
        st['mins'] = m; st['extra'] = True
        if not st.get('note'): st['note'] = note
        n_ex += 1

d['daily'] = {'quick': quick, 'extra': extra}
save(d)

easy = set(d['journey'][0]['steps'])
ladder_q = [t['id'] for c in d['categories'] for t in c['tracks']
            if t['steps'][0]['ctx'] == 'room' and isinstance(t['steps'][0].get('mins'), int) and t['steps'][0]['mins'] <= 5
            and not t.get('place') and not t['steps'][0].get('place') and not t.get('from')]
print(f'quick pool: {len(quick)} standalone + {len(ladder_q)} short ladder first rungs = {len(quick) + len(ladder_q)}')
print(f'  standalone at 3 min or under: {sum(q["mins"] <= 3 for q in quick)}')
print(f'extra pool: {len(extra)} fresh + {n_ex} Creating order rungs = {len(extra) + n_ex}')
