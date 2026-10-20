# Catalogue build

Builds `public/data/catalogue.json` and `docs/inventory/uncatalogued-areas.csv` from committed inputs only. Then regenerate the CSV export and coverage report:

```sh
npm run data:build      # = python3 scripts/inventory/build.py && npm run data:export && npm run data:coverage
```

It needs Python 3.9 or later (standard library only) and Node. Nothing is downloaded. The output is deterministic: rebuilding without changing an input reproduces the committed files byte for byte, so `git diff` shows the effect of any change to an input.

**Edit the inputs, not the outputs.** A rebuild overwrites `public/data/catalogue.json`, so change the inputs below and rebuild.

## Stages

| Script | Does |
|---|---|
| `stage1.py` | Starts from the curated base catalogue, adds the 9 additional countries, vocabularies and protection categories, and adds every Ramsar site not yet catalogued. |
| `stage2.py` | Merges the verified areas from each country's research into existing records (same name, or an `overrides.json` merge), or adds them with an official or Wikidata (CC0) location. Areas with no usable location go to the unmapped list. |
| `stage3.py` | Adds biosphere reserves and World Heritage designations, adds the researched challenges and potential activities for one area per additional country, sets the country inventory status and comparison, and writes the outputs. |
| `norm.py`, `geo.py` | Name normalisation for matching, and the point-in-country test (committed outlines in `public/data/geo/countries.geojson`, with 0.35° of tolerance around coasts and borders). |

Intermediate files go to a temporary directory. To keep them, pass a directory: `python3 scripts/inventory/build.py /path/to/dir`. `stage2-review.txt` there lists name matches, merges and rejected locations for review.

## Inputs

| Input | What it is | Origin and licence |
|---|---|---|
| `inputs/base-catalogue.json` | The curated catalogue before the inventory build: Guinea-Bissau and WASOP research, challenges, activities, organisations and sources. | Project research. Edit here to change curated content. |
| `../../docs/inventory/research/<ISO3>.json` | Desk research per country: official inventory, stated counts, verified areas and gaps. | Project research. |
| `inputs/ramsar-sites.json` | Facts from the Ramsar annotated lists (RSIS PDF exports, parsed with `pdftotext`): number, name, region, area, designation date and coordinates. `habitatTerms` holds the habitat terms found in each site summary; the summaries themselves are not stored, because Ramsar content is cited for reference only. | Ramsar Convention Secretariat; facts cited. |
| `inputs/biosphere-reserves.json` | Facts from UNESCO Man and the Biosphere pages (`unesco.org/en/mab/<slug>`): title, year, country, area and reference point. | UNESCO; facts cited. |
| `inputs/world-heritage.json` | Natural and mixed World Heritage properties for the 22 countries, from the UNESCO State Party pages and the list's GeoJSON endpoint. | UNESCO; facts cited. |
| `inputs/wikidata/<ISO3>.json`, `inputs/wikidata-items.json`, `inputs/wikidata-name-search.json` | Wikidata protected-area items per country, items looked up by id, and name-search candidates, with labels and coordinates. | Wikidata, CC0. |
| `inputs/area-research/<ISO3>.json` | Researched conservation challenges, potential regenerative activities, organisations, sources and key facts for one area in each of the 9 additional countries (shape as in the files; `territoryId` names the area). Each was checked statement by statement against its sources. Activities are never `verified`; organisation links are `related-initiative` only when a verified statement documents the organisation's work there. | Project research; sources cited for reference unless their licence says otherwise. |
| `inputs/overrides.json` | Reviewed decisions: `merge` (research area → catalogue record; `noMerge` is also supported), `overlap`, `acceptWikidata`, `rejectWikidata` and `rejectWikidataWhereNote`. | Project review. |
| `inputs/eco-false.json` | Habitat-term matches reviewed as false (for example a bird's name), as `[Ramsar site number, ecosystem id]`. | Project review. |

WDPA / Protected Planet data is not used anywhere.

Refreshing the external inputs is a research step outside this build: re-downloading and re-parsing the Ramsar PDFs and UNESCO pages, and re-querying Wikidata. Keep the same file shapes. The habitat terms were matched case-insensitively in each Ramsar site summary with these patterns:

| Ecosystem | Pattern |
|---|---|
| `mangrove` | `mangrove` |
| `intertidal-flats` | `intertidal\|mud ?flats?\|sand ?flats?\|tidal flats?` |
| `seagrass` | `sea ?grass` |
| `estuarine` | `estuar\|\bbolon\|\bdelta\b` |
| `coastal-lagoon` | `lagoon\|lagune\|lagoa` |
| `sandy-beaches` | `beach` |
| `shallow-marine` | `shallow marine\|marine waters` |
| `lakes` | `\blakes?\b\|\blac\b` |
| `floodplains` | `flood ?plains?\|flooded grassland\|seasonally flooded` |
| `marshes-swamps` | `(?<!mangrove )\b(?:marsh(?:es\|land)?\|swamps?\|papyrus\|reed ?beds?)\b` |
