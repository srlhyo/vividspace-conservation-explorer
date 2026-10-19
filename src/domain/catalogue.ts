import type {
  Catalogue,
  ConservationChallenge,
  Ecosystem,
  ConservationTheme,
  Organisation,
  RegenerativeOpportunity,
  Source,
  Statement,
  Territory,
  TerritoryEcosystem,
} from './types'

export interface TerritoryFilters {
  countries: string[]
  ecosystems: string[]
  themes: string[]
}

export const emptyFilters: TerritoryFilters = { countries: [], ecosystems: [], themes: [] }

export type FilterKey = keyof TerritoryFilters

export function hasActiveFilters(filters: TerritoryFilters): boolean {
  return filters.countries.length + filters.ecosystems.length + filters.themes.length > 0
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
  const vocabulary: { id: string; label: string }[] =
    key === 'countries'
      ? catalogue.countries.map((c) => ({ id: c.code, label: c.name }))
      : key === 'ecosystems'
        ? catalogue.ecosystems.map((e) => ({ id: e.id, label: e.name }))
        : catalogue.themes.map((t) => ({ id: t.id, label: t.name }))

  const others: TerritoryFilters = { ...filters, [key]: [] }
  const candidates = filterTerritories(catalogue, others)

  return vocabulary
    .map(({ id, label }) => ({
      id,
      label,
      total: catalogue.territories.filter((t) => territoryValues(catalogue, t, key).has(id)).length,
      available: candidates.filter((t) => territoryValues(catalogue, t, key).has(id)).length,
    }))
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
  ecosystems: (TerritoryEcosystem & { ecosystem: Ecosystem })[]
  themes: ConservationTheme[]
  challenges: ConservationChallenge[]
  opportunities: RegenerativeOpportunity[]
  organisations: Organisation[]
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
    ...organisations.map((o) => o.role),
  ]
  const sourceIds = [
    ...territory.location.descriptionSourceIds,
    territory.location.pointSourceId,
    territory.geometry.sourceId,
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
    ecosystems,
    themes: catalogue.themes.filter((t) => themeIds.has(t.id)),
    challenges,
    opportunities,
    organisations,
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

/**
 * Organisations of the territory whose documented role cites a source that the opportunity's
 * rationale also cites. This is shared evidence only — it implies no partnership or endorsement.
 */
export function organisationsInEvidence(
  profile: TerritoryProfile,
  opportunity: RegenerativeOpportunity,
): Organisation[] {
  const ids = new Set(opportunity.rationale.flatMap((s) => s.sourceIds))
  return profile.organisations.filter((o) => o.role.sourceIds.some((id) => ids.has(id)))
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
