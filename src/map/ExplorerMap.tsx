import * as maplibregl from 'maplibre-gl'
import type { GeoJSONSource, MapLayerMouseEvent } from 'maplibre-gl'
import type { ExpressionSpecification, SymbolLayerSpecification } from '@maplibre/maplibre-gl-style-spec'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Feature, FeatureCollection, Point } from 'geojson'
import { useEffect, useMemo, useRef, useState } from 'react'
import { config } from '../config'
import type { BoundaryLayers } from '../data/repository'
import type { Territory } from '../domain/types'
import { loadBasemap } from './basemap'
import { palette } from './palette'
// MapLibre locates its worker relative to its own module, which breaks once bundled.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'

maplibregl.setWorkerUrl(workerUrl)

interface ExplorerMapProps {
  boundaries: BoundaryLayers
  territories: Territory[]
  visibleIds: Set<string>
  selectedId: string | null
  onSelect: (territoryId: string) => void
  /** Countries currently selected (highlighted on the map). */
  selectedCountries: string[]
  onSelectCountry: (code: string) => void
  /** Catalogued areas per country code, shown in the country tooltip. */
  countryCounts: Record<string, number>
  /** Camera request from the dashboard; a new `id` triggers it. */
  viewRequest: ViewRequest | null
  projection: 'mercator' | 'globe'
}

export type ViewRequest = { id: number } & (
  | { view: 'region' }
  | { view: 'world' }
  | { view: 'country'; code: string }
)

type MapStatus = 'loading' | 'ready' | 'offline' | 'error'

const SRC = {
  countries: 'catalogued-countries',
  regions: 'gnb-regions',
  areas: 'territory-areas',
  points: 'territory-points',
  labels: 'territory-labels',
} as const

const INTERACTIVE_LAYERS = ['territory-points-circle', 'territory-areas-fill']

const ATTRIBUTION =
  '<a href="https://www.naturalearthdata.com" target="_blank" rel="noreferrer">Natural Earth</a> · ' +
  '<a href="https://www.geoboundaries.org" target="_blank" rel="noreferrer">geoBoundaries</a> (ODbL) · ' +
  '<a href="https://www.ramsar.org" target="_blank" rel="noreferrer">Ramsar</a> · ' +
  '<a href="https://www.wikidata.org" target="_blank" rel="noreferrer">Wikidata</a>'

function territoryFeatures(boundaries: BoundaryLayers, territories: Territory[]) {
  const areas: FeatureCollection = {
    type: 'FeatureCollection',
    features: territories.flatMap((t) => {
      if (t.geometry.representation !== 'boundary') return []
      const region = boundaries.regions.features.find(
        (f) => f.properties.shapeISO === t.geometry.featureRef,
      )
      return region
        ? [{ type: 'Feature', geometry: region.geometry, properties: { territoryId: t.id, name: t.name } }]
        : []
    }),
  }
  const toPoint = (t: Territory): Feature<Point> => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: t.location.point },
    properties: {
      territoryId: t.id,
      name: t.name,
      label: t.shortName ?? t.name,
      representation: t.geometry.representation,
    },
  })
  const points: FeatureCollection = {
    type: 'FeatureCollection',
    features: territories.filter((t) => t.geometry.representation === 'point').map(toPoint),
  }
  const labels: FeatureCollection = { type: 'FeatureCollection', features: territories.map(toPoint) }
  return { areas, points, labels }
}

/** Bounding box of any GeoJSON coordinate array. */
function boundsOf(coordinates: unknown, bounds = new maplibregl.LngLatBounds()) {
  const extend = (c: unknown): void => {
    if (Array.isArray(c) && typeof c[0] === 'number') bounds.extend(c as [number, number])
    else if (Array.isArray(c)) c.forEach(extend)
  }
  extend(coordinates)
  return bounds
}

