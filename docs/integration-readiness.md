# Integration readiness

Status: Milestone 2, a standalone demonstration. Nothing described under "future approaches" is implemented.

## Current standalone architecture

A static single-page application (React 19, TypeScript, Vite, Tailwind CSS 4, MapLibre GL JS 6). It has no backend, authentication, database or dependency on the Vivid Space codebase or Lovable Cloud. `npm run build` produces a `dist/` folder that any static host can serve.

```
public/data/            static dataset (the only "backend")
  catalogue.json        all domain entities + sources
  geo/*.geojson         WASOP country outlines (Natural Earth) and Guinea-Bissau regions (geoBoundaries, ODbL)
src/domain/             framework-free domain model and logic
  types.ts              entity types
  catalogue.ts          filtering, territory profiles, challenge → activity links
  validate.ts           referential-integrity and provenance rules
src/data/               data-access boundary
  repository.ts         ConservationRepository interface + static-file implementation
  useExplorerData.ts    React loading/error state around the repository
src/state/selection.ts  Territory → Challenge → Activity selection, mirrored in the URL hash
src/map/                MapLibre presentation (no domain rules)
src/components/         dashboard UI (no data fetching); panel/ is the guided territory panel
src/config.ts           all environment-dependent settings
scripts/fetch-geodata.mjs  reproducible download of boundary data
```

Dependency direction: `components` and `map` → `domain` ← `data`. The domain layer imports nothing from React, MapLibre or the network.

## Domain entities (`src/domain/types.ts`)

| Entity | Purpose |
|---|---|
| `Country` | ISO 3166-1 alpha-3 code + name. Only `GNB` today. |
| `Territory` | A selectable place: administrative region, protected area or community protected area. Has a reference point, a geometry descriptor (`boundary` linked to a boundary feature, or `point` only), key facts, ecosystems and a verification status. Optional `parentId` for nesting. |
| `Ecosystem` | Controlled vocabulary (mangrove, intertidal flats, …). A territory's link to an ecosystem is a sourced `Statement`. |
| `ConservationTheme` | Controlled vocabulary used for filtering. A territory's themes are *derived* from its challenges and opportunities. |
| `ConservationChallenge` | A documented pressure, linked to territories and themes, described by sourced statements. |
| `RegenerativeOpportunity` | A *potential* activity linked to challenges, with an evidence level that is never `verified`, a rationale chain and an explicit `validationNeeded` list. |
| `Organisation` | An organisation with type, URL and a sourced role statement, linked to territories where that role is documented. Activities reference organisations through explicit, sourced `organisationLinks`. |
| `Source` | Provenance: title, publisher, URL, licence/terms, access date. |
| `Statement` | The unit of displayed information: `text` + `evidence` (`verified` / `interpretation` / `hypothesis`) + `sourceIds`. |

The challenge → activity workflow is derived from existing links rather than new data:
- `opportunitiesForChallenge` and `unlinkedOpportunities` use `RegenerativeOpportunity.challengeIds`.
- Organisations are linked to an activity only through explicit `RegenerativeOpportunity.organisationLinks`. Each link is a sourced statement marked `related-initiative` (documented work, verified) or `potential-stakeholder` (an interpretation, to be validated). Sharing a citation never creates a link. An organisation that only appears as a source publisher is shown in the source list, not as a stakeholder.

`validateCatalogue()` enforces the provenance rules: verified and interpretation statements must cite a source, every reference must resolve, opportunities need validation items, and an opportunity may only respond to challenges documented in one of its territories. A test runs it against the published dataset.

## Data-access boundary

```ts
interface ConservationRepository {
  getCatalogue(): Promise<Catalogue>
  getBoundaries(): Promise<BoundaryLayers>
}
```

The UI receives a repository instance (created once in `App.tsx`) and never calls `fetch` itself. `createStaticRepository(baseUrl)` reads JSON files. Its base URL comes from `VITE_DATA_BASE_URL`, so the same files can be served from a CDN or API gateway without a code change.

## Potential future integration approaches (not implemented)

1. **Remote API, same shapes.** Implement `createApiRepository()` that returns the same `Catalogue` and `BoundaryLayers` from a Vivid Space or shared conservation API. Then swap it in `App.tsx`. If the dataset grows, add narrower methods (e.g. `getTerritoryProfile(id)`) to the interface.
2. **Embed in the Vivid Space platform.** `src/domain` and `src/data` are framework-light and could move into a shared package. The `Explorer` view could be mounted as a route or an iframe/micro-frontend. Auth would wrap the repository (e.g. a token-injecting `fetch`), not the domain.
3. **Link to business planning.** `RegenerativeOpportunity.id` and `Territory.id` are stable string ids that a future Regenerative Business Plan Builder could reference. The URL hash (`#t=<territory>&c=<challenge>&o=<activity>`) is already a stable deep link another application could open.
4. **Richer geometry.** `TerritoryGeometry` already distinguishes boundary from point. Licensed protected-area polygons or vector tiles could be added as another boundary source without UI changes.

## Decisions intentionally deferred

- Backend, database or PostGIS, and data-editing workflows.
- Authentication, user accounts and shared sessions with Vivid Space.
- Internationalisation (UI is English. Portuguese is a likely next language).
- A formal schema (e.g. JSON Schema / zod) for runtime validation of API responses. Today TypeScript types plus `validateCatalogue` cover the static file.
- Satellite imagery. The keyless ESA WorldCover 2021 Sentinel-2 composite was evaluated and removed, because it has large coverage gaps over the Bijagós. The other free sources were non-commercial (EOX), needed keys (Esri, Mapbox, MapTiler) or were too coarse (NASA GIBS). Offline tile caching is also deferred.
- Production hosting, analytics and monitoring.
- How opportunities would be scored or prioritised. No scoring is shown, to avoid implying validation.

## Known assumptions and limitations

- **Geographic scope:** the 13 WASOP countries. Guinea-Bissau has detailed research (challenges, potential activities, organisations). Elsewhere the catalogue is a researched selection of coastal and marine Ramsar sites plus a few other sourced areas, without challenges or activities. See `docs/coverage-report.md`.
- **Region polygons are administrative boundaries** (geoBoundaries ADM1, derived from OpenStreetMap). They are *not* the boundaries of the biosphere reserve, Ramsar sites, national parks or the World Heritage property. Each territory panel states this.
- **Protected areas are points.** Official boundaries are held in WDPA/Protected Planet, which was not used because its terms restrict redistribution. Reference points come from Wikidata (CC0) and are representative, not centroids of official boundaries.
- **The basemap** is OpenFreeMap (free, no key, OpenStreetMap data). If it can't be reached, the app falls back to an offline style that shows only the bundled boundaries, without labels.
- **The dataset is small and hand-curated.** Facts were checked against the cited pages on the access date shown. Sources can change, so re-verify before external publication.
- **Copyrighted sources** are cited for reference only: the app stores short factual paraphrases and links, not copied content.
- **Desktop-first layout.** The minimum supported width is 1024 px. Mobile is out of scope for Milestone 1.
- **Bundle size.** The JS bundle is ~1.3 MB (~370 kB gzip), mostly MapLibre. The MapLibre worker ships as a separate `.mjs` asset (registered via `setWorkerUrl` in `src/map/ExplorerMap.tsx`), so a static host must serve `.mjs` files with a JavaScript MIME type.
