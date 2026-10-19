// Writes docs/coverage-report.md: per-country coverage of the catalogue and known research gaps.
// Counts are computed from public/data/catalogue.json; the gap notes below are maintained by hand.
// Run with: npm run data:coverage
import { readFile, writeFile } from 'node:fs/promises'

const catalogue = JSON.parse(await readFile(new URL('../public/data/catalogue.json', import.meta.url), 'utf8'))

/** Research gaps that cannot be derived from the data. */
const GAPS = {
  BEN: 'Researched area: Mono Transboundary Biosphere Reserve (challenges from GIZ, IUCN NL and NGO reports; restoration figures self-reported). Other coastal Ramsar sites are location records only. National marine/coastal protected areas not yet researched.',
  CPV: 'Researched area: Salinas of the English Port, Maio (only one documented initiative, so its salt activity is a hypothesis). Other Ramsar sites are location records only. National marine protected areas and natural parks not yet researched.',
  CIV: 'Researched area: Iles Ehotilé-Essouman (2018 Ramsar sheet, UNESCO, state news). No results found for the 2020 mangrove restoration agreement; no current park-authority website. Two sites had erroneous Ramsar header coordinates (description coordinates used).',
  GMB: 'Researched area: Tanbi Wetlands Complex (2006 Ramsar sheet, 2012 shellfish co-management plan; whether the plan is still in force was not verified). Niumi coordinates taken from Wikidata (Ramsar coordinates erroneous). Other national protected areas not yet researched.',
  GHA: 'Researched area: Keta Lagoon Complex (2023–2032 management plan; restoration figures self-reported). Muni-Pomadze coordinates taken from Wikidata (Ramsar coordinates erroneous).',
  GIN: 'Researched area: Konkouré (EU-funded PROMAK project and Guinée Écologie 2025 report; the 1990 Ramsar sheet is illegible and project localities are not confirmed inside the Ramsar site). Other Ramsar summaries are dated (1990–1993). National marine protected areas not yet researched.',
  GNB: 'Detailed research across the Bijagós, Cacheu and Cantanhez areas. Lagoa de Cufada added from Ramsar (location record only).',
  LBR: 'Researched area: Lake Piso (2007 Ramsar sheet, which predates the reserve; current project results unpublished; no mangrove replanting documented yet). Lake Piso coordinates from its Ramsar description (header coordinates erroneous). Proposed/declared marine protected areas not yet researched.',
  MRT: "Researched area: Banc d'Arguin (UNESCO, park authority, BACoMaB trust fund; Ramsar sheet not retrieved). National marine protected areas beyond Ramsar not yet researched.",
  NGA: 'Researched area: Ogoniland Wetland (UNEP 2011 assessment, HYPREP clean-up; restoration figures self-reported). Only three coastal Ramsar sites (most Nigerian Ramsar sites are inland). Ebute Oni summary lists implausible species, so only habitat terms are used.',
  SEN: 'Researched area: Delta du Saloum (UNESCO, IUCN 2011; the managing body is documented only in a 1993 Ramsar sheet; some initiatives from news). Community marine protected areas designated nationally not yet researched.',
  SLE: 'Researched area: Sierra Leone River Estuary (Ramsar 1999, 2025 national audit; conflicting mangrove-trend figures are not shown; planting sites not confirmed inside the Ramsar site). Western Area Peninsula National Park from Wikidata only (location-only). Marine protected areas (e.g. Yawri Bay, Sherbro, Turtle Islands) not yet verified.',
  TGO: 'Researched area: Zones Humides du Littoral du Togo (2007 Ramsar sheet, World Bank, a planned 2025 CTCN project; the site has no management plan). The Mono transboundary biosphere reserve is catalogued under Benin.',
}

const sourceById = new Map(catalogue.sources.map((s) => [s.id, s]))
const rows = catalogue.countries.map((country) => {
  const ts = catalogue.territories.filter((t) => t.countryCode === country.code)
  const ids = new Set(ts.map((t) => t.id))
  const cited = new Set(
    ts.flatMap((t) => [
      t.location.pointSourceId,
      ...t.location.descriptionSourceIds,
      ...t.overview.flatMap((s) => s.sourceIds),
      ...t.designations.flatMap((d) => d.sourceIds),
    ]),
  )
  // Most-cited publishers first, normalised so variants of one organisation count once.
  const tally = new Map()
  for (const id of cited) {
    const publisher = sourceById.get(id)?.publisher?.replace(/\s*\(.*\)$/, '').replace(/,.*$/, '')
    if (publisher) tally.set(publisher, (tally.get(publisher) ?? 0) + 1)
  }
  const publishers = [...tally].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([p]) => p)
  const count = (pred) => ts.filter(pred).length
  const linked = (items) => items.filter((i) => i.territoryIds.some((id) => ids.has(id))).length
  return {
    country,
    total: ts.length,
    boundaries: count((t) => t.geometry.representation === 'boundary'),
    points: count((t) => t.geometry.representation === 'point'),
    corrected: count((t) => /erroneous/.test(t.verification.note)),
    locationOnly: count((t) => t.verification.status === 'location-only'),
    withEcosystems: count((t) => t.ecosystems.length > 0),
    challenges: linked(catalogue.challenges),
    opportunities: linked(catalogue.opportunities),
    publishers,
  }
})

const lines = [
  '# Catalogue coverage report',
  '',
  `Generated from \`public/data/catalogue.json\` (dataset v${catalogue.meta.version}, updated ${catalogue.meta.updated}). Regenerate with \`npm run data:coverage\`.`,
  '',
  'The catalogue is a **researched selection** of marine and coastal conservation areas across the 13 WASOP countries, not an exhaustive official inventory. Outside Guinea-Bissau it consists mainly of Ramsar sites taken from the official Ramsar annotated lists, with one researched area per country. Locations are reference points; no protected-area boundaries are shown. WDPA/Protected Planet data is not used.',
  '',
  '| Country | Areas | Location quality | With habitats | Challenges / activities | Main sources |',
  '|---|---:|---|---:|---|---|',
  ...rows.map((r) =>
    [
      r.country.name,
      r.total,
      [
        r.points && `${r.points} point${r.points === 1 ? '' : 's'}`,
        r.boundaries && `${r.boundaries} admin boundar${r.boundaries === 1 ? 'y' : 'ies'}`,
        r.corrected && `${r.corrected} with corrected coordinates`,
        r.locationOnly && `${r.locationOnly} location-only`,
      ]
        .filter(Boolean)
        .join('; '),
      r.withEcosystems,
      `${r.challenges} / ${r.opportunities}`,
      r.publishers.join('; '),
    ].join(' | ').replace(/^/, '| ').replace(/$/, ' |'),
  ),
  '',
  '## Research gaps by country',
  '',
  ...rows.map((r) => `- **${r.country.name}** (${r.total}): ${GAPS[r.country.code] ?? 'No notes.'}`),
  '',
  '## Notes',
  '',
  "- Ramsar's annotated-list export contains erroneous site-header coordinates for several sites. Each affected record states which coordinates are used: the site description's own coordinates, or Wikidata.",
  '- Habitat tags for Ramsar sites reflect terms named in Ramsar\'s own site summary (reviewed for false matches). They are not mapped ecosystem extents.',
  '- Outside Guinea-Bissau, challenges, organisations and potential regenerative activities have been researched for one area per country. Potential activities are interpretations or hypotheses that need validation, and organisation links state either documented related work or an unvalidated stakeholder to consult.',
  '',
]
await writeFile(new URL('../docs/coverage-report.md', import.meta.url), lines.join('\n'))
console.log('wrote docs/coverage-report.md')
