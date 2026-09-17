"""v78 (2026-09-17): wave two of the rewrite — Relationships, Community, Spirituality and Emotions finished,
plus earning, selling and negotiation in Prosperity. 36 ladders to tools/areas/BRIEF.md (worldwide rule and
`who` label included), drafted by writers D–I, every rung read. Run after apply_v76.py (which runs the v77
place-neutral pass): python3 tools/areas/apply_v78.py
"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', 'health'))
from lib import load, save

IDS = ['care.welcome', 'speak.humour', 'speak.story', 'food.host', 'speak.hardthing', 'speak.connect',
       'care.younger', 'care.older', 'speak.teach', 'beauty.town', 'care.animals', 'classic.beautiful',
       'calm.still', 'classic.think', 'classic.stories', 'classic.big', 'calm.hard', 'belong.story',
       'nerve.phone', 'nerve.walkin', 'nerve.no', 'nerve.onthespot', 'nerve.odd', 'speak.stage',
       'belong.shops', 'belong.cars', 'belong.rooms', 'belong.carry', 'money.earn', 'money.sell',
       'deal.more', 'deal.phone', 'deal.terms', 'deal.walkaway', 'deal.both', 'money.negotiate']
FIX = [  # the read
 ('deal.walkaway', None, 'name', 'Being willing to walk away', 'Being ready to say no to a deal'),   # "walk away" is a figure of speech
 ('money.negotiate', 6, 'note', 'If you have climbed "Being willing to walk away"', 'If you have climbed "Being ready to say no to a deal"'),
]
KINDS = {'skill', 'attention', 'courage', 'kindness'}; CTX = {'room', 'home', 'kit', 'with', 'out', 'long'}
BAN = ['£', 'Northern Ireland', ' NI ', 'Belfast', '999', 'Met Office', 'NHS', 'chippy', 'postie', 'car boot', 'finish line']

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
    assert new.get('who') and len(new['who']) <= 60, (tid, new.get('who'))
    blob = json.dumps(new, ensure_ascii=False)
    for b in BAN: assert b not in blob, (tid, b)
    for j, s in enumerate(new['steps'], 1):
        assert s['n'] == j and s['test'].strip() and len(s.get('note', '')) > 40, (tid, j)
        assert s['ctx'] in CTX and s['kind'] in KINDS, (tid, j)
        assert 'mins' not in s or j == 1, (tid, j)
    assert isinstance(new['steps'][0].get('mins'), int), tid
    c['tracks'][i] = new
save(d)
fm = os.path.join(HERE, '..', 'daily', 'first_mins.py'); s = open(fm).read()
for tid in IDS:
    m = where[tid][0]['tracks'][where[tid][1]]['steps'][0]['mins']
    s, k = re.subn(r"'%s': (None|\d+)" % re.escape(tid), "'%s': %d" % (tid, m), s); assert k == 1, tid
open(fm, 'w').write(s)
print('rewritten:', len(IDS), 'ladders,', sum(len(where[t][0]['tracks'][where[t][1]]['steps']) for t in IDS), 'rungs')
