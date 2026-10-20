# Data dictionary

How the Conservation Opportunity Explorer's data is structured. The canonical definitions are the TypeScript types in [`src/domain/types.ts`](../src/domain/types.ts). The data itself is one static file, [`public/data/catalogue.json`](../public/data/catalogue.json). [`src/domain/validate.ts`](../src/domain/validate.ts) and [`src/data/dataset.test.ts`](../src/data/dataset.test.ts) enforce the rules described here.

A spreadsheet-friendly copy of the same records is in [`data-export/`](data-export/README.md). Regenerate it with `npm run data:export`.

## Overview

```
Country 1─* Territory *─* Designation type        (Territory.designations, each with sources)
                     *─* Ecosystem                 (Territory.ecosystems, each a sourced statement)
                     1─* Territory (parent/child)  (Territory.parentId)
Territory *─* Conservation challenge               (Challenge.territoryIds)
Territory *─* Potential regenerative activity      (Opportunity.territoryIds)
Challenge *─* Potential regenerative activity      (Opportunity.challengeIds)
Activity  *─* Organisation                         (Opportunity.organisationLinks, typed and sourced)
Territory *─* Organisation                         (Organisation.territoryIds)
every statement, designation and location ─* Source (sourceIds)
```

All identifiers are stable strings, for example `ramsar-1584`, `cacheu-fuelwood` or `iucn-nl`. Relationships always refer to these ids.

## Statements and evidence

Almost every sentence shown in the app is a **statement**:

| Field | Meaning |
|---|---|
| `text` | The sentence as displayed. |
| `evidence` | `verified`: stated directly by at least one cited source. `interpretation`: a reasoned link between cited evidence and this place, not stated as such by any single source. `hypothesis`: an idea that needs field, regulatory and market validation. |
| `sourceIds` | Sources supporting the sentence. Required for `verified` and `interpretation`; optional for `hypothesis`. |

Rules: a potential activity is never `verified`. An organisation linked as `related-initiative` must be backed by a `verified` statement. A `potential-stakeholder` link must be an `interpretation` or a `hypothesis`, because it is unvalidated.

## Entities

### Catalogue metadata (`meta`)
| Field | Meaning |
|---|---|
| `version` | Dataset version (semantic). |
| `updated` | Date of the last data update. |
| `description` | What the dataset covers and its limits. |

### Country (`countries`)
| Field | Meaning |
|---|---|
| `code` | ISO 3166-1 alpha-3 code, the country's id. |
| `name` | Display name. |

### Territory (`territories`)
A catalogued conservation area, or a broader landscape or administrative region used for context.

| Field | Meaning |
|---|---|
| `id` | Stable id. Ramsar records use `ramsar-<site number>`. |
| `name`, `shortName`, `localName` | Official or common name, a compact map label, and the name in the local language. |
| `kind` | Record type used by this catalogue: `ramsar-site` (shown as "Wetland site"), `protected-area`, `community-protected-area`, `archipelago` or `administrative-region`. It is a record category, **not** an official designation. |
| `countryCode` | The country's id. |
| `parentId` | The enclosing territory, if catalogued (e.g. a park inside the Bijagós Archipelago). |
| `location.description` + `descriptionSourceIds` | Where it is, as stated by the source. |
| `location.point` + `pointSourceId` | Reference point `[longitude, latitude]` (WGS84) and where it comes from. This is a representative location, not a boundary. |
| `geometry.representation` | `point` (reference location only) or `boundary` (polygon from a cited boundary dataset; used only for Guinea-Bissau administrative regions, never for protected-area boundaries). |
| `geometry.featureRef`, `sourceId`, `caveat` | Boundary feature id, its source, and what the geometry does **not** represent. |
| `designations[]` | Official designations (`designationId` + `sourceIds`), e.g. Ramsar site, national park. |
| `overview[]` | Key facts (statements). |
| `livelihoods[]` | Documented local economic activities (statements). |
| `ecosystems[]` | Habitats documented for this place: `ecosystemId` plus a statement saying which source names them. These are not mapped ecosystem extents. |
| `verification.status` | `verified`, `partially-verified` or `location-only` (only a location is sourced). |
| `verification.note`, `reviewed` | What was checked, which coordinates are used and known gaps, and the review date. |

