// Integrity checks for the published static dataset in public/data.
import { readFileSync } from 'node:fs'
import type { Geometry } from 'geojson'
import { describe, expect, it } from 'vitest'
import type { Catalogue } from '../domain/types'
import { validateCatalogue } from '../domain/validate'
import type { BoundaryCollection } from './repository'

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

const catalogue = read<Catalogue>('catalogue.json')
const regions = read<BoundaryCollection>('geo/gnb-adm1.geojson')

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

  it('places every territory inside the Guinea-Bissau area', () => {
    for (const t of catalogue.territories) {
      const [lng, lat] = t.location.point
      expect(lng, t.id).toBeGreaterThan(-17.5)
      expect(lng, t.id).toBeLessThan(-13.5)
      expect(lat, t.id).toBeGreaterThan(10.5)
      expect(lat, t.id).toBeLessThan(12.8)
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

  it('never presents an opportunity as verified', () => {
    for (const o of catalogue.opportunities) expect(o.evidence).not.toBe('verified')
  })
})
