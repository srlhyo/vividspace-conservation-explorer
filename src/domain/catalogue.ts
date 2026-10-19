import type {
  Catalogue,
  ConservationChallenge,
  DesignationType,
  Ecosystem,
  ConservationTheme,
  Organisation,
  OrganisationLink,
  RegenerativeOpportunity,
  Source,
  Statement,
  Territory,
  TerritoryEcosystem,
} from './types'

export interface TerritoryFilters {
  countries: string[]
  designations: string[]
  ecosystems: string[]
  themes: string[]
}

export const emptyFilters: TerritoryFilters = { countries: [], designations: [], ecosystems: [], themes: [] }

export type FilterKey = keyof TerritoryFilters

export function hasActiveFilters(filters: TerritoryFilters): boolean {
  return Object.values(filters).some((values) => values.length > 0)
}

/** Themes of a territory are derived from the challenges and opportunities linked to it. */
export function territoryThemeIds(catalogue: Catalogue, territoryId: string): Set<string> {
  const ids = new Set<string>()
  for (const item of [...catalogue.challenges, ...catalogue.opportunities]) {
    if (item.territoryIds.includes(territoryId)) item.themeIds.forEach((t) => ids.add(t))
  }
  return ids
}

function territoryValues(catalogue: Catalogue, territory: Territory, key: FilterKey): Set<string> {
  switch (key) {
    case 'countries':
      return new Set([territory.countryCode])
    case 'designations':
      return new Set(territory.designations.map((d) => d.designationId))
    case 'ecosystems':
      return new Set(territory.ecosystems.map((e) => e.ecosystemId))
    case 'themes':
      return territoryThemeIds(catalogue, territory.id)
  }
}

/** OR within a filter group, AND across groups. Empty group = no constraint. */
export function matchesFilters(
  catalogue: Catalogue,
  territory: Territory,
  filters: TerritoryFilters,
): boolean {
  return (Object.keys(filters) as FilterKey[]).every((key) => {
    const selected = filters[key]
    if (selected.length === 0) return true
    const values = territoryValues(catalogue, territory, key)
    return selected.some((v) => values.has(v))
  })
}

export function filterTerritories(catalogue: Catalogue, filters: TerritoryFilters): Territory[] {
  return catalogue.territories.filter((t) => matchesFilters(catalogue, t, filters))
}

export interface FilterOption {
  id: string
  label: string
  /** Territories in the whole dataset carrying this value. */
  total: number
  /** Territories that would match if this option were toggled on, given the other groups. */
  available: number
  /**
   * True when every territory matching the other groups has this value, so selecting it on its
   * own would not narrow the results.
   */
  coversAll: boolean
}

/**
 * Options for one filter group, limited to values that occur in the dataset (total > 0).
 * `available` is computed with the other groups applied, so the UI can explain options
 * that would currently produce no results.
 */
export function filterOptions(
  catalogue: Catalogue,
  filters: TerritoryFilters,
  key: FilterKey,
): FilterOption[] {
  const vocabulary: { id: string; label: string }[] = {
    countries: catalogue.countries.map((c) => ({ id: c.code, label: c.name })),
    designations: catalogue.designationTypes.map((d) => ({ id: d.id, label: d.name })),
    ecosystems: catalogue.ecosystems.map((e) => ({ id: e.id, label: e.name })),
    themes: catalogue.themes.map((t) => ({ id: t.id, label: t.name })),
  }[key]

  const others: TerritoryFilters = { ...filters, [key]: [] }
  const candidates = filterTerritories(catalogue, others)

  return vocabulary
    .map(({ id, label }) => ({
      id,
      label,
      total: catalogue.territories.filter((t) => territoryValues(catalogue, t, key).has(id)).length,
      available: candidates.filter((t) => territoryValues(catalogue, t, key).has(id)).length,
    }))
    .map((o) => ({ ...o, coversAll: candidates.length > 0 && o.available === candidates.length }))
    .filter((o) => o.total > 0)
}

export function toggleFilter(
  filters: TerritoryFilters,
  key: FilterKey,
  value: string,
): TerritoryFilters {
  const current = filters[key]
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
  return { ...filters, [key]: next }
}

export interface TerritoryProfile {
  territory: Territory
  parent?: Territory
  children: Territory[]
  countryName: string
  designations: (DesignationType & { sourceIds: string[] })[]
  ecosystems: (TerritoryEcosystem & { ecosystem: Ecosystem })[]
  themes: ConservationTheme[]
  challenges: ConservationChallenge[]
  opportunities: RegenerativeOpportunity[]
  organisations: Organisation[]
  /** Organisations referenced by the profile's opportunities (may lie outside the territory). */
  linkedOrganisations: Organisation[]
  /** Every source cited anywhere in the profile, in first-cited order. */
  sources: Source[]
}

