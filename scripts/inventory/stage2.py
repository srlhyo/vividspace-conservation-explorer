"""Stage 2: merge agent-verified national areas, locate them (official or Wikidata CC0), add World Heritage."""
import json, re, os, sys, difflib, glob
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
IN = f'{HERE}/inputs'                                     # committed inputs
RESEARCH = f'{ROOT}/docs/inventory/research'              # committed country research
WORK = sys.argv[1]                                        # temporary directory for intermediate files
sys.path.insert(0, HERE)
from norm import core, same, similar, slug, ascii
from access import accessed
cat = json.load(open(f'{WORK}/stage1.json'))
NAMES = {c['code']: c['name'] for c in cat['countries']}
OVR = json.load(open(f'{IN}/overrides.json'))
ACCEPT = {tuple(x) for x in OVR.get('acceptWikidata', [])}      # (code, area name, qid)
REJECT = {tuple(x) for x in OVR.get('rejectWikidata', [])}
# (code, area name, text in the area's notes, qid): disambiguates areas that share a name.
REJECT_NOTE = [tuple(x) for x in OVR.get('rejectWikidataWhereNote', [])]
def rejected(code, a, qid):
    return (code, a['name'], qid) in REJECT or any(c == code and n == a['name'] and t in (a.get('notes') or '') and q == qid for c, n, t, q in REJECT_NOTE)
MERGE = {tuple(x[:2]): x[2] for x in OVR.get('merge', [])}      # (code, area name) -> territory id
NOMERGE = {tuple(x) for x in OVR.get('noMerge', [])}             # (code, area name, territory id)
OVERLAP = {tuple(x[:2]): x[2] for x in OVR.get('overlap', [])}  # (code, area name) -> overlapping territory id
from geo import inside

# Wikidata items per country (CC0): qid -> labels, points, types
WD = {}
for f in sorted(glob.glob(f'{IN}/wikidata/*.json')):
    code = os.path.basename(f)[:3]
    items = WD.setdefault(code, {})
    for r in json.load(open(f)):
        q = r['i']['value'].rsplit('/', 1)[1]
        it = items.setdefault(q, dict(qid=q, labels=set(), points=[], types=r.get('typeLabels', {}).get('value', ''), ramsar=r.get('ramsarId', {}).get('value'), whs=r.get('whsId', {}).get('value')))
        for k in ('label', 'labelFr', 'labelPt'):
            if r.get(k): it['labels'].add(r[k]['value'])
        if r.get('coord'):
            m = re.match(r'Point\(([-\d.eE]+) ([-\d.eE]+)\)', r['coord']['value'])
            if m:
                p = (float(m.group(1)), float(m.group(2)))
                if p not in it['points']: it['points'].append(p)

# Extra candidates from the name-search fallback (items in the right country with a coordinate).
for key, cands in json.load(open(f'{IN}/wikidata-name-search.json')).items():
    code = key.split('|', 1)[0]
    for c in cands:
        # Settlements and administrative units are too coarse to stand in for a protected area.
        if re.search(r'\b(village|town|city|settlement|district|municipality|commune|region|province)\b', c.get('description') or '', re.I): continue
        it = WD.setdefault(code, {}).setdefault(c['qid'], dict(qid=c['qid'], labels=set(), points=[], types='(name search) ' + (c.get('description') or ''), ramsar=None, whs=None))
        it['labels'] |= set(c['labels'])
        for p in c['points']:
            if tuple(p) not in it['points']: it['points'].append(tuple(p))

QCACHE = json.load(open(f'{IN}/wikidata-items.json'))
COUNTRY_Q = dict(AGO='Q916', BWA='Q963', NAM='Q1030', TZA='Q924', MOZ='Q1029', UGA='Q1036', EGY='Q79', GAB='Q1000', STP='Q1039',
                 BEN='Q962', CPV='Q1011', CIV='Q1008', GMB='Q1005', GHA='Q117', GIN='Q1006', GNB='Q1007', LBR='Q1014', MRT='Q1025',
                 NGA='Q1033', SEN='Q1041', SLE='Q1044', TGO='Q945', CMR='Q1009', COG='Q971', COD='Q974')
