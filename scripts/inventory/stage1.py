"""Stage 1: countries, vocabularies, inventory metadata for existing records, and all Ramsar sites."""
import json, re, os, sys, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
IN = f'{HERE}/inputs'                                     # committed inputs
RESEARCH = f'{ROOT}/docs/inventory/research'              # committed country research
WORK = sys.argv[1]                                        # temporary directory for intermediate files
A = '2026-10-20'
cat = json.load(open(f'{IN}/base-catalogue.json'))
ramsar = json.load(open(f'{IN}/ramsar-sites.json'))

NEW = [('AGO', 'Angola'), ('BWA', 'Botswana'), ('EGY', 'Egypt'), ('GAB', 'Gabon'), ('MOZ', 'Mozambique'), ('NAM', 'Namibia'),
       ('STP', 'São Tomé and Príncipe'), ('TZA', 'Tanzania'), ('UGA', 'Uganda')]
for c in cat['countries']: c['group'] = 'wasop'
cat['countries'] += [dict(code=k, name=n, group='additional') for k, n in NEW]
NAMES = {c['code']: c['name'] for c in cat['countries']}

cat['designationTypes'] += [
  dict(id='nature-reserve', name='Nature reserve', description='A nationally designated nature, strict nature or natural reserve.'),
  dict(id='marine-protected-area', name='Marine protected area', description='A nationally designated protected area covering marine or coastal waters.'),
  dict(id='wildlife-reserve', name='Wildlife or game reserve', description='A nationally designated wildlife, faunal or game reserve, or a wildlife sanctuary.'),
  dict(id='forest-reserve', name='Forest reserve', description='A nationally designated forest reserve or classified forest.'),
  dict(id='other-protected-area', name='Other protected area', description='Another nationally designated protected-area category, such as a protected landscape, conservation area or protectorate.'),
]
cat['ecosystems'] += [
  dict(id='lakes', name='Lakes', definition='Permanent or seasonal bodies of standing fresh or saline water inland.'),
  dict(id='floodplains', name='Floodplains', definition='Land beside rivers that is seasonally flooded, including flooded grasslands.'),
  dict(id='marshes-swamps', name='Marshes and swamps', definition='Freshwater wetlands dominated by herbaceous plants (marshes) or trees (swamps), such as papyrus or reed beds.'),
]

# Inventory metadata for existing records. Legal status is left undocumented here; it is added
# later only where a cited source documents it.
EXISTING_CATEGORY = {'bijagos-archipelago': 'international-designation', 'cacheu-region': 'context',
                     'mono-biosphere-reserve': 'international-designation', 'urok-community-mpa': 'community-conservation-area'}
for t in cat['territories']:
    ds = {d['designationId'] for d in t['designations']}
    cat_ = EXISTING_CATEGORY.get(t['id']) or ('national-park' if 'national-park' in ds else 'community-conservation-area' if 'community-protected-area' in ds else 'international-designation')
    t['inventory'] = dict(category=cat_, legalStatus=None)

def ramsar_number(t):
    m = re.match(r'ramsar-(\d+)$', t['id'])
    return int(m.group(1)) if m else {'bijagos-archipelago': 2198, 'cacheu-mangroves-park': 2229}.get(t['id'])
present = {ramsar_number(t): t for t in cat['territories'] if ramsar_number(t)}
by_number = {s['number']: s for s in ramsar}
for n, t in present.items():
    s = by_number.get(n)
    if s: t['inventory']['sourceDate'] = s['designated'].replace('-', '/') and datetime.datetime.strptime(s['designated'], '%d-%m-%Y').strftime('%Y-%m-%d')

ISO2 = dict(BEN='bj', CPV='cv', CIV='ci', GMB='gm', GHA='gh', GIN='gn', GNB='gw', LBR='lr', MRT='mr', NGA='ng', SEN='sn', SLE='sl', TGO='tg',
            AGO='ao', BWA='bw', NAM='na', TZA='tz', MOZ='mz', UGA='ug', EGY='eg', GAB='ga', STP='st')
FILES = dict(BEN='Benin', CPV='Cabo-Verde', CIV='Cote-d-Ivoire', GMB='Gambia', GHA='Ghana', GIN='Guinea', GNB='Guinea-Bissau', LBR='Liberia',
             MRT='Mauritania', NGA='Nigeria', SEN='Senegal', SLE='Sierra-Leone', TGO='Togo', AGO='Angola', BWA='Botswana', NAM='Namibia',
             TZA='United-Republic-of-Tanzania', MOZ='Mozambique', UGA='Uganda', EGY='Egypt', GAB='Gabon', STP='Sao-Tome-and-Principe')
