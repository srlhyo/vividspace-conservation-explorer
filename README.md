# Vivid Space · Conservation Opportunity Explorer

A standalone geospatial dashboard prototype for discussion between Vivid Space and BlueSeeds. It covers conservation territories in **Guinea-Bissau** (the Bijagós Archipelago and the Cacheu region) and guides the viewer through:

**Territory → Conservation challenge → Potential regenerative activity → Supporting evidence → Next steps**

Every statement is labelled by evidence level and linked to its source.

> This is a discussion prototype. It is not an existing joint product or an agreed partnership. Potential activities are discussion starters, not validated businesses.

## Develop

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run typecheck` | TypeScript check (app, tests, config) |
| `npm test` | Unit tests and dataset integrity tests (Vitest) |
| `npm run lint` | oxlint |
| `npm run build` | Typecheck and production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run data:geo` | Re-download boundary files from geoBoundaries (pinned release) |

## Deploy (static hosting)

The app is a static site with no server-side component.

1. Run `npm ci && npm run build`.
2. Upload the contents of `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 + CloudFront, nginx).

Notes:

- **Sub-path hosting.** If the site is served from a sub-path (e.g. `https://example.org/explorer/`), build with `npm run build -- --base=/explorer/`. Asset, data and icon URLs follow the base automatically.
- **No rewrite rules needed.** Navigation state lives in the URL hash (`#t=…&c=…&o=…`), so any static host works without SPA rewrites.
- **MIME type for `.mjs`.** The map engine's worker ships as `assets/maplibre-gl-worker-*.mjs`. The host must serve `.mjs` as `text/javascript`. Common hosts do this by default.
- **Optional configuration** (build-time, see `.env.example` and `src/config.ts`):
  - `VITE_DATA_BASE_URL` serves the dataset from elsewhere.
  - `VITE_BASEMAP_STYLE_URL` sets another MapLibre basemap style.
- **External services at runtime.** These are free and need no API key:
  - OpenFreeMap basemap tiles. If they are unreachable, the app falls back to its bundled boundaries.
  - Google Fonts. If unreachable, the app falls back to system fonts.

## Demo walkthrough

1. Select **Cacheu River Mangroves Natural Park** on the map or in the list.
2. Open the challenge **Fuelwood demand on mangroves**.
3. Open **Women-led solar salt production**. Read the evidence chain from verified facts to the proposal, then the questions to validate, the organisations in the cited evidence, and the sources.
4. Use the breadcrumb to go back. Try **Orango Islands National Park → Community-owned, low-impact tourism → Also considered for: Bijagós Archipelago**.

The URL updates as you go, so a prepared view can be bookmarked or reopened after a reload.

## Data

- `public/data/catalogue.json` holds territories, ecosystems, themes, challenges, potential activities, organisations and sources. The rules every entry must follow are enforced by `src/domain/validate.ts` and `src/data/dataset.test.ts`.
- `public/data/geo/` holds the Guinea-Bissau country and region boundaries from geoBoundaries gbOpen (derived from OpenStreetMap, ODbL 1.0). These are **administrative** boundaries. Protected areas are shown as location points only, because official protected-area boundaries (WDPA) are not used.

Evidence levels:

- **Verified fact**: stated directly by a cited source.
- **Research-backed interpretation**: a reasoned link between cited evidence and the territory.
- **Hypothesis**: an idea that needs community, regulatory and market validation.

The **About the data** button in the app lists every source with its licence or terms. Architecture and future integration notes are in [`docs/integration-readiness.md`](docs/integration-readiness.md).

### Adding data

1. Add a `Source` (URL, publisher, licence, access date) before citing it.
2. Add or extend entities in `catalogue.json`, citing `sourceIds` on every verified or interpretation statement. Link a potential activity only to challenges documented in one of its territories.
3. Run `npm test`. The integrity tests fail on missing sources, dangling references, mismatched challenge links or out-of-area coordinates.
