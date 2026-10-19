import type { FeatureCollection, Geometry } from 'geojson'
import type { Catalogue } from '../domain/types'

export interface BoundaryProperties {
  shapeISO: string | null
  shapeName: string
  level: 'ADM0' | 'ADM1'
}

export type BoundaryCollection = FeatureCollection<Geometry, BoundaryProperties>

export interface CountryProperties {
  /** ISO 3166-1 alpha-3, matching Country.code in the catalogue. */
  code: string
  name: string
}

export type CountryCollection = FeatureCollection<Geometry, CountryProperties>

export interface BoundaryLayers {
  /** Outlines of the countries covered by the catalogue. */
  countries: CountryCollection
  /** Administrative regions used as territory boundaries (Guinea-Bissau). */
  regions: BoundaryCollection
}

/**
 * The data-access boundary. The UI depends only on this interface; today it is backed by
 * static files, and later it can be backed by an HTTP API returning the same shapes.
 */
export interface ConservationRepository {
  getCatalogue(): Promise<Catalogue>
  getBoundaries(): Promise<BoundaryLayers>
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Could not load ${url} (HTTP ${res.status})`)
  return (await res.json()) as T
}

/** Reads the catalogue and boundary files published under `baseUrl`. */
export function createStaticRepository(baseUrl: string): ConservationRepository {
  return {
    getCatalogue: () => fetchJson<Catalogue>(`${baseUrl}/catalogue.json`),
    getBoundaries: async () => {
      const [countries, regions] = await Promise.all([
        fetchJson<CountryCollection>(`${baseUrl}/geo/wasop-countries.geojson`),
        fetchJson<BoundaryCollection>(`${baseUrl}/geo/gnb-adm1.geojson`),
      ])
      return { countries, regions }
    },
  }
}