### Designation type (`designationTypes`), Ecosystem (`ecosystems`), Theme (`themes`)
Controlled vocabularies with `id`, `name` and a generic `description`/`definition`. They are used for filters and tags. A definition is a glossary entry, not a claim about any place.

### Conservation challenge (`challenges`)
| Field | Meaning |
|---|---|
| `id`, `title` | Stable id and short title. |
| `territoryIds` | Territories where the challenge is documented. |
| `themeIds` | Conservation themes. |
| `statements[]` | The evidence (statements, normally `verified`). |

### Potential regenerative activity (`opportunities`)
| Field | Meaning |
|---|---|
| `id`, `title` | Stable id and title. |
| `territoryIds` | Territories it is considered for. |
| `challengeIds` | Challenges it could help address. Each must be documented in one of its territories. |
| `themeIds` | Themes. |
| `evidence` | `interpretation` or `hypothesis`, never `verified`. |
| `rationale[]` | The evidence chain, from documented facts to the proposal (statements). |
| `validationNeeded[]` | Questions to validate before treating it as viable. |
| `organisationLinks[]` | `organisationId`, `relationship` (`related-initiative` or `potential-stakeholder`) and a `statement` explaining the link. Only relationships stated by a source are recorded; sharing a citation is never enough. |

### Organisation (`organisations`)
| Field | Meaning |
|---|---|
| `id`, `name`, `acronym`, `type`, `url` | Identity. `url` is omitted when the official domain is dead or hijacked. |
| `territoryIds` | Territories where its role is documented (may be empty). |
| `role` | What the organisation does there (statement). |

### Source (`sources`)
| Field | Meaning |
|---|---|
| `id` | Stable id cited by `sourceIds`. |
| `title`, `publisher`, `url`, `kind` | What it is and where to read it (`webpage`, `report`, `dataset` or `article`). |
| `licence`, `licenceUrl` | Terms of use. Many are "cited for reference (facts and short quotes)": facts are cited, but content is not redistributed. |
| `accessed` | Date the source was last checked. |
| `note` | Caveats (language, age, secondary source, self-reported figures). |

## CSV export mapping

| CSV file | One row per | Key | Links to |
|---|---|---|---|
| `countries.csv` | country | `country_code` | — |
| `territories.csv` | territory | `territory_id` | `country_code`, `parent_id`, designation and ecosystem ids, `location_source_id` |
| `territory_designations.csv` | territory × designation | `territory_id` + `designation_id` | `designation_types.csv`, `sources.csv` |
| `territory_ecosystems.csv` | territory × ecosystem statement | `territory_id` + `ecosystem_id` | `ecosystems.csv`, `sources.csv` |
| `challenges.csv` | challenge | `challenge_id` | `territory_ids`, `theme_ids`, `linked_opportunity_ids` |
| `opportunities.csv` | potential activity | `opportunity_id` | `territory_ids`, `challenge_ids`, `organisation_ids` |
| `opportunity_organisation_links.csv` | activity × organisation link | `opportunity_id` + `organisation_id` | `organisations.csv`, `sources.csv` |
| `organisations.csv` | organisation | `organisation_id` | `territory_ids`, role sources |
| `statements.csv` | statement | `owner_type` + `owner_id` + `position` | the owning record; `source_ids` |
| `sources.csv` | source | `source_id` | — |
| `designation_types.csv`, `ecosystems.csv`, `themes.csv` | vocabulary entry | id | — |

`statements.csv` holds every sourced sentence with its evidence level: territory key facts, livelihoods, challenges, activity rationale and organisation roles. Organisation-link statements are in `opportunity_organisation_links.csv`, and ecosystem statements in `territory_ecosystems.csv`. The `*_source_urls` columns repeat the URLs of the listed source ids for convenience.
