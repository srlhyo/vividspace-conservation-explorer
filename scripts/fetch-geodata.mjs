// Downloads the boundaries used by the explorer and writes them to public/data/geo.
// URLs are pinned to release tags/commits so the output is reproducible. Run with: npm run data:geo
//
// - WASOP country outlines: Natural Earth 1:50m admin-0 countries, v5.1.2 — public domain.
// - Guinea-Bissau regions: geoBoundaries gbOpen ADM1 (Runfola et al. 2020), derived from
//   OpenStreetMap — ODbL 1.0, © OpenStreetMap contributors.
import { mkdir, writeFile } from 'node:fs/promises'

const OUT_DIR = new URL('../public/data/geo/', import.meta.url)
const NATURAL_EARTH =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_admin_0_countries.geojson'
const GEOBOUNDARIES_ADM1 =
  'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/GNB/ADM1/geoBoundaries-GNB-ADM1_simplified.geojson'

/** The 13 West Africa Sustainable Ocean Programme (WASOP) countries, ISO 3166-1 alpha-3. */
const WASOP = ['BEN', 'CPV', 'CIV', 'GMB', 'GHA', 'GIN', 'GNB', 'LBR', 'MRT', 'NGA', 'SEN', 'SLE', 'TGO']

const round = (coords) =>
  typeof coords[0] === 'number'
    ? coords.map((n) => Math.round(n * 1e4) / 1e4)
    : coords.map(round)

async function download(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  return res.json()
}

await mkdir(OUT_DIR, { recursive: true })

const ne = await download(NATURAL_EARTH)
const countries = ne.features
  .filter((f) => WASOP.includes(f.properties.ADM0_A3))
  .map((f) => ({
    type: 'Feature',
    properties: { code: f.properties.ADM0_A3, name: f.properties.NAME },
    geometry: { type: f.geometry.type, coordinates: round(f.geometry.coordinates) },
  }))
if (countries.length !== WASOP.length) throw new Error(`Expected ${WASOP.length} countries, got ${countries.length}`)
await writeFile(
  new URL('wasop-countries.geojson', OUT_DIR),
  JSON.stringify({
    type: 'FeatureCollection',
    metadata: { source: NATURAL_EARTH, dataset: 'Natural Earth 1:50m admin-0 countries v5.1.2', licence: 'Public domain' },
    features: countries,
  }),
)
console.log(`wrote wasop-countries.geojson (${countries.length} features)`)

const adm1 = await download(GEOBOUNDARIES_ADM1)
await writeFile(
  new URL('gnb-adm1.geojson', OUT_DIR),
  JSON.stringify({
    type: 'FeatureCollection',
    metadata: {
      source: GEOBOUNDARIES_ADM1,
      dataset: 'geoBoundaries gbOpen GNB ADM1 (simplified)',
      licence: 'ODbL-1.0',
      attribution: 'geoBoundaries (Runfola et al. 2020); © OpenStreetMap contributors',
    },
    features: adm1.features.map((f) => ({
      type: 'Feature',
      properties: { shapeISO: f.properties.shapeISO ?? null, shapeName: f.properties.shapeName, level: 'ADM1' },
      geometry: { type: f.geometry.type, coordinates: roundFine(f.geometry.coordinates) },
    })),
  }),
)
console.log(`wrote gnb-adm1.geojson (${adm1.features.length} features)`)

function roundFine(coords) {
  return typeof coords[0] === 'number' ? coords.map((n) => Math.round(n * 1e5) / 1e5) : coords.map(roundFine)
}