src_ids = {s['id'] for s in cat['sources']}
def ramsar_source(code):
    sid = f'ramsar-annotated-{ISO2[code]}'
    if sid not in src_ids:
        cat['sources'].append(dict(id=sid, title=f'Annotated List of Wetlands of International Importance — {NAMES[code]}', publisher='Ramsar Convention Secretariat (RSIS)',
            url=f'https://rsis.ramsar.org/sites/default/files/rsiswp_search/exports/Ramsar-Sites-annotated-summary-{FILES[code]}.pdf',
            licence='© Ramsar Convention Secretariat — cited for reference (facts and short quotes)', accessed=A, kind='report',
            note='Some site-header coordinates in this export are erroneous; affected records say which coordinates are used.'))
        src_ids.add(sid)
    return sid

# Habitat terms found in each Ramsar site summary (`habitatTerms` in ramsar-sites.json; the matching
# patterns are listed in README.md). FALSE holds matches reviewed as false (e.g. a bird's name).
ECO = [('mangrove', 'mangroves'), ('intertidal-flats', 'intertidal or tidal flats'), ('seagrass', 'seagrass'),
       ('estuarine', 'estuarine waters or a river delta'), ('coastal-lagoon', 'lagoons'), ('sandy-beaches', 'beaches'),
       ('shallow-marine', 'marine waters'), ('lakes', 'lakes'), ('floodplains', 'floodplains or seasonally flooded land'),
       ('marshes-swamps', 'marshes or swamps')]
FALSE = {(1840, 'estuarine'), (2182, 'sandy-beaches'), (338, 'estuarine')}
FALSE |= set(tuple(x) for x in json.load(open(f'{IN}/eco-false.json')))
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
def month(d):  # '24-01-2000' -> '24 January 2000', independent of the system locale
    dt = datetime.datetime.strptime(d, '%d-%m-%Y')
    return f'{dt.day} {MONTHS[dt.month - 1]} {dt.year}'
added = []
for s in ramsar:
    n, code = s['number'], s['code']
    if n in present or not s.get('coordSource'): continue
    src = ramsar_source(code)
    ecos = []
    for eid, words in ECO:
        if eid in s['habitatTerms'] and (n, eid) not in FALSE:
            ecos.append(dict(ecosystemId=eid, text=f"Ramsar's site summary mentions {words}.", evidence='verified', sourceIds=[src]))
    nm = s['name']
    desig = [dict(designationId='ramsar', sourceIds=[src])]
    category = 'international-designation'
    if re.search(r'parc national|national park|parque nacional', nm, re.I):
        desig.append(dict(designationId='national-park', sourceIds=[src])); category = 'national-park'
    region = s['region'] if s['region'] and len(s['region']) <= 80 else ''
    coord_note = (f"Ramsar's site-header coordinates ({s['headerCoords']}) are erroneous; the coordinates given in the site description ({s['coords']}) are used."
                  if s['coordSource'] == 'description' else None)
    t = dict(id=f'ramsar-{n}', name=nm)
    if len(nm) > 30 and ',' in nm: t['shortName'] = nm.split(',')[0].strip()
    t.update(kind='ramsar-site', countryCode=code,
        location=dict(description=(f'{region}, {NAMES[code]} (administrative area as listed by Ramsar).' if region else f'{NAMES[code]}.'),
                      descriptionSourceIds=[src], point=[round(s['lon'], 5), round(s['lat'], 5)], pointSourceId=src),
        geometry=dict(representation='point', sourceId=src, caveat='Shown at reference coordinates only; the Ramsar site boundary is not shown.'),
        designations=desig,
        overview=[dict(text=f"Designated a Wetland of International Importance (Ramsar site no. {n}) on {month(s['designated'])}, with a listed area of {s['area_ha']} ha.", evidence='verified', sourceIds=[src])],
        livelihoods=[], ecosystems=ecos,
        verification=dict(status='partially-verified', reviewed=A,
            note=' '.join(x for x in ["Name, designation date, area and location come from Ramsar's official annotated list, and habitats are those named in its site summary.", coord_note,
                  'National protected-area status is not recorded here unless a national source documents it. No conservation challenge, organisation or potential activity has been researched for this site.'] if x)),
        inventory=dict(category=category, legalStatus=None, sourceDate=datetime.datetime.strptime(s['designated'], '%d-%m-%Y').strftime('%Y-%m-%d')))
    cat['territories'].append(t); added.append(t)
json.dump(cat, open(f'{WORK}/stage1.json', 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print('added Ramsar', len(added), Counter(t['countryCode'] for t in added))
print('unresolved coords', [(s['code'], s['number'], s['name']) for s in ramsar if not s.get('coordSource')])
