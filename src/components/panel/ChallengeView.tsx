import { opportunitiesForChallenge, sourcesCitedBy, type TerritoryProfile } from '../../domain/catalogue'
import type { ConservationChallenge } from '../../domain/types'
import { StatementList } from '../StatementList'
import { OpportunityCards } from './TerritoryOverview'
import { BackLink, Section, SourceList, ThemeTags } from './parts'

interface Props {
  profile: TerritoryProfile
  challenge: ConservationChallenge
  citations: Map<string, number>
  onBack: () => void
  onSelectOpportunity: (id: string) => void
}

export function ChallengeView({ profile, challenge, citations, onBack, onSelectOpportunity }: Props) {
  const opportunities = opportunitiesForChallenge(profile, challenge.id)

  return (
    <div className="flex flex-col gap-7">
      <div>
        <BackLink onClick={onBack}>All challenges in {profile.territory.shortName ?? profile.territory.name}</BackLink>
        <p className="mt-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-clay">Conservation challenge</p>
        <h3 className="mt-1 font-display text-xl font-semibold leading-snug text-ink">{challenge.title}</h3>
        <div className="mt-2">
          <ThemeTags themes={profile.themes.filter((t) => challenge.themeIds.includes(t.id))} />
        </div>
      </div>

      <Section title="What the evidence says">
        <StatementList statements={challenge.statements} citations={citations} />
      </Section>

      <Section
        title="Potential regenerative activities"
        hint={
          opportunities.length > 0
            ? 'Discussion starters linking this need to possible activities — not validated businesses or confirmed partnerships.'
            : undefined
        }
      >
        {opportunities.length === 0 ? (
          <p className="rounded-lg bg-cream px-3 py-2.5 text-[13px] leading-relaxed text-ink-muted">
            No potential activity is documented for this challenge yet. None is suggested without
            supporting evidence.
          </p>
        ) : (
          <OpportunityCards opportunities={opportunities} onSelect={onSelectOpportunity} />
        )}
      </Section>

      <Section title="Sources">
        <SourceList sources={sourcesCitedBy(profile, challenge.statements)} citations={citations} />
      </Section>
    </div>
  )
}
