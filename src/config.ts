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
    /** Initial focus: Guinea-Bissau [west, south, east, north]. */
    initialBounds: [-16.9, 10.75, -13.6, 12.75] as [number, number, number, number],
    /** "Explore world" camera: whole globe, centred on the Atlantic between Africa and Brazil. */
    worldView: { center: [-5, 8] as [number, number], zoom: 1.3 },
    /** Below this zoom the map shows that catalogue coverage is Guinea-Bissau only. */
    coverageNoticeBelowZoom: 5,
    /**
     * Optional satellite layer: ESA WorldCover 2021 Sentinel-2 true-colour composite (10 m),
     * CC BY 4.0, served without a key by VITO's Terrascope WMTS. Tiles exist for zoom 8–14
     * over land only; the standard basemap stays visible underneath elsewhere.
     */
    satellite: {
      tileUrl:
        env.VITE_SATELLITE_TILE_URL ??
        'https://wmts.terrascope.be/?service=WMTS&request=GetTile&version=1.0.0&layer=esa-worldcover-s2rgbnir-10m-2021-v2_tcc&style=default&format=image/png&tilematrixset=EPSG:3857&tilematrix={z}&tilerow={y}&tilecol={x}&TIME=2021-01-01',
      minzoom: 8,
      maxzoom: 14,
      provider: 'ESA WorldCover 2021 Sentinel-2 composite (10 m)',
      attribution:
        '© <a href="https://esa-worldcover.org" target="_blank" rel="noreferrer">ESA WorldCover project</a> 2021 / Contains modified Copernicus Sentinel data (2021) processed by ESA WorldCover consortium (CC BY 4.0)',
    },
  },
} as const

export type AppConfig = typeof config
