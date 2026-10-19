# Vivid Space · Conservation Opportunity Explorer

A standalone geospatial dashboard prototype for discussion between Vivid Space and BlueSeeds. It shows conservation territories in **Guinea-Bissau** (Bijagós Archipelago and Cacheu region) with their ecosystems, documented challenges, stakeholders and *potential* regenerative activities. Every statement is labelled by evidence level and linked to its source.

> Discussion prototype: this is not an existing joint product or agreed partnership.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run typecheck` | TypeScript project check (app, tests, config) |
| `npm test` | Unit tests + dataset integrity tests (Vitest) |
| `npm run lint` | oxlint |
| `npm run build` | Typecheck + production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run data:geo` | Re-download the boundary files from geoBoundaries (pinned release) |

Configuration is optional; see `.env.example` and `src/config.ts`.

## Data

- `public/data/catalogue.json`: territories, ecosystems, themes, challenges, opportunities, organisations and sources. The rules every entry must follow are enforced by `src/domain/validate.ts` and `src/data/dataset.test.ts`.
- `public/data/geo/`: Guinea-Bissau country and region boundaries from geoBoundaries gbOpen (derived from OpenStreetMap, ODbL 1.0).

Evidence levels:

- **Verified fact**: stated directly by a cited source.
- **Research-backed interpretation**: a reasoned link between cited evidence and the territory.
- **Hypothesis**: an idea needing community, regulatory and market validation.

The **About the data** button in the app lists every source with its licence or terms. The architecture and future integration notes are in [`docs/integration-readiness.md`](docs/integration-readiness.md).

### Adding data

1. Add a `Source` (URL, publisher, licence, access date) before citing it.
2. Add or extend entities in `catalogue.json`, citing `sourceIds` on every verified or interpretation statement.
3. Run `npm test`. The integrity tests fail on missing sources, dangling references or out-of-area coordinates.
