import type {
  EvidenceLevel,
  OrganisationType,
  TerritoryKind,
  VerificationStatus,
} from '../domain/types'

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
  archipelago: 'Archipelago',
  'administrative-region': 'Administrative region',
  'protected-area': 'Protected area',
  'community-protected-area': 'Community protected area',
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
