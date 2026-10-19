import { describe, expect, it } from 'vitest'
import {
  emptyFilters,
  filterOptions,
  filterTerritories,
  getTerritoryProfile,
  opportunitiesForChallenge,
  organisationLinksFor,
  sourcesCitedBy,
  territorySummary,
  toggleFilter,
  unlinkedOpportunities,
} from './catalogue'
import type { Catalogue, Territory } from './types'
import { validateCatalogue } from './validate'

const territory = (id: string, ecosystemIds: string[], parentId?: string): Territory => ({
  id,
  name: id,
  kind: 'protected-area',
  countryCode: 'GNB',
  parentId,
  location: { description: '', descriptionSourceIds: [], point: [-15, 11], pointSourceId: 's1' },
  geometry: { representation: 'point', sourceId: 's1', caveat: '' },
  overview: [],
  livelihoods: [],
  ecosystems: ecosystemIds.map((ecosystemId) => ({
    ecosystemId,
    text: '',
    evidence: 'verified',
    sourceIds: ['s1'],
  })),
  verification: { status: 'verified', note: '', reviewed: '2026-10-18' },
})

const fixture: Catalogue = {
  meta: { version: 'test', updated: '2026-10-18', description: '' },
  countries: [{ code: 'GNB', name: 'Guinea-Bissau' }],
  territories: [territory('a', ['mangrove']), territory('b', ['mangrove', 'mudflat'], 'a'), territory('c', ['marine'])],
  ecosystems: [
    { id: 'mangrove', name: 'Mangrove', definition: '' },
    { id: 'mudflat', name: 'Mudflat', definition: '' },
    { id: 'marine', name: 'Marine', definition: '' },
    { id: 'desert', name: 'Desert', definition: '' },
  ],
  themes: [
    { id: 'fish', name: 'Fisheries', description: '' },
    { id: 'climate', name: 'Climate', description: '' },
  ],
  challenges: [
    { id: 'ch1', title: 'c1', territoryIds: ['a', 'c'], themeIds: ['fish'], statements: [{ text: 'x', evidence: 'verified', sourceIds: ['s1'] }] },
  ],
  opportunities: [
    {
      id: 'op1',
      title: 'o1',
      territoryIds: ['a', 'b'],
      themeIds: ['climate'],
      challengeIds: ['ch1'],
      evidence: 'hypothesis',
      rationale: [
        { text: 'w', evidence: 'verified', sourceIds: ['s2'] },
        { text: 'y', evidence: 'hypothesis', sourceIds: [] },
      ],
      validationNeeded: ['demand'],
      organisationLinks: [],
    },
  ],
  organisations: [
    { id: 'org', name: 'Org', type: 'national-ngo', territoryIds: ['a'], role: { text: 'z', evidence: 'verified', sourceIds: ['s2'] } },
  ],
  sources: [
    { id: 's1', title: 'S1', publisher: 'P', url: 'https://example.org/1', licence: 'CC0', accessed: '2026-10-18', kind: 'dataset' },
    { id: 's2', title: 'S2', publisher: 'P', url: 'https://example.org/2', licence: 'CC0', accessed: '2026-10-18', kind: 'webpage' },
  ],
}

const ids = (ts: Territory[]) => ts.map((t) => t.id)

describe('filterTerritories', () => {
  it('returns everything without filters', () => {
    expect(ids(filterTerritories(fixture, emptyFilters))).toEqual(['a', 'b', 'c'])
  })

  it('ORs values within a group', () => {
    const f = { ...emptyFilters, ecosystems: ['mudflat', 'marine'] }
    expect(ids(filterTerritories(fixture, f))).toEqual(['b', 'c'])
  })

  it('ANDs across groups, with themes derived from challenges and opportunities', () => {
    const f = { ...emptyFilters, ecosystems: ['mangrove'], themes: ['fish'] }
    expect(ids(filterTerritories(fixture, f))).toEqual(['a'])
    const g = { ...emptyFilters, themes: ['climate'] }
    expect(ids(filterTerritories(fixture, g))).toEqual(['a', 'b'])
  })

  it('toggles values on and off', () => {
    const on = toggleFilter(emptyFilters, 'themes', 'fish')
    expect(on.themes).toEqual(['fish'])
    expect(toggleFilter(on, 'themes', 'fish').themes).toEqual([])
  })
})

describe('filterOptions', () => {
  it('omits vocabulary values that no territory has', () => {
    const options = filterOptions(fixture, emptyFilters, 'ecosystems')
    expect(options.map((o) => o.id)).toEqual(['mangrove', 'mudflat', 'marine'])
  })

  it('reports availability given the other active groups', () => {
    const f = { ...emptyFilters, themes: ['climate'] }
    const options = filterOptions(fixture, f, 'ecosystems')
    expect(options.find((o) => o.id === 'marine')).toMatchObject({ total: 1, available: 0 })
    expect(options.find((o) => o.id === 'mudflat')).toMatchObject({ total: 1, available: 1 })
  })
})

describe('getTerritoryProfile', () => {
  it('assembles related entities and de-duplicated sources', () => {
    const profile = getTerritoryProfile(fixture, 'a')!
    expect(profile.children.map((c) => c.id)).toEqual(['b'])
    expect(profile.challenges.map((c) => c.id)).toEqual(['ch1'])
    expect(profile.organisations.map((o) => o.id)).toEqual(['org'])
    expect(profile.sources.map((s) => s.id)).toEqual(['s1', 's2'])
    expect(profile.themes.map((t) => t.id)).toEqual(['fish', 'climate'])
  })

  it('returns undefined for unknown territories', () => {
    expect(getTerritoryProfile(fixture, 'nope')).toBeUndefined()
  })
})

