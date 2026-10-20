"""Stage 3: biosphere reserves (UNESCO pages), World Heritage designations, country inventory status, final assembly."""
import json, re, os, sys, glob, csv
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
IN = f'{HERE}/inputs'                                     # committed inputs
RESEARCH = f'{ROOT}/docs/inventory/research'              # committed country research
WORK = sys.argv[1]                                        # temporary directory for intermediate files
OUT_CAT = f'{ROOT}/public/data/catalogue.json'
OUT_CSV = f'{ROOT}/docs/inventory/uncatalogued-areas.csv'
sys.path.insert(0, HERE)
from norm import similar, same, core
A = '2026-10-20'
cat = json.load(open(f'{WORK}/stage2.json'))
report = json.load(open(f'{WORK}/stage2-report.json'))
unc = json.load(open(f'{WORK}/uncatalogued.json'))
T = {t['id']: t for t in cat['territories']}
NAMES = {c['code']: c['name'] for c in cat['countries']}
src_ids = {s['id'] for s in cat['sources']}
def add_source(s):
    if s['id'] not in src_ids: cat['sources'].append(s); src_ids.add(s['id'])
UNESCO_TERMS = dict(licence='© UNESCO — cited for reference (facts and short quotes)', licenceUrl='https://www.unesco.org/en/terms-use')
COUNTRY_BY_NAME = {v: k for k, v in NAMES.items()} | {'Gambia': 'GMB', 'United Republic of Tanzania': 'TZA', 'Sao Tome and Principe': 'STP', "Cote d'Ivoire": 'CIV', 'Guinea Bissau': 'GNB', 'Cabo Verde': 'CPV', 'Cape Verde': 'CPV'}
from geo import inside

# --- Biosphere reserves --------------------------------------------------------------------
EXISTING_MAB = {'mono': 'mono-biosphere-reserve', 'bolama-bijagos': 'bijagos-archipelago'}
added_mab = []
# Facts from each UNESCO MAB page (biosphere-reserves.json): title, year, country, area, reference point.
for mab in json.load(open(f'{IN}/biosphere-reserves.json')):
    slug, title, year, area = mab['slug'], mab['title'], mab['year'], mab['area_ha']
    cname = mab['country']
    countries = [COUNTRY_BY_NAME[cname]] if cname in COUNTRY_BY_NAME else [COUNTRY_BY_NAME.get(c.strip()) for c in re.split(r',| and ', cname)]
    countries = [c for c in countries if c]
    lat, lon = mab['lat'], mab['lon']
    sid = f'unesco-mab-{slug}'
    if slug == 'delta-du-saloum' and 'unesco-mab-saloum' in src_ids: sid = 'unesco-mab-saloum'
    if slug == 'mono' and 'unesco-mab-mono' in src_ids: sid = 'unesco-mab-mono'
    add_source(dict(id=sid, title=f'{title} — biosphere reserve', publisher='UNESCO Man and the Biosphere Programme', url=f'https://www.unesco.org/en/mab/{slug}', accessed=A, kind='webpage', **UNESCO_TERMS))
    fact = dict(text=f"Designated a UNESCO biosphere reserve in {year}" + (f", with a listed area of {area} ha." if area else '.'), evidence='verified', sourceIds=[sid])
    # Already catalogued as a biosphere reserve?
    existing = EXISTING_MAB.get(slug) or next((t['id'] for t in cat['territories'] if t['countryCode'] in countries and any(d['designationId'] == 'biosphere-reserve' for d in t['designations']) and similar(title, t['name'])), None)
    if existing:
        t = T[existing]
        for d in t['designations']:
            if d['designationId'] == 'biosphere-reserve' and sid not in d['sourceIds']: d['sourceIds'].append(sid)
        continue
    code = next((c for c in countries if inside(c, lon, lat)), None)
    if not code: print('MAB point outside listed countries', slug, countries, lon, lat); continue
    overlaps = [t['id'] for t in cat['territories'] if t['countryCode'] in countries and t.get('inventory', {}).get('category') != 'context' and not t['id'].startswith('mab-') and (similar(title, t['name']) or similar(title, t.get('localName') or ''))]
    tid = f'mab-{slug}'
    t = dict(id=tid, name=f'{title} Biosphere Reserve', kind='protected-area', countryCode=code,
             location=dict(description=f"{', '.join(NAMES[c] for c in countries)}.", descriptionSourceIds=[sid], point=[round(lon, 5), round(lat, 5)], pointSourceId=sid),
             geometry=dict(representation='point', sourceId=sid, caveat='Shown at the reference coordinates given by UNESCO; the biosphere reserve and its zones are not shown.'),
             designations=[dict(designationId='biosphere-reserve', sourceIds=[sid])], overview=[fact], livelihoods=[], ecosystems=[],
             verification=dict(status='partially-verified', reviewed=A, note='Name, year, area and reference location from UNESCO. A biosphere reserve is a zoned landscape whose core areas are usually national protected areas, so it overlaps them and is not counted as a separate legally designated area. No conservation challenge, organisation or potential activity has been researched for it.'),
             inventory={k: v for k, v in dict(category='international-designation', legalStatus=None, sourceDate=year, overlaps=overlaps or None).items() if k == 'legalStatus' or v})
    if len(countries) > 1: t['verification']['note'] = f"Transboundary reserve shared by {', '.join(NAMES[c] for c in countries)}; listed under {NAMES[code]}, where UNESCO's reference point lies. " + t['verification']['note']
    cat['territories'].append(t); T[tid] = t; added_mab.append((tid, overlaps))
