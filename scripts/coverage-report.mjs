// Writes docs/coverage-report.md: per-country inventory status, catalogue coverage and known gaps.
// Everything is computed from public/data/catalogue.json (countries[].inventory holds the official
// inventory comparison and gaps), the research files in docs/inventory/research/ (areas listed by the
// sources reviewed) and docs/inventory/uncatalogued-areas.csv (listed areas not mapped).
// Run with: npm run data:coverage
import { readFile, writeFile } from 'node:fs/promises'

const catalogue = JSON.parse(await readFile(new URL('../public/data/catalogue.json', import.meta.url), 'utf8'))
const research = Object.fromEntries(
  await Promise.all(
    catalogue.countries.map(async (c) => [
      c.code,
      JSON.parse(await readFile(new URL(`../docs/inventory/research/${c.code}.json`, import.meta.url), 'utf8')),
    ]),
  ),
)
/** Minimal RFC 4180 parser: quoted cells may contain commas, quotes and line breaks. */
function parseCsv(text) {
  const rows = [[]]
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted && ch === '"' && text[i + 1] === '"') {
      cell += '"'
      i++
    } else if (ch === '"') {
      quoted = !quoted
    } else if (!quoted && (ch === ',' || ch === '\n')) {
      rows.at(-1).push(cell.replace(/\r$/, ''))
      cell = ''
      if (ch === '\n') rows.push([])
    } else {
      cell += ch
    }
  }
  if (cell || rows.at(-1).length) rows.at(-1).push(cell)
  else rows.pop()
  const [columns, ...records] = rows
  return records.map((r) => Object.fromEntries(columns.map((c, i) => [c, r[i]])))
}
const unmapped = parseCsv((await readFile(new URL('../docs/inventory/uncatalogued-areas.csv', import.meta.url), 'utf8')).replace(/^\uFEFF/, ''))
const unmappedBy = {}
for (const row of unmapped) unmappedBy[row.country_code] = (unmappedBy[row.country_code] ?? 0) + 1
const sourceById = new Map(catalogue.sources.map((s) => [s.id, s]))

const CATEGORY = {
  'national-park': 'National parks',
  'nature-reserve': 'Nature reserves',
  'marine-protected-area': 'Marine protected areas',
  'wildlife-reserve': 'Wildlife / game reserves',
  'forest-reserve': 'Forest reserves',
  'community-conservation-area': 'Community conservation areas',
  'other-protected-area': 'Other protected areas',
  'international-designation': 'International designation only',
  proposed: 'Proposed (not designated)',
  context: 'Context (not a protected area)',
}
const GROUP = { wasop: 'WASOP', additional: 'Additional' }
const has = (t, d) => t.designations.some((x) => x.designationId === d)
const link = (id) => {
  const s = sourceById.get(id)
  return s ? `[${s.publisher.replace(/\s*\(.*\)$/, '')}](${s.url})` : id
}

const rows = catalogue.countries.map((country) => {
  const ts = catalogue.territories.filter((t) => t.countryCode === country.code)
  const areas = ts.filter((t) => t.inventory?.category !== 'context')
  const byCategory = {}
  for (const t of areas) byCategory[t.inventory?.category] = (byCategory[t.inventory?.category] ?? 0) + 1
  return {
    country,
    areas,
    byCategory,
    national: areas.filter((t) => !['international-designation', 'proposed'].includes(t.inventory?.category)).length,
    proposed: byCategory.proposed ?? 0,
    international: byCategory['international-designation'] ?? 0,
    context: ts.length - areas.length,
    listed: research[country.code].areas.length,
    unmapped: unmappedBy[country.code] ?? 0,
    ramsar: areas.filter((t) => has(t, 'ramsar')).length,
    whs: areas.filter((t) => has(t, 'world-heritage')).length,
    mab: areas.filter((t) => has(t, 'biosphere-reserve')).length,
    legal: areas.filter((t) => t.inventory?.legalStatus).length,
    overlaps: areas.filter((t) => (t.inventory?.overlaps ?? []).length > 0).length,
  }
})

