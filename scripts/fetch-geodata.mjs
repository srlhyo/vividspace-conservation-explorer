// Downloads the administrative boundaries used by the explorer and writes them to
// public/data/geo. URLs are pinned to a geoBoundaries release commit so the output is
// reproducible. Run with: npm run data:geo
//
// Source: geoBoundaries gbOpen (Runfola et al. 2020), derived from OpenStreetMap.
// Licence: Open Data Commons Open Database License 1.0 (ODbL) — © OpenStreetMap contributors.
import { mkdir, writeFile } from 'node:fs/promises'

const RELEASE = 'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/GNB'
const OUT_DIR = new URL('../public/data/geo/', import.meta.url)

const layers = [
  { level: 'ADM0', file: 'gnb-adm0.geojson' },
  { level: 'ADM1', file: 'gnb-adm1.geojson' },
]

const round = (coords) =>
  typeof coords[0] === 'number'
    ? coords.map((n) => Math.round(n * 1e5) / 1e5)
    : coords.map(round)

await mkdir(OUT_DIR, { recursive: true })

for (const { level, file } of layers) {
  const url = `${RELEASE}/${level}/geoBoundaries-GNB-${level}_simplified.geojson`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  const data = await res.json()

  const features = data.features.map((f) => ({
    type: 'Feature',
    properties: {
      shapeISO: f.properties.shapeISO ?? null,
      shapeName: f.properties.shapeName,
      level,
    },
    geometry: { type: f.geometry.type, coordinates: round(f.geometry.coordinates) },
  }))

  const out = {
    type: 'FeatureCollection',
    metadata: {
      source: url,
      dataset: `geoBoundaries gbOpen GNB ${level} (simplified)`,
      licence: 'ODbL-1.0',
      attribution: 'geoBoundaries (Runfola et al. 2020); © OpenStreetMap contributors',
    },
    features,
  }
  await writeFile(new URL(file, OUT_DIR), JSON.stringify(out))
  console.log(`wrote ${file} (${features.length} features)`)
}
