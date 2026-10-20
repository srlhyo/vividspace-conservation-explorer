// Writes docs/data-export/*.csv: the committed catalogue as linked, spreadsheet-friendly tables.
// Every value comes from public/data/catalogue.json; nothing is reconstructed or filled in.
// Identifiers are the catalogue's own stable ids, so the files can be joined on them.
// Run with: npm run data:export
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const catalogue = JSON.parse(await readFile(new URL('../public/data/catalogue.json', import.meta.url), 'utf8'))
const OUT = new URL('../docs/data-export/', import.meta.url)

const sourceById = new Map(catalogue.sources.map((s) => [s.id, s]))
const countryName = new Map(catalogue.countries.map((c) => [c.code, c.name]))
const lookup = (list) => new Map(list.map((x) => [x.id, x.name]))
const designationName = lookup(catalogue.designationTypes)
const ecosystemName = lookup(catalogue.ecosystems)
const themeName = lookup(catalogue.themes)
const organisationName = lookup(catalogue.organisations)

/** Multi-valued cells are joined with "; " (ids never contain that sequence). */
const list = (values) => values.filter((v) => v !== undefined && v !== null && v !== '').join('; ')
const urls = (ids) => list(ids.map((id) => sourceById.get(id)?.url))

function csv(columns, rows) {
  const cell = (v) => {
    const s = v === undefined || v === null ? '' : String(v)
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [columns.join(','), ...rows.map((r) => columns.map((c) => cell(r[c])).join(','))].join('\r\n') + '\r\n'
}

// Inventory columns are only written once the catalogue has inventory data, so no column is blank throughout.
const OPTIONAL = new Set([
  'group', 'inventory_status', 'inventory_summary', 'inventory_source_ids', 'inventory_source_urls',
  'protection_category', 'legal_status', 'legal_status_evidence', 'legal_status_source_ids', 'source_date', 'overlaps_territory_ids',
])
const files = {}
const table = (name, columns, rows) =>
  (files[name] = {
    columns: columns.filter((c) => !OPTIONAL.has(c) || rows.some((r) => r[c] !== undefined && r[c] !== '')),
    rows,
  })

const territoryCounts = (id) => ({
  challenge_count: catalogue.challenges.filter((c) => c.territoryIds.includes(id)).length,
  opportunity_count: catalogue.opportunities.filter((o) => o.territoryIds.includes(id)).length,
})

table(
  'countries',
  ['country_code', 'country_name', 'group', 'territory_count', 'inventory_status', 'inventory_summary', 'inventory_source_ids', 'inventory_source_urls'],
  catalogue.countries.map((c) => ({
    country_code: c.code,
    country_name: c.name,
    group: c.group,
    territory_count: catalogue.territories.filter((t) => t.countryCode === c.code).length,
    inventory_status: c.inventory?.status,
    inventory_summary: c.inventory?.summary,
    inventory_source_ids: list(c.inventory?.sourceIds ?? []),
    inventory_source_urls: urls(c.inventory?.sourceIds ?? []),
  })),
)

table(
  'territories',
  [
    'territory_id', 'name', 'short_name', 'local_name', 'record_type', 'country_code', 'country_name', 'parent_id',
    'protection_category', 'legal_status', 'legal_status_evidence', 'legal_status_source_ids', 'source_date',
    'designation_ids', 'designation_names', 'ecosystem_ids', 'ecosystem_names',
    'location_description', 'longitude', 'latitude', 'location_source_id', 'location_source_url',
    'geometry_representation', 'boundary_feature_ref', 'geometry_caveat',
    'verification_status', 'verification_note', 'reviewed', 'overlaps_territory_ids',
    'challenge_count', 'opportunity_count',
  ],
  catalogue.territories.map((t) => ({
    territory_id: t.id,
    name: t.name,
    short_name: t.shortName,
    local_name: t.localName,
    record_type: t.kind,
    country_code: t.countryCode,
    country_name: countryName.get(t.countryCode),
    parent_id: t.parentId,
    protection_category: t.inventory?.category,
    legal_status: t.inventory?.legalStatus?.text,
    legal_status_evidence: t.inventory?.legalStatus?.evidence,
    legal_status_source_ids: list(t.inventory?.legalStatus?.sourceIds ?? []),
    source_date: t.inventory?.sourceDate,
    designation_ids: list(t.designations.map((d) => d.designationId)),
    designation_names: list(t.designations.map((d) => designationName.get(d.designationId))),
    ecosystem_ids: list(t.ecosystems.map((e) => e.ecosystemId)),
    ecosystem_names: list(t.ecosystems.map((e) => ecosystemName.get(e.ecosystemId))),
    location_description: t.location.description,
    longitude: t.location.point[0],
    latitude: t.location.point[1],
    location_source_id: t.location.pointSourceId,
    location_source_url: sourceById.get(t.location.pointSourceId)?.url,
    geometry_representation: t.geometry.representation,
    boundary_feature_ref: t.geometry.featureRef,
    geometry_caveat: t.geometry.caveat,
    verification_status: t.verification.status,
    verification_note: t.verification.note,
    reviewed: t.verification.reviewed,
    overlaps_territory_ids: list(t.inventory?.overlaps ?? []),
    ...territoryCounts(t.id),
  })),
)

table(
  'territory_designations',
  ['territory_id', 'designation_id', 'designation_name', 'source_ids', 'source_urls'],
  catalogue.territories.flatMap((t) =>
    t.designations.map((d) => ({
      territory_id: t.id,
      designation_id: d.designationId,
      designation_name: designationName.get(d.designationId),
      source_ids: list(d.sourceIds),
      source_urls: urls(d.sourceIds),
    })),
  ),
)

table(
  'territory_ecosystems',
  ['territory_id', 'ecosystem_id', 'ecosystem_name', 'statement', 'evidence', 'source_ids', 'source_urls'],
  catalogue.territories.flatMap((t) =>
    t.ecosystems.map((e) => ({
      territory_id: t.id,
      ecosystem_id: e.ecosystemId,
      ecosystem_name: ecosystemName.get(e.ecosystemId),
      statement: e.text,
      evidence: e.evidence,
      source_ids: list(e.sourceIds),
      source_urls: urls(e.sourceIds),
    })),
  ),
)

table(
  'challenges',
  ['challenge_id', 'title', 'territory_ids', 'theme_ids', 'theme_names', 'statement_count', 'linked_opportunity_ids'],
  catalogue.challenges.map((c) => ({
    challenge_id: c.id,
    title: c.title,
    territory_ids: list(c.territoryIds),
    theme_ids: list(c.themeIds),
    theme_names: list(c.themeIds.map((id) => themeName.get(id))),
    statement_count: c.statements.length,
    linked_opportunity_ids: list(catalogue.opportunities.filter((o) => o.challengeIds.includes(c.id)).map((o) => o.id)),
  })),
)

table(
  'opportunities',
  ['opportunity_id', 'title', 'evidence', 'territory_ids', 'challenge_ids', 'theme_ids', 'theme_names', 'validation_needed', 'rationale_count', 'organisation_ids'],
  catalogue.opportunities.map((o) => ({
    opportunity_id: o.id,
    title: o.title,
    evidence: o.evidence,
    territory_ids: list(o.territoryIds),
    challenge_ids: list(o.challengeIds),
    theme_ids: list(o.themeIds),
    theme_names: list(o.themeIds.map((id) => themeName.get(id))),
    validation_needed: list(o.validationNeeded),
    rationale_count: o.rationale.length,
    organisation_ids: list(o.organisationLinks.map((l) => l.organisationId)),
  })),
)

table(
  'opportunity_organisation_links',
  ['opportunity_id', 'organisation_id', 'organisation_name', 'relationship', 'statement', 'evidence', 'source_ids', 'source_urls'],
  catalogue.opportunities.flatMap((o) =>
    o.organisationLinks.map((l) => ({
      opportunity_id: o.id,
      organisation_id: l.organisationId,
      organisation_name: organisationName.get(l.organisationId),
      relationship: l.relationship,
      statement: l.statement.text,
      evidence: l.statement.evidence,
      source_ids: list(l.statement.sourceIds),
      source_urls: urls(l.statement.sourceIds),
    })),
  ),
)

table(
  'organisations',
  ['organisation_id', 'name', 'acronym', 'type', 'url', 'territory_ids', 'role', 'role_evidence', 'role_source_ids', 'role_source_urls'],
  catalogue.organisations.map((o) => ({
    organisation_id: o.id,
    name: o.name,
    acronym: o.acronym,
    type: o.type,
    url: o.url,
    territory_ids: list(o.territoryIds),
    role: o.role.text,
    role_evidence: o.role.evidence,
    role_source_ids: list(o.role.sourceIds),
    role_source_urls: urls(o.role.sourceIds),
  })),
)

// Every sourced sentence shown in the app, with its owner, so evidence can be audited in one place.
const statementRows = []
const addStatements = (ownerType, ownerId, statements) =>
  statements.forEach((s, i) =>
    statementRows.push({
      owner_type: ownerType,
      owner_id: ownerId,
      position: i + 1,
      text: s.text,
      evidence: s.evidence,
      source_ids: list(s.sourceIds),
      source_urls: urls(s.sourceIds),
    }),
  )
for (const t of catalogue.territories) {
  addStatements('territory-overview', t.id, t.overview)
  addStatements('territory-livelihood', t.id, t.livelihoods)
  if (t.inventory?.legalStatus) addStatements('territory-legal-status', t.id, [t.inventory.legalStatus])
}
for (const c of catalogue.challenges) addStatements('challenge', c.id, c.statements)
for (const o of catalogue.opportunities) addStatements('opportunity-rationale', o.id, o.rationale)
for (const o of catalogue.organisations) addStatements('organisation-role', o.id, [o.role])
table('statements', ['owner_type', 'owner_id', 'position', 'text', 'evidence', 'source_ids', 'source_urls'], statementRows)

table(
  'sources',
  ['source_id', 'title', 'publisher', 'url', 'kind', 'licence', 'licence_url', 'accessed', 'note'],
  catalogue.sources.map((s) => ({
    source_id: s.id,
    title: s.title,
    publisher: s.publisher,
    url: s.url,
    kind: s.kind,
    licence: s.licence,
    licence_url: s.licenceUrl,
    accessed: s.accessed,
    note: s.note,
  })),
)

table('designation_types', ['designation_id', 'name', 'description'], catalogue.designationTypes.map((d) => ({ designation_id: d.id, name: d.name, description: d.description })))
table('ecosystems', ['ecosystem_id', 'name', 'definition'], catalogue.ecosystems.map((e) => ({ ecosystem_id: e.id, name: e.name, definition: e.definition })))
table('themes', ['theme_id', 'name', 'description'], catalogue.themes.map((t) => ({ theme_id: t.id, name: t.name, description: t.description })))

await mkdir(OUT, { recursive: true })
// A byte-order mark lets spreadsheet software detect UTF-8 (accented names).
for (const [name, { columns, rows }] of Object.entries(files)) {
  await writeFile(new URL(`${name}.csv`, OUT), '﻿' + csv(columns, rows))
}
const summary = Object.entries(files).map(([name, { rows }]) => `| \`${name}.csv\` | ${rows.length} |`)
await writeFile(
  new URL('README.md', OUT),
  [
    '# Catalogue export (CSV)',
    '',
    `Generated from \`public/data/catalogue.json\` (dataset v${catalogue.meta.version}, updated ${catalogue.meta.updated}) by \`npm run data:export\`. Do not edit by hand; regenerate after changing the catalogue.`,
    '',
    'Field meanings and relationships are described in [`../data-dictionary.md`](../data-dictionary.md). Multi-valued cells are separated by `; `. Files are UTF-8 with a byte-order mark so spreadsheet software shows accented names correctly.',
    '',
    '| File | Rows |',
    '|---|---:|',
    ...summary,
    '',
  ].join('\n'),
)
console.log(Object.entries(files).map(([n, { rows }]) => `${n}: ${rows.length}`).join('\n'))
