import { useState } from 'react'
import {
  opportunitiesForChallenge,
  unlinkedOpportunities,
  type TerritoryProfile,
} from '../../domain/catalogue'
import type { RegenerativeOpportunity } from '../../domain/types'
import { EvidenceBadge } from '../EvidenceBadge'
import { GeometryGlyph } from '../GeometryGlyph'
import { verificationMeta } from '../labels'
import { Citations, StatementList } from '../StatementList'
import { Chevron, Disclosure, LinkChip, OrganisationList, Section, SourceList, ThemeTags } from './parts'

const KEY_FACTS_PREVIEW = 3

interface Props {
  profile: TerritoryProfile
  citations: Map<string, number>
  onSelectTerritory: (id: string) => void
  onSelectChallenge: (id: string) => void
  onSelectOpportunity: (id: string) => void
}

export function TerritoryOverview({
  profile,
  citations,
  onSelectTerritory,
  onSelectChallenge,
  onSelectOpportunity,
}: Props) {
  const { territory } = profile
  const [allFacts, setAllFacts] = useState(false)
  const [dataNotes, setDataNotes] = useState(false)
  const facts = allFacts ? territory.overview : territory.overview.slice(0, KEY_FACTS_PREVIEW)
  const unlinked = unlinkedOpportunities(profile)
  const verification = verificationMeta[territory.verification.status]

  return (
    <div className="flex flex-col gap-7">
      {/* Location, map representation and data status */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[14px] leading-relaxed text-ink">
          {territory.location.description}
          <Citations sourceIds={territory.location.descriptionSourceIds} citations={citations} />
        </p>
        <div className="rounded-lg bg-cream px-3 py-2 ring-1 ring-line">
          <button
            type="button"
            aria-expanded={dataNotes}
            onClick={() => setDataNotes((v) => !v)}
            className="flex w-full items-center gap-2.5 text-left"
          >
            <GeometryGlyph representation={territory.geometry.representation} />
            <span className="min-w-0 flex-1 text-[12.5px] font-semibold leading-snug text-ink">
              {territory.geometry.representation === 'boundary'
                ? 'Administrative boundary — not a protected-area boundary'
                : 'Location point — official boundary not shown'}
            </span>
            <span className={`shrink-0 rounded-full px-1.5 py-px text-[10.5px] font-semibold ring-1 ${verification.tone}`}>
              {verification.label}
            </span>
            <span className="text-ink-muted">
              <Chevron direction={dataNotes ? 'up' : 'down'} />
            </span>
          </button>
          {dataNotes && (
            <div className="mt-2 flex flex-col gap-1.5 border-t border-line pt-2 text-[12.5px] leading-relaxed text-ink-muted">
              <p>
                {territory.geometry.caveat}
                <Citations sourceIds={[territory.geometry.sourceId]} citations={citations} />
              </p>
              <p>{territory.verification.note}</p>
              <p className="text-[11.5px]">Reviewed {territory.verification.reviewed}</p>
            </div>
          )}
        </div>
        {(profile.parent || profile.children.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
            {profile.parent && (
              <>
                <span className="text-ink-muted">Within</span>
                <LinkChip onClick={() => onSelectTerritory(profile.parent!.id)}>{profile.parent.name}</LinkChip>
              </>
            )}
            {profile.children.length > 0 && (
              <>
                <span className="text-ink-muted">Includes</span>
                {profile.children.map((c) => (
                  <LinkChip key={c.id} onClick={() => onSelectTerritory(c.id)}>
                    {c.shortName ?? c.name}
                  </LinkChip>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <Section
        title="Conservation challenges"
        hint={
          profile.challenges.length > 0
            ? 'Select a challenge to see potential regenerative activities and the evidence behind them.'
            : undefined
        }
      >
        {profile.challenges.length === 0 ? (
          <p className="text-sm italic text-ink-muted">No conservation challenge is documented for this territory yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {profile.challenges.map((c) => {
              const n = opportunitiesForChallenge(profile, c.id).length
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelectChallenge(c.id)}
                    className="group flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3 text-left ring-1 ring-line transition hover:bg-cream hover:ring-forest/40"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold leading-snug text-ink">{c.title}</span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <ThemeTags themes={profile.themes.filter((t) => c.themeIds.includes(t.id))} />
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${n > 0 ? 'bg-gold-soft text-amber-900' : 'bg-stone-100 text-stone-500'}`}
                    >
                      {n > 0 ? `${n} activit${n === 1 ? 'y' : 'ies'}` : 'No activity yet'}
                    </span>
                    <span className="text-ink-muted group-hover:text-forest">
                      <Chevron />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Section>

      {unlinked.length > 0 && (
        <Section
          title="Other potential activities"
          hint="Documented for this territory but not linked to one of the challenges above."
        >
          <OpportunityCards opportunities={unlinked} onSelect={onSelectOpportunity} />
        </Section>
      )}

      {territory.overview.length > 0 && (
        <Section title="Key facts">
          <StatementList statements={facts} citations={citations} />
          {territory.overview.length > KEY_FACTS_PREVIEW && (
            <button
              type="button"
              onClick={() => setAllFacts((v) => !v)}
              className="mt-3 text-[13px] font-medium text-forest hover:underline"
            >
              {allFacts ? 'Show fewer facts' : `Show all ${territory.overview.length} facts`}
            </button>
          )}
        </Section>
      )}

      <div className="flex flex-col gap-3">
        <Disclosure title="Ecosystems" count={profile.ecosystems.length}>
          {profile.ecosystems.length === 0 ? (
            <p className="text-sm italic text-ink-muted">No source reviewed so far describes this territory's habitats.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {profile.ecosystems.map((e) => (
                <li key={e.ecosystemId}>
                  <span className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-ink" title={e.ecosystem.definition}>
                      {e.ecosystem.name}
                    </span>
                    <EvidenceBadge level={e.evidence} />
                  </span>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-ink">
                    {e.text}
                    <Citations sourceIds={e.sourceIds} citations={citations} />
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Disclosure>
        <Disclosure title="Local economy & livelihoods" count={territory.livelihoods.length}>
          {territory.livelihoods.length === 0 ? (
            <p className="text-sm italic text-ink-muted">No source reviewed so far describes local livelihoods here.</p>
          ) : (
            <StatementList statements={territory.livelihoods} citations={citations} />
          )}
        </Disclosure>
        <Disclosure title="Organisations & stakeholders" count={profile.organisations.length}>
          <OrganisationList organisations={profile.organisations} citations={citations} />
        </Disclosure>
        <Disclosure title="All sources for this territory" count={profile.sources.length} defaultOpen>
          <SourceList sources={profile.sources} citations={citations} />
        </Disclosure>
      </div>
    </div>
  )
}

export function OpportunityCards({
  opportunities,
  onSelect,
}: {
  opportunities: RegenerativeOpportunity[]
  onSelect: (id: string) => void
}) {
  return (
    <ul className="flex flex-col gap-2">
      {opportunities.map((o) => {
        const summary = o.rationale.at(-1)?.text
        return (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => onSelect(o.id)}
              className="group flex w-full items-start gap-3 rounded-xl bg-white px-4 py-3 text-left ring-1 ring-line transition hover:bg-cream hover:ring-forest/40"
            >
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-semibold leading-snug text-ink">{o.title}</span>
                  <EvidenceBadge level={o.evidence} />
                </span>
                {summary && (
                  <span className="mt-1 line-clamp-2 block text-[12.5px] leading-snug text-ink-muted">{summary}</span>
                )}
              </span>
              <span className="mt-0.5 text-ink-muted group-hover:text-forest">
                <Chevron />
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
