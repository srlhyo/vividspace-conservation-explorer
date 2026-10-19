# Vivid Space · Conservation Opportunity Explorer

A standalone geospatial dashboard prototype for discussion between Vivid Space and BlueSeeds. It covers marine and coastal conservation areas across the **13 West Africa Sustainable Ocean Programme (WASOP) countries**, with detailed research for Guinea-Bissau (the Bijagós Archipelago, the Cacheu region and Cantanhez National Park) and one researched area in each of the other 12 countries, and guides the viewer through:

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
- **Security headers.** `public/_headers` (copied to `dist/`) sets a Content-Security-Policy and related headers on Netlify. It also works on Cloudflare Pages; other hosts need equivalent configuration. The policy allows only the site itself and `tiles.openfreemap.org`. If you change `VITE_DATA_BASE_URL` or `VITE_BASEMAP_STYLE_URL` to another host, add that host to `connect-src` (and `img-src` for raster tiles).
- **Optional configuration** (build-time, see `.env.example` and `src/config.ts`):
  - `VITE_DATA_BASE_URL` serves the dataset from elsewhere.
  - `VITE_BASEMAP_STYLE_URL` sets another MapLibre basemap style.
- **External services at runtime.** The only one is free and needs no API key. Fonts (Outfit, Figtree, OFL-1.1) are self-hosted, so visitors' browsers contact only the site and this service:
  - OpenFreeMap basemap tiles. If they are unreachable, the app falls back to its bundled boundaries.

## Demo walkthrough

1. Select **Cacheu River Mangroves Natural Park** on the map or in the list.
2. Open the challenge **Fuelwood demand on mangroves**.
3. Open **Women-led solar salt production**. Read the evidence chain from verified facts to the proposal, then the questions to validate, the organisations with documented work on related initiatives (and the potential stakeholder to consult), and the sources.
4. Use the breadcrumb to go back. Try **Orango Islands National Park → Community-owned, low-impact tourism → Also considered for: Bijagós Archipelago**.
5. Choose another country, for example **The Gambia → Tanbi Wetlands Complex → Mangrove cutting and harvesting of juvenile shellfish → Women-led oyster and cockle products under co-management**, or **Mauritania → Parc National du Banc d'Arguin**.

The URL updates as you go, so a prepared view can be bookmarked or reopened after a reload.

Use **Explore world** to zoom out to a global view, and switch between the **2D map** and the **3D globe**. **Reset view** returns to the WASOP regional overview. The global view is for geographic orientation only: the conservation catalogue covers the 13 WASOP countries.

## Data

- `public/data/catalogue.json` holds territories, ecosystems, themes, challenges, potential activities, organisations and sources. The rules every entry must follow are enforced by `src/domain/validate.ts` and `src/data/dataset.test.ts`.
- `public/data/geo/` holds the 13 WASOP country outlines (Natural Earth 1:50m, public domain) and the Guinea-Bissau region boundaries (geoBoundaries gbOpen, derived from OpenStreetMap, ODbL 1.0). Protected areas are shown as reference points only, because official protected-area boundaries (WDPA) are not used.
- Outside Guinea-Bissau the catalogue is a researched selection, mainly coastal and marine Ramsar sites from the official Ramsar annotated lists. It is **not an exhaustive official inventory**. One area per country has researched challenges, potential activities and organisations (named in the coverage report); the other sites are location and designation records only. See [`docs/coverage-report.md`](docs/coverage-report.md) (regenerate with `npm run data:coverage`).

Filters (ecosystem type, conservation theme) use the attributes documented for each territory in the cited sources. They are not maps of where ecosystems or conditions occur. Matching territories stay green on the map and non-matching ones turn grey. The sidebar and the map both show how many territories match, with a one-click way to clear the filters.

Evidence levels:

- **Verified fact**: stated directly by a cited source.
- **Research-backed interpretation**: a reasoned link between cited evidence and the territory.
- **Hypothesis**: an idea that needs community, regulatory and market validation.

The **About the data** button in the app lists every source with its licence or terms. Architecture and future integration notes are in [`docs/integration-readiness.md`](docs/integration-readiness.md).

### Adding data

1. Add a `Source` (URL, publisher, licence, access date) before citing it.
2. Add or extend entities in `catalogue.json`, citing `sourceIds` on every verified or interpretation statement. Link a potential activity only to challenges documented in one of its territories.
3. Run `npm test`. The integrity tests fail on missing sources, dangling references, mismatched challenge links or out-of-area coordinates.
