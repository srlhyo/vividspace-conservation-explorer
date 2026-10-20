# Conservation Explorer: protected-area inventory handoff

Prepared for Fatima on 2026-10-20 from dataset v0.5.0 of the VividSpace Conservation Opportunity Explorer. This package holds the dataset behind the dashboard as linked spreadsheets, plus the list of verified areas that are not on the map yet.

## What is inside

| File | What it is |
|---|---|
| `coverage-report.md` | Start here. Per-country inventory status, a reconciliation table (areas listed by the national sources reviewed, mapped or unmapped) and the known gaps. |
| `data-dictionary.md` | What every entity, field and relationship means, and the rules behind them. |
| `data-export/*.csv` | The complete dashboard catalogue as 13 linked tables (see `data-export/README.md` for row counts). |
| `inventory/uncatalogued-areas.csv` | 448 areas verified in official or authoritative sources but **not on the map**, because no official or openly licensed location was found. |
| `inventory/research/<ISO3>.json` | The desk research for each country: the official inventory found, stated official totals, every verified area and the gaps. |

## Totals

- 22 countries: the 13 WASOP countries and 9 additional African countries.
- 387 mapped areas: 266 with national or community legal protection, 4 proposed, and 117 with an international designation only (Ramsar site, World Heritage property or biosphere reserve). There is also 1 context record, the Cacheu Region, which is an administrative region and not a protected area.
- 719 nationally designated or proposed areas were found in the national sources reviewed: 271 are on the map, and 448 are in `uncatalogued-areas.csv`.
- Every country's inventory is **partial**. None has been verified as exhaustive.

## How to use the files

- Open the CSVs in a spreadsheet or load them into a database. They are UTF-8 with a byte-order mark, so accented names display correctly. Cells holding several values separate them with `; `.
- Join the tables on their ids. `territories.csv` links to `countries.csv` through `country_code`. `territory_designations.csv` and `territory_ecosystems.csv` link through `territory_id`. Every `source_ids` cell links to `sources.csv`. The full mapping is at the end of `data-dictionary.md`.
- Use `protection_category` in `territories.csv` to separate the kinds of status. National legal protection, `international-designation`, `proposed` and `context` are different things and should not be added together as one kind of protected area.
- Each record in `uncatalogued-areas.csv` has a stable `record_id`, its sources and the Wikidata item where one was found. Adding a location for a record is the step needed to put it on the map.

## Limitations

- **Not exhaustive.** Forest reserves, classified forests, hunting zones and similar categories are often counted but not named in official sources (for example about 994 forest reserves in Nigeria and 506 in Uganda). These are recorded as counts in the gaps, not as rows.
- **Points, not boundaries.** Locations are reference points from the official source, Ramsar, UNESCO or Wikidata (CC0). They are not boundaries or official centroids, and some are only the feature an area is named after; `geometry_caveat` says which applies.
- **No WDPA / Protected Planet data.** It was not used, because its licence does not allow redistribution. The inventory has therefore not been compared with that global compilation.
- **Source licences.** Most sources are cited for reference: facts and short quotes only. Check `licence` in `sources.csv` before reusing any source's content. Wikidata coordinates are public domain (CC0).
- **Evidence levels.** Every sentence in `statements.csv` is marked `verified`, `interpretation` or `hypothesis`. Potential regenerative activities are never verified facts and need field, regulatory and market validation.
- **Research depth.** Conservation challenges, organisations and potential activities have been researched only for Guinea-Bissau and for one area in each of the other 12 WASOP countries.
- **Snapshot.** The files reflect the sources as checked on the access dates shown. Some legal texts could not be retrieved (for example Tanzania's and Uganda's legal databases block automated access). Conflicts between sources are recorded in the notes and the coverage report.

The files are generated from the project repository by `npm run data:export` and `npm run data:coverage`, and the dashboard reads the same catalogue. Some links in `data-dictionary.md` point to source files in that repository, which are not part of this package.