/** Assembles everything known about one territory. Returns undefined for unknown ids. */
export function getTerritoryProfile(
  catalogue: Catalogue,
  territoryId: string,
): TerritoryProfile | undefined {
  const territory = catalogue.territories.find((t) => t.id === territoryId)
  if (!territory) return undefined

  const byTerritory = <T extends { territoryIds: string[] }>(items: T[]) =>
    items.filter((i) => i.territoryIds.includes(territoryId))

  const challenges = byTerritory(catalogue.challenges)
  const opportunities = byTerritory(catalogue.opportunities)
  const organisations = byTerritory(catalogue.organisations)
  const themeIds = territoryThemeIds(catalogue, territoryId)

  const ecosystems = territory.ecosystems.flatMap((e) => {
    const ecosystem = catalogue.ecosystems.find((x) => x.id === e.ecosystemId)
    return ecosystem ? [{ ...e, ecosystem }] : []
  })

  const statements: Statement[] = [
    ...territory.overview,
    ...territory.livelihoods,
    ...territory.ecosystems,
    ...challenges.flatMap((c) => c.statements),
    ...opportunities.flatMap((o) => o.rationale),
    ...opportunities.flatMap((o) => o.organisationLinks.map((l) => l.statement)),
    ...organisations.map((o) => o.role),
  ]
  const designations = territory.designations.flatMap((d) => {
    const type = catalogue.designationTypes.find((x) => x.id === d.designationId)
    return type ? [{ ...type, sourceIds: d.sourceIds }] : []
  })
  const sourceIds = [
    ...territory.location.descriptionSourceIds,
    territory.location.pointSourceId,
    territory.geometry.sourceId,
    ...designations.flatMap((d) => d.sourceIds),
    ...statements.flatMap((s) => s.sourceIds),
  ]
  const sources = [...new Set(sourceIds)].flatMap((id) => {
    const source = catalogue.sources.find((s) => s.id === id)
    return source ? [source] : []
  })

  return {
    territory,
    parent: catalogue.territories.find((t) => t.id === territory.parentId),
    children: catalogue.territories.filter((t) => t.parentId === territory.id),
    countryName:
      catalogue.countries.find((c) => c.code === territory.countryCode)?.name ??
      territory.countryCode,
    designations,
    ecosystems,
    themes: catalogue.themes.filter((t) => themeIds.has(t.id)),
    challenges,
    opportunities,
    organisations,
    linkedOrganisations: catalogue.organisations.filter((org) =>
      opportunities.some((o) => o.organisationLinks.some((l) => l.organisationId === org.id)),
    ),
    sources,
  }
}

/** Maps source ids to 1-based citation numbers for a profile's source list. */
export function citationIndex(sources: Source[]): Map<string, number> {
  return new Map(sources.map((s, i) => [s.id, i + 1]))
}

// --- Challenge → opportunity exploration -------------------------------------------------

/** Potential activities in a profile that respond to the given challenge. */
export function opportunitiesForChallenge(
  profile: TerritoryProfile,
  challengeId: string,
): RegenerativeOpportunity[] {
  return profile.opportunities.filter((o) => o.challengeIds.includes(challengeId))
}

/** Potential activities of a territory that respond to none of its documented challenges. */
export function unlinkedOpportunities(profile: TerritoryProfile): RegenerativeOpportunity[] {
  const ids = new Set(profile.challenges.map((c) => c.id))
  return profile.opportunities.filter((o) => !o.challengeIds.some((id) => ids.has(id)))
}

/** Sources cited by the given statements, in profile order. */
export function sourcesCitedBy(profile: TerritoryProfile, statements: Statement[]): Source[] {
  const ids = new Set(statements.flatMap((s) => s.sourceIds))
  return profile.sources.filter((s) => ids.has(s.id))
}

export interface ResolvedOrganisationLink extends OrganisationLink {
  organisation: Organisation
}

/**
 * The organisations explicitly linked to an opportunity in the data. Organisations are never
 * inferred from shared citations: a source that mentions an organisation is not evidence that
 * the organisation is involved in the proposed activity.
 */
export function organisationLinksFor(
  profile: TerritoryProfile,
  opportunity: RegenerativeOpportunity,
): ResolvedOrganisationLink[] {
  return opportunity.organisationLinks.flatMap((link) => {
    const organisation = profile.linkedOrganisations.find((o) => o.id === link.organisationId)
    return organisation ? [{ ...link, organisation }] : []
  })
}

export interface TerritorySummary {
  challenges: number
  opportunities: number
}

export function territorySummary(catalogue: Catalogue, territoryId: string): TerritorySummary {
  const count = (items: { territoryIds: string[] }[]) =>
    items.filter((i) => i.territoryIds.includes(territoryId)).length
  return { challenges: count(catalogue.challenges), opportunities: count(catalogue.opportunities) }
}

/** Filters other than the country scope (designation, ecosystem, theme). */
export const attributeKeys = ['designations', 'ecosystems', 'themes'] as const satisfies readonly FilterKey[]

export function hasAttributeFilters(filters: TerritoryFilters): boolean {
  return attributeKeys.some((key) => filters[key].length > 0)
}

/** Territories within the selected countries only (all territories when none is selected). */
export function territoriesInScope(catalogue: Catalogue, filters: TerritoryFilters): Territory[] {
  return filterTerritories(catalogue, { ...emptyFilters, countries: filters.countries })
}

/** How many territories of each kind, most frequent first. */
export function countByKind(territories: Territory[]): { kind: Territory['kind']; count: number }[] {
  const counts = new Map<Territory['kind'], number>()
  for (const t of territories) counts.set(t.kind, (counts.get(t.kind) ?? 0) + 1)
  return [...counts].map(([kind, count]) => ({ kind, count })).sort((a, b) => b.count - a.count)
}