def agent_qid_item(code, q):
    """An agent-verified QID, from the per-country query results or the direct lookup cache."""
    if q in WD.get(code, {}): return WD[code][q]
    e = QCACHE.get(q)
    if e and COUNTRY_Q[code] in e['countries']:
        return dict(qid=q, labels=set(e['labels']), points=[tuple(p) for p in e['points']], types='', ramsar=None, whs=None)
    return None

def wd_point(code, it):
    pts = [p for p in it['points'] if inside(code, *p)]
    return pts[0] if pts else None

def wd_candidates(code, names):
    exact, fuzzy = [], []
    for it in WD.get(code, {}).values():
        if not it['points']: continue
        labels = sorted(it['labels'])
        if any(same(n, lab) for n in names for lab in labels): exact.append(it); continue
        scores = [difflib.SequenceMatcher(None, ' '.join(core(n)), ' '.join(core(lab))).ratio() for lab in labels if core(lab) for n in names if core(n)]
        if scores and max(scores) >= 0.84: fuzzy.append((max(scores), it))
    return exact, sorted(fuzzy, key=lambda x: -x[0])

src_ids = {s['id'] for s in cat['sources']}
def add_source(s):
    if s['id'] in src_ids: return
    cat['sources'].append(s); src_ids.add(s['id'])
def named_feature(it): return it['types'].startswith('(name search)')
def wikidata_source(it, name, code):
    sid = f"wikidata-{it['qid'].lower()}"
    label = sorted(it['labels'])[0] if it['labels'] else name
    title = (f"{label} ({it['qid']}: {it['types'].replace('(name search) ', '') or 'named feature'}) — coordinate location" if named_feature(it)
             else f"{name} ({it['qid']}) — coordinate location")
    add_source(dict(id=sid, title=title, publisher='Wikidata', url=f"https://www.wikidata.org/wiki/{it['qid']}",
                    licence='CC0 1.0', licenceUrl='https://creativecommons.org/publicdomain/zero/1.0/', accessed=accessed(code), kind='dataset'))
    return sid

DESIG = {'national-park': 'national-park', 'nature-reserve': 'nature-reserve', 'marine-protected-area': 'marine-protected-area',
         'game-reserve': 'wildlife-reserve', 'forest-reserve': 'forest-reserve', 'community-conservation-area': 'community-protected-area',
         'other-protected-area': 'other-protected-area'}
CATEGORY = {'game-reserve': 'wildlife-reserve'}
NATIONAL = set(DESIG)

review, uncatalogued, report = [], [], {}
terr_by_country = {}
for t in cat['territories']: terr_by_country.setdefault(t['countryCode'], []).append(t)
used_ids = {t['id'] for t in cat['territories']}

def names_of(t): return [x for x in (t['name'], t.get('shortName'), t.get('localName')) if x]

