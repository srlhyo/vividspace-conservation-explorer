# Protected-area inventory and coverage report

Generated from `public/data/catalogue.json` (dataset v0.6.0, updated 2026-10-20). Regenerate with `npm run data:coverage`.

The catalogue holds **387 catalogued areas** in **22 countries**: the 13 WASOP countries and 9 additional African countries. **It is a partial inventory.** No country's coverage has been verified as exhaustive against an official register (see "Inventory status"). Each record appears once: when Ramsar, World Heritage or biosphere status applies to the same area as a national designation, it is recorded as an extra designation on that area. Designations that cover a different extent are separate records, linked as overlapping.

Sources are national authorities, laws and government reports (found by desk research), plus the Ramsar annotated lists and UNESCO World Heritage pages. Locations are reference points: from Ramsar, from UNESCO, or from Wikidata (CC0) where official sources give none. No protected-area boundaries are shown. WDPA/Protected Planet data is not used, because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

## Summary

| Country | Group | Catalogued areas | National / community designations | Ramsar | World Heritage | Biosphere | With documented legal basis | Inventory status |
|---|---|---:|---:|---:|---:|---:|---:|---|
| Benin | WASOP | 10 | 3 | 4 | 2 | 3 | 1 | Partial |
| Cabo Verde | WASOP | 25 | 20 | 4 | 0 | 2 | 20 | Partial |
| Côte d'Ivoire | WASOP | 24 | 16 | 6 | 3 | 2 | 16 | Partial |
| The Gambia | WASOP | 9 | 7 | 3 | 0 | 1 | 0 | Partial |
| Ghana | WASOP | 22 | 14 | 6 | 0 | 3 | 12 | Partial |
| Guinea | WASOP | 25 | 9 | 15 | 1 | 4 | 5 | Partial |
| Guinea-Bissau | WASOP | 9 | 6 | 4 | 1 | 1 | 6 | Partial |
| Liberia | WASOP | 9 | 4 | 5 | 0 | 0 | 4 | Partial |
| Mauritania | WASOP | 6 | 3 | 4 | 1 | 1 | 2 | Partial |
| Nigeria | WASOP | 28 | 11 | 16 | 0 | 1 | 11 | Partial |
| Senegal | WASOP | 22 | 19 | 9 | 2 | 5 | 6 | Partial |
| Sierra Leone | WASOP | 10 | 9 | 1 | 2 | 0 | 4 | Partial |
| Togo | WASOP | 9 | 6 | 4 | 0 | 0 | 2 | Partial |
| Angola | Additional | 11 | 10 | 1 | 0 | 0 | 10 | Partial |
| Botswana | Additional | 11 | 10 | 1 | 1 | 0 | 10 | Partial |
| Egypt | Additional | 23 | 20 | 4 | 1 | 2 | 20 | Partial |
| Gabon | Additional | 21 | 18 | 8 | 2 | 0 | 18 | Partial |
| Mozambique | Additional | 14 | 11 | 2 | 1 | 1 | 7 | Partial |
| Namibia | Additional | 20 | 15 | 5 | 1 | 0 | 15 | Partial |
| São Tomé and Príncipe | Additional | 4 | 2 | 1 | 0 | 1 | 2 | Partial |
| Tanzania | Additional | 40 | 31 | 4 | 4 | 5 | 17 | Partial |
| Uganda | Additional | 35 | 22 | 12 | 2 | 2 | 16 | Partial |

## Reconciliation

How the areas listed by the national sources reviewed relate to the records on the map. **Listed** is every nationally designated or proposed area found in the official or authoritative sources reviewed (the `areas` in `inventory/research/<country>.json`). Each listed area is either **mapped** (it is a catalogue record, or an extra designation on one) or **unmapped** (in `inventory/uncatalogued-areas.csv`, because no openly licensed location was found). The map also holds **international-only** records — Ramsar sites, World Heritage properties and biosphere reserves with no national designation documented on the record — which are not part of the national list.

**Why mapped totals can exceed national counts.** A country's total of mapped records adds international-only records to the nationally designated or proposed ones, so it can be higher than the number of areas on the national list (for example Nigeria, Guinea and Uganda, which have many Ramsar sites). A biosphere reserve or a Ramsar site whose extent differs from a national area is a separate record linked as overlapping, not a second count of the same area. International designations are a different kind of status from national legal protection and are never counted as national protected areas. Conversely, a listed national area that shares a record with a Ramsar site is counted once on the map.

| Country | Listed in sources reviewed | Mapped | Unmapped | Mapped records: national or community | Proposed | International-only | Total mapped records |
|---|---:|---:|---:|---:|---:|---:|---:|
| Benin | 9 | 3 | 6 | 3 | 0 | 7 | 10 |
| Cabo Verde | 47 | 20 | 27 | 20 | 0 | 5 | 25 |
| Côte d'Ivoire | 26 | 17 | 9 | 16 | 1 | 7 | 24 |
| The Gambia | 24 | 7 | 17 | 7 | 0 | 2 | 9 |
| Ghana | 18 | 14 | 4 | 14 | 0 | 8 | 22 |
| Guinea | 14 | 9 | 5 | 9 | 0 | 16 | 25 |
| Guinea-Bissau | 11 | 6 | 5 | 6 | 0 | 3 | 9 |
| Liberia | 16 | 6 | 10 | 4 | 1 | 4 | 9 |
| Mauritania | 7 | 4 | 3 | 3 | 1 | 2 | 6 |
| Nigeria | 18 | 11 | 7 | 11 | 0 | 17 | 28 |
| Senegal | 28 | 19 | 9 | 19 | 0 | 3 | 22 |
| Sierra Leone | 22 | 10 | 12 | 9 | 1 | 0 | 10 |
| Togo | 14 | 6 | 8 | 6 | 0 | 3 | 9 |
| Angola | 18 | 10 | 8 | 10 | 0 | 1 | 11 |
| Botswana | 29 | 10 | 19 | 10 | 0 | 1 | 11 |
| Egypt | 31 | 20 | 11 | 20 | 0 | 3 | 23 |
| Gabon | 46 | 18 | 28 | 18 | 0 | 3 | 21 |
| Mozambique | 16 | 11 | 5 | 11 | 0 | 3 | 14 |
| Namibia | 166 | 15 | 151 | 15 | 0 | 5 | 20 |
| São Tomé and Príncipe | 4 | 2 | 2 | 2 | 0 | 2 | 4 |
| Tanzania | 124 | 31 | 93 | 31 | 0 | 9 | 40 |
| Uganda | 31 | 22 | 9 | 22 | 0 | 13 | 35 |
| **Total** | **719** | **271** | **448** | **266** | **4** | **117** | **387** |

Not counted above: 1 context record (an administrative region shown for orientation, not a protected area). Mapped listed areas equal national/community plus proposed records in every country except Liberia, where the proposed Marshall Wetlands protected area is recorded on its Ramsar site, an international-only record.

## Catalogued areas by protection category

| Country | National parks | Nature reserves | Marine protected areas | Wildlife / game reserves | Forest reserves | Community conservation areas | Other protected areas | International designation only | Proposed (not designated) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Benin | 2 | 0 | 1 | 0 | 0 | 0 | 0 | 7 | 0 |
| Cabo Verde | 6 | 5 | 1 | 0 | 0 | 0 | 8 | 5 | 0 |
| Côte d'Ivoire | 8 | 5 | 0 | 3 | 0 | 0 | 0 | 7 | 1 |
| The Gambia | 4 | 3 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| Ghana | 7 | 4 | 0 | 3 | 0 | 0 | 0 | 8 | 0 |
| Guinea | 3 | 2 | 2 | 0 | 2 | 0 | 0 | 16 | 0 |
| Guinea-Bissau | 5 | 0 | 0 | 0 | 0 | 1 | 0 | 3 | 0 |
| Liberia | 3 | 0 | 0 | 0 | 0 | 0 | 1 | 4 | 1 |
| Mauritania | 2 | 0 | 0 | 0 | 0 | 0 | 1 | 2 | 1 |
| Nigeria | 10 | 0 | 0 | 1 | 0 | 0 | 0 | 17 | 0 |
| Senegal | 6 | 3 | 5 | 2 | 0 | 3 | 0 | 3 | 0 |
| Sierra Leone | 3 | 0 | 1 | 2 | 3 | 0 | 0 | 0 | 1 |
| Togo | 3 | 0 | 0 | 3 | 0 | 0 | 0 | 3 | 0 |
| Angola | 9 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| Botswana | 3 | 0 | 0 | 5 | 2 | 0 | 0 | 1 | 0 |
| Egypt | 4 | 16 | 0 | 0 | 0 | 0 | 0 | 3 | 0 |
| Gabon | 13 | 0 | 0 | 4 | 1 | 0 | 0 | 3 | 0 |
| Mozambique | 10 | 0 | 0 | 1 | 0 | 0 | 0 | 3 | 0 |
| Namibia | 9 | 1 | 0 | 3 | 0 | 1 | 1 | 5 | 0 |
| São Tomé and Príncipe | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| Tanzania | 19 | 0 | 4 | 5 | 0 | 0 | 3 | 9 | 0 |
| Uganda | 10 | 0 | 0 | 11 | 0 | 1 | 0 | 13 | 0 |

## Inventory status by country

For each country: the best available official inventory found, totals stated by official or authoritative sources (to compare with the catalogue), and what is missing, duplicated or unverified.

### Benin — partial (10 catalogued)

