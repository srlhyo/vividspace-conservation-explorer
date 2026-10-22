// Integrity checks for the published static dataset in public/data.
import { readFileSync } from 'node:fs'
import type { Geometry } from 'geojson'
import { describe, expect, it } from 'vitest'
import type { Catalogue } from '../domain/types'
import { validateCatalogue } from '../domain/validate'
import type { BoundaryCollection, CountryCollection } from './repository'

const read = <T>(path: string): T =>
  JSON.parse(readFileSync(new URL(`../../public/data/${path}`, import.meta.url), 'utf8')) as T

/** [west, south, east, north] of a polygon or multipolygon. */
function bbox(geometry: Geometry): [number, number, number, number] {
  const coords = JSON.stringify('coordinates' in geometry ? geometry.coordinates : [])
  const nums = coords.match(/-?\d+(\.\d+)?/g)!.map(Number)
  const xs = nums.filter((_, i) => i % 2 === 0)
  const ys = nums.filter((_, i) => i % 2 === 1)
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]
}

type Ring = [number, number][]
const polygonsOf = (g: Geometry): Ring[][] =>
  g.type === 'Polygon' ? [g.coordinates as Ring[]] : g.type === 'MultiPolygon' ? (g.coordinates as Ring[][]) : []

/** Even-odd ray casting over every ring (holes toggle the result). */
function containsPoint(g: Geometry, x: number, y: number): boolean {
  let inside = false
  for (const ring of polygonsOf(g).flat()) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i]
      const [xj, yj] = ring[j]
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
    }
  }
  return inside
}

/** True when any outline vertex lies within `tol` degrees of the point. */
const nearOutline = (g: Geometry, x: number, y: number, tol: number) =>
  polygonsOf(g).flat(2).some(([px, py]) => Math.abs(px - x) <= tol && Math.abs(py - y) <= tol)

const catalogue = read<Catalogue>('catalogue.json')
const regions = read<BoundaryCollection>('geo/gnb-adm1.geojson')
const countries = read<CountryCollection>('geo/countries.geojson')