/** Bounding box of a territory: its polygon if it has one, else a small box around its point. */
function territoryBounds(territory: Territory, areas: FeatureCollection) {
  const area = areas.features.find((f) => f.properties?.territoryId === territory.id)
  const bounds = boundsOf(area && 'coordinates' in area.geometry ? area.geometry.coordinates : [])
  if (bounds.isEmpty()) {
    const [lng, lat] = territory.location.point
    bounds.extend([lng - 0.18, lat - 0.15]).extend([lng + 0.18, lat + 0.15])
  }
  return bounds
}

export function ExplorerMap({
  boundaries,
  territories,
  visibleIds,
  selectedId,
  onSelect,
  selectedCountries,
  onSelectCountry,
  countryCounts,
  viewRequest,
  projection,
}: ExplorerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [status, setStatus] = useState<MapStatus>('loading')
  const [zoom, setZoom] = useState<number | null>(null)
  const features = useMemo(() => territoryFeatures(boundaries, territories), [boundaries, territories])

  // Handlers registered once on the map read the latest props through a ref.
  const latest = useRef({ onSelect, onSelectCountry, countryCounts, visibleIds, boundaries, features })
  useEffect(() => {
    latest.current = { onSelect, onSelectCountry, countryCounts, visibleIds, boundaries, features }
  })

  // Create the map once.
  useEffect(() => {
    let disposed = false
    let map: maplibregl.Map | undefined
    let loadTimer: ReturnType<typeof setTimeout> | undefined
    const hoverPopup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
      className: 'territory-tooltip',
    })

    loadBasemap(config.map.basemapStyleUrl, config.map.basemapTimeoutMs).then((basemap) => {
      if (disposed || !containerRef.current) return
      map = new maplibregl.Map({
        container: containerRef.current,
        style: basemap.style,
        bounds: config.map.initialBounds,
        fitBoundsOptions: { padding: 40 },
        attributionControl: { compact: false, customAttribution: ATTRIBUTION },
      })
      mapRef.current = map
      loadTimer = setTimeout(() => {
        if (!disposed && !map?.loaded()) setStatus('error')
      }, config.map.loadTimeoutMs)
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
      map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left')

      map.on('zoomend', () => {
        if (map) setZoom(map.getZoom())
      })
      map.on('error', (e: maplibregl.ErrorEvent) => console.warn('[map]', e.error?.message ?? e))

      map.on('load', () => {
        clearTimeout(loadTimer)
        if (!map) return
        const { boundaries, features } = latest.current
        const before = basemap.beforeLayerId
        map.addSource(SRC.countries, { type: 'geojson', data: boundaries.countries, promoteId: 'code' })
        map.addSource(SRC.regions, { type: 'geojson', data: boundaries.regions })
        map.addSource(SRC.areas, { type: 'geojson', data: features.areas, promoteId: 'territoryId' })
        map.addSource(SRC.points, { type: 'geojson', data: features.points, promoteId: 'territoryId' })


        const selected: ExpressionSpecification = ['boolean', ['feature-state', 'selected'], false]
        const countryHover: ExpressionSpecification = ['boolean', ['feature-state', 'hover'], false]
        // Catalogued countries: a near-transparent fill keeps them clickable; selection tints them.
        map.addLayer(
          {
            id: 'countries-fill',
            type: 'fill',
            source: SRC.countries,
            paint: {
              'fill-color': basemap.offline ? palette.land : palette.forestLight,
              'fill-opacity': basemap.offline
                ? 1
                : ['case', selected, 0.1, countryHover, 0.07, 0.02],
            },
          },
          before,
        )
        map.addLayer(
          {
            id: 'regions-line',
            type: 'line',
            source: SRC.regions,
            minzoom: 6,
            paint: { 'line-color': palette.muted, 'line-width': 0.8, 'line-dasharray': [3, 2] },
          },
          before,
        )
        map.addLayer(
          {
            id: 'countries-line',
            type: 'line',
            source: SRC.countries,
            paint: {
              'line-color': ['case', selected, palette.goldDark, palette.forest],
              'line-width': ['case', selected, 2.2, 1.1],
              'line-opacity': ['case', selected, 1, 0.65],
            },
          },
          before,
        )
        // Territories outside the filter results are drawn grey rather than hidden; a selected
        // territory always keeps its highlight.
        const dimmed: ExpressionSpecification = ['boolean', ['feature-state', 'dimmed'], false]
        const hovered: ExpressionSpecification = ['boolean', ['feature-state', 'hover'], false]
        map.addLayer(
          {
            id: 'territory-areas-fill',
            type: 'fill',
            source: SRC.areas,
            paint: {
              'fill-color': ['case', selected, palette.gold, dimmed, palette.muted, palette.forestLight],
              'fill-opacity': ['case', selected, 0.32, dimmed, 0.06, hovered, 0.28, 0.16],
            },
          },
          before,
        )
        map.addLayer(
          {
            id: 'territory-areas-line',
            type: 'line',
            source: SRC.areas,
            paint: {
              'line-color': ['case', selected, palette.goldDark, dimmed, palette.muted, palette.forest],
              'line-width': ['case', selected, 2.6, dimmed, 0.8, 1.4],
              'line-opacity': ['case', selected, 1, dimmed, 0.7, 1],
            },
          },
          before,
        )
        map.addLayer({
          id: 'territory-points-halo',
          type: 'circle',
          source: SRC.points,
          paint: {
            'circle-radius': ['case', selected, 18, 0],
            'circle-color': palette.gold,
            'circle-opacity': 0.3,
          },
        })
        map.addLayer({
          id: 'territory-points-circle',
          type: 'circle',
          source: SRC.points,
          paint: {
            'circle-radius': ['case', selected, 9, dimmed, 4.5, hovered, 8, 6.5],
            'circle-color': ['case', selected, palette.gold, dimmed, palette.muted, palette.forest],
            'circle-stroke-color': palette.white,
            'circle-stroke-width': ['case', dimmed, 1, 2],
            'circle-opacity': ['case', selected, 1, dimmed, 0.6, 1],
          },
        })

        // Labels need glyphs, which only the online basemap provides.
        if (!basemap.offline) {
          map.addSource(SRC.labels, { type: 'geojson', data: features.labels, promoteId: 'territoryId' })
          const textPaint: SymbolLayerSpecification['paint'] = {
            'text-color': ['case', selected, palette.goldDark, dimmed, palette.muted, palette.forest],
            'text-halo-color': palette.white,
            'text-halo-width': 2,
            'text-opacity': ['case', selected, 1, dimmed, 0.75, 1],
          }
          // Regions: spaced capitals, placed at the region's reference point.
          map.addLayer({
            id: 'territory-region-labels',
            type: 'symbol',
            source: SRC.labels,
            filter: ['==', ['get', 'representation'], 'boundary'],
            minzoom: 6,
            layout: {
              'text-field': ['get', 'label'],
              'text-font': ['Noto Sans Bold'],
              'text-size': 12,
              'text-transform': 'uppercase',
              'text-letter-spacing': 0.12,
              'text-max-width': 12,
            },
            paint: textPaint,
          })
          // Sites: short name beside the point.
          map.addLayer({
            id: 'territory-point-labels',
            type: 'symbol',
            source: SRC.labels,
            filter: ['==', ['get', 'representation'], 'point'],
            // Site names appear from regional zoom; at overview scale the tooltip names them.
            minzoom: 6,
            layout: {
              'text-field': ['get', 'label'],
              'text-font': ['Noto Sans Bold'],
              'text-size': 13,
              'text-anchor': 'left',
              'text-offset': [0.9, 0],
              'text-max-width': 14,
            },
            paint: textPaint,
          })
        }

        let hoveredId: string | null = null
        const setHover = (id: string | null) => {
          if (!map) return
          for (const source of [SRC.areas, SRC.points]) {
            if (hoveredId) map.setFeatureState({ source, id: hoveredId }, { hover: false })
            if (id) map.setFeatureState({ source, id }, { hover: true })
          }
          hoveredId = id
        }

        let hoveredCountry: string | null = null
        const setCountryHover = (code: string | null) => {
          if (!map || code === hoveredCountry) return
          if (hoveredCountry) map.setFeatureState({ source: SRC.countries, id: hoveredCountry }, { hover: false })
          if (code) map.setFeatureState({ source: SRC.countries, id: code }, { hover: true })
          hoveredCountry = code
        }

        const pick = (e: MapLayerMouseEvent): { id: string; name: string } | null => {
          if (!map) return null
          // Results are top-most first, so a protected-area point wins over the region around it.
          // A greyed-out point (another country, or not matching the filters) can still be opened;
          // greyed-out region fills are not, so clicking inside them still selects the country.
          const hits = map.queryRenderedFeatures(e.point, { layers: INTERACTIVE_LAYERS })
          const hit =
            hits.find((f: maplibregl.MapGeoJSONFeature) => latest.current.visibleIds.has(String(f.properties.territoryId))) ??
            hits.find((f: maplibregl.MapGeoJSONFeature) => f.layer.id === 'territory-points-circle')
          return hit ? { id: String(hit.properties.territoryId), name: String(hit.properties.name) } : null
        }
        const pickCountry = (e: MapLayerMouseEvent): { code: string; name: string } | null => {
          if (!map) return null
          const hit = map.queryRenderedFeatures(e.point, { layers: ['countries-fill'] })[0]
          return hit ? { code: String(hit.properties.code), name: String(hit.properties.name) } : null
        }

        map.on('mousemove', (e: maplibregl.MapMouseEvent) => {
          if (!map) return
          const hit = pick(e as MapLayerMouseEvent)
          const country = hit ? null : pickCountry(e as MapLayerMouseEvent)
          map.getCanvas().style.cursor = hit || country ? 'pointer' : ''
          if (hit?.id !== hoveredId) setHover(hit?.id ?? null)
          setCountryHover(country?.code ?? null)
          if (hit) hoverPopup.setLngLat(e.lngLat).setText(hit.name).addTo(map)
          else if (country) {
            const n = latest.current.countryCounts[country.code] ?? 0
            hoverPopup
              .setLngLat(e.lngLat)
              .setText(`${country.name} · ${n === 0 ? 'no catalogued areas yet' : `${n} catalogued area${n === 1 ? '' : 's'}`}`)
              .addTo(map)
          } else hoverPopup.remove()
        })
        map.on('mouseout', () => {
          setHover(null)
          setCountryHover(null)
          hoverPopup.remove()
        })
        map.on('click', (e: maplibregl.MapMouseEvent) => {
          const hit = pick(e as MapLayerMouseEvent)
          if (hit) return latest.current.onSelect(hit.id)
          const country = pickCountry(e as MapLayerMouseEvent)
          if (country) latest.current.onSelectCountry(country.code)
        })

        setZoom(map.getZoom())
        setStatus(basemap.offline ? 'offline' : 'ready')
      })
    }).catch((err: unknown) => {
      console.error('[map] failed to initialise', err)
      if (!disposed) setStatus('error')
    })

    return () => {
      disposed = true
      clearTimeout(loadTimer)
      hoverPopup.remove()
      map?.remove()
      mapRef.current = null
    }
    // The map is created once; data updates are pushed by the effects below.
  }, [])

  // Keep sources in sync if the dataset changes.
  useEffect(() => {
    const map = mapRef.current
    if (!map || status === 'loading' || status === 'error') return
    ;(map.getSource(SRC.areas) as GeoJSONSource | undefined)?.setData(features.areas)
    ;(map.getSource(SRC.points) as GeoJSONSource | undefined)?.setData(features.points)
    ;(map.getSource(SRC.labels) as GeoJSONSource | undefined)?.setData(features.labels)
  }, [features, status])

  // Reflect filter and selection state.
  useEffect(() => {
    const map = mapRef.current
    if (!map || status === 'loading' || status === 'error') return
    for (const t of territories) {
      const state = { dimmed: !visibleIds.has(t.id), selected: t.id === selectedId }
      const sources: string[] = t.geometry.representation === 'boundary' ? [SRC.areas] : [SRC.points]
      if (map.getSource(SRC.labels)) sources.push(SRC.labels)
      for (const source of sources) map.setFeatureState({ source, id: t.id }, state)
    }
  }, [territories, visibleIds, selectedId, status])

  useEffect(() => {
    const map = mapRef.current
    if (!map || status === 'loading' || status === 'error') return
    for (const f of boundaries.countries.features) {
      map.setFeatureState({ source: SRC.countries, id: f.properties.code }, { selected: selectedCountries.includes(f.properties.code) })
    }
  }, [boundaries, selectedCountries, status])

  // Fly to the selected territory, leaving room for the information panel on the right.
  useEffect(() => {
    const map = mapRef.current
    const territory = territories.find((t) => t.id === selectedId)
    if (!map || !territory || status === 'loading' || status === 'error') return
    // The information panel may have just opened; measure the narrower container first.
    map.resize()
    map.fitBounds(territoryBounds(territory, features.areas), {
      padding: { top: 60, bottom: 60, left: 60, right: 60 },
      maxZoom: 10,
      duration: 900,
    })
  }, [selectedId, territories, features, status])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !viewRequest || status === 'loading' || status === 'error') return
    map.resize()
    if (viewRequest.view === 'world') map.flyTo({ ...config.map.worldView, duration: 1400 })
    else if (viewRequest.view === 'country') {
      const country = boundaries.countries.features.find((f) => f.properties.code === viewRequest.code)
      if (country && 'coordinates' in country.geometry) {
        map.fitBounds(boundsOf(country.geometry.coordinates), { padding: 50, maxZoom: 8, duration: 1200 })
      }
    } else map.fitBounds(config.map.initialBounds, { padding: 40, duration: 1400 })
  }, [viewRequest, boundaries, status])

  useEffect(() => {
    const map = mapRef.current
    if (!map || status === 'loading' || status === 'error') return
    map.setProjection({ type: projection })
  }, [projection, status])

  const notices: string[] = []
  if (zoom !== null && zoom < config.map.coverageNoticeBelowZoom) {
    notices.push('Conservation records cover the 22 catalogued African countries only')
  }

  return (
    <div className="relative h-full w-full">
      {/* Inline style: maplibre-gl.css sets `.maplibregl-map { position: relative }`. */}
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0 }}
        aria-label="Map of the catalogued countries"
        role="region"
      />
      {status === 'loading' && (
        <div className="absolute inset-0 grid place-items-center bg-cream/70 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm text-ink shadow-card">
            <span className="size-3 animate-spin rounded-full border-2 border-forest border-t-transparent" />
            Loading map…
          </div>
        </div>
      )}
      {notices.length > 0 && status !== 'error' && (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-1.5 px-4">
          {notices.map((n) => (
            <div key={n} className="rounded-full bg-forest-deep/90 px-4 py-1.5 text-center text-[12px] font-medium text-white shadow-card">
              {n}
            </div>
          ))}
        </div>
      )}
      {status === 'offline' && (
        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-amber-50 px-4 py-2 text-xs text-amber-900 shadow-card ring-1 ring-amber-200">
          Basemap unavailable — showing offline boundaries only. Territories remain selectable.
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 grid place-items-center bg-cream p-6 text-center text-sm text-ink">
          The map could not be loaded in this browser (WebGL may be disabled, or the map engine
          failed to start). Territory information is still available from the list on the left.
        </div>
      )}
    </div>
  )
}
