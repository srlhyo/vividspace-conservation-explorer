// Conservation domain model. These types are deliberately free of any map, UI or
// storage concerns so they can be shared with an API or another application later.

/**
 * How strongly a statement is supported.
 * - verified: a factual claim stated directly by at least one cited source.
 * - interpretation: a reasoned link between cited evidence and this territory
 *   (e.g. applying a documented practice to a documented need). Requires sources.
 * - hypothesis: an idea that needs field validation. Sources are optional context.
 */
export type EvidenceLevel = 'verified' | 'interpretation' | 'hypothesis'

export type SourceKind = 'webpage' | 'report' | 'dataset' | 'article'

export interface Source {
  id: string
  title: string
  publisher: string
  url: string
  /** Licence or terms under which the source is used, e.g. "CC BY 4.0". */
  licence: string
  licenceUrl?: string
  /** ISO date the source was last checked. */
  accessed: string
  kind: SourceKind
  note?: string
}

/** A single sentence displayed to the user, with its evidence level and provenance. */
export interface Statement {
  text: string
  evidence: EvidenceLevel
  sourceIds: string[]
}

export interface Country {
  /** ISO 3166-1 alpha-3 code. */
  code: string
  name: string
}

export type TerritoryKind =
  | 'ramsar-site'
  | 'archipelago'
  | 'administrative-region'
  | 'protected-area'
  | 'community-protected-area'

export type VerificationStatus = 'verified' | 'partially-verified' | 'location-only'

export interface TerritoryGeometry {
  /** 'boundary' = polygon from a cited boundary dataset; 'point' = representative location only. */
  representation: 'boundary' | 'point'
  /** Identifier of the feature in the boundary dataset (ISO 3166-2 code for admin regions). */
  featureRef?: string
  sourceId: string
  /** Plain-language caveat shown next to the geometry, e.g. what the polygon does NOT represent. */
  caveat: string
}

export interface TerritoryEcosystem extends Statement {
  ecosystemId: string
}

export interface TerritoryDesignation {
  designationId: string
  sourceIds: string[]
}

/** Controlled vocabulary of formal designations used for filtering. */
export interface DesignationType {
  id: string
  name: string
  description: string
}

export interface Territory {
  id: string
  name: string
  /** Compact label for the map, when the full name is long. */
  shortName?: string
  localName?: string
  kind: TerritoryKind
  countryCode: string
  parentId?: string
  location: {
    description: string
    descriptionSourceIds: string[]
    /** [longitude, latitude] in WGS84. */
    point: [number, number]
    pointSourceId: string
  }
  geometry: TerritoryGeometry
  /** Key facts and designations. */
  overview: Statement[]
  /** Documented local economic activities (context for opportunities). */
  livelihoods: Statement[]
  ecosystems: TerritoryEcosystem[]
  /** Formal designations (Ramsar site, national park, ...), each backed by a source. */
  designations: TerritoryDesignation[]
  verification: {
    status: VerificationStatus
    note: string
    reviewed: string
  }
}

export interface Ecosystem {
  id: string
  name: string
  /** Generic definition (glossary), not a claim about any specific territory. */
  definition: string
}

export interface ConservationTheme {
  id: string
  name: string
  description: string
}

export interface ConservationChallenge {
  id: string
  title: string
  territoryIds: string[]
  themeIds: string[]
  statements: Statement[]
}

/**
 * How an organisation relates to a potential activity. Only relationships stated by a source
 * are recorded; sharing a citation is never enough.
 * - related-initiative: documented work on this or a closely related initiative (verified).
 * - potential-stakeholder: a documented responsibility suggests they would need to be
 *   consulted (interpretation or hypothesis, to be validated).
 */
export type OrganisationRelationship = 'related-initiative' | 'potential-stakeholder'

export interface OrganisationLink {
  organisationId: string
  relationship: OrganisationRelationship
  statement: Statement
}

export interface RegenerativeOpportunity {
  id: string
  title: string
  territoryIds: string[]
  themeIds: string[]
  /** Challenges this activity could help address. */
  challengeIds: string[]
  /** Overall maturity of the opportunity as presented. Never 'verified' for a proposed business. */
  evidence: Exclude<EvidenceLevel, 'verified'>
  /** Supporting chain of reasoning, each step with its own evidence level. */
  rationale: Statement[]
  /** What must be validated before this could be treated as a viable activity. */
  validationNeeded: string[]
  /** Evidence-backed organisation relationships for this activity (may be empty). */
  organisationLinks: OrganisationLink[]
}

export type OrganisationType =
  | 'government-agency'
  | 'national-ngo'
  | 'international-ngo'
  | 'conservation-trust-fund'
  | 'international-organisation'
  | 'regional-partnership'
  | 'research-institution'
  | 'international-programme'

export interface Organisation {
  id: string
  name: string
  acronym?: string
  type: OrganisationType
  url?: string
  /** Territories where the role is documented; empty when only geographic context is known. */
  territoryIds: string[]
  role: Statement
}

export interface CatalogueMeta {
  version: string
  updated: string
  description: string
}

/** The full static dataset. An API-backed repository would assemble the same shape. */
export interface Catalogue {
  meta: CatalogueMeta
  countries: Country[]
  designationTypes: DesignationType[]
  territories: Territory[]
  ecosystems: Ecosystem[]
  themes: ConservationTheme[]
  challenges: ConservationChallenge[]
  opportunities: RegenerativeOpportunity[]
  organisations: Organisation[]
  sources: Source[]
}