describe('public catalogue', () => {
  it('passes referential-integrity and provenance validation', () => {
    expect(validateCatalogue(catalogue)).toEqual([])
  })

  it('covers the Bijagós Archipelago and the Cacheu region', () => {
    const names = catalogue.territories.map((t) => t.name).join(' | ')
    expect(names).toMatch(/Bijagós/)
    expect(names).toMatch(/Cacheu/)
  })

  it('links every boundary territory to an existing boundary feature', () => {
    const codes = new Set(regions.features.map((f) => f.properties.shapeISO))
    for (const t of catalogue.territories.filter((t) => t.geometry.representation === 'boundary')) {
      expect(codes.has(t.geometry.featureRef ?? null), t.id).toBe(true)
    }
  })

  it('lists the 13 WASOP countries and the 12 additional countries, each with an outline', () => {
    const wasop = ['BEN', 'CPV', 'CIV', 'GMB', 'GHA', 'GIN', 'GNB', 'LBR', 'MRT', 'NGA', 'SEN', 'SLE', 'TGO']
    const additional = ['AGO', 'BWA', 'CMR', 'COD', 'COG', 'EGY', 'GAB', 'MOZ', 'NAM', 'STP', 'TZA', 'UGA']
    const codes = (group: string) => catalogue.countries.filter((c) => c.group === group).map((c) => c.code).sort()
    expect(codes('wasop')).toEqual([...wasop].sort())
    expect(codes('additional')).toEqual([...additional].sort())
    expect(countries.features.map((f) => f.properties.code).sort()).toEqual([...wasop, ...additional].sort())
  })

  it('states an inventory status for every country and never claims exhaustive coverage without a stated official count', () => {
    for (const c of catalogue.countries) {
      expect(c.inventory, c.code).toBeDefined()
      if (c.inventory?.status === 'exhaustive') expect(c.inventory.officialCounts.length, c.code).toBeGreaterThan(0)
    }
  })

  it('records a protection category for every territory', () => {
    for (const t of catalogue.territories) expect(t.inventory?.category, t.id).toBeDefined()
  })

  it('represents every country with at least one catalogued area', () => {
    for (const c of catalogue.countries) {
      expect(catalogue.territories.some((t) => t.countryCode === c.code), c.code).toBe(true)
    }
  })

  // Catches swapped or mistyped coordinates (several exist in the Ramsar export). Coastal and
  // marine sites may sit just offshore, so points within ~40 km of the outline are accepted.
  it('places every territory in or next to its own country', () => {
    for (const t of catalogue.territories) {
      const country = countries.features.find((f) => f.properties.code === t.countryCode)!
      const [lng, lat] = t.location.point
      expect(containsPoint(country.geometry, lng, lat) || nearOutline(country.geometry, lng, lat, 0.35), t.id).toBe(true)
    }
  })

  // Marine sites may legitimately sit in water outside the simplified land outline, so the
  // check uses the parent's extent plus ~11 km. It still catches misplaced coordinates.
  it('places each point within reach of its parent region', () => {
    const buffer = 0.1
    for (const t of catalogue.territories.filter((t) => t.parentId)) {
      const parent = catalogue.territories.find((p) => p.id === t.parentId)!
      const region = regions.features.find((f) => f.properties.shapeISO === parent.geometry.featureRef)
      if (!region) continue
      const [w, s, e, n] = bbox(region.geometry)
      const [lng, lat] = t.location.point
      expect(lng >= w - buffer && lng <= e + buffer && lat >= s - buffer && lat <= n + buffer, `${t.id} near ${parent.id}`).toBe(true)
    }
  })

  it('records a licence and https URL for every source', () => {
    for (const s of catalogue.sources) {
      expect(s.licence.trim(), s.id).not.toBe('')
      expect(s.url, s.id).toMatch(/^https:\/\//)
    }
  })

  it('links organisations to activities only explicitly (regression: shared citations)', () => {
    // Rainforest Trust and PRCM are cited for the tourism rationale but have no documented role in it.
    const tourism = catalogue.opportunities.find((o) => o.id === 'bijagos-community-tourism')!
    const linked = tourism.organisationLinks.map((l) => l.organisationId)
    expect(linked).not.toContain('rainforest-trust')
    expect(linked).not.toContain('prcm')
  })

  it('never presents an opportunity as verified', () => {
    for (const o of catalogue.opportunities) expect(o.evidence).not.toBe('verified')
  })

  it('never describes an area with documented challenges as not researched', () => {
    const researched = new Set(catalogue.challenges.flatMap((c) => c.territoryIds))
    for (const t of catalogue.territories.filter((t) => researched.has(t.id)))
      expect(t.verification.note, t.id).not.toMatch(/No conservation challenge.*has been researched/)
  })
})

/** Minimal RFC 4180 parser for the inventory CSV (quoted cells may contain commas, quotes and line breaks). */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [[]]
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
      rows.at(-1)!.push(cell.replace(/\r$/, ''))
      cell = ''
      if (ch === '\n') rows.push([])
    } else {
      cell += ch
    }
  }
  if (cell || rows.at(-1)!.length) rows.at(-1)!.push(cell)
  else rows.pop()
  const [columns, ...records] = rows
  return records.map((r) => Object.fromEntries(columns.map((c, i) => [c, r[i] ?? ''])))
}

describe('inventory of verified but unmapped areas', () => {
  const docs = (path: string) => readFileSync(new URL(`../../docs/inventory/${path}`, import.meta.url), 'utf8')
  const catalogue = read<Catalogue>('catalogue.json')
  const unmapped = parseCsv(docs('uncatalogued-areas.csv').replace(/^﻿/, ''))
  const research = Object.fromEntries(
    catalogue.countries.map((c) => [c.code, JSON.parse(docs(`research/${c.code}.json`)) as { areas: { name: string }[] }]),
  )

  it('gives every row a unique id that is not also a catalogue id', () => {
    const ids = unmapped.map((r) => r.record_id)
    expect(new Set(ids).size).toBe(ids.length)
    const catalogued = new Set(catalogue.territories.map((t) => t.id))
    for (const id of ids) expect(catalogued.has(id), id).toBe(false)
  })

  // National-list areas; Ramsar sites without usable coordinates are listed with category international-designation.
  const national = unmapped.filter((r) => r.category !== 'international-designation')

  it('lists only areas from the country research or Ramsar sites, with resolvable sources', () => {
    const sources = new Set(catalogue.sources.map((s) => s.id))
    for (const r of national)
      expect(research[r.country_code]?.areas.some((a) => a.name === r.name), `${r.country_code} ${r.name}`).toBe(true)
    for (const r of unmapped.filter((r) => r.category === 'international-designation'))
      expect(r.record_id, r.name).toMatch(/^ramsar-\d+$/)
    for (const r of unmapped) {
      expect(r.source_ids, r.record_id).not.toBe('')
      for (const id of r.source_ids.split('; ')) expect(sources.has(id), `${r.record_id} → ${id}`).toBe(true)
    }
  })

  it('never lists more unmapped areas for a country than its research found', () => {
    for (const c of catalogue.countries) {
      const count = national.filter((r) => r.country_code === c.code).length
      expect(count, c.code).toBeLessThanOrEqual(research[c.code].areas.length)
    }
  })
})