print('biosphere reserves added', len(added_mab))
for x in added_mab: print('  ', x)

# --- World Heritage ------------------------------------------------------------------------------
WHS_TARGETS = {1432: ['ramsar-879'], 1430: ['pa-nam-namib-naukluft-park'], 403: ['pa-tza-kilimanjaro-national-park'], 199: ['pa-tza-selous-game-reserve'],
    156: ['pa-tza-serengeti-national-park'], 39: ['pa-tza-ngorongoro-conservation-area'], 914: ['pa-moz-parque-nacional-de-maputo'],
    682: ['pa-uga-bwindi-impenetrable-national-park'], 684: ['ramsar-1861'], 1186: ['ramsar-2041'], 1653: ['pa-gab-parc-national-de-l-ivindo'],
    1147: ['pa-gab-parc-national-de-la-lope'], 749: ['pa-ben-parc-national-de-la-pendjari', 'pa-ben-parc-national-du-w-benin'], 227: ['pa-civ-parc-national-de-la-comoe'],
    155: ['pa-civ-reserve-naturelle-integrale-du-mont-nimba', 'pa-gin-reserve-naturelle-integrale-des-monts-nimba'], 195: ['pa-civ-parc-national-de-tai'],
    1431: ['bijagos-archipelago'], 506: ['ramsar-250'], 25: ['ramsar-138'], 153: ['pa-sen-parc-national-du-niokolo-koba'],
    1746: ['pa-sle-tiwai-island-wildlife-sanctuary', 'pa-sle-gola-rainforest-national-park']}
PART = {1430, 1186, 749, 1746, 914, 1147}  # the property and the catalogued area differ in extent
whs_missing = []
for w in json.load(open(f'{IN}/world-heritage.json')):
    sid = f"unesco-whc-{w['id']}"
    add_source(dict(id=sid, title=f"{w['title']} — World Heritage List", publisher='UNESCO World Heritage Centre', url=f"https://whc.unesco.org/en/list/{w['id']}/", accessed=A, kind='webpage', **UNESCO_TERMS))
    targets = [x for x in WHS_TARGETS.get(w['id'], []) if x in T]
    if not targets: whs_missing.append(w['title']); continue
    for tid in targets:
        t = T[tid]
        if not any(d['designationId'] == 'world-heritage' for d in t['designations']):
            t['designations'].append(dict(designationId='world-heritage', sourceIds=[sid]))
        else:
            for d in t['designations']:
                if d['designationId'] == 'world-heritage' and sid not in d['sourceIds']: d['sourceIds'].append(sid)
        text = f"Inscribed on the World Heritage List in {w['inscribed']} as a {w['category']} property (“{w['title']}”)" + (', which covers a different extent from this area' if w['id'] in PART else '') + '.'
        if w.get('danger'): text += ' UNESCO lists it as World Heritage in Danger.'
        if not any(sid in s['sourceIds'] for s in t['overview']): t['overview'].append(dict(text=text, evidence='verified', sourceIds=[sid]))
print('WHS without catalogued target:', whs_missing)

# --- Record type and categories ------------------------------------------------------------
NATIONAL = {'national-park', 'nature-reserve', 'marine-protected-area', 'wildlife-reserve', 'forest-reserve', 'other-protected-area'}
for t in cat['territories']:
    c = t['inventory']['category']
    if t['kind'] == 'ramsar-site' and c in NATIONAL: t['kind'] = 'protected-area'
    if t['kind'] == 'ramsar-site' and c == 'community-conservation-area': t['kind'] = 'community-protected-area'

