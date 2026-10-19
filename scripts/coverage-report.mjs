// Writes docs/coverage-report.md: per-country coverage of the catalogue and known research gaps.
// Counts are computed from public/data/catalogue.json; the gap notes below are maintained by hand.
// Run with: npm run data:coverage
import { readFile, writeFile } from 'node:fs/promises'

const catalogue = JSON.parse(await readFile(new URL('../public/data/catalogue.json', import.meta.url), 'utf8'))

/** Research gaps that cannot be derived from the data. */
const GAPS = {
  BEN: 'Coastal Ramsar sites plus the transboundary Mono biosphere reserve. National marine/coastal protected areas not yet researched.',
  CPV: 'Coastal Ramsar sites only. National marine protected areas and natural parks not yet researched.',
  CIV: 'Coastal Ramsar sites only; two had erroneous Ramsar header coordinates (description coordinates used).',
  GMB: 'Coastal and estuarine Ramsar sites. Niumi coordinates taken from Wikidata (Ramsar coordinates erroneous). Other national protected areas not yet researched.',
  GHA: 'Coastal Ramsar sites. Muni-Pomadze coordinates taken from Wikidata (Ramsar coordinates erroneous).',
  GIN: 'Coastal Ramsar sites; Ramsar summaries are dated (several from 1990–1993). National marine protected areas not yet researched.',
  GNB: 'Detailed research: challenges, potential activities and organisations exist only here. Lagoa de Cufada added from Ramsar.',
  LBR: 'Coastal Ramsar sites. Lake Piso coordinates from its Ramsar description (header coordinates erroneous). Proposed/declared marine protected areas not yet researched.',
  MRT: "Coastal Ramsar sites, including Banc d'Arguin. National marine protected areas beyond Ramsar not yet researched.",
  NGA: 'Only three coastal Ramsar sites (most Nigerian Ramsar sites are inland). Ebute Oni summary lists implausible species, so only habitat terms are used. Niger Delta protected areas not yet researched.',
  SEN: 'Coastal Ramsar sites. Community marine protected areas (AMP) designated nationally not yet researched.',
  SLE: 'One Ramsar site (coordinates from its description) and Western Area Peninsula National Park from Wikidata only (location-only). Marine protected areas (e.g. Yawri Bay, Sherbro, Turtle Islands) not yet verified.',
  TGO: 'One coastal Ramsar site. The Mono transboundary biosphere reserve is catalogued under Benin. Further sites not yet researched.',
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
  'The catalogue is a **researched selection** of marine and coastal conservation areas across the 13 WASOP countries, not an exhaustive official inventory. Outside Guinea-Bissau it consists mainly of Ramsar sites taken from the official Ramsar annotated lists. Locations are reference points; no protected-area boundaries are shown. WDPA/Protected Planet data is not used.',
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
  '- No conservation challenges, organisations or potential regenerative activities have been researched for areas outside Guinea-Bissau, and none are shown.',
  '',
]
await writeFile(new URL('../docs/coverage-report.md', import.meta.url), lines.join('\n'))
console.log('wrote docs/coverage-report.md')