National parks, hunting zones and MPAs are PA categories under the wildlife regime (Décret 2011-394); Pendjari NP is under delegated management (6NR). The NBSAP Tableau 1 (DGFRN 2013) gives official counts by category (2 national parks, 4 zones cynégétiques, 46 forêts classées, 6 périmètres de reboisement) but no names; two MPAs were created in 2022. cenagref.net was not used (reported hijacked). Comparison: the sources reviewed list 9 nationally designated or proposed areas; 3 are catalogued here, and 6 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 4 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Government of Benin](https://www.cbd.int/doc/world/bj/bj-nbsap-v2-fr.pdf); [Government of Benin](https://www.cbd.int/doc/nr/nr-06/bj-nr-06-fr.pdf); [République du Bénin](https://faolex.fao.org/docs/pdf/Ben224997.pdf).

Stated official totals:

- parcs nationaux: 2 (as of 2013) — [Government of Benin](https://www.cbd.int/doc/world/bj/bj-nbsap-v2-fr.pdf)
- zones cynégétiques: 4 (as of 2013) — [Government of Benin](https://www.cbd.int/doc/world/bj/bj-nbsap-v2-fr.pdf)
- forêts classées: 46 (as of 2013) — [Government of Benin](https://www.cbd.int/doc/world/bj/bj-nbsap-v2-fr.pdf)
- forêts classées: 56 (as of 6th National Report) — [Government of Benin](https://www.cbd.int/doc/nr/nr-06/bj-nr-06-fr.pdf)

Gaps:

- Only three of the four zones cynégétiques could be named (Pendjari, Atacora, Djona); the relationship of the Konkombri and Mékrou hunting areas to them is ambiguous in UNESCO documents.
- Creation acts, years and individual areas of Pendjari NP, W NP and the hunting zones were not documented in sources seen.
- The text of Décret n° 2022-003 (MPAs) was not seen; areas of the two MPAs unknown.
- Benin's 'réserves de faune' and 'sanctuaires' categories (Décret 2011-394) had no named examples in sources seen.
- Not enumerated: forêts classées (about 56) — No official list found; counts conflict (46 in NBSAP/DGFRN 2013, 56 in 6NR).
- Not enumerated: périmètres de reboisement (about 6) — Plantations; names not given.
- Not enumerated: forêts sacrées (about 2940) — About 2,940 sacred forests (18,360 ha); no list.
- Not enumerated: other community conservation areas — Only two ACCB arrêtés were found (6NR); others (e.g. Dèmè-Lokoli-Koussoukpa community reserve mentioned in NBSAP) lack documented legal status.
- 6 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Cabo Verde — partial (25 catalogued)

The legal inventory is the annex 'Rede Nacional Inicial de Áreas Protegidas' of Decreto-Lei n.º 3/2003 of 24 February 2003 (regime jurídico dos espaços naturais; amended by Decreto-Lei n.º 44/2006), which declares 47 areas by island in six categories (Parque Nacional, Parque Natural, Reserva Natural, Monumento Natural, Paisagem Protegida, Sítio de Interesse Científico). Individual areas are subsequently delimited by Decreto-Regulamentar and given management plans by Resolução; some categories and limits have changed since 2003 (e.g. Barreiro e Figueira now a Paisagem Protegida). All 47 annex entries are recorded below with the 2003 category; later instruments verified in FAOLEX are added to legalStatus. Later additions to the network (if any) were not systematically searched. The 2003 annex is an official list but only as a scanned gazette page (not machine-readable). Comparison: the sources reviewed list 47 nationally designated or proposed areas; 20 are catalogued here (1 as an extra designation on an already catalogued area), and 27 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 4 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [República de Cabo Verde — via FAOLEX](https://faolex.fao.org/docs/pdf/cvi38666.pdf); [República de Cabo Verde — via FAOLEX](https://faolex.fao.org/docs/pdf/cvi198137.pdf); [Government of Cabo Verde / CBD Secretariat](https://www.cbd.int/doc/world/cv/cv-nbsap-v2-pt.pdf).

Stated official totals:

- protected areas in the initial national network: 47 (as of 2003-02-24) — [República de Cabo Verde — via FAOLEX](https://faolex.fao.org/docs/pdf/cvi38666.pdf)
- protected areas (6 categories): 47 (as of 2020-09) — [República de Cabo Verde — via FAOLEX](https://faolex.fao.org/docs/pdf/cvi198137.pdf)

Gaps:

- Areas (ha) were not extracted per site; individual Decretos-Regulamentares give delimitations for some sites only.
- Categories are those of the 2003 annex; some have changed (e.g. Barreiro e Figueira, Maio, became Paisagem Protegida; Terras Salgadas/Parque Natural do Norte da Ilha do Maio relationship unclear).
- Only a sample of later Decretos-Regulamentares/Resoluções was checked; legalStatus lists only those verified in FAOLEX.
- Any protected areas added to the network after 2003 (e.g. new marine areas) were not identified.
- Wikidata QIDs not assigned (Wikidata services were rate-limiting); coordinates left null.
- Not enumerated: protected areas declared after 2003 (if any) and marine protected areas proposed by the marine gap analysis — Not systematically searched; NR6 mentions proposals for new PAs in the marine component.
- 27 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Côte d'Ivoire — partial (24 catalogued)

Parks and reserves are managed by the Office Ivoirien des Parcs et Réserves (OIPR) under Loi n° 2002-102, whose Annexes 1-2 are the official list as of 2002 (8 national parks, 6 reserves with creating instrument and area). Later creations are by decree (2013-2026), traced via FAOLEX/LEAP, the national CBD CHM and Council-of-Ministers communiqués. Forêts classées (~231-234, SODEFOR) were not enumerated. oipr.ci was not used. Comparison: the sources reviewed list 26 nationally designated or proposed areas; 17 are catalogued here (1 as an extra designation on an already catalogued area), and 9 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 6 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [République de Côte d'Ivoire](https://faolex.fao.org/docs/pdf/ivc81290.pdf); [UNEP LEAP](https://leap.unep.org/en/countries/ci/national-legislation/loi-ndeg-2002-102-relative-la-creation-la-gestion-et-au); [Government of Côte d'Ivoire](https://www.cbd.int/doc/world/ci/ci-nr-06-fr.pdf).

Stated official totals:

- national parks: 8 (as of 2002) — [République de Côte d'Ivoire](https://faolex.fao.org/docs/pdf/ivc81290.pdf)
- national parks and nature reserves: 15 (as of 6th National Report (c. 2019)) — [Government of Côte d'Ivoire](https://www.cbd.int/doc/world/ci/ci-nr-06-fr.pdf)
- forêts classées: 234 (as of 6th National Report (c. 2019)) — [Government of Côte d'Ivoire](https://www.cbd.int/doc/world/ci/ci-nr-06-fr.pdf)
- réserves botaniques: 16 (as of 2016) — [Government of Côte d'Ivoire](https://www.cbd.int/doc/world/ci/ci-nbsap-v2-fr.pdf)

Gaps:

- Annex areas date from 2002; boundaries of most parks/reserves were redefined by 2018 decrees whose new areas were not extracted.
- Decree numbers for the Grand-Béréby MPA (2022), Eden de Agnéby-Tiassa RNV (2025) and SOGB RNV (2026) were not verified from the Journal Officiel; only Council-of-Ministers communiqués/press were seen.
- Whether the 'Zone périphérique de protection du Parc de Taï' still exists as a separate reserve after 2018 is unknown.
- The OIPR website (oipr.ci) was not used; OIPR's current count of '15 parks and reserves' appears only in press reports.
- Proposed MPA sites from the 2020 Council-of-Ministers communication have no defined boundaries in sources seen.
- areaKm2 values were converted from hectares (1 km² = 100 ha) where the cited source gives hectares; source figures are quoted in notes where they conflict.
- Not enumerated: forêts classées (SODEFOR) (about 234) — List too large; no official list found (NBSAP gives 231, 6NR 234).
- Not enumerated: réserves botaniques (about 16) — Names not listed in sources seen.
- Not enumerated: other réserves naturelles volontaires — RNVs are created ad hoc by decree; no consolidated list found.
- 9 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### The Gambia — partial (9 catalogued)

Wildlife protected areas are designated under the Biodiversity/Wildlife Act 2003 and managed by the Department of Parks and Wildlife Management (DPWM); forest reserves/parks are under the Department of Forestry. The best official list found is Table 1 'Protected Areas of the Gambia' in the revised NBSAP (March 2015), giving 22 entries (7 established parks/reserves, 1 proposed national park, 1 community wildlife reserve and 13 community conservation areas then 'in process'). The 6th national report (2019) repeats the count of 22 wildlife protected areas (8 reserves/national parks + 14 community-based conservation areas) without names. No DPWM-published list was used (dpwm.gov.gm reported hijacked/dead). Comparison: the sources reviewed list 24 nationally designated or proposed areas; 7 are catalogued here (2 as an extra designation on an already catalogued area), and 17 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 3 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Government of The Gambia / CBD Secretariat](https://www.cbd.int/doc/world/gm/gm-nbsap-v2-en.pdf); [Government of The Gambia / CBD Secretariat](https://chm.cbd.int/database/record?documentID=243051); [Government of The Gambia / CBD Secretariat](https://ort.cbd.int/database/record?documentID=284161).

Stated official totals:

- wildlife protected areas (DPWM): 22 (as of 2019) — [Government of The Gambia / CBD Secretariat](https://chm.cbd.int/database/record?documentID=243051)
- reserves and national parks: 8 (as of 2019) — [Government of The Gambia / CBD Secretariat](https://chm.cbd.int/database/record?documentID=243051)
- community-based conservation areas: 14 (as of 2019) — [Government of The Gambia / CBD Secretariat](https://chm.cbd.int/database/record?documentID=243051)
- forest reserves (Department of Forestry): 66 (as of 2015) — [Government of The Gambia / CBD Secretariat](https://www.cbd.int/doc/world/gm/gm-nbsap-v2-en.pdf)

Gaps:

- No legal instrument (gazette notice) was verified for any Gambian protected area; establishment years come from the NBSAP table.
- The status of the 13 community conservation areas listed 'in process' in 2015 is inferred, not confirmed by name, from NR6's statement that 13 new community protected areas were established.
- NR7 (2026) mentions 'new site designations' without naming them; any post-2019 designations (e.g. Jokadu NP, Kartong MPA) remain unverified.
- The Biodiversity and Wildlife Act 2003 text (and any schedule of protected areas) was not located in FAOLEX during this run.
- Wikidata QIDs not assigned (Wikidata services were rate-limiting); coordinates left null.
- Not enumerated: forest reserves / forest parks (Department of Forestry) (about 66) — No official list found; NBSAP gives 66 forest reserves (34,029 ha), of which 34 forest parks (22,239 ha) designated as protected forest; NBSAP notes most are not categorised as protected areas, except e.g. Bijilo, Pirang, Kungkilling and Dobo which are 'managed for conservation'.
- Not enumerated: community forests and joint forest parks — NR6 mentions 29 community forests and 23 joint forest parks; no list found.
- 17 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Ghana — partial (22 catalogued)

Wildlife protected areas are managed by the Wildlife Division of the Forestry Commission and are legally established by the Wildlife Reserves Regulations 1971 (L.I. 710) and its amendments (kept in force by the Wildlife Resources Management Act 2023, Act 1115). The NBSAP (Nov 2016, Table 4, source FDMP 2016) gives the most complete official list with areas and years. Forest reserves (~280) are managed by the Forest Services Division and were not enumerated. The Forestry Commission website was not used (reported hijacked/dead). Comparison: the sources reviewed list 18 nationally designated or proposed areas; 14 are catalogued here (1 as an extra designation on an already catalogued area), and 4 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 6 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Government of Ghana](https://www.cbd.int/doc/world/gh/gh-nbsap-v2-en.pdf); [Government of Ghana](https://faolex.fao.org/docs/pdf/gha40796.pdf); [Parliament of Ghana](https://ghana.arocha.org/wp-content/uploads/sites/42/2024/04/WILDLIFE-RESOURCES-MANAGEMENT-ACT-2023-ACT-1115.pdf).

Stated official totals:

- wildlife protected areas (national parks, resource reserves, wildlife sanctuaries, strict nature reserve): 16 (as of 2018) — [Government of Ghana](https://www.cbd.int/doc/world/gh/gh-nr-06-en.pdf)
- legally-constituted wildlife conservation areas incl. Ramsar sites: 21 (as of 2016) — [Government of Ghana](https://www.cbd.int/doc/world/gh/gh-nbsap-v2-en.pdf)
- forest reserves: 280 (as of 2016) — [Government of Ghana](https://www.cbd.int/doc/world/gh/gh-nbsap-v2-en.pdf)

Gaps:

- Counts conflict: NBSAP text says six national parks and three sanctuaries while its Table 4 lists seven national parks and three gazetted sanctuaries (+1 proposed); the 6NR says 7 NP, 6 RR, 2 WS, 1 SNR. Records follow Table 4.
- Legal instruments for Kyabobo NP, Boabeng-Fiema WS and the original Bia NP gazette (L.I. 881, 1974) and L.I. 1283 (1983) were not seen.
- The NBSAP mentions one proposed national park whose name is not given.
- No Ghanaian marine protected area was found in official sources.
- Areas are taken from NBSAP Table 4 (FDMP 2016) and may differ from current gazetted boundaries.
- areaKm2 values were converted from hectares (1 km² = 100 ha) where the cited source gives hectares; source figures are quoted in notes where they conflict.
- Not enumerated: forest reserves (Forest Services Division) (about 280) — List too large; no official machine-readable list found (official FC site unreliable).
- Not enumerated: Globally Significant Biodiversity Areas (forest reserves) (about 29) — Designated within forest reserves; names not listed in sources seen.
- Not enumerated: Community Resource Management Areas (CREMAs) — No official list found; recognised under s.39 of Act 1115.
- 4 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Guinea — partial (25 catalogued)

No published official list of Guinea's protected areas was found. Guinea's PoWPA document (CBD) says the national protected-area network was 'validated' in 2010 with 53 identified protected areas, many without validated creation acts, but gives no list. Management lies with the Office Guinéen des Parcs Nationaux et Réserves de Faune (OGPNRF) and the forestry administration; Mount Nimba is managed by CEGENS. The most detailed descriptive source is the 2008 IUCN/PAPACO management-effectiveness evaluation of 12 areas (hosted on Guinea's national CBD clearing-house), which itself warns that the legal status of most areas has not been updated since independence. Records below combine that evaluation with Guinea's 6th (2018) and 7th (2026) CBD reports and the Haut Niger creation decree; legal status is uncertain for several sites. Ramsar sites are handled separately. Comparison: the sources reviewed list 14 nationally designated or proposed areas; 9 are catalogued here (3 as an extra designation on an already catalogued area), and 5 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 15 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Government of Guinea / CBD Secretariat](https://www.cbd.int/doc/world/gn/gn-nbsap-powpa-fr.pdf); [UICN/PACO (IUCN Central and West Africa Programme) — hosted on Guinea's national CBD clearing-house](https://gn.chm-cbd.net/sites/gn/files/2021-07/Parcs%26ReservesDeGuinee.pdf); [Government of Guinea / CBD Secretariat](https://www.cbd.int/doc/nr/nr-06/gn-nr-06-fr.pdf); [Government of Guinea / CBD Secretariat](https://ort.cbd.int/database/record?documentID=291677).

Stated official totals:

- identified protected areas (national network validated 2010): 53 (as of 2010) — [Government of Guinea / CBD Secretariat](https://www.cbd.int/doc/world/gn/gn-nbsap-powpa-fr.pdf)
- protected areas by governance type (state / community / private): 53 (as of 2010) — [Government of Guinea / CBD Secretariat](https://www.cbd.int/doc/world/gn/gn-nbsap-powpa-fr.pdf)
- community forests: 186 (as of 2018) — [Government of Guinea / CBD Secretariat](https://www.cbd.int/doc/nr/nr-06/gn-nr-06-fr.pdf)
- classified state forests at independence: 156 (as of 1958) — [Government of Guinea / CBD Secretariat](https://www.cbd.int/doc/world/gn/gn-nbsap-powpa-fr.pdf)

Gaps:

- No official, named list of Guinea's 53 identified protected areas was found; OGPNRF has no reliable web presence located during this run.
- Legal status of many sites (Tristao, Alcatraz, Manden Woula, transboundary areas, Kounounkan) is unclear; the IUCN 2008 review notes most statuses were not updated since independence.
- Moyen Bafing NP creation is stated by NR7 but the decree text was not retrieved; press/partner pages reporting a 2021 decree could not be fetched.
- Area figures conflict between sources for Haut Niger, Badiar and Kankan/Foloningbè; conflicts are recorded in notes.
- Wikidata QIDs not assigned (Wikidata services were rate-limiting); coordinates left null.
- Not enumerated: remaining identified protected areas (of 53 in the 2010 national network), incl. other fauna reserves and sanctuaries (about 53) — Only a count is published (PoWPA); no list found.
- Not enumerated: forêts classées (classified forests) — No official list found; 156 classified state forests existed at independence (PoWPA).
- Not enumerated: forêts communautaires (community forests) (about 186) — Count only (NR6).
- 5 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Guinea-Bissau — partial (9 catalogued)

The Sistema Nacional de Áreas Protegidas (SNAP) is managed by the Instituto da Biodiversidade e das Áreas Protegidas (IBAP) under the Lei-Quadro das Áreas Protegidas (Decreto-Lei 5-A/2011, replacing Decreto-Lei 3/97). IBAP's website lists the protected areas and publishes the creation decrees (scanned Boletim Oficial pages), which were checked for the 2000, 2005, 2011 and 2017 decrees. The 6th CBD report (2019) states the SNAP covers 26.3% of the territory (~750,000 ha) with 8 protected areas plus 3 ecological corridors created by Decrees 11–15/2017. The list appears complete for state protected areas; community forests (104) are not enumerated. Note: the IBAP website (ibapgbissau.org) also carries unrelated spam blog posts, suggesting partial compromise; facts were cross-checked against the decree scans and NR6. Comparison: the sources reviewed list 11 nationally designated or proposed areas; 6 are catalogued here (5 as an extra designation on an already catalogued area), and 5 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 4 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Instituto da Biodiversidade e das Áreas Protegidas (IBAP), Guiné-Bissau](https://ibapgbissau.org/areas-protegidas/); [Government of Guinea-Bissau / CBD Secretariat](https://www.cbd.int/doc/nr/nr-06/gw-nr-06-pt.pdf); [República da Guiné-Bissau](https://ibapgbissau.org/wp-content/uploads/2022/06/Decreto-criacao-Cacheu-1.pdf); [República da Guiné-Bissau](https://ibapgbissau.org/wp-content/uploads/2022/06/Decreto-PNMJVP-1.pdf); [República da Guiné-Bissau](https://ibapgbissau.org/wp-content/uploads/2022/06/Decreto-Urok-1.pdf); [República da Guiné-Bissau](https://ibapgbissau.org/wp-content/uploads/2022/06/Decreto-Cantanhez-1.pdf); [República da Guiné-Bissau](https://ibapgbissau.org/wp-content/uploads/2022/06/Decreto-lei-Criacao-das-AP-do-Comlexo-Dulombi-Boe-Tchetche-Sul.-B.-O.-n.o-26-RESUMIDO%EF%80%A22017-.pdf).

Stated official totals:

- protected areas (SNAP): 8 (as of 2019-03) — [Government of Guinea-Bissau / CBD Secretariat](https://www.cbd.int/doc/nr/nr-06/gw-nr-06-pt.pdf)
- ecological corridors: 3 (as of 2019-03) — [Government of Guinea-Bissau / CBD Secretariat](https://www.cbd.int/doc/nr/nr-06/gw-nr-06-pt.pdf)
- community forests: 104 (as of 2019-03) — [Government of Guinea-Bissau / CBD Secretariat](https://www.cbd.int/doc/nr/nr-06/gw-nr-06-pt.pdf)

Gaps:

- Guinea-Bissau had not submitted a 7th CBD national report in the CBD index at time of research; the 2019 NR6 is the latest official summary.
- The Reserva da Biosfera do Arquipélago Bolama-Bijagós (listed by IBAP among its areas) is a UNESCO designation handled separately and is not recorded here.
- Areas are as stated by IBAP pages; decree texts for the 2000/2005/2011 areas are scans and their annex areas were not re-read in full.
- The 2019 NR6 count of '8 protected areas' versus 8 park/MPA units listed here is consistent, but any area created after 2019 was not identified.
- Wikidata QIDs not assigned (Wikidata services were rate-limiting); coordinates left null.
- Not enumerated: community forests (florestas comunitárias) (about 104) — NR6 gives only a count (104, ~26,050 ha); no official list found.
- 5 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Liberia — partial (9 catalogued)

The Forestry Development Authority (FDA) is the statutory PA authority (National Forestry Reform Law 2006; Protected Forest Areas Network Act 2003). Its June 2026 Kwa gazettement package states the network comprises five legally established PAs and lists the proposed PAs; the NBSAP 2017-2025 (Table 10, source FDA) gives areas. No machine-readable list found. Comparison: the sources reviewed list 16 nationally designated or proposed areas; 6 are catalogued here (2 as an extra designation on an already catalogued area), and 10 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 5 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Forestry Development Authority (FDA), Liberia](https://fda.gov.lr/sites/default/files/documents/PKNP%20Draft%20Gazettement%20Package%20June%202026_%20Updated.pdf); [Government of Liberia](https://www.cbd.int/doc/world/lr/lr-nbsap-v2-en.pdf).

Stated official totals:

- legally established protected areas: 5 (as of 2026-06) — [Forestry Development Authority (FDA), Liberia](https://fda.gov.lr/sites/default/files/documents/PKNP%20Draft%20Gazettement%20Package%20June%202026_%20Updated.pdf)
- proposed protected areas: 11 (as of 2019) — [Government of Liberia](https://www.cbd.int/doc/world/lr/lr-nr-06-en.pdf)
- national forests (production, partial protection): 11 (as of 2017) — [Government of Liberia](https://www.cbd.int/doc/world/lr/lr-nbsap-v2-en.pdf)

Gaps:

- Liberia has no designated marine protected area in sources seen; the 6NR sets a target to 'Establish at least 2 marine protected areas'.
- Lake Piso's legal instrument (2011) and area were not verified; NBSAP and 5NR area figures conflict.
- The FDA (2026) lists 8 proposed PAs whereas NBSAP 2017 lists 10 and the 6NR says 11; Gbi, Bong Mountains and West Nimba were not in the FDA 2026 list, so their current proposal status is unclear.
- Wonegizi gazettement was in public-comment stage (to 6 Sept 2026); outcome unknown.
- The Protected Forest Areas Network Act (2003) text itself was not fetched (only referenced by the FDA and ClientEarth).
- areaKm2 values were converted from hectares (1 km² = 100 ha) where the cited source gives hectares; source figures are quoted in notes where they conflict.
- Not enumerated: national forests (production forests) (about 11) — Production forests from which concessions are carved; not protected areas in the strict sense.
- Not enumerated: community forests / sacred forests — No official enumerable list found.
- 10 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Mauritania — partial (6 catalogued)

No standalone official register was found. The most explicit official statement is Mauritania's 6th CBD national report (2019, section 7.2 'Situation des aires protégées'), which lists two national parks (Banc d'Arguin, Diawling), a recently created third park (Awleigatt), the Cap Blanc satellite reserve and the (unclassified) Chat Tboul reserve, plus several areas under study. The two main parks are public administrative establishments with their own laws/decrees and official websites (pnba.mr, pnd.mr); a Direction des aires protégées et du littoral (DAPL) exists within the environment ministry. The 'Zones protégées' page of the national CBD clearing-house (mr.chm-cbd.net) reproduces outdated WCMC-derived entries and was not used. Comparison: the sources reviewed list 7 nationally designated or proposed areas; 4 are catalogued here (3 as an extra designation on an already catalogued area), and 3 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 4 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Ministère de l'Environnement et du Développement Durable / CBD Secretariat](https://www.cbd.int/doc/nr/nr-06/mr-nr-06-fr.pdf); [République Islamique de Mauritanie — via FAOLEX](https://faolex.fao.org/docs/pdf/mau20609.pdf); [Journal Officiel de la République Islamique de Mauritanie — via FAOLEX](https://faolex.fao.org/docs/pdf/mau4232.pdf); [Parc National du Banc d'Arguin](https://pnba.mr/); [Parc National du Diawling](https://www.pnd.mr/).

Stated official totals:

- national parks: 3 (as of 2019) — [Ministère de l'Environnement et du Développement Durable / CBD Secretariat](https://www.cbd.int/doc/nr/nr-06/mr-nr-06-fr.pdf)
- reserves: 2 (as of 2019) — [Ministère de l'Environnement et du Développement Durable / CBD Secretariat](https://www.cbd.int/doc/nr/nr-06/mr-nr-06-fr.pdf)

Gaps:

- No official consolidated list after 2019 was found; Mauritania had not submitted a 7th CBD national report in the CBD index at time of research.
- Creation act, date and area of the Parc National d'Awleigatt were not found in FAOLEX or official sources.
- PNBA's original 1976 creation decree (n° 76-147, referenced in FAOLEX/LEAP as repealed) was not fetched; the 1976 date comes from pnba.mr.
- Area of the Cap Blanc satellite reserve not documented in fetched sources.
- The national CBD clearing-house page 'Zones protégées' (mr.chm-cbd.net/fr/zones-protegees) reproduces old WCMC entries (e.g. 'Las Cuevecillas', 'Réserve du Mouflon') of unclear validity; not used.
- Wikidata QIDs not assigned (Wikidata services were rate-limiting); coordinates left null.
- Not enumerated: sites under study / proposed protected areas (PoWPA) — NR6 lists further candidate sites (Mahmouda, El Agher, El Atf, Bougahri–Metrewgha, Lac de Mal, Oudhne Levrass, Tilemci, Dhar Oualata Tichitt, El Agane, Kankossa) without any legal status; not recorded individually.
- Not enumerated: classified forests — No official list or count found.
- 3 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Nigeria — partial (28 catalogued)

Federal national parks are managed by the Nigeria National Park Service (NPS) under the National Park Service Act (Cap N65 LFN 2004, amended 2006), whose s.50 lists the seven pre-existing parks. Ten additional parks were declared by the National Park (Declaration) Order 2022 (National Assembly concurrence March 2023; NPS says gazetted) and are being handed over by the states in batches (Hadejia Wetlands, Oba Hills and Marhai in 2024; Kampe in Feb 2025), giving 17 national parks per NPS. Game reserves and forest reserves are state-managed; no official machine-readable or enumerable national list of them was found. Comparison: the sources reviewed list 18 nationally designated or proposed areas; 11 are catalogued here, and 7 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 16 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Federal Republic of Nigeria](https://faolex.fao.org/docs/pdf/nig34266.pdf); [Nigeria National Park Service](https://www.nigeriaparkservice.gov.ng/); [Policy and Legal Advocacy Centre](https://placng.org/i/national-assembly-approves-presidential-declaration-order-on-establishment-of-ten-national-parks/); [Nigeria National Park Service](https://nigeriaparkservice.gov.ng/blog/2025/02/06/national-park-service-takes-over-kampe-games-reserve-as-a-national-park-steering-committee-inaugurated-for-seamless-transition/); [Government of Nigeria](https://www.cbd.int/doc/world/ng/ng-nbsap-v2-en.pdf).

Stated official totals:

- national parks (pre-2023): 7 (as of 2023) — [News Agency of Nigeria](https://nannews.ng/environmental-sustainability-national-park-reassures-commitment-to-wildlife-conservation/)
- national parks (after 10 upgrades): 17 (as of 2025-02) — [Nigeria National Park Service](https://nigeriaparkservice.gov.ng/blog/2025/02/06/national-park-service-takes-over-kampe-games-reserve-as-a-national-park-steering-committee-inaugurated-for-seamless-transition/)
- forest reserves: 994 (as of 2012 (cited in NBSAP 2016-2020)) — [Government of Nigeria](https://www.cbd.int/doc/world/ng/ng-nbsap-v2-en.pdf)
- game reserves (state governments, a few community-managed): 32 (as of 2012 (cited in NBSAP 2016-2020)) — [Government of Nigeria](https://www.cbd.int/doc/world/ng/ng-nbsap-v2-en.pdf)

Gaps:

- The gazette of the National Park (Declaration) Order 2022 was not seen; legal status of the ten new parks rests on the NASS concurrence (March 2023) and NPS statements that they were gazetted (Dec 2023). Areas and boundaries of the ten parks are undocumented in sources seen.
- Only four of the ten new parks (Hadejia Wetlands, Oba Hills, Marhai, Kampe) have a documented handover to the NPS; the status of Allawa, Apoi, Edumanom, Falgore, Kogo and Pandam handovers is unknown.
- Spellings of the new parks differ between sources (Allawa/Alawa, Falgore/Galgore, Marhai/Marhi, Edumanom/Edumenum/Edumenun, Hadejia Wetland/Baturiya Wetland); names used here follow the NAN/NPS wording.
- Okomu National Park's current area and Yankari Game Reserve's area are not stated in official sources seen.
- No Nigerian marine protected area was found in official sources.
- The NPS park pages date from 2014; areas may have changed (e.g. the 2023 bill concerning Okwangwo was not followed up).
- areaKm2 values were converted from hectares (1 km² = 100 ha) where the cited source gives hectares; source figures are quoted in notes where they conflict.
- Not enumerated: forest reserves (state) (about 994) — No official list found; NBSAP (citing NCF 2012) gives 994, of which about half reportedly de-reserved or encroached. Other secondary sources quote 445 — not verified.
- Not enumerated: game reserves (state) (about 32) — State-managed; no official national list found.
- Not enumerated: strict nature reserves, sacred groves and community areas — No official list found.
- 7 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Senegal — partial (22 catalogued)

No single consolidated, current official list was found online. Protected areas are split between the Direction des Parcs Nationaux (DPN: national parks, special/fauna reserves), the Direction des Aires Marines Communautaires Protégées (DAMCP, created by decree 2012-543: marine protected areas and coastal community reserves) and the forestry service DEFCCS (213 forêts classées, sylvopastoral reserves, hunting zones). The best official lists found are: the DPN's PoWPA document (table of 16 DPN-administered areas, c. 2011), the 2013 National MPA Strategy (14 coastal areas), Senegal's 2018 AEWA national-report annex (22 sites incl. later AMPs), and individual creation decrees (2004, 2014, 2020, 2023). Lists are dated and partial; the DPN and DAMCP websites were not used (reported hijacked/dead). Comparison: the sources reviewed list 28 nationally designated or proposed areas; 19 are catalogued here (9 as an extra designation on an already catalogued area), and 9 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 9 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Ministère de l'Environnement et de la Protection de la Nature, Direction des Parcs Nationaux](https://www.cbd.int/doc/world/sn/sn-nbsap-powpa-fr.pdf); [République du Sénégal (DAMCP) — via FAOLEX](https://faolex.fao.org/docs/pdf/sen160731.pdf); [Government of Senegal, submitted to UNEP/AEWA Online Reporting System](https://ors.unep-aewa.org/answers/2640538/documents/1552); [Government of Senegal / CBD Secretariat](https://chm.cbd.int/database/record?documentID=241356); [Government of Senegal / CBD Secretariat](https://ort.cbd.int/database/record?documentID=288627).

Stated official totals:

- national parks and strict/special reserves (DPN): 10 (as of 2019) — [Government of Senegal / CBD Secretariat](https://chm.cbd.int/database/record?documentID=241356)
- forêts classées (classified forests, incl. sylvopastoral reserves and hunting zones): 213 (as of 2019) — [Government of Senegal / CBD Secretariat](https://chm.cbd.int/database/record?documentID=241356)
- coastal protected areas forming the basis of the MPA network: 14 (as of 2013-12) — [République du Sénégal (DAMCP) — via FAOLEX](https://faolex.fao.org/docs/pdf/sen160731.pdf)

Gaps:

- The DPN PoWPA table is undated (c. 2011) and the AEWA list is from 2018; no current consolidated official list was found, and dpn.sn / damcp.sn were not used.
- Creation decrees for the AMPs of Sangomar, Niamone-Kalounayes and Kassa-Balantacounda were not located; they are recorded as AMPs on the basis of Senegal's 2018 AEWA report only.
- Creation acts (decree numbers) for the national parks and DPN reserves were not verified; only creation years from DPN/AEWA tables are given.
- Areas for AMP de Somone, Kaalolaal Blouf-Fogny, Gorée and the extended Gandoule are only given as coordinate polygons in the decrees, so areaKm2 is null.
- NR7 (2026) reports that AMP coverage reached ~4.9% in 2024 and cites decree 2024-790 on AMP management; any AMPs created after 2023 were not identified.
- Date conflicts: Somone community reserve (1999 vs 2001), Palmarin (2001 vs 2003), Ferlo Nord (1996 = creation or transfer to DPN?).
- Wikidata QIDs not assigned (Wikidata API was rate-limiting during this run); coordinates left null.
- Not enumerated: forêts classées (classified forests) incl. réserves sylvopastorales and zones d'intérêt cynégétique (about 213) — No official list found; NR6 gives counts only (213 classified forests incl. 20 sylvopastoral reserves and 8 hunting zones).
- Not enumerated: réserves naturelles communautaires and APAC (community/indigenous conserved areas) other than those listed — Mentioned in NR7 (recognition of APAC, AMCEZ, community reserves, e.g. APAC Kawawana) but no official list with legal status was found.
- Not enumerated: Réserve de Faune du Ferlo Sud (about 1) — Not found in any fetched official source (only in Wikipedia/WDPA-derived sites), so not recorded.
- 9 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Sierra Leone — partial (10 catalogued)

The National Protected Area Authority (NPAA), created by the National Protected Areas Authority and Conservation Trust Fund Act 2012, manages national parks and wildlife sanctuaries; forest reserves remain with the Forestry Division, and the four estuarine Marine Protected Areas were declared by the Ministry of Fisheries and Marine Resources. NPAA's website has a 'List of National Protected Areas' page, but it was empty when fetched (Oct 2026) and the site contains template placeholder content. The best official descriptions are the NBSAP 2017–2026 (protected-area categories under the Wildlife Conservation Act 1972, gazetted national parks, Table 9 of major forest-estate components, Table 2 of estuarine MPAs) and the 6th CBD national report (2020). No complete official register was found. Comparison: the sources reviewed list 22 nationally designated or proposed areas; 10 are catalogued here (2 as an extra designation on an already catalogued area), and 12 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 1 Ramsar site for this country. Coverage has not been verified as exhaustive. Sources: [Government of Sierra Leone / CBD Secretariat](https://www.cbd.int/doc/world/sl/sl-nbsap-v2-en.pdf); [Government of Sierra Leone / CBD Secretariat](https://www.cbd.int/doc/nr/nr-06/sl-nr-06-en.pdf); [Government of Sierra Leone / CBD Secretariat](https://ort.cbd.int/database/record?documentID=290957); [National Protected Area Authority, Sierra Leone](https://npaa.gov.sl/list-of-national-protected-areas/).

Stated official totals:

- designated protected areas (within 48 reserve areas): 15 (as of 2011) — [Government of Sierra Leone / CBD Secretariat](https://www.cbd.int/doc/nr/nr-06/sl-nr-06-en.pdf)
- gazetted national parks: 4 (as of 2017) — [Government of Sierra Leone / CBD Secretariat](https://www.cbd.int/doc/world/sl/sl-nbsap-v2-en.pdf)
- marine protected areas: 4 (as of 2017) — [Government of Sierra Leone / CBD Secretariat](https://www.cbd.int/doc/world/sl/sl-nbsap-v2-en.pdf)
- forest reserves: 29 (as of 2017) — [Government of Sierra Leone / CBD Secretariat](https://www.cbd.int/doc/world/sl/sl-nbsap-v2-en.pdf)

Gaps:

- No complete official list was retrievable: the NPAA 'List of National Protected Areas' page was empty when fetched.
- Gazettement instruments (Government Notices/Statutory Instruments) were not located for any area; years come from NBSAP/NR6 narrative and conflict for Gola (2011 vs 2013) and the MPAs (2010 vs 2012).
- MPA boundaries/areas not documented in fetched sources (only mangrove areas). Whether additional MPAs were declared after 2017 was not verified.
- NR7 (2026) states a target to expand protected areas but gives no updated list.
- Wikidata QIDs not assigned (Wikidata services were rate-limiting); coordinates left null.
- Not enumerated: other forest reserves (about 29) — NBSAP gives 29 forest reserves in total (also 'about 24 forest reserves' elsewhere) but lists only the major ones (Table 9); no complete official list found.
- 12 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Togo — partial (9 catalogued)

The Ministère de l'Environnement et des Ressources Forestières (MERF) is responsible for PAs. Of 83 legally classified PAs (to 1990), a requalification programme (since 1999; décret 2003-237/PR) retained 10-14 priority PAs covering ~578,000 ha. No consolidated official list with legal acts exists in sources seen; records combine the government PoWPA table, NBSAP 2014, 6NR (2018) and the UICN 2008 RAPPAM. A new law on creation and management of PAs was adopted by the National Assembly in August 2026 (promulgation not verified). Comparison: the sources reviewed list 14 nationally designated or proposed areas; 6 are catalogued here (1 as an extra designation on an already catalogued area), and 8 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 4 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Gouvernement du Togo](https://www.cbd.int/doc/world/tg/tg-nbsap-powpa-fr.pdf); [Ministère de l'Environnement et des Ressources Forestières](https://www.cbd.int/doc/world/tg/tg-nbsap-v2-fr.pdf); [MERF, Togo](https://tg.chm-cbd.net/sites/tg/files/2023-07/Togo-6RN%20biodi%20corrig%C3%A9%20final.docx); [UICN/PACO](https://tg.chm-cbd.net/sites/tg/files/2023-07/Evaluation%20de%20l%27efficacit%C3%A9%20des%20Ap%20Togo%20RAPPAM.pdf).

Stated official totals:

- legally classified protected areas (until 1990): 83 (as of 1990) — [Ministère de l'Environnement et des Ressources Forestières](https://www.cbd.int/doc/world/tg/tg-nbsap-v2-fr.pdf)
- priority protected areas / PA mosaics: 10 (as of c. 2012) — [Gouvernement du Togo](https://www.cbd.int/doc/world/tg/tg-nbsap-powpa-fr.pdf)
- priority protected areas: 14 (as of 2018) — [MERF, Togo](https://tg.chm-cbd.net/sites/tg/files/2023-07/Togo-6RN%20biodi%20corrig%C3%A9%20final.docx)

Gaps:

- Togo has no marine protected area (6NR: 'le Togo ne dispose pas d’une aire marine protégée').
- Requalification instruments (arrêtés/décrets) were seen only as citations in the UICN 2008 report; most current legal acts and post-requalification boundaries are undocumented.
- Area figures differ between PoWPA (c. 2012) and UICN 2008; the most recent figure is used and conflicts are noted.
- Anié (part of the Fazao-Malfakassa/Anié mosaic) and Balam forest are mentioned but not documented enough to record separately.
- The 2026 PA law may lead to reclassification; outcome unknown.
- areaKm2 values were converted from hectares (1 km² = 100 ha) where the cited source gives hectares; source figures are quoted in notes where they conflict.
- Not enumerated: forêts classées / other historical PAs (about 83) — Historical total of 83 classified areas (793,000 ha); many encroached and not requalified; no official current list.
- Not enumerated: sacred forests and community forests — Numerous; PoWPA lists the sacred groves of Assévé and Godjinmé (10 ha) as priority, the 6NR names Akissa and Godjinmé; no official list.
- 8 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Angola — partial (11 catalogued)

The national conservation-area network is managed by INBAC (Instituto Nacional da Biodiversidade e Áreas de Conservação, under the ministry responsible for the environment, currently the Ministério da Cultura, Turismo e Ambiente per INBAC park pages). INBAC's website lists 14 areas — 9 national parks, 1 regional natural park (Chimalavera) and 4 reserves — with creating instruments and areas on each page; this matches the counts in the 2019-2025 NBSAP and INBAC's November 2023 status report (156,909.9 km2, 12.58% of the territory). No machine-readable register exists. The legal framework is Lei 8/20 (Áreas de Conservação Ambiental), amended by Lei 12/21. Four further areas, including the first marine conservation area (Baía dos Tigres), are being created but no creating instrument was found. Comparison: the sources reviewed list 18 nationally designated or proposed areas; 10 are catalogued here, and 8 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 1 Ramsar site for this country. Coverage has not been verified as exhaustive. Sources: [Instituto Nacional da Biodiversidade e Áreas de Conservação](https://inbac.gov.ao/Site/areasConservacao/parque); [INBAC](https://inbac.gov.ao/Site/areasConservacao/reservas); [Ministério do Ambiente / Instituto Nacional da Biodiversidade e Conservação](https://inbac.gov.ao/assets_admin/images/documento/038120a4e2e93e6af96d110264eba860.pdf); [Ministry of Environment, Angola](https://www.cbd.int/doc/world/ao/ao-nbsap-v2-en.pdf); [Ministério do Ambiente — Direcção Nacional da Biodiversidade](https://www.cbd.int/doc/world/ao/ao-nr-05-en.pdf); [Assembleia Nacional](https://inbac.gov.ao/assets_admin/images/documento/b66e0a47fb6628053b0aab549ee11ef5.pdf).

Stated official totals:

- conservation areas (9 national parks, 1 natural park, 4 reserves): 14 (as of 2020) — [Ministry of Environment, Angola](https://www.cbd.int/doc/world/ao/ao-nbsap-v2-en.pdf)
- national parks (2012; six until 2010): 9 (as of 2012) — [Ministério do Ambiente — Direcção Nacional da Biodiversidade](https://www.cbd.int/doc/world/ao/ao-nr-05-en.pdf)
- national parks: 9 (as of 2023-11-06) — [Ministério do Ambiente / Instituto Nacional da Biodiversidade e Conservação](https://inbac.gov.ao/assets_admin/images/documento/038120a4e2e93e6af96d110264eba860.pdf)
- reserves: 4 (as of 2023-11-06) — [Ministério do Ambiente / Instituto Nacional da Biodiversidade e Conservação](https://inbac.gov.ao/assets_admin/images/documento/038120a4e2e93e6af96d110264eba860.pdf)
- new conservation areas being created: 4 (as of 2023-11-06) — [Ministério do Ambiente / Instituto Nacional da Biodiversidade e Conservação](https://inbac.gov.ao/assets_admin/images/documento/038120a4e2e93e6af96d110264eba860.pdf)
- marine conservation areas: 0 (as of 2023-03-30) — [Presidente da República](https://lex.ao/docs/presidente-da-republica/2023/decreto-presidencial-n-o-88-23-de-30-de-marco/)

Gaps:

- INBAC pages contain copy-paste errors (Mupa page cites 'Reserva natural integral de Bicuar'; Bicuar page says the 1964 diploma created a 'Reserva parcial'; Cameia's Portaria number and date are blank) — legal histories should be checked against the original Boletim Oficial texts, which were not available online.
- Luengue-Luiana area conflicts: 22,610 km2 in Lei 38/11 vs 45,816/45,818 km2 in INBAC documents (possibly reflecting later boundary changes not found).
- INBAC's conservation-areas document (ago-inbac-acs) highlights an extension of Iona's limits into the marine environment; no instrument confirming a marine extension was found.
- Status of the four areas 'em criação' (Cumbira, Morro do Moco, Serra do Pingano, Baía dos Tigres) after November 2023 could not be confirmed from a Diário da República text; as of the October 2026 State of the Nation report Baía dos Tigres was still being advanced.
- Lei 8/20 was only available as a scanned PDF (checked by OCR); it defines categories but does not itself list the existing areas.
- No official coordinates were used; points depend on Wikidata matches. Chimalavera and Ilhéu dos Pássaros had no matching Wikidata item in a keyword search (Wikidata was rate-limited during this run).
- Not enumerated: coutadas (public and private hunting areas) — Hunting concessions, not conservation areas under Lei 8/20; no official current list found (Lei 38/11 names Longa-Mavinga, Luengue, Luiana and Mucusso coutadas partly absorbed into Luengue-Luiana).
- Not enumerated: forest reserves (reservas florestais) — No official list found online.
- 8 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Botswana — partial (11 catalogued)

No public protected-area register from the Department of Wildlife and National Parks (DWNP) was found online (DWNP has no standalone website; the Botswana Tourism site returned errors). The authoritative list is statutory: the Wildlife Conservation and National Parks Act (Cap. 38:01) declares national parks (First Schedule), game reserves and sanctuaries (Second Schedule), wildlife management areas (Third Schedule) and controlled hunting areas (Fourth Schedule). The freely available consolidated text (FAOLEX) runs to 2007; the Sua Pan Flamingo Sanctuary (S.I. 38 of 2010) was added from its own order. Forest reserves come from the Forest (Declaration of Forest Reserves) Order. The current (2023-2024 amended) consolidated Act is behind a paywall, so later changes may be missing. Category totals from the 5th CBD report (2015, Table 5): national parks 44,390 km2 (7%); game reserves 59,590 + 408 km2 (10%); legislated WMAs 72,090 km2 (23%) plus 65,780 km2 not legislated; forest reserves 4,095.4 km2 (1%). DWNP's PoWPA submission: 'About 40% of the Botswana’s land area has been devoted to protected areas, with 17% being national parks and game reserves'. Comparison: the sources reviewed list 29 nationally designated or proposed areas; 10 are catalogued here, and 19 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 1 Ramsar site for this country. Coverage has not been verified as exhaustive. Sources: [Government of Botswana](https://faolex.fao.org/docs/pdf/bot4728.pdf); [Botswana Laws](https://botswanalaws.com/consolidated-statutes/subsidiary-legislation/wildlife-conservation-and-national-parks-subsidiary-legislation-previously-fauna-conservation); [Botswana Laws](https://botswanalaws.com/consolidated-statutes/subsidiary-legislation/forest-subsidiary-legislation); [Department of Environmental Affairs, Botswana](https://www.cbd.int/doc/world/bw/bw-nr-05-en.pdf); [Department of Wildlife and National Parks, Botswana](https://www.cbd.int/doc/world/bw/bw-nbsap-powpa-en.pdf).

Stated official totals:

- national parks (First Schedule): 4 (as of 2007) — [Government of Botswana](https://faolex.fao.org/docs/pdf/bot4728.pdf)
- game reserves and sanctuaries (Second Schedule): 9 (as of 2007) — [Government of Botswana](https://faolex.fao.org/docs/pdf/bot4728.pdf)
- wildlife management areas (Third Schedule): 9 (as of 2007) — [Government of Botswana](https://faolex.fao.org/docs/pdf/bot4728.pdf)

Gaps:

- The freely available consolidated Wildlife Conservation and National Parks Act (FAOLEX) is current only to S.I. 80 of 2007; amendments by Act 15 of 2023 and S.I.s of 2023-2024 could not be read (paywalled), so any newer parks, reserves or WMAs are missing.
- Establishment years for national parks and game reserves (pre-1992 declarations under the National Parks Act and Fauna Conservation Act) were not found in an official source and are left null.
- Per-area sizes are not given in the Act or the 5th CBD report (which only gives category totals), so areaKm2 is null except where stated.
- Areas often described as protected (Khama Rhino Sanctuary, Mokolodi Nature Reserve, Nata Bird Sanctuary, Mashatu, Okavango Delta as a whole) do not appear in the Act's schedules; they are community, private or international designations and were not added.
- Current status of the forest reserves after the partial degazetting noted in the 5th CBD report (2015) was not verified.
- No official coordinates were used; points depend on Wikidata matches. Gemsbok National Park has no QID because Wikidata only has the binational Kgalagadi Transfrontier Park (Q859385); sanctuaries, WMAs and most forest reserves had no matching item (Wikidata was rate-limited, so only a keyword search was run).
- Not enumerated: controlled hunting areas (Fourth Schedule) (about 80) — Hunting/land-use zoning units (NG/, CH/, GH/ etc.), not protected areas; 80 numbered entries counted in the 2007 consolidated Fourth Schedule.
- Not enumerated: private game reserves (Declaration of Private Game Reserve(s) Orders) — Declared farm by farm under orders amended many times (1968-2008); full current list not freely available.
- Not enumerated: non-legislated (proposed) wildlife management areas — 5th CBD report: Kgalagadi District WMAs have land board approval but were not gazetted (65,780 km2 'not legislated').
- 19 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Egypt — partial (23 catalogued)

The Egyptian Environmental Affairs Agency (EEAA, Nature Conservation Sector) maintains the official list of natural protectorates declared by Prime Ministerial decree under Law No. 102 of 1983. Its July 2026 list (English and Arabic PDFs) enumerates all 31 protectorates with declaration year, area, governorate, management type and declaring/amending decrees; this matches the count of 31 (up to 2025) stated on the EEAA protectorates page. The list appears complete for nationally declared protectorates. It is a PDF table, not a dataset, and gives no coordinates or boundaries. Comparison: the sources reviewed list 31 nationally designated or proposed areas; 20 are catalogued here (3 as an extra designation on an already catalogued area), and 11 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 4 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Egyptian Environmental Affairs Agency (EEAA), Ministry of Local Development and Environment](https://www.eeaa.gov.eg/Topics/85/36/Details); [Egyptian Environmental Affairs Agency (EEAA) — Nature Conservation Sector](https://www.eeaa.gov.eg/Uploads/Topics/Files/20260720125008622.pdf); [Egyptian Environmental Affairs Agency (EEAA) — Nature Conservation Sector](https://www.eeaa.gov.eg/Uploads/Topics/Files/20260720125008613.pdf).

Stated official totals:

- natural protectorates (Law 102/1983): 31 (as of 2025) — [Egyptian Environmental Affairs Agency (EEAA), Ministry of Local Development and Environment](https://www.eeaa.gov.eg/Topics/85/36/Details)

Gaps:

- No official coordinates or boundaries were found; the EEAA protectorates map (https://www.eeaa.gov.eg/Uploads/Topics/Files/20230308115635941.pdf, 2023) is image-only, so coordinates are left null.
- Marine/coastal flags rely on EEAA's short descriptions; protectorates whose description does not mention marine or coastal waters (e.g. Zaranik/Bardawil, Ashtum El-Gamil, Burullus, Taba, Salloum Gulf, Al-Omayed) are left null rather than guessed.
- The boundaries of the 2025 Great Fringing Reefs protectorate (Decree 4419/2025), and how it overlaps the existing Red Sea protectorates, were not verified from an official text; the decree itself was not obtained.
- The EEAA page notes that protectorate pages are being updated; the English 'Regulations' PDF on the page is image-only and was not used.
- Arabic local names come from a PDF whose text extraction breaks lam-alef ligatures; they were corrected by hand and should be spot-checked.
- Ramsar, World Heritage and Biosphere overlaps are mentioned only where EEAA text or well-known coincidence supports them; the coordinator should confirm them from Ramsar/UNESCO.
- Wikidata QIDs were checked one by one with Special:EntityData (label incl. Arabic, P17=Egypt, P31). No item was found for Nile River Islands, Gebel Kamil Meteorite or Great Fringing Reefs. The Dababiya, Salloum and Bahariya items are bare protected-area items without coordinates. Elba also has a second, bare item (Q117258352) besides the one used (Q47069184). Omayed's item is typed as a biosphere reserve but carries the protectorate's Arabic name.
- 11 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Gabon — partial (21 catalogued)

No consolidated official list was retrievable online: the ANPN (Agence Nationale des Parcs Nationaux) website did not resolve/respond. The inventory here is assembled from the founding legal texts: the 13 decrees of 30 August 2002 classifying the national parks (FAOLEX/LEAP; governed since by Loi 003/2007) and Décret 00161/PR of 31 May 2017, which creates 9 marine parks and 11 aquatic reserves with areas and boundaries. Counts are confirmed by Gabon's 6th national report to the CBD (2019). Other protected areas (presidential reserve, arboreta, hunting domains, proposed sites) come from the 2012 PoWPA action plan and the 2019 national report and are dated or partly verified. Comparison: the sources reviewed list 46 nationally designated or proposed areas; 18 are catalogued here (5 as an extra designation on an already catalogued area), and 28 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 8 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Présidence de la République gabonaise](https://faolex.fao.org/docs/pdf/gab240602.pdf); [Ministère des Eaux, des Forêts, de la Mer, de l'Environnement (Gabon), submitted to the CBD](https://www.cbd.int/doc/nr/nr-06/ga-nr-06-fr.pdf); [Government of Gabon (PoWPA focal point), submitted to the CBD](https://www.cbd.int/doc/world/ga/ga-nbsap-powpa-fr.pdf); [CARPE (Central African Regional Program for the Environment, USAID) archive](https://carpe.umd.edu/sites/default/files/documentsarchive/Repertoire_Lois_et_decrets_sur_la_gestion_des_RN_au_Gabon_2009.pdf).

Stated official totals:

- national parks: 13 (as of 2019) — [Ministère des Eaux, des Forêts, de la Mer, de l'Environnement (Gabon), submitted to the CBD](https://www.cbd.int/doc/nr/nr-06/ga-nr-06-fr.pdf)
- marine parks: 9 (as of 2017) — [Présidence de la République gabonaise](https://faolex.fao.org/docs/pdf/gab240602.pdf)
- aquatic reserves: 11 (as of 2017) — [Présidence de la République gabonaise](https://faolex.fao.org/docs/pdf/gab240602.pdf)
- arboreta: 2 (as of 2019) — [Ministère des Eaux, des Forêts, de la Mer, de l'Environnement (Gabon), submitted to the CBD](https://www.cbd.int/doc/nr/nr-06/ga-nr-06-fr.pdf)
- presidential reserve: 1 (as of 2019) — [Ministère des Eaux, des Forêts, de la Mer, de l'Environnement (Gabon), submitted to the CBD](https://www.cbd.int/doc/nr/nr-06/ga-nr-06-fr.pdf)

Gaps:

- The ANPN website (parcsgabon.ga / anpn.ga) could not be reached (DNS failure/timeout), so no current official ANPN list was checked; possible changes after 2019 (new parks, boundary changes, the extension of Akanda/Pongara buffer zones or the May 2026 draft partial declassification of Arboretum Raponda Walker reported in the press) are not verified.
- National park areas are the classification-decree figures from 2002 (FAOLEX abstracts or scanned decrees). Later boundary changes, if any, are not reflected. The LEAP abstract for decree 615 (Minkébé) is wrong (it repeats Moukalaba-Doudou), so the Minkébé area comes from the scanned decree.
- Gabon's 6th national report swaps the marine totals (aquatic reserves 173,100 ha; marine parks 5,102,800 ha); Decree 161/2017 gives marine parks 1,731 km² and aquatic reserves 51,028 km², and the decree figures are used here.
- Decree 161/2017 gives boundary coordinates for each marine park and aquatic reserve. They were not converted to points, so coordinates are left null.
- The status of hunting domains (domaines de chasse) and of Wonga-Wongué rests on the 2012 PoWPA table only. Their creating acts were not found, and several probably overlap or were absorbed by the 2002 national parks.
- Marine flags for Mayumba and Moukalaba-Doudou national parks are left null because the fetched texts do not describe them as marine or coastal.
- Ramsar, World Heritage (Lopé, 2015) and biosphere (Ipassa-Makokou) overlaps are noted only as stated in the 6th national report.
- Wikidata QIDs were checked with Special:EntityData (label, P17=Gabon, P31). The 20 marine-network items and most hunting-domain items have no coordinates on Wikidata. No QID was assigned to Lékédi (the Wikidata 'parc de la Lékédi' may not be the same unit), Arboretum de Sibang, Iboudji or Evaro. The Raponda Walker record is linked to 'Mondah Forest' (Q6898591).
- Not enumerated: classified forests (forêts classées) and other forest reserves — No official list found; only Sibang and Mondah appear in the 2012 PoWPA table.
- Not enumerated: conservation series (séries de conservation) in managed forest concessions — Mentioned in the 6th national report as additional conservation areas, but not listed.
- 28 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Mozambique — partial (14 catalogued)

ANAC (Administração Nacional das Áreas de Conservação) administers the national system of conservation areas and its website lists 10 national parks, 2 national reserves and 1 special reserve (plus transfrontier areas), but its 'sobre' text is out of date ('7 Parques e 7 Reservas Nacionais') and it does not list environmental protection areas, partial reserves or municipal parks. Creation instruments are decrees published in the Boletim da República (several available on FAOLEX). Hunting areas (20 coutadas oficiais, 9 blocos de caça, 13 community programmes, 31 fazendas do bravio) are stated by ANAC without a published list. Comparison: the sources reviewed list 16 nationally designated or proposed areas; 11 are catalogued here, and 5 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 2 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Administração Nacional das Áreas de Conservação](https://www.anac.gov.mz/areas-de-conservacao/); [Administração Nacional das Áreas de Conservação](https://www.anac.gov.mz/anac/); [Administração Nacional das Áreas de Conservação](https://www.anac.gov.mz/turismo/turismo-cinegetico/); [Ministry for the Coordination of Environmental Affairs (MICOA), Mozambique](https://www.cbd.int/doc/world/mz/mz-nr-05-en.pdf).

Stated official totals:

- national parks (ANAC list): 10 (as of 2026) — [Administração Nacional das Áreas de Conservação](https://www.anac.gov.mz/areas-de-conservacao/)
- national parks and national reserves (ANAC 'sobre', dated): 14 — [Administração Nacional das Áreas de Conservação](https://www.anac.gov.mz/anac/)
- coutadas oficiais: 20 — [Administração Nacional das Áreas de Conservação](https://www.anac.gov.mz/turismo/turismo-cinegetico/)
- fazendas do bravio: 31 — [Administração Nacional das Áreas de Conservação](https://www.anac.gov.mz/turismo/turismo-cinegetico/)
- community hunting programmes: 13 — [Administração Nacional das Áreas de Conservação](https://www.anac.gov.mz/turismo/turismo-cinegetico/)

Gaps:

- The 2020 recategorisation decrees (Gilé and Chimanimani to national parks; Niassa to special reserve) were not located; the status rests on ANAC's current list plus a dated news report (and, for Chimanimani, a 2022 Boletim despacho naming the national park).
- Creation instruments and dates for Gorongosa, Banhine, Zinave, Marromeu, Pomene and Niassa were not verified from legal texts (only ANAC's narrative years).
- ANAC still lists Marromeu and Pomene as 'Reserva Nacional' although that category was reportedly abolished by Lei 5/2017; their current legal category is unclear.
- Areas: only Bazaruto (ANAC), Quirimbas (ANAC, approximate) and the Primeiras e Segundas APA (decree) have documented areas; the CBD 5NR table contains garbled hectare figures.
- Lake Niassa Partial Reserve and the Primeiras e Segundas APA are not on ANAC's conservation-areas page; Ponta do Ouro Partial Marine Reserve and Maputo Special Reserve were extinguished in 2021 and merged into Maputo National Park, so they are not recorded separately.
- Transfrontier conservation areas (Grande Limpopo, Lubombo, Niassa-Selous, ZIMOZA) are treaty frameworks over national areas, not separate national designations, and are not recorded.
- No official coordinates were found (decrees contain boundary coordinates but no single reference point).
- Wikidata QIDs were matched (search + entity check of label, P17 country and P31 type) only for national parks and selected major reserves; the Wikidata API was heavily rate-limited (HTTP 429) during this run, so other areas were not attempted or the lookup failed. A null QID does not mean no item exists.
- Not enumerated: coutadas oficiais (official hunting areas) (about 20) — Hunting areas; ANAC states the count but publishes no list. Under Lei 16/2014 they are sustainable-use conservation areas, but per the brief they are not recorded without an official list.
- Not enumerated: fazendas do bravio (game farms) (about 31) — Private/commercial hunting areas; no official list found.
- Not enumerated: community conservation areas / community hunting programmes (e.g. Tchuma Tchato, Chipanje Chetu) (about 13) — ANAC mentions 13 community programmes; no list or legal designations found.
- Not enumerated: forest reserves, sanctuaries and municipal ecological parks — No official consolidated list found (e.g. Santuário Bravio de Vilanculos, Cabo de São Sebastião, Inhaca reserves were seen only in non-official sources).
- 5 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Namibia — partial (20 catalogued)

State protected areas are managed by the Ministry of Environment, Forestry and Tourism (MEFT); its website lists 20 state protected areas (national parks, game parks, recreation resorts, Cape Cross Seal Reserve, South West Nature Reserve) with size and proclamation year per park, but no machine-readable register and no Government Notice references. Communal conservancies are registered by MEFT under s.24A of the Nature Conservation Ordinance; the most complete public list is NACSO's table (86 conservancies, matching MEFT's stated 86) plus NACSO's compilation of gazette numbers. A further conservancy (Ekango Lyomongwa) was gazetted in September 2025. Community forests (Forest Act 2001) and inland fisheries reserves (Inland Fisheries Resources Act 2003) were enumerated directly from the Government Gazettes hosted by NACSO. The marine protected area is the Namibian Islands' Marine Protected Area (Marine Resources Act 2000). Comparison: the sources reviewed list 166 nationally designated or proposed areas; 15 are catalogued here, and 151 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 5 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Ministry of Environment, Forestry and Tourism (MEFT), Namibia](https://www.meft.gov.na/national-parks/overview-of-national-parks/292/); [Ministry of Environment, Forestry and Tourism (MEFT), Namibia](https://www.meft.gov.na/services/conservancies/193/); [Namibian Association of CBNRM Support Organisations](https://nacso.org.na/communal-conservancies/); [NACSO](https://nacso.org.na/wp-content/uploads/2025/05/Gazette-Numbers.pdf).

Stated official totals:

- state-run protected areas: 20 — [Ministry of Environment, Forestry and Tourism (MEFT), Namibia](https://www.meft.gov.na/national-parks/overview-of-national-parks/292/)
- registered communal conservancies: 86 — [Ministry of Environment, Forestry and Tourism (MEFT), Namibia](https://www.meft.gov.na/services/conservancies/193/)
- communal conservancies (NACSO listing): 86 (as of 2025) — [Namibian Association of CBNRM Support Organisations](https://nacso.org.na/communal-conservancies/)
- community forests (registered and emerging): 43 — [NACSO](https://nacso.org.na/community-forests/)
- gazetted fisheries reserves: 10 — [NACSO](https://nacso.org.na/community-fisheries-reserves/)

Gaps:

- MEFT gives proclamation years and sizes but not the Government Notice numbers for the 20 state protected areas; the specific notices (e.g. Bwabwata 2007, Dorob 2010, Tsau //Khaeb 2008, Mangetti 2008, Nkasa Rupara renaming) were not verified (NamibLII was behind a bot challenge).
- 'South West Nature Reserve' appears in MEFT's list but its link points to the Skeleton Coast page; its location, size and legal basis could not be verified.
- MEFT's state-protected-area list does not include the Namibian Islands' Marine Protected Area, Cape Cross is listed as a 'Seal Reserve', and Gross-Barmen / Hardap / Von Bach / Naute are recreation-oriented game parks or resorts; categories here follow MEFT labels.
- Conservancy registrations after 2018 other than Ekango Lyomongwa (GN 248 of 2025) could not be checked systematically; the NACSO/MEFT count of 86 may be out of date.
- NACSO says '43 registered and emerging' community forests, but 47 gazetted declarations (2006-2023) were found in the gazettes NACSO hosts; the gazette list is used here and community forests declared outside these gazettes may be missing.
- GN 297 of 2016 declares the whole Zambezi/Chobe River system a seasonal fisheries reserve (1 December to 28 February each year); it is a seasonal closure and is not recorded as an area.
- No official coordinates were used; points depend on Wikidata matches. Wikidata was heavily rate-limited (HTTP 429) during this run, so only a keyword search (haswbstatement:P17) was possible; most conservancies, community forests and fisheries reserves appear to have no Wikidata item and have null QIDs.
- Not enumerated: freehold conservancies — Voluntary associations of commercial farmers; not declared under the Nature Conservation Ordinance's protected-area provisions and no official list found.
- Not enumerated: tourism and hunting concessions — Use rights granted by MEFT inside/outside parks, not protected-area designations.
- Not enumerated: private game parks / private nature reserves (s.22 of the Ordinance) — No official list found.
- Not enumerated: state forest reserves other than Zambezi — Only the 2023 Zambezi State Forest Reserve declaration was found; no consolidated list of state forest reserves was located.
- 151 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### São Tomé and Príncipe — partial (4 catalogued)

No consolidated official list or protected-area authority website was found. The inventory is reconstructed from the founding legal texts in the Diário da República (via FAOLEX): Laws 6/2006 and 7/2006 creating the two terrestrial natural parks, and Decree-Laws 02/2026 (national MPA network framework) and 03/2026 (first two MPAs of São Tomé). The six MPAs planned around Príncipe are to be classified by a separate Príncipe regional instrument, which was not found. Comparison: the sources reviewed list 4 nationally designated or proposed areas; 2 are catalogued here, and 2 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 1 Ramsar site for this country. Coverage has not been verified as exhaustive. Sources: [Assembleia Nacional, São Tomé e Príncipe](https://faolex.fao.org/docs/pdf/sao83963.pdf); [Assembleia Nacional, São Tomé e Príncipe](https://faolex.fao.org/docs/pdf/sao83964.pdf); [Governo de São Tomé e Príncipe](https://faolex.fao.org/docs/pdf/sao242311.pdf); [Governo de São Tomé e Príncipe](https://faolex.fao.org/docs/pdf/sao242310.pdf).

Stated official totals:

- marine protected areas of São Tomé island (created): 2 (as of 2026-02-27) — [Governo de São Tomé e Príncipe](https://faolex.fao.org/docs/pdf/sao242310.pdf)
- marine protected areas planned (6 Príncipe + 2 São Tomé) — NGO figure: 8 (as of 2025-10) — [Parliamentarians for Global Action](https://www.pgaction.org/pdf/2025/mpa-sao-tome-principe_en.pdf)

Gaps:

- Neither park law states a total area, so areaKm2 is null for both natural parks; no official area figure was found.
- No official coordinates were found. The park laws describe boundaries by named landmarks and maps, and the MPA zoning maps are annexes (images) in the decree-law.
- The legal status of the six planned Príncipe MPAs could not be confirmed. NGO sources (PGA 2025, Fauna & Flora 2025) report draft decree-laws approved by the Council of Ministers in April 2025, but only the São Tomé decree (03/2026) was found in FAOLEX.
- Decree-Laws 02/2026 and 03/2026 enter into force 90 days after publication (about late May 2026); no later implementing acts (management plans) were checked.
- The NGO factsheet says the whole country was designated a UNESCO Biosphere Reserve on 27 September 2025. This is left to the coordinator's UNESCO check and not used here.
- Ramsar (e.g. Ilhéus Tinhosas, mentioned in the 6th national report as a Ramsar site since 2006) and biosphere designations are not recorded as separate areas, per the brief.
- Wikidata QIDs for the two natural parks were checked with Special:EntityData. No Wikidata items were found for the two 2026 MPAs.
- Not enumerated: marine protected areas of the Autonomous Region of Príncipe (planned) (about 6) — Decree-Law 02/2026 leaves the classification of Príncipe MPAs to a separate instrument ('diploma próprio'). No published Príncipe instrument was found, and the site names appear only on an NGO map image, so they are not listed individually.
- 2 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Tanzania — partial (40 catalogued)

No single consolidated official list. Inventories are split by managing authority: TANAPA (national parks; 21 park sections on its website, Kigosi National Park was revoked by GN 616 of 2023), TAWA (an official table of game reserves, game controlled areas and wildlife management areas with area, region and gazettement GN), NCAA (Ngorongoro Conservation Area), the Marine Parks and Reserves Unit (3 marine parks + 15 marine reserves, Tanzania mainland), and TFS (465 forest reserves incl. 25 nature forest reserves and 18 bee reserves; no public list). Zanzibar's protected areas are managed separately by the Revolutionary Government of Zanzibar; no official Zanzibar list could be fetched. Legal instruments (GNs) are indexed on TanzLII. The TAWA table is the most complete official list; the TANAPA list comes from the site's park sections, not from a stated list. Comparison: the sources reviewed list 124 nationally designated or proposed areas; 31 are catalogued here, and 93 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 4 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Tanzania National Parks](https://www.tanzaniaparks.go.tz/); [Tanzania Wildlife Management Authority](https://www.tawa.go.tz/protected-areas); [Tanzania Wildlife Management Authority](https://www.tawa.go.tz/about-us); [Ngorongoro Conservation Area Authority](https://www.ncaa.go.tz/about-ncaa/); [Marine Parks and Reserves Unit (MPRU), Tanzania](https://www.marineparks.go.tz/pages/marine-history); [Tanzania Forest Services Agency](https://www.tfs.go.tz/forests/category/natural_forests); [Vice President's Office, Division of Environment, United Republic of Tanzania](https://www.cbd.int/doc/world/tz/tz-nr-05-en.pdf).

Stated official totals:

- marine parks: 3 — [Marine Parks and Reserves Unit (MPRU), Tanzania](https://www.marineparks.go.tz/pages/marine-history)
- marine reserves (mainland): 15 — [Marine Parks and Reserves Unit (MPRU), Tanzania](https://www.marineparks.go.tz/pages/marine-history)
- marine parks and reserves (total): 18 — [Marine Parks and Reserves Unit (MPRU), Tanzania](https://www.marineparks.go.tz/pages/marine-history)
- forest reserves managed by TFS: 465 — [Tanzania Forest Services Agency](https://www.tfs.go.tz/forests/category/natural_forests)
- nature forest reserves: 25 — [Tanzania Forest Services Agency](https://www.tfs.go.tz/forests/category/natural_forests)
- bee reserves: 18 — [Tanzania Forest Services Agency](https://www.tfs.go.tz/forests/category/natural_forests)
- national parks: 16 (as of 2013) — [Vice President's Office, Division of Environment, United Republic of Tanzania](https://www.cbd.int/doc/world/tz/tz-nr-05-en.pdf)
- game reserves: 28 (as of 2013) — [Vice President's Office, Division of Environment, United Republic of Tanzania](https://www.cbd.int/doc/world/tz/tz-nr-05-en.pdf)
- game controlled areas: 42 (as of 2013) — [Vice President's Office, Division of Environment, United Republic of Tanzania](https://www.cbd.int/doc/world/tz/tz-nr-05-en.pdf)
- wildlife management areas: 38 (as of 2013) — [Vice President's Office, Division of Environment, United Republic of Tanzania](https://www.cbd.int/doc/world/tz/tz-nr-05-en.pdf)
- marine protected areas (Zanzibar): 3 (as of 2014) — [Vice President's Office, Division of Environment, United Republic of Tanzania](https://www.cbd.int/doc/world/tz/tz-nr-05-en.pdf)

Gaps:

- TANAPA's website lists 21 national parks but does not state a total count, establishment instruments or areas for most parks; the original declaration GNs for the 2019 parks (Burigi-Chato, Ibanda-Kyerwa, Rumanyika-Karagwe, Ugalla-River, Nyerere) were not found.
- Kigosi National Park (2019) is excluded: GN 616 of 2023 ('Tamko la Kufuta Hifadhi ya Taifa Kigosi la Mwaka 2023') revoked it per TanzLII; a 2025 High Court judgment indexed on TanzLII describes the area as now 'Hifadhi ya Msitu ya Taifa Kigosi' (national forest reserve), which could not be confirmed from TFS.
- TanzLII document pages (National Parks Act Cap 282 consolidated 2025 with its Second Schedule; individual GNs) are behind a Cloudflare challenge; only titles, GN numbers and dates from the TanzLII search API were used.
- TAWA's table has 25 game reserve rows (two rows combine two reserves: Ikorongo & Grumeti; Lukwati & Piti), versus 28 game reserves in the 2014 CBD report; some reserves were upgraded to national parks since 2019 (e.g. Burigi, Biharamulo, Kimisi, Ibanda, Rumanyika, Kigosi, Ugalla parts). TAWA areas are rounded figures for many reserves.
- TAWA's table lists 25 game controlled areas and 21 WMAs, versus 42 GCAs and 38 WMAs (33 established) in the 2014 CBD report; differences could not be reconciled.
- Marine reserve names are given by MPRU only as island names; individual gazettement years are known only for the four DMRS islands gazetted in June 1975. Mnazi Bay-Ruvuma Estuary Marine Park's gazettement could not be read from the GMP PDF.
- Zanzibar: Jozani-Chwaka Bay National Park, Changuu-Bawe and other Zanzibar conservation areas could not be verified from official sources; the three Zanzibar marine areas are recorded only from the 2014 CBD report.
- Ramsar sites (Malagarasi-Muyovozi, Kilombero Valley Floodplain, Lake Natron) and the Kilwa/Songo Mnara cultural heritage site appear in the TAWA table but are not recorded as separate areas per the brief.
- No official coordinates were found for any area.
- Wikidata QIDs were matched (search + entity check of label, P17 country and P31 type) only for national parks and selected major reserves; the Wikidata API was heavily rate-limited (HTTP 429) during this run, so other areas were not attempted or the lookup failed. A null QID does not mean no item exists.
- Not enumerated: forest reserves (TFS national forest reserves, incl. remaining nature forest reserves) (about 465) — No official list published on the TFS website; only 8 destination pages found. Local authority forest reserves and village land forest reserves are additional.
- Not enumerated: national bee reserves (about 18) — TFS states 18 bee reserves but publishes no list; several were declared by GN in 2024 (e.g. Malinga GN 526, Aghondi GN 530, Kwenyunga-Magiri GN 550, Shinji GN 551 of 2024 per TanzLII). Bee reserves are forest/beekeeping reserves rather than wildlife conservation areas.
- Not enumerated: Zanzibar terrestrial protected areas (e.g. Jozani-Chwaka Bay National Park, forest reserves) — No Zanzibar Government source could be fetched (sites unreachable or blocked); only third-party sources were found, so none are recorded.
- Not enumerated: wildlife corridors and other recent wildlife declarations — Only the Nyerere-Udzungwa corridor (GN 226 of 2025) was found; a systematic search of TanzLII for all corridor orders was not possible because full-text pages are blocked to automated fetch.
- 93 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

### Uganda — partial (35 catalogued)

Uganda Wildlife Authority manages the wildlife conservation areas and states their counts (10 national parks, 12 wildlife reserves, 5 community wildlife management areas, 13 wildlife sanctuaries) but its website names only the national parks and 11 wildlife reserves. The legal declarations are statutory instruments under the Uganda Wildlife Act (most from 2003, SI 41–64 of 2003), indexed on ULII. The National Forestry Authority manages 506 central forest reserves (no list published on its website); local forest reserves are managed by district governments. Comparison: the sources reviewed list 31 nationally designated or proposed areas; 22 are catalogued here (1 as an extra designation on an already catalogued area), and 9 are verified but not yet mapped because no openly licensed location was found. The catalogue also holds 12 Ramsar sites for this country. Coverage has not been verified as exhaustive. Sources: [Uganda Wildlife Authority](https://ugandawildlife.org/); [Uganda Wildlife Authority](https://ugandawildlife.org/parks-reserves/); [National Forestry Authority (NFA), Uganda](https://www.nfa.go.ug/).

Stated official totals:

- national parks: 10 — [Uganda Wildlife Authority](https://ugandawildlife.org/)
- wildlife reserves: 12 — [Uganda Wildlife Authority](https://ugandawildlife.org/)
- community wildlife management areas: 5 — [Uganda Wildlife Authority](https://ugandawildlife.org/)
- wildlife sanctuaries: 13 — [Uganda Wildlife Authority](https://ugandawildlife.org/)
- central forest reserves: 506 — [National Forestry Authority (NFA), Uganda](https://www.nfa.go.ug/)

Gaps:

- ULII document pages are behind a Cloudflare challenge; only instrument titles, numbers and dates from the ULII search API were used. SI 60 of 2003 (gap in the series 41–64) could not be identified.
- No 2003-era declaration instruments were found for Kidepo Valley, Murchison Falls, Rwenzori Mountains and Semuliki national parks or for Katonga, Karuma and Kigezi wildlife reserves; these may have been declared under earlier legislation (e.g. National Parks Act; National Parks (Declaration) (Amendment) Order, SI 76 of 1993).
- UWA page areas are headline figures; the Kibale figure (321 km², identical to Bwindi) appears erroneous and was omitted; Ajai, Karuma and Kigezi pages give inconsistent km²/ha pairs (km² value recorded).
- Whether East Madi is UWA's 12th wildlife reserve is inferred, not confirmed.
- Ramsar sites and World Heritage sites (Bwindi, Rwenzori) are noted only where they coincide with a park.
- No official coordinates were found for any area.
- Wikidata QIDs were matched (search + entity check of label, P17 country and P31 type) only for national parks and selected major reserves; the Wikidata API was heavily rate-limited (HTTP 429) during this run, so other areas were not attempted or the lookup failed. A null QID does not mean no item exists.
- Not enumerated: central forest reserves (about 506) — NFA states 506 CFRs (1,265,741 ha) but its CFR catalogue page does not list them; the declaring orders (Forest (Declaration of Central Forest Reserves) Orders) are on ULII but full text is blocked to automated fetch.
- Not enumerated: local forest reserves — Managed by District Local Governments (NFA catalogue page); no list found.
- Not enumerated: wildlife sanctuaries not found in legal records (about 8) — UWA states 13 sanctuaries; only 5 declaration instruments (2003) were found on ULII and UWA's sanctuary page shows only Ziwa Rhino Sanctuary (privately run; legal status not verified).
- Not enumerated: community wildlife areas not found in legal records (about 1) — UWA states 5; only 4 declaration instruments (2003) were found on ULII.
- 9 verified areas not mapped (no openly licensed coordinates); listed in docs/inventory/uncatalogued-areas.csv.
- WDPA/Protected Planet, the most complete global compilation, is not used because its licence does not allow redistribution here, so the catalogue cannot be compared with it.

## Notes

- Ramsar's annotated-list export has erroneous site-header coordinates for several sites. Each affected record says which coordinates are used: the site description's own, UNESCO's, or Wikidata's.
- Habitat tags reflect terms named in the cited site summary, reviewed for false matches. They are not mapped ecosystem extents.
- Areas verified in an official list but without an openly licensed location are not mapped. They are listed in [`inventory/uncatalogued-areas.csv`](inventory/uncatalogued-areas.csv). Every row there is verified in an official or authoritative source; proposed areas are listed with category `proposed`.
- Conservation challenges, organisations and potential regenerative activities have been researched for Guinea-Bissau and for one area in each of the other 21 countries only. Other areas have not been researched, which does not mean they face no challenges.
