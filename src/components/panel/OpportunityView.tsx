import { organisationsInEvidence, sourcesCitedBy, type TerritoryProfile } from '../../domain/catalogue'
import type { ConservationChallenge, RegenerativeOpportunity, Territory } from '../../domain/types'
import { EvidenceBadge } from '../EvidenceBadge'
import { evidenceMeta } from '../labels'
import { Citations } from '../StatementList'
import { BackLink, LinkChip, OrganisationList, Section, SourceList, ThemeTags } from './parts'

interface Props {
  profile: TerritoryProfile
  opportunity: RegenerativeOpportunity
  /** The challenge the user came from, if any. */
  fromChallenge?: ConservationChallenge
  otherTerritories: Territory[]
  citations: Map<string, number>
  onBack: () => void
  onSelectChallenge: (id: string) => void
  onSelectTerritory: (id: string) => void
}

export function OpportunityView({
  profile,
  opportunity,
  fromChallenge,
  otherTerritories,
  citations,
  onBack,
  onSelectChallenge,
  onSelectTerritory,
}: Props) {
  const respondsTo = profile.challenges.filter((c) => opportunity.challengeIds.includes(c.id))
  const organisations = organisationsInEvidence(profile, opportunity)

  return (
    <div className="flex flex-col gap-7">
      <div>
        <BackLink onClick={onBack}>
          {fromChallenge ? fromChallenge.title : `All challenges in ${profile.territory.shortName ?? profile.territory.name}`}
        </BackLink>
        <p className="mt-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-clay">
          Potential regenerative activity
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold leading-snug text-ink">{opportunity.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <EvidenceBadge level={opportunity.evidence} long />
          <ThemeTags themes={profile.themes.filter((t) => opportunity.themeIds.includes(t.id))} />
        </div>
        <p className="mt-3 rounded-lg bg-gold-soft/70 px-3 py-2 text-[12.5px] leading-relaxed text-amber-950">
          A discussion starter, <strong>not a validated business or a confirmed partnership</strong>.{' '}
          {evidenceMeta[opportunity.evidence].description}
        </p>
        {respondsTo.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[12px]">
            <span className="text-ink-muted">Responds to</span>
            {respondsTo.map((c) => (
              <LinkChip key={c.id} onClick={() => onSelectChallenge(c.id)}>
                {c.title}
              </LinkChip>
            ))}
          </div>
        )}
      </div>

      <Section title="Why it may be relevant" hint="Read from documented facts down to the proposal.">
        <ol className="relative flex flex-col gap-4">
          {opportunity.rationale.map((s, i) => (
            <li key={i} className="relative flex gap-3">
              {i < opportunity.rationale.length - 1 && (
                <span className="absolute top-6 bottom-[-1rem] left-[11px] w-px bg-line" aria-hidden />
              )}
              <span
                className={`relative grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ring-1 ${evidenceMeta[s.evidence].badge}`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <EvidenceBadge level={s.evidence} />
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink">
                  {s.text}
                  <Citations sourceIds={s.sourceIds} citations={citations} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Next steps — questions to validate">
        <ul className="flex flex-col gap-2 rounded-xl bg-cream p-4 ring-1 ring-line">
          {opportunity.validationNeeded.map((q) => (
            <li key={q} className="flex gap-2.5 text-[13.5px] leading-snug text-ink">
              <span className="mt-0.5 size-4 shrink-0 rounded border-2 border-clay/70" aria-hidden />
              {q}
            </li>
          ))}
        </ul>
      </Section>

      {organisations.length > 0 && (
        <Section
          title="Organisations in the cited evidence"
          hint="Listed because their documented work shares sources with this rationale. No partnership or endorsement is implied."
        >
          <OrganisationList organisations={organisations} citations={citations} />
        </Section>
      )}

      <Section title="Supporting sources">
        <SourceList sources={sourcesCitedBy(profile, opportunity.rationale)} citations={citations} />
      </Section>

      {otherTerritories.length > 0 && (
        <Section title="Also considered for">
          <div className="flex flex-wrap gap-1.5">
            {otherTerritories.map((t) => (
              <LinkChip key={t.id} onClick={() => onSelectTerritory(t.id)}>
                {t.name}
              </LinkChip>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