# --- Country inventory -------------------------------------------------------------------
agents = {os.path.basename(p)[:3]: json.load(open(p)) for p in sorted(glob.glob(f'{RESEARCH}/*.json'))}
srcurl = {s['url']: s['id'] for s in cat['sources']} | {s['url'].replace('https://inbac.gov.ao/', 'http://inbac.gov.ao/'): s['id'] for s in cat['sources']}
for c in cat['countries']:
    code = c['code']; d = agents.get(code); r = report.get(code, {})
    terrs = [t for t in cat['territories'] if t['countryCode'] == code and t['inventory']['category'] != 'context']
    ramsar = sum(1 for t in terrs if any(x['designationId'] == 'ramsar' for x in t['designations']))
    if not d:
        c['inventory'] = dict(status='partial', summary='No national protected-area inventory was researched.', sourceIds=[], officialCounts=[], gaps=['National inventory not researched.'])
        continue
    # agent source ids were remapped in stage 2 only on collision; resolve by URL
    amap = {s['id']: srcurl.get(s['url'], s['id']) for s in d['sources']}
    listed = r.get('listed', 0); merged = len(r.get('merged', [])); created = len(r.get('created', [])); unmapped = len(r.get('unmapped', []))
    summary = (d['officialInventory']['summary'].strip() + f" Comparison: the sources reviewed list {listed} nationally designated or proposed areas; {created + merged} are catalogued here"
               + (f" ({merged} as an extra designation on an already catalogued area)" if merged else '') + f", and {unmapped} are verified but not yet mapped because no openly licensed location was found."
               + f" The catalogue also holds {ramsar} Ramsar site{'s' if ramsar != 1 else ''} for this country. Coverage has not been verified as exhaustive.")
    gaps = list(d.get('gaps', []))
    for n in d.get('notEnumerated', []):
        gaps.append(f"Not enumerated: {n['category']}" + (f" (about {n['approxCount']})" if n.get('approxCount') else '') + f" — {n['reason']}")
    if unmapped: gaps.append(f"{unmapped} verified area{'s' if unmapped != 1 else ''} not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.")
    gaps.append('WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.')
    counts = [dict({k: v for k, v in dict(category=n['category'], count=n['count'], asOf=str(n['asOf']) if n.get('asOf') else None).items() if v is not None}, sourceId=amap.get(n['sourceId'], n['sourceId']))
              for n in d['officialInventory'].get('statedCounts', []) if isinstance(n.get('count'), int) and amap.get(n['sourceId'], n['sourceId']) in src_ids]
    c['inventory'] = dict(status='partial', summary=summary, sourceIds=[amap.get(x, x) for x in d['officialInventory'].get('sourceIds', []) if amap.get(x, x) in src_ids], officialCounts=counts, gaps=gaps)

cat['meta']['version'] = '0.5.0'; cat['meta']['updated'] = A
cat['meta']['description'] = ('Demonstration dataset covering the 13 West Africa Sustainable Ocean Programme (WASOP) countries and 9 additional African countries. '
    'It combines detailed Guinea-Bissau research (Bijagós Archipelago, Cacheu region, Cantanhez), researched challenges and potential activities for one area in each other WASOP country, '
    'and a partial, source-checked protected-area inventory for all 22 countries: nationally designated areas from national authorities and legal texts, Ramsar sites, World Heritage properties and biosphere reserves. '
    'No country inventory has been verified as exhaustive. Every factual statement cites a publicly accessible source that was checked on the access date shown. '
    'Potential regenerative activities are presented as interpretations or hypotheses, never as validated businesses.')
json.dump(cat, open(OUT_CAT, 'w'), ensure_ascii=False, indent=1)
os.makedirs(os.path.dirname(OUT_CSV), exist_ok=True)
# record_id follows the catalogue's id pattern and is unique across the catalogue and this list.
from norm import slug
taken = set(T) | {t['id'] for t in cat['territories']}
for row in unc:
    rid = f"pa-{row['country_code'].lower()}-{slug(row['name'])}"
    while rid in taken: rid += '-2'
    taken.add(rid); row['record_id'] = rid
cols = ['record_id', 'country_code', 'name', 'local_name', 'category', 'designation', 'legal_status', 'established', 'area_km2', 'wikidata_qid', 'status', 'source_ids', 'source_urls', 'notes']
with open(OUT_CSV, 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.DictWriter(f, fieldnames=cols); w.writeheader()
    for row in sorted(unc, key=lambda x: (x['country_code'], x['name'])): w.writerow({k: row.get(k) for k in cols})
print('territories', len(cat['territories']), 'sources', len(cat['sources']), 'uncatalogued', len(unc))
