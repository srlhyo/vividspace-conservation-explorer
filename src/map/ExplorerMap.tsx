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
  /** Camera request from the dashboard; a new `id` triggers it. */
  viewRequest: { view: 'guinea-bissau' | 'world'; id: number } | null
  projection: 'mercator' | 'globe'
}

type MapStatus = 'loading' | 'ready' | 'offline' | 'error'

const SRC = {
  country: 'gnb-country',
  regions: 'gnb-regions',
  areas: 'territory-areas',
  points: 'territory-points',
  labels: 'territory-labels',
} as const

const INTERACTIVE_LAYERS = ['territory-points-circle', 'territory-areas-fill']

const ATTRIBUTION =
  '<a href="https://www.geoboundaries.org" target="_blank" rel="noreferrer">geoBoundaries</a> (ODbL) · ' +
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

/** Bounding box of a territory: its polygon if it has one, else a small box around its point. */
function territoryBounds(territory: Territory, areas: FeatureCollection) {
  const bounds = new maplibregl.LngLatBounds()
  const area = areas.features.find((f) => f.properties?.territoryId === territory.id)
  const extend = (c: unknown): void => {
    if (Array.isArray(c) && typeof c[0] === 'number') bounds.extend(c as [number, number])
    else if (Array.isArray(c)) c.forEach(extend)
  }
  if (area && 'coordinates' in area.geometry) extend(area.geometry.coordinates)
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
  viewRequest,
  projection,
}: ExplorerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [status, setStatus] = useState<MapStatus>('loading')
  const [zoomedOut, setZoomedOut] = useState(false)
  const features = useMemo(() => territoryFeatures(boundaries, territories), [boundaries, territories])

  // Handlers registered once on the map read the latest props through a ref.
  const latest = useRef({ onSelect, visibleIds, boundaries, features })
  useEffect(() => {
    latest.current = { onSelect, visibleIds, boundaries, features }
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
        if (map) setZoomedOut(map.getZoom() < config.map.coverageNoticeBelowZoom)
      })
      map.on('error', (e: maplibregl.ErrorEvent) => console.warn('[map]', e.error?.message ?? e))

      map.on('load', () => {
        clearTimeout(loadTimer)
        if (!map) return
        const { boundaries, features } = latest.current
        const before = basemap.beforeLayerId
        map.addSource(SRC.country, { type: 'geojson', data: boundaries.country })
        map.addSource(SRC.regions, { type: 'geojson', data: boundaries.regions })
        map.addSource(SRC.areas, { type: 'geojson', data: features.areas, promoteId: 'territoryId' })
        map.addSource(SRC.points, { type: 'geojson', data: features.points, promoteId: 'territoryId' })

        if (basemap.offline) {
          map.addLayer({
            id: 'country-fill',
            type: 'fill',
            source: SRC.country,
            paint: { 'fill-color': palette.land },
          })
        }
        map.addLayer(
          {
            id: 'regions-line',
            type: 'line',
            source: SRC.regions,
            paint: { 'line-color': palette.muted, 'line-width': 0.8, 'line-dasharray': [3, 2] },
          },
          before,
        )
        map.addLayer(
          {
            id: 'country-line',
            type: 'line',
            source: SRC.country,
            paint: { 'line-color': palette.forest, 'line-width': 1.6, 'line-opacity': 0.7 },
          },
          before,
        )
        const selected: ExpressionSpecification = ['boolean', ['feature-state', 'selected'], false]
        const hidden: ExpressionSpecification = ['boolean', ['feature-state', 'hidden'], false]
        const hovered: ExpressionSpecification = ['boolean', ['feature-state', 'hover'], false]
        map.addLayer(
          {
            id: 'territory-areas-fill',
            type: 'fill',
            source: SRC.areas,
            paint: {
              'fill-color': ['case', selected, palette.gold, palette.forestLight],
              'fill-opacity': ['case', hidden, 0, selected, 0.32, hovered, 0.28, 0.16],
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
              'line-color': ['case', selected, palette.goldDark, palette.forest],
              'line-width': ['case', selected, 2.6, 1.4],
              'line-opacity': ['case', hidden, 0.25, 1],
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
            'circle-radius': ['case', selected, 9, hovered, 8, 6.5],
            'circle-color': ['case', selected, palette.gold, palette.forest],
            'circle-stroke-color': palette.white,
            'circle-stroke-width': 2,
            'circle-opacity': ['case', hidden, 0, 1],
            'circle-stroke-opacity': ['case', hidden, 0, 1],
          },
        })

        // Labels need glyphs, which only the online basemap provides.
        if (!basemap.offline) {
          map.addSource(SRC.labels, { type: 'geojson', data: features.labels, promoteId: 'territoryId' })
          const textPaint: SymbolLayerSpecification['paint'] = {
            'text-color': ['case', selected, palette.goldDark, palette.forest],
            'text-halo-color': palette.white,
            'text-halo-width': 2,
            'text-opacity': ['case', hidden, 0, 1],
          }
          // Regions: spaced capitals, placed at the region's reference point.
          map.addLayer({
            id: 'territory-region-labels',
            type: 'symbol',
            source: SRC.labels,
            filter: ['==', ['get', 'representation'], 'boundary'],
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

        const pick = (e: MapLayerMouseEvent): { id: string; name: string } | null => {
          if (!map) return null
          // Results are top-most first, so a protected-area point wins over the region around it.
          const hits = map.queryRenderedFeatures(e.point, { layers: INTERACTIVE_LAYERS })
          const hit = hits.find((f: maplibregl.MapGeoJSONFeature) => latest.current.visibleIds.has(String(f.properties.territoryId)))
          return hit ? { id: String(hit.properties.territoryId), name: String(hit.properties.name) } : null
        }

        map.on('mousemove', (e: maplibregl.MapMouseEvent) => {
          if (!map) return
          const hit = pick(e as MapLayerMouseEvent)
          map.getCanvas().style.cursor = hit ? 'pointer' : ''
          if (hit?.id !== hoveredId) setHover(hit?.id ?? null)
          if (hit) hoverPopup.setLngLat(e.lngLat).setText(hit.name).addTo(map)
          else hoverPopup.remove()
        })
        map.on('mouseout', () => {
          setHover(null)
          hoverPopup.remove()
        })
        map.on('click', (e: maplibregl.MapMouseEvent) => {
          const hit = pick(e as MapLayerMouseEvent)
          if (hit) latest.current.onSelect(hit.id)
        })

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
      const state = { hidden: !visibleIds.has(t.id), selected: t.id === selectedId }
      const sources: string[] = t.geometry.representation === 'boundary' ? [SRC.areas] : [SRC.points]
      if (map.getSource(SRC.labels)) sources.push(SRC.labels)
      for (const source of sources) map.setFeatureState({ source, id: t.id }, state)
    }
  }, [territories, visibleIds, selectedId, status])

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
    else map.fitBounds(config.map.initialBounds, { padding: 40, duration: 1400 })
  }, [viewRequest, status])

  useEffect(() => {
    const map = mapRef.current
    if (!map || status === 'loading' || status === 'error') return
    map.setProjection({ type: projection })
  }, [projection, status])

  return (
    <div className="relative h-full w-full">
      {/* Inline style: maplibre-gl.css sets `.maplibregl-map { position: relative }`. */}
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0 }}
        aria-label="Map"
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
      {zoomedOut && status !== 'error' && (
        <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-forest-deep/90 px-4 py-1.5 text-[12px] font-medium text-white shadow-card">
          Conservation data currently covers Guinea-Bissau only
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
