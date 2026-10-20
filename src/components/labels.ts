import type { EvidenceLevel, OrganisationType, ProtectionCategory, TerritoryKind, VerificationStatus } from '../domain/types'

export const evidenceMeta: Record<
  EvidenceLevel,
  { label: string; short: string; description: string; badge: string; rule: string }
> = {
  verified: {
    label: 'Verified fact',
    short: 'Verified',
    description: 'Stated directly by the cited source(s).',
    badge: 'bg-forest text-white ring-forest',
    rule: 'border-forest',
  },
  interpretation: {
    label: 'Research-backed interpretation',
    short: 'Interpretation',
    description:
      'A reasoned link between cited evidence and this territory. Not stated as such by any single source.',
    badge: 'bg-sky-50 text-sky-900 ring-sky-300',
    rule: 'border-sky-400',
  },
  hypothesis: {
    label: 'Hypothesis — requires validation',
    short: 'Hypothesis',
    description:
      'A proposal for discussion. It has not been validated with communities, authorities or the market.',
    badge: 'bg-white text-clay ring-clay border-dashed',
    rule: 'border-clay border-dashed',
  },
}

export const territoryKindLabel: Record<TerritoryKind, string> = {
  // A record category, not a designation: official designations are listed separately.
  'ramsar-site': 'Wetland site',
  archipelago: 'Archipelago',
  'administrative-region': 'Administrative region',
  'protected-area': 'Protected area',
  'community-protected-area': 'Community protected area',
}

export const territoryKindPlural: Record<TerritoryKind, string> = {
  'ramsar-site': 'wetland sites',
  archipelago: 'archipelagos',
  'administrative-region': 'administrative regions',
  'protected-area': 'protected areas',
  'community-protected-area': 'community protected areas',
}

/** "Catalogued as: 7 wetland sites · 1 protected area" — record types, not official designations. */
export function kindBreakdown(items: { kind: TerritoryKind; count: number }[]): string {
  if (items.length === 0) return ''
  const parts = items.map(
    ({ kind, count }) => `${count} ${count === 1 ? territoryKindLabel[kind].toLowerCase() : territoryKindPlural[kind]}`,
  )
  return `Catalogued as: ${parts.join(' · ')}`
}

export const kindBreakdownHint =
  'Record types used in this catalogue. Official designations (Ramsar site, national park, …) are shown on each area and in the Designation filter.'

/** Designations conferred under international conventions or programmes; every other designation type is national. */
export const internationalDesignationIds: ReadonlySet<string> = new Set(['ramsar', 'world-heritage', 'biosphere-reserve'])

export const protectionCategoryLabel: Record<ProtectionCategory, string> = {
  'national-park': 'National park',
  'nature-reserve': 'Nature reserve',
  'marine-protected-area': 'Marine protected area',
  'wildlife-reserve': 'Wildlife or game reserve',
  'forest-reserve': 'Forest reserve',
  'community-conservation-area': 'Community conservation area',
  'other-protected-area': 'Other protected area',
  'international-designation': 'International designation only',
  proposed: 'Proposed — not legally designated',
  context: 'Landscape or region (context, not a protected area)',
}

export const verificationMeta: Record<VerificationStatus, { label: string; tone: string }> = {
  verified: { label: 'Verified', tone: 'bg-forest-soft text-forest ring-forest/30' },
  'partially-verified': {
    label: 'Partially verified',
    tone: 'bg-gold-soft text-amber-900 ring-gold/50',
  },
  'location-only': { label: 'Location only', tone: 'bg-stone-100 text-stone-700 ring-stone-300' },
}

export const organisationTypeLabel: Record<OrganisationType, string> = {
  'government-agency': 'Government agency',
  'national-ngo': 'National NGO',
  'international-ngo': 'International NGO',
  'conservation-trust-fund': 'Conservation trust fund',
  'international-organisation': 'International organisation',
  'regional-partnership': 'Regional partnership',
  'research-institution': 'Research institution',
  'international-programme': 'International programme',
}
