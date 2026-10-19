import type { ReactNode } from 'react'
import { citationIndex, type TerritoryProfile } from '../domain/catalogue'
import type { Source } from '../domain/types'
import { EvidenceBadge } from './EvidenceBadge'
import { GeometryGlyph } from './FilterPanel'
import { organisationTypeLabel, territoryKindLabel, verificationMeta, evidenceMeta } from './labels'
import { Citations, StatementItem, StatementList } from './StatementList'

interface TerritoryPanelProps {
  profile: TerritoryProfile
  inCurrentResults: boolean
  onSelect: (id: string) => void
  onClose: () => void
}

export function TerritoryPanel({ profile, inCurrentResults, onSelect, onClose }: TerritoryPanelProps) {
  const { territory } = profile
  const citations = citationIndex(profile.sources)
  const verification = verificationMeta[territory.verification.status]
  const [lng, lat] = territory.location.point

  return (
    <aside
      className="flex w-[400px] shrink-0 flex-col border-l border-line bg-white 2xl:w-[460px]"
      aria-label={`Information about ${territory.name}`}
    >
      <div className="border-b border-line px-6 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {territoryKindLabel[territory.kind]} · {profile.countryName}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold leading-tight text-ink">
              {territory.name}
            </h2>
            {territory.localName && (
              <p className="mt-0.5 text-sm italic text-ink-muted">{territory.localName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close territory panel"
            className="grid size-8 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-cream hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink">
          {territory.location.description}
          <Citations sourceIds={territory.location.descriptionSourceIds} citations={citations} />
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Reference point {lat.toFixed(3)}°, {lng.toFixed(3)}°
          <Citations sourceIds={[territory.location.pointSourceId]} citations={citations} />
        </p>

        {(profile.parent || profile.children.length > 0) && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            {profile.parent && (
              <>
                <span className="text-ink-muted">Within</span>
                <LinkChip onClick={() => onSelect(profile.parent!.id)}>{profile.parent.name}</LinkChip>
              </>
            )}
            {profile.children.length > 0 && (
              <>
                <span className="text-ink-muted">Contains</span>
                {profile.children.map((c) => (
                  <LinkChip key={c.id} onClick={() => onSelect(c.id)}>
                    {c.name}
                  </LinkChip>
                ))}
              </>
            )}
          </div>
        )}

        {!inCurrentResults && (
          <p className="mt-3 rounded-md bg-gold-soft px-3 py-2 text-xs text-amber-900">
            This territory is outside your current filter results.
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-7">
          <div className="rounded-xl bg-cream p-4 ring-1 ring-line">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Data status
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${verification.tone}`}>
                {verification.label}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink">{territory.verification.note}</p>
            <div className="mt-3 flex items-start gap-2 border-t border-line pt-3">
              <GeometryGlyph representation={territory.geometry.representation} />
              <p className="text-[12.5px] leading-relaxed text-ink-muted">
                {territory.geometry.caveat}
                <Citations sourceIds={[territory.geometry.sourceId]} citations={citations} />
              </p>
            </div>
            <p className="mt-2 text-[11px] text-ink-muted">Reviewed {territory.verification.reviewed}</p>
          </div>

          <Section title="Key facts" empty={territory.overview.length === 0}>
            <StatementList statements={territory.overview} citations={citations} />
          </Section>

          <Section title="Ecosystems" empty={profile.ecosystems.length === 0}>
            <ul className="flex flex-col gap-3">
              {profile.ecosystems.map((e) => (
                <li key={e.ecosystemId} className="flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink" title={e.ecosystem.definition}>
                      {e.ecosystem.name}
                    </span>
                    <EvidenceBadge level={e.evidence} />
                  </span>
                  <p className="text-[13.5px] leading-relaxed text-ink">
                    {e.text}
                    <Citations sourceIds={e.sourceIds} citations={citations} />
                  </p>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Local economy & livelihoods" empty={territory.livelihoods.length === 0}>
            <StatementList statements={territory.livelihoods} citations={citations} />
          </Section>

          <Section title="Conservation challenges" empty={profile.challenges.length === 0}>
            <ul className="flex flex-col gap-4">
              {profile.challenges.map((c) => (
                <li key={c.id} className="rounded-lg p-3.5 ring-1 ring-line">
                  <h4 className="text-sm font-semibold text-ink">{c.title}</h4>
                  <ThemeTags ids={c.themeIds} profile={profile} />
                  <ul className="mt-2.5 flex flex-col gap-2.5">
                    {c.statements.map((s, i) => (
                      <StatementItem key={i} statement={s} citations={citations} />
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            title="Potential regenerative activities"
            empty={profile.opportunities.length === 0}
            emptyText="No opportunity has been documented for this territory yet. None is suggested without supporting evidence."
          >
            <p className="mb-3 rounded-md bg-gold-soft/60 px-3 py-2 text-[12px] leading-relaxed text-amber-950">
              These are discussion starters that link documented needs to possible activities. They
              are <strong>not validated businesses</strong> and need community, regulatory and
              market validation.
            </p>
            <ul className="flex flex-col gap-4">
              {profile.opportunities.map((o) => (
                <li
                  key={o.id}
                  className={`rounded-lg border-l-4 bg-white p-3.5 ring-1 ring-line ${evidenceMeta[o.evidence].rule}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-ink">{o.title}</h4>
                    <EvidenceBadge level={o.evidence} />
                  </div>
                  <ThemeTags ids={o.themeIds} profile={profile} />
                  {o.challengeIds.length > 0 && (
                    <p className="mt-2 text-[12px] text-ink-muted">
                      Responds to:{' '}
                      {o.challengeIds
                        .map((id) => profile.challenges.find((c) => c.id === id)?.title)
                        .filter(Boolean)
                        .join('; ')}
                    </p>
                  )}
                  <ul className="mt-2.5 flex flex-col gap-2.5">
                    {o.rationale.map((s, i) => (
                      <StatementItem key={i} statement={s} citations={citations} />
                    ))}
                  </ul>
                  <div className="mt-3 rounded-md bg-cream px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      To validate
                    </p>
                    <ul className="mt-1 list-disc pl-4 text-[12.5px] leading-relaxed text-ink">
                      {o.validationNeeded.map((v) => (
                        <li key={v}>{v}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Organisations & stakeholders" empty={profile.organisations.length === 0}>
            <ul className="flex flex-col gap-3">
              {profile.organisations.map((o) => (
                <li key={o.id} className="flex flex-col gap-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    {o.url ? (
                      <a href={o.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-forest hover:underline">
                        {o.name}
                      </a>
                    ) : (
                      <span className="text-sm font-semibold text-ink">{o.name}</span>
                    )}
                    {o.acronym && <span className="text-xs text-ink-muted">({o.acronym})</span>}
                    <span className="text-[11px] uppercase tracking-wide text-ink-muted">
                      {organisationTypeLabel[o.type]}
                    </span>
                  </span>
                  <p className="text-[13px] leading-relaxed text-ink">
                    {o.role.text}
                    <Citations sourceIds={o.role.sourceIds} citations={citations} />
                  </p>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Sources" empty={profile.sources.length === 0}>
            <SourceList sources={profile.sources} />
          </Section>
        </div>
      </div>
    </aside>
  )
}

function Section({
  title,
  empty,
  emptyText = 'No verified information available in this dataset yet.',
  children,
}: {
  title: string
  empty: boolean
  emptyText?: string
  children: ReactNode
}) {
  return (
    <section>
      <h3 className="mb-3 font-display text-[13px] font-semibold uppercase tracking-wider text-ink-muted">
        {title}
      </h3>
      {empty ? <p className="text-sm italic text-ink-muted">{emptyText}</p> : children}
    </section>
  )
}

function ThemeTags({ ids, profile }: { ids: string[]; profile: TerritoryProfile }) {
  const themes = profile.themes.filter((t) => ids.includes(t.id))
  if (themes.length === 0) return null
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {themes.map((t) => (
        <span key={t.id} className="rounded bg-forest-soft px-1.5 py-px text-[10.5px] font-medium text-forest">
          {t.name}
        </span>
      ))}
    </div>
  )
}

function LinkChip({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-forest-soft px-2 py-0.5 font-medium text-forest hover:bg-forest hover:text-white"
    >
      {children}
    </button>
  )
}

export function SourceList({ sources, numbered = true }: { sources: Source[]; numbered?: boolean }) {
  return (
    <ol className="flex flex-col gap-2.5">
      {sources.map((s, i) => (
        <li key={s.id} id={numbered ? `source-${s.id}` : undefined} className="flex gap-2 text-[12.5px] leading-snug target:rounded target:bg-gold-soft">
          {numbered && <span className="w-6 shrink-0 font-semibold text-forest">[{i + 1}]</span>}
          <span className="min-w-0">
            <a href={s.url} target="_blank" rel="noreferrer" className="font-medium text-ink hover:text-forest hover:underline">
              {s.title}
            </a>
            <span className="text-ink-muted"> — {s.publisher}</span>
            <span className="mt-0.5 block text-[11px] text-ink-muted">
              {s.licenceUrl ? (
                <a href={s.licenceUrl} target="_blank" rel="noreferrer" className="hover:underline">
                  {s.licence}
                </a>
              ) : (
                s.licence
              )}{' '}
              · accessed {s.accessed}
            </span>
            {s.note && <span className="mt-0.5 block text-[11px] italic text-ink-muted">{s.note}</span>}
          </span>
        </li>
      ))}
    </ol>
  )
}
