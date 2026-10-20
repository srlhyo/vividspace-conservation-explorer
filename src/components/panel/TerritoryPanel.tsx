import { citationIndex, type TerritoryProfile } from '../../domain/catalogue'
import type { Territory } from '../../domain/types'
import { territoryKindLabel } from '../labels'
import { OpportunityView } from './OpportunityView'
import { TerritoryOverview } from './TerritoryOverview'

interface TerritoryPanelProps {
  profile: TerritoryProfile
  challengeId: string | null
  opportunityId: string | null
  allTerritories: Territory[]
  inCurrentResults: boolean
  onClearFilters: () => void
  onSelectTerritory: (id: string) => void
  onSelectChallenge: (id: string | null) => void
  onSelectOpportunity: (id: string | null) => void
  onOpenOpportunityIn: (territoryId: string, opportunityId: string) => void
  onClose: () => void
}

/**
 * The contextual panel: Territory → Challenge → Activity, with evidence and next steps.
 * Challenges expand inline in the territory overview; an activity opens its own view.
 */
export function TerritoryPanel(props: TerritoryPanelProps) {
  const { profile, challengeId, opportunityId, onSelectChallenge, onSelectOpportunity } = props
  const { territory } = profile
  const citations = citationIndex(profile.sources)
  const challenge = profile.challenges.find((c) => c.id === challengeId)
  const opportunity = profile.opportunities.find((o) => o.id === opportunityId)
  // Challenges open inline in the overview; only an activity replaces it with its own view.
  const view = `${territory.id}/${opportunity ? `o:${opportunity.id}` : 'overview'}`
  const deep = Boolean(opportunity)

  const steps = [
    { label: territory.shortName ?? territory.name, onClick: () => onSelectChallenge(null) },
    challenge && { label: challenge.title, onClick: () => onSelectOpportunity(null) },
    opportunity && { label: opportunity.title },
  ].filter(Boolean) as { label: string; onClick?: () => void }[]

  return (
    <aside
      className="flex w-[400px] shrink-0 flex-col border-l border-line bg-white 2xl:w-[460px]"
      aria-label={`Information about ${territory.name}`}
    >
      <header className="border-b border-line px-6 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              {territoryKindLabel[territory.kind]} · {profile.countryName}
            </p>
            <h2
              className={`mt-0.5 font-display font-semibold leading-tight text-ink ${deep ? 'text-[17px]' : 'text-[22px]'}`}
            >
              {territory.name}
            </h2>
            {territory.localName && !deep && <p className="text-[13px] italic text-ink-muted">{territory.localName}</p>}
          </div>
          <button
            type="button"
            onClick={props.onClose}
            aria-label="Close territory panel"
            className="grid size-8 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-cream hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {deep && (
          <nav aria-label="Exploration path" className="mt-2.5">
            <ol className="flex min-w-0 items-center gap-1 text-[12px]">
              {steps.map((step, i) => {
                const last = i === steps.length - 1
                return (
                  <li key={i} className={`flex items-center gap-1 ${last ? 'min-w-0' : 'shrink-0'}`}>
                    {i > 0 && <span className="text-ink-muted/60">›</span>}
                    {last || !step.onClick ? (
                      <span className="truncate font-semibold text-ink" aria-current="page">
                        {step.label}
                      </span>
                    ) : (
                      <button type="button" onClick={step.onClick} className="max-w-28 truncate text-forest hover:underline">
                        {step.label}
                      </button>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
        )}
        {!props.inCurrentResults && (
          <p className="mt-2 flex items-center justify-between gap-2 rounded-md bg-gold-soft px-3 py-1.5 text-[12px] text-amber-900">
            This territory does not match your current filters.
            <button type="button" onClick={props.onClearFilters} className="shrink-0 font-semibold underline hover:no-underline">
              Clear filters
            </button>
          </p>
        )}
      </header>

      {/* Keyed by view so each step starts scrolled to the top. */}
      <div key={view} className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {opportunity ? (
          <OpportunityView
            profile={profile}
            opportunity={opportunity}
            fromChallenge={challenge}
            otherTerritories={props.allTerritories.filter(
              (t) => t.id !== territory.id && opportunity.territoryIds.includes(t.id),
            )}
            citations={citations}
            onBack={() => onSelectOpportunity(null)}
            onSelectChallenge={onSelectChallenge}
            onSelectTerritory={(id) => props.onOpenOpportunityIn(id, opportunity.id)}
          />
        ) : (
          <TerritoryOverview
            profile={profile}
            citations={citations}
            challengeId={challenge?.id ?? null}
            onSelectTerritory={props.onSelectTerritory}
            onSelectChallenge={onSelectChallenge}
            onSelectOpportunity={onSelectOpportunity}
          />
        )}
      </div>
    </aside>
  )
}
