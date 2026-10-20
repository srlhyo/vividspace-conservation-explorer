# Protected-area inventory research

- `research/<ISO3>.json`: desk research for each of the 22 countries. It records the best official inventory found, the totals stated by official sources, every area verified from authoritative sources (with category, designation, legal basis and source ids), categories that could not be enumerated, and gaps. It was compiled on 2026-10-20 from national authorities, laws and decrees, government reports to the CBD, UNESCO and Ramsar. WDPA/Protected Planet was not used.
- `uncatalogued-areas.csv`: areas verified in those sources that are **not** on the map, because no official or openly licensed (CC0) location was found. Adding a location is the main step needed to catalogue them.

The dashboard catalogue (`public/data/catalogue.json`) was built from these files, together with the Ramsar annotated lists, UNESCO World Heritage and biosphere-reserve pages, and Wikidata coordinates (CC0). It records the same area once, adding its designations to that one record, and links overlapping areas. [`../coverage-report.md`](../coverage-report.md) compares each country's catalogue with its official inventory.