describe('challenge → opportunity exploration', () => {
  it('links opportunities to the challenges they respond to', () => {
    const a = getTerritoryProfile(fixture, 'a')!
    expect(opportunitiesForChallenge(a, 'ch1').map((o) => o.id)).toEqual(['op1'])
    expect(unlinkedOpportunities(a)).toEqual([])
  })

  it('reports opportunities whose challenges are not documented for the territory', () => {
    const b = getTerritoryProfile(fixture, 'b')!
    expect(b.challenges).toEqual([])
    expect(unlinkedOpportunities(b).map((o) => o.id)).toEqual(['op1'])
  })

  it('lists the sources cited by a rationale', () => {
    const a = getTerritoryProfile(fixture, 'a')!
    expect(sourcesCitedBy(a, a.opportunities[0].rationale).map((s) => s.id)).toEqual(['s2'])
  })

  it('never associates an organisation with an activity just because they share a source', () => {
    // The fixture's rationale and the organisation's role both cite s2, but there is no link.
    const a = getTerritoryProfile(fixture, 'a')!
    expect(a.organisations[0].role.sourceIds).toContain('s2')
    expect(organisationLinksFor(a, a.opportunities[0])).toEqual([])
  })

  it('returns only explicit organisation links, with their relationship', () => {
    const statement = { text: 'ran a pilot', evidence: 'verified' as const, sourceIds: ['s1'] }
    const linked: Catalogue = {
      ...fixture,
      opportunities: [
        {
          ...fixture.opportunities[0],
          organisationLinks: [{ organisationId: 'org', relationship: 'related-initiative', statement }],
        },
      ],
    }
    // b has no organisation of its own; the linked organisation is still resolved for the activity.
    const b = getTerritoryProfile(linked, 'b')!
    expect(b.organisations).toEqual([])
    expect(organisationLinksFor(b, b.opportunities[0])).toMatchObject([
      { organisation: { id: 'org' }, relationship: 'related-initiative', statement },
    ])
  })

  it('summarises counts per territory', () => {
    expect(territorySummary(fixture, 'a')).toEqual({ challenges: 1, opportunities: 1 })
    expect(territorySummary(fixture, 'c')).toEqual({ challenges: 1, opportunities: 0 })
  })
})

describe('validateCatalogue', () => {
  it('accepts a consistent catalogue', () => {
    expect(validateCatalogue(fixture)).toEqual([])
  })

  it('flags unsourced verified statements and dangling references', () => {
    const broken: Catalogue = {
      ...fixture,
      challenges: [{ ...fixture.challenges[0], territoryIds: ['ghost'], statements: [{ text: 'claim', evidence: 'verified', sourceIds: [] }] }],
    }
    const problems = validateCatalogue(broken)
    expect(problems.some((p) => p.includes('unknown territory "ghost"'))).toBe(true)
    expect(problems.some((p) => p.includes('has no source'))).toBe(true)
  })

  it('flags unsupported organisation links', () => {
    const withLinks = (links: Catalogue['opportunities'][number]['organisationLinks']): Catalogue => ({
      ...fixture,
      opportunities: [{ ...fixture.opportunities[0], organisationLinks: links }],
    })
    const hypothesis = { text: 'might help', evidence: 'hypothesis' as const, sourceIds: [] }
    const verified = { text: 'manages it', evidence: 'verified' as const, sourceIds: ['s1'] }
    expect(validateCatalogue(withLinks([{ organisationId: 'org', relationship: 'related-initiative', statement: hypothesis }]))).toEqual([
      'opportunity op1 → organisation org: related-initiative links must be verified facts',
    ])
    expect(validateCatalogue(withLinks([{ organisationId: 'org', relationship: 'potential-stakeholder', statement: verified }]))).toEqual([
      'opportunity op1 → organisation org: potential stakeholders are interpretations or hypotheses, not verified facts',
    ])
    expect(validateCatalogue(withLinks([{ organisationId: 'ghost', relationship: 'related-initiative', statement: verified }]))).toEqual([
      'opportunity op1 → organisation ghost: unknown organisation',
    ])
    const elsewhere: Catalogue = {
      ...withLinks([{ organisationId: 'org', relationship: 'related-initiative', statement: verified }]),
      organisations: [{ ...fixture.organisations[0], territoryIds: ['c'] }],
    }
    expect(validateCatalogue(elsewhere)).toEqual([
      'opportunity op1 → organisation org: organisation shares no territory with the opportunity',
    ])
  })

  it('allows linking an organisation that has no documented territory', () => {
    const verified = { text: 'ran a pilot', evidence: 'verified' as const, sourceIds: ['s1'] }
    const programme: Catalogue = {
      ...fixture,
      organisations: [{ ...fixture.organisations[0], territoryIds: [] }],
      opportunities: [
        {
          ...fixture.opportunities[0],
          organisationLinks: [{ organisationId: 'org', relationship: 'related-initiative', statement: verified }],
        },
      ],
    }
    expect(validateCatalogue(programme)).toEqual([])
  })

  it('flags opportunities linked to a challenge from another territory', () => {
    const broken: Catalogue = {
      ...fixture,
      opportunities: [{ ...fixture.opportunities[0], territoryIds: ['b'] }],
    }
    expect(validateCatalogue(broken)).toEqual([
      'opportunity op1: linked challenge "ch1" shares no territory with it',
    ])
  })
})
