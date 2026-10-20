import { useState } from 'react'
import { unlinkedOpportunities, type TerritoryProfile } from '../../domain/catalogue'
import { EvidenceBadge } from '../EvidenceBadge'
import { GeometryGlyph } from '../GeometryGlyph'
import { protectionCategoryLabel, verificationMeta } from '../labels'
import { Citations, StatementList } from '../StatementList'
import { ChallengeItem } from './ChallengeItem'
import { Chevron, Disclosure, LinkChip, OpportunityCards, OrganisationList, Section, SourceList } from './parts'

const KEY_FACTS_PREVIEW = 3

interface Props {
  profile: TerritoryProfile
  citations: Map<string, number>
  /** The challenge expanded in the list, if any. */
  challengeId: string | null
  onSelectTerritory: (id: string) => void
  onSelectChallenge: (id: string | null) => void
  onSelectOpportunity: (id: string) => void
}

export function TerritoryOverview({
  profile,
  citations,
  challengeId,
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
        {profile.designations.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
            <span className="text-ink-muted">Designations</span>
            {profile.designations.map((d) => (
              <span key={d.id} title={d.description} className="rounded-full bg-sky-50 px-2 py-0.5 font-medium text-sky-900 ring-1 ring-sky-200">
                {d.name}
                <Citations sourceIds={d.sourceIds} citations={citations} />
              </span>
            ))}
          </div>
        )}
        {territory.inventory && (
          <div className="flex flex-col gap-1 text-[12.5px] leading-snug">
            <p>
              <span className="text-ink-muted">Protection status</span>{' '}
              <span className="font-semibold text-ink">{protectionCategoryLabel[territory.inventory.category]}</span>
              {territory.inventory.sourceDate && (
                <span className="text-ink-muted"> · source dated {territory.inventory.sourceDate}</span>
              )}
            </p>
            {territory.inventory.legalStatus ? (
              <p className="text-ink">
                <span className="mr-1.5 align-middle">
                  <EvidenceBadge level={territory.inventory.legalStatus.evidence} />
                </span>
                {territory.inventory.legalStatus.text}
                <Citations sourceIds={territory.inventory.legalStatus.sourceIds} citations={citations} />
              </p>
            ) : (
              !['context', 'international-designation'].includes(territory.inventory.category) && (
                <p className="italic text-ink-muted">Legal basis not documented in the sources reviewed.</p>
              )
            )}
          </div>
        )}
        {profile.overlaps.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
            <span className="text-ink-muted" title="Catalogued separately because the designations cover different extents.">
              Overlaps with
            </span>
            {profile.overlaps.map((t) => (
              <LinkChip key={t.id} onClick={() => onSelectTerritory(t.id)}>
                {t.shortName ?? t.name}
              </LinkChip>
            ))}
          </div>
        )}
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
            ? 'Open a challenge to see its potential regenerative activities and the evidence behind them. The others stay listed for comparison.'
            : undefined
        }
      >
        {profile.challenges.length === 0 ? (
          <p className="text-sm italic text-ink-muted">
            Conservation challenges have not been researched for this area yet, so none are listed here. This
            does not mean the area faces none.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {profile.challenges.map((c) => (
              <ChallengeItem
                key={c.id}
                profile={profile}
                challenge={c}
                open={c.id === challengeId}
                citations={citations}
                onToggle={() => onSelectChallenge(c.id === challengeId ? null : c.id)}
                onSelectOpportunity={onSelectOpportunity}
              />
            ))}
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
        <Disclosure title="Organisations documented here" count={profile.organisations.length}>
          <p className="mb-3 text-[12.5px] leading-snug text-ink-muted">
            Each role is as stated by the cited source. Listing does not imply any relationship with
            Vivid Space or BlueSeeds.
          </p>
          <OrganisationList organisations={profile.organisations} citations={citations} />
        </Disclosure>
        <Disclosure title="All sources for this territory" count={profile.sources.length} defaultOpen>
          <SourceList sources={profile.sources} citations={citations} />
        </Disclosure>
      </div>
    </div>
  )
}
