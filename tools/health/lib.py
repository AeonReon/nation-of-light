"""Shared helpers for the Health rewrite (2026-09-16).

The rewrite standard, in one place, so the other nine life areas can follow it:

  1. A ladder belongs to ONE path inside its life area (Food / Fitness / Rest here).
  2. The rungs are in the order you would actually take them. Each one is
     reachable from the one before it, and the one before it is the training
     for it. No jumps, no numbers that go backwards.
  3. Every rung says exactly what to do right now. No hypotheticals to invent.
  4. Every rung has a `note`: the how, an example, the no-spend / no-kit
     alternative, and "if this is already how you live, do it on purpose and
     count it" wherever somebody might already be past it.
  5. The far end is significant but reachable in about three months of a
     little most days. Thirty press-ups, not fifty. The `line` must match the
     last rung.
  6. Written so a grown-up is not talked down to and a child is not lost:
     plain modern English, short sentences, concrete things, no jargon.
"""
import json, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
SCHOOL = os.path.join(ROOT, 'school.json')


def load():
    with open(SCHOOL) as f:
        return json.load(f)


def save(d):
    with open(SCHOOL, 'w') as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
        f.write('\n')


def track(d, tid):
    for c in d['categories']:
        for t in c['tracks']:
            if t['id'] == tid:
                return t
    raise KeyError(tid)


def cat(d, cid):
    for c in d['categories']:
        if c['id'] == cid:
            return c
    raise KeyError(cid)


def steps(rungs):
    """rungs = list of (test, kind, ctx, [how...], note) -> numbered step dicts."""
    out = []
    for i, r in enumerate(rungs, 1):
        test, kind, ctx, how, note = r
        s = {'n': i, 'test': test, 'how': list(how), 'ctx': ctx, 'kind': kind}
        if note:
            s['note'] = note
        out.append(s)
    return out


def put(d, tid, *, cid=None, name=None, line=None, size=None, about=None,
        after=None, rungs=None, place=None, frm=None, strand=None, twist=None):
    """Rewrite a ladder in place, or create it in category `cid`."""
    try:
        t = track(d, tid)
    except KeyError:
        t = {'id': tid}
        cat(d, cid or tid.split('.')[0])['tracks'].append(t)
    if name: t['name'] = name
    if line: t['line'] = line
    if size: t['size'] = size
    if about: t['about'] = about
    if strand: t['strand'] = strand
    if frm is not None: t['from'] = frm
    if after is not None:
        if after: t['after'] = after
        else: t.pop('after', None)
    if place is not None:
        if place: t['place'] = place
        else: t.pop('place', None)
    if rungs is not None:
        old = {s['n']: s for s in t.get('steps', [])}
        t['steps'] = steps(rungs)
        # carry a hand-written twist forward only where the rung still means the same thing
        for s in t['steps']:
            o = old.get(s['n'])
            if o and o.get('twist') and twist is not False and o.get('test') == s['test']:
                s['twist'] = o['twist']
    return t


def report(d, tids):
    for tid in tids:
        t = track(d, tid)
        n = sum(1 for s in t['steps'] if s.get('note'))
        print(f"  {tid:16s} {len(t['steps']):2d} rungs  {n:2d} notes  about={'y' if t.get('about') else 'n'}  {t['name']}")
