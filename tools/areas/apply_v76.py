"""v76 (2026-09-17): two more ladders rewritten in each of the nine life areas after Health.

Run from the app folder: python3 tools/areas/apply_v76.py   (idempotent)
Drafted by three writers against tools/areas/BRIEF.md (order that makes sense, every rung doable,
a note on every rung, who it is for said plainly), then read rung by rung; the fixes below are that read.
"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', 'health'))
from lib import load, save

IDS = ['speak.listen', 'care.giving', 'speak.strangers', 'care.place', 'money.handling', 'deal.price',
       'mind.findout', 'words.books', 'order.bedroom', 'home.mend', 'make.draw', 'music.sing',
       'wild.weather', 'sky.stars', 'calm.gratitude', 'calm.attention', 'nerve.asking', 'belong.chair']

FIX = [  # (ladder, rung n or None for the ladder, field, old, new)
 ('speak.strangers', 8, 'note', 'the man at the market stall', 'the person at the market stall'),
 ('mind.findout', 6, 'note', 'The finish line is the thing done, not the thing read about.', 'It is done when the thing is done, not when you have read about it.'),
 ('home.mend', 16, 'test', 'somebody who knows how mend', 'somebody who knows how to mend'),
 ('sky.stars', 7, 'note', 'by about a sixth of a circle', 'by about a twelfth of a circle'),
 ('wild.weather', 17, 'test', 'the inshore waters forecast for Northern Ireland', 'the inshore waters forecast for the stretch of coast you would walk'),
 ('belong.chair', None, 'name', 'From where you are sitting', 'Grand places, from home'),
 ('belong.chair', 6, 'note', '"City Hall: free tours, no booking on some days."', '"City Hall: free tours, times on its website."'),
]
KINDS = {'skill', 'attention', 'courage', 'kindness'}; CTX = {'room', 'home', 'kit', 'with', 'out', 'long'}

WHO = {'speak.listen': 'From about eight; a child and a grown-up side by side',
 'care.giving': 'For everybody; a child and a grown-up side by side',
 'speak.strangers': 'From about eight, with a grown-up beside a child',
 'care.place': 'For everybody; a child and a grown-up side by side',
 'money.handling': 'From about seven; a child and a grown-up side by side',
 'deal.price': 'Grown-ups and teenagers; from ten with a grown-up',
 'mind.findout': 'Grown-ups and anybody from about twelve',
 'words.books': 'Grown-ups, and children who read chapter books alone',
 'order.bedroom': 'For everybody; each person does their own room',
 'home.mend': 'Grown-ups and teenagers; from eight with a grown-up',
 'make.draw': 'For everybody from about six, side by side',
 'music.sing': 'For everybody; a child and a grown-up side by side',
 'wild.weather': 'For everybody; always a grown-up at the shore',
 'sky.stars': 'For everybody; a grown-up with any child in the dark',
 'calm.gratitude': 'For everybody; a family can do it together',
 'calm.attention': 'Grown-ups and anybody from about twelve',
 'nerve.asking': 'Grown-ups and anybody from about ten',
 'belong.chair': 'Grown-ups and teenagers'}

d = load()
where = {t['id']: (c, i) for c in d['categories'] for i, t in enumerate(c['tracks'])}
for tid in IDS:
    new = json.load(open(os.path.join(HERE, tid + '.json')))
    for (lid, n, f, old, rep) in FIX:
        if lid != tid: continue
        obj = new if n is None else new['steps'][n - 1]
        if old in obj[f]: obj[f] = obj[f].replace(old, rep)
        else: assert rep in obj[f], (tid, n, old)
    c, i = where[tid]; cur = c['tracks'][i]
    for k in ('id', 'size', 'strand'): assert new[k] == cur[k], (tid, k)
    for k in ('place', 'need', 'after', 'pic', 'warn'):
        if k in cur and k not in new: new[k] = cur[k]
    assert 12 <= len(new['steps']) <= 20 and new['about'].strip() and new['line'].strip(), tid
    for j, s in enumerate(new['steps'], 1):
        assert s['n'] == j and s['test'].strip() and len(s.get('note', '')) > 40, (tid, j)
        assert s['ctx'] in CTX and s['kind'] in KINDS, (tid, j)
        assert 'mins' not in s or j == 1 or s.get('extra'), (tid, j)
        assert 'finish line' not in s['note'] + s['test'], (tid, j)
    assert isinstance(new['steps'][0].get('mins'), int), tid
    new['who'] = WHO[tid]   # the short who-it-is-for label on the row and the ladder page
    c['tracks'][i] = new
save(d)

# keep the v74 sources in step, so re-running patch_v74 cannot undo this
fm = os.path.join(HERE, '..', 'daily', 'first_mins.py'); s = open(fm).read()
for tid in IDS:
    m = where[tid][0]['tracks'][where[tid][1]]['steps'][0]['mins']
    s, k = re.subn(r"'%s': (None|\d+)" % re.escape(tid), "'%s': %d" % (tid, m), s); assert k == 1, tid
open(fm, 'w').write(s)
print('rewritten:', len(IDS), 'ladders,', sum(len(where[t][0]['tracks'][where[t][1]]['steps']) for t in IDS), 'rungs')

# v77: the place-neutral pass runs after, or re-running this would bring the Northern Ireland wording back
import runpy; runpy.run_path(os.path.join(HERE, '..', 'global', 'unlocal_v77.py'), run_name='__main__')
