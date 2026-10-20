// Central application configuration. Every environment-dependent value lives here;
// override via VITE_* variables (see .env.example).

const env = import.meta.env

export const config = {
  appName: 'Conservation Opportunity Explorer',
  brand: {
    name: 'Vivid Space',
    url: 'https://vividspace.io',
    iconUrl: `${env.BASE_URL}brand/vivid-space-icon.png`,
  },
  /** Base URL of the static dataset. Point this at an API later without touching the UI. */
  dataBaseUrl: env.VITE_DATA_BASE_URL ?? `${env.BASE_URL}data`,
  map: {
    /** Free, keyless vector basemap (OpenFreeMap, OpenStreetMap data). */
    basemapStyleUrl: env.VITE_BASEMAP_STYLE_URL ?? 'https://tiles.openfreemap.org/styles/positron',
    basemapTimeoutMs: 8000,
    /** After this, a map that has not finished loading is reported as failed. */
    loadTimeoutMs: 20000,
    /** Initial focus: all catalogued countries, Cabo Verde to Tanzania and Egypt to Namibia [west, south, east, north]. */
    initialBounds: [-25.5, -29.0, 41.0, 31.8] as [number, number, number, number],
    /** "Explore world" camera: whole globe, centred on the Atlantic between Africa and Brazil. */
    worldView: { center: [-5, 8] as [number, number], zoom: 1.3 },
    /** Below this zoom the map notes which countries the records cover. */
    coverageNoticeBelowZoom: 3,
  },
} as const

export type AppConfig = typeof config
