import type { StyleSpecification } from '@maplibre/maplibre-gl-style-spec'
import { palette } from './palette'

export interface BasemapResult {
  style: StyleSpecification
  /** True when the online basemap could not be loaded and the offline style is used. */
  offline: boolean
  /** First label layer of the basemap; our layers are inserted beneath it. */
  beforeLayerId?: string
}

/** Minimal style used when the basemap is unreachable: our own boundaries still render. */
export const offlineStyle: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [{ id: 'background', type: 'background', paint: { 'background-color': palette.water } }],
}

/**
 * Fetches the basemap style with a timeout. Never rejects: on failure it resolves to the
 * offline style so the map (and the territories on it) remain usable.
 */
export async function loadBasemap(url: string, timeoutMs: number): Promise<BasemapResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const style = (await res.json()) as StyleSpecification
    const firstSymbol = style.layers.find((l) => l.type === 'symbol')
    return { style, offline: false, beforeLayerId: firstSymbol?.id }
  } catch (err) {
    console.warn('[map] basemap unavailable, using offline style:', err)
    return { style: offlineStyle, offline: true }
  } finally {
    clearTimeout(timer)
  }
}