const total = rows.reduce((n, r) => n + r.areas.length, 0)
const sum = (key) => rows.reduce((n, r) => n + r[key], 0)
const lines = [
  '# Protected-area inventory and coverage report',
  '',
  `Generated from \`public/data/catalogue.json\` (dataset v${catalogue.meta.version}, updated ${catalogue.meta.updated}). Regenerate with \`npm run data:coverage\`.`,
  '',
  `The catalogue holds **${total} catalogued areas** in **${catalogue.countries.length} countries**: the 13 WASOP countries and 9 additional African countries. **It is a partial inventory.** No country's coverage has been verified as exhaustive against an official register (see "Inventory status"). Each record appears once: when Ramsar, World Heritage or biosphere status applies to the same area as a national designation, it is recorded as an extra designation on that area. Designations that cover a different extent are separate records, linked as overlapping.`,
  '',
  'Sources are national authorities, laws and government reports (found by desk research), plus the Ramsar annotated lists and UNESCO World Heritage pages. Locations are reference points: from Ramsar, from UNESCO, or from Wikidata (CC0) where official sources give none. No protected-area boundaries are shown. WDPA/Protected Planet data is not used, because its licence does not allow redistribution here, so the catalogue cannot be compared with it.',
  '',
  '## Summary',
  '',
  '| Country | Group | Catalogued areas | National / community designations | Ramsar | World Heritage | Biosphere | With documented legal basis | Inventory status |',
  '|---|---|---:|---:|---:|---:|---:|---:|---|',
  ...rows.map((r) =>
    `| ${r.country.name} | ${GROUP[r.country.group]} | ${r.areas.length} | ${r.national} | ${r.ramsar} | ${r.whs} | ${r.mab} | ${r.legal} | ${r.country.inventory?.status === 'exhaustive' ? 'Exhaustive' : 'Partial'} |`,
  ),
  '',
  '## Reconciliation',
  '',
  'How the areas listed by the national sources reviewed relate to the records on the map. **Listed** is every nationally designated or proposed area found in the official or authoritative sources reviewed (the `areas` in `inventory/research/<country>.json`). Each listed area is either **mapped** (it is a catalogue record, or an extra designation on one) or **unmapped** (in `inventory/uncatalogued-areas.csv`, because no openly licensed location was found). The map also holds **international-only** records — Ramsar sites, World Heritage properties and biosphere reserves with no national designation documented on the record — which are not part of the national list.',
  '',
  '**Why mapped totals can exceed national counts.** A country\'s total of mapped records adds international-only records to the nationally designated or proposed ones, so it can be higher than the number of areas on the national list (for example Nigeria, Guinea and Uganda, which have many Ramsar sites). A biosphere reserve or a Ramsar site whose extent differs from a national area is a separate record linked as overlapping, not a second count of the same area. International designations are a different kind of status from national legal protection and are never counted as national protected areas. Conversely, a listed national area that shares a record with a Ramsar site is counted once on the map.',
  '',
  '| Country | Listed in sources reviewed | Mapped | Unmapped | Mapped records: national or community | Proposed | International-only | Total mapped records |',
  '|---|---:|---:|---:|---:|---:|---:|---:|',
  ...rows.map((r) => `| ${r.country.name} | ${r.listed} | ${r.listed - r.unmapped} | ${r.unmapped} | ${r.national} | ${r.proposed} | ${r.international} | ${r.areas.length} |`),
  `| **Total** | **${sum('listed')}** | **${sum('listed') - sum('unmapped')}** | **${sum('unmapped')}** | **${sum('national')}** | **${sum('proposed')}** | **${sum('international')}** | **${total}** |`,
  '',
  `Not counted above: ${sum('context')} context record (an administrative region shown for orientation, not a protected area). Mapped listed areas equal national/community plus proposed records in every country except Liberia, where the proposed Marshall Wetlands protected area is recorded on its Ramsar site, an international-only record.`,
  '',
  '## Catalogued areas by protection category',
  '',
  `| Country | ${Object.values(CATEGORY).slice(0, -1).join(' | ')} |`,
  `|---|${Object.keys(CATEGORY).slice(0, -1).map(() => '---:').join('|')}|`,
  ...rows.map((r) => `| ${r.country.name} | ${Object.keys(CATEGORY).slice(0, -1).map((k) => r.byCategory[k] ?? 0).join(' | ')} |`),
  '',
  '## Inventory status by country',
  '',
  'For each country: the best available official inventory found, totals stated by official or authoritative sources (to compare with the catalogue), and what is missing, duplicated or unverified.',
  '',
]
for (const r of rows) {
  const inv = r.country.inventory
  lines.push(`### ${r.country.name} — ${inv?.status === 'exhaustive' ? 'exhaustive' : 'partial'} (${r.areas.length} catalogued)`, '')
  if (!inv) {
    lines.push('No inventory assessment recorded.', '')
    continue
  }
  lines.push(inv.summary + (inv.sourceIds.length ? ` Sources: ${inv.sourceIds.map(link).join('; ')}.` : ''), '')
  if (inv.officialCounts.length) {
    lines.push('Stated official totals:', '')
    for (const n of inv.officialCounts) lines.push(`- ${n.category}: ${n.count}${n.asOf ? ` (as of ${n.asOf})` : ''} — ${link(n.sourceId)}`)
    lines.push('')
  }
  if (inv.gaps.length) {
    lines.push('Gaps:', '')
    for (const g of inv.gaps) lines.push(`- ${g}`)
    lines.push('')
  }
}
lines.push(
  '## Notes',
  '',
  "- Ramsar's annotated-list export has erroneous site-header coordinates for several sites. Each affected record says which coordinates are used: the site description's own, UNESCO's, or Wikidata's.",
  "- Habitat tags reflect terms named in the cited site summary, reviewed for false matches. They are not mapped ecosystem extents.",
  '- Areas verified in an official list but without an openly licensed location are not mapped. They are listed in [`inventory/uncatalogued-areas.csv`](inventory/uncatalogued-areas.csv). Every row there is verified in an official or authoritative source; proposed areas are listed with category `proposed`.',
  '- Conservation challenges, organisations and potential regenerative activities have been researched for Guinea-Bissau and for one area in each of the other 21 countries only. Other areas have not been researched, which does not mean they face no challenges.',
  '',
)
await writeFile(new URL('../docs/coverage-report.md', import.meta.url), lines.join('\n'))
console.log(`wrote docs/coverage-report.md (${total} areas, ${catalogue.countries.length} countries)`)