for path in sorted(glob.glob(f'{RESEARCH}/*.json')):
    d = json.load(open(path)); code = d['country']
    srcmap = {}
    for s in d['sources']:
        sid = s['id']
        if sid in src_ids and next(x for x in cat['sources'] if x['id'] == sid)['url'] != s['url']: sid = f'{sid}-{code.lower()}'
        srcmap[s['id']] = sid
        note = ' '.join(x for x in [f"Dated {s['date']}." if s.get('date') else None, s.get('note')] if x) or None
        # Verified to serve the same documents over HTTPS (2026-10-20).
        url = s['url'].replace('http://inbac.gov.ao/', 'https://inbac.gov.ao/')
        add_source({k: v for k, v in dict(id=sid, title=s['title'], publisher=s['publisher'], url=url,
                    licence=s.get('licence') or f"© {s['publisher']} — cited for reference (facts and short quotes)", accessed=accessed(code),
                    kind=s.get('kind') if s.get('kind') in ('webpage', 'report', 'dataset', 'article') else 'webpage', note=note).items() if v})
    sdate = {srcmap[s['id']]: s.get('date') for s in d['sources']}
    pub = {srcmap[s['id']]: s['publisher'] for s in d['sources']}
    R = report.setdefault(code, dict(listed=0, merged=[], created=[], unmapped=[], proposed=0))
    for a in d['areas']:
        R['listed'] += 1
        sids = [srcmap.get(x, x) for x in a.get('sourceIds', []) if srcmap.get(x, x) in src_ids]
        if not sids: review.append(f'{code} NO SOURCE {a["name"]}'); continue
        catg = CATEGORY.get(a['category'], a['category'])
        names = [x for x in (a['name'], a.get('localName')) if x]
        legal = None
        if a.get('legalStatus') and a['legalStatus'].get('text'):
            lsids = [srcmap.get(x, x) for x in a['legalStatus'].get('sourceIds', []) if srcmap.get(x, x) in src_ids] or sids
            text = a['legalStatus']['text'].strip().rstrip('.') + '.'
            legal = dict(text=text[0].upper() + text[1:], evidence='verified', sourceIds=lsids)
        publishers = '; '.join(dict.fromkeys(pub.get(x, x) for x in sids))
        listed = f"Listed as “{a['designationLabel']}” by {publishers}." if a.get('designationLabel') else f'Listed by {publishers}.'
        # 1) Same area already catalogued?
        overlap_with = next((t for t in cat['territories'] if t['id'] == OVERLAP[(code, a['name'])]), None) if (code, a['name']) in OVERLAP else None
        target = None
        if (code, a['name']) in MERGE: target = next(t for t in cat['territories'] if t['id'] == MERGE[(code, a['name'])])
        elif overlap_with: pass
        else:
            for t in terr_by_country.get(code, []):
                if (code, a['name'], t['id']) in NOMERGE: continue
                if any(same(n, m) for n in names for m in names_of(t)): target = t; break
                if any(similar(n, m) for n in names for m in names_of(t)): review.append(f'{code} SIMILAR? "{a["name"]}" ~ {t["id"]} "{t["name"]}"')
        if target and (code, a['name']) not in MERGE:
            # Same name but clearly different extent (documented areas differ by more than 2x): keep separate, linked as overlapping.
            m = re.search(r'listed area of ([\d,.]+) ha', ' '.join(s_['text'] for s_ in target['overview']))
            if m and a.get('areaKm2'):
                ratio = (float(m.group(1).replace(',', '')) / 100) / float(a['areaKm2'])
                if not 0.5 <= ratio <= 2:
                    review.append(f'{code} OVERLAP (area ratio {ratio:.1f}) "{a["name"]}" vs {target["id"]}')
                    overlap_with, target = target, None
        if target:
            if catg in NATIONAL and not any(x['designationId'] == DESIG[a['category']] for x in target['designations']):
                target['designations'].append(dict(designationId=DESIG[a['category']], sourceIds=sids))
            if catg != 'proposed' and target['inventory']['category'] in ('international-designation',):
                target['inventory']['category'] = catg
            if legal and not target['inventory'].get('legalStatus'): target['inventory']['legalStatus'] = legal
            target['overview'].append(dict(text=listed, evidence='verified', sourceIds=sids))
            target['verification']['note'] += f" National designation from {publishers}."
            R['merged'].append(f"{a['name']} → {target['id']}")
            review.append(f'{code} MERGE "{a["name"]}" → {target["id"]} "{target["name"]}"')
            continue
        # 2) Locate: official coordinates, agent QID, or a reviewed Wikidata name match.
        point, psrc, how = None, None, None
        if a.get('coordinates'):
            point = (a['coordinates']['lon'], a['coordinates']['lat']); psrc = srcmap.get(a['coordinates']['sourceId'], a['coordinates']['sourceId']); how = 'official'
        else:
            exact, fuzzy = wd_candidates(code, names)
            pick = None
            q = a.get('wikidataQid')
            if q: pick = agent_qid_item(code, q)
            accepted = [it for it in WD.get(code, {}).values() if (code, a['name'], it['qid']) in ACCEPT]
            if accepted: pick = accepted[0]
            elif not pick:
                exact = [it for it in exact if not rejected(code, a, it['qid'])]
                if len(exact) == 1: pick = exact[0]
                elif len(exact) > 1: review.append(f'{code} AMBIGUOUS "{a["name"]}": ' + ', '.join(f"{it['qid']} {sorted(it['labels'])[:2]}" for it in exact))
                for sc, it in fuzzy[:3]:
                    if it is not pick and (code, a['name'], it['qid']) not in REJECT:
                        review.append(f'{code} FUZZY {sc:.2f} "{a["name"]}" ~ {it["qid"]} {sorted(it["labels"])[:3]} [{it["types"][:40]}]')
            if pick:
                p = wd_point(code, pick)
                if p: point, psrc, how = p, wikidata_source(pick, a['name'], code), ('feature' if named_feature(pick) else 'wikidata')
                else: review.append(f'{code} OUTSIDE "{a["name"]}" {pick["qid"]} {pick["points"]}')
        if not point:
            uncatalogued.append(dict(country_code=code, name=a['name'], local_name=a.get('localName'), category=catg, designation=a.get('designationLabel'),
                                     legal_status=legal['text'] if legal else None, established=a.get('established'), area_km2=a.get('areaKm2'), wikidata_qid=a.get('wikidataQid'), status='verified in official or authoritative source; no openly licensed location found',
                                     source_ids='; '.join(sids), source_urls='; '.join(next(s['url'] for s in cat['sources'] if s['id'] == x) for x in sids), notes=a.get('notes')))
            R['unmapped'].append(a['name']); continue
        tid = f"pa-{code.lower()}-{slug(a['name'])}"
        while tid in used_ids: tid += '-2'
        used_ids.add(tid)
        dates = [sdate.get(x) for x in sids if sdate.get(x)]
        caveat = {'official': 'Shown at coordinates given by the cited official source; the boundary is not shown.',
                  'wikidata': 'Approximate reference point from Wikidata (CC0), not checked against an official map; the boundary is not shown.',
                  'feature': 'Approximate point of the feature this area is named after (from Wikidata, CC0), not of the protected area itself; the boundary is not shown.'}[how]
        overview = [dict(text=listed, evidence='verified', sourceIds=sids)]
        if a.get('established') and not (legal and str(a['established'])[:4] in legal['text']):
            overview.append(dict(text=f"Established {a['established']}, according to the cited sources.", evidence='verified', sourceIds=sids))
        note = (f"Name and designation from {publishers}. " + {'official': 'Location from the cited official source. ', 'wikidata': 'Location is an approximate point from Wikidata, not an official boundary or centroid. ',
                   'feature': 'Location is the Wikidata point of the feature the area is named after, used as an approximation; the protected area itself has no openly licensed location. '}[how]
                + (f"Research note: {a['notes'].strip()} " if a.get('notes') else '') + 'No conservation challenge, organisation or potential activity has been researched for this area.')
        t = dict(id=tid, name=a['name'])
        if a.get('localName'): t['localName'] = a['localName']
        t.update(kind='community-protected-area' if catg == 'community-conservation-area' else 'protected-area', countryCode=code,
                 location=dict(description=f'{NAMES[code]}.', descriptionSourceIds=sids, point=[round(point[0], 5), round(point[1], 5)], pointSourceId=psrc),
                 geometry=dict(representation='point', sourceId=psrc, caveat=caveat),
                 designations=[dict(designationId=DESIG[a['category']], sourceIds=sids)] if a['category'] in DESIG else [],
                 overview=overview, livelihoods=[], ecosystems=[],
                 verification=dict(status='partially-verified', reviewed=accessed(code), note=note.strip()),
                 inventory={k: v for k, v in dict(category=catg, legalStatus=legal, sourceDate=dates[0] if dates else None,
                                                   overlaps=[overlap_with['id']] if overlap_with else None).items() if k == 'legalStatus' or v})
        # Not added to terr_by_country: areas listed separately by the same source are distinct areas.
        cat['territories'].append(t)
        R['created'].append(a['name'])
        if catg == 'proposed': R['proposed'] += 1

json.dump(cat, open(f'{WORK}/stage2.json', 'w'), ensure_ascii=False, indent=1)
json.dump(uncatalogued, open(f'{WORK}/uncatalogued.json', 'w'), ensure_ascii=False, indent=1)
json.dump(report, open(f'{WORK}/stage2-report.json', 'w'), ensure_ascii=False, indent=1)
open(f'{WORK}/stage2-review.txt', 'w').write('\n'.join(review))
for c, r in report.items(): print(c, 'listed', r['listed'], 'merged', len(r['merged']), 'created', len(r['created']), 'unmapped', len(r['unmapped']))
print('review lines', len(review))
