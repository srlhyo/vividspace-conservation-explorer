import { useEffect, useRef, useState } from 'react'
import { opportunitiesForChallenge, type TerritoryProfile } from '../../domain/catalogue'
import type { ConservationChallenge, EvidenceLevel } from '../../domain/types'
import { EvidenceBadge } from '../EvidenceBadge'
import { StatementItem, StatementList } from '../StatementList'
import { Chevron, OpportunityCards, ThemeTags } from './parts'

interface Props {
  profile: TerritoryProfile
  challenge: ConservationChallenge
  open: boolean
  citations: Map<string, number>
  onToggle: () => void
  onSelectOpportunity: (id: string) => void
}

/**
 * One challenge in the territory's list, expanded inline so the other challenges stay in view.
 * Open, it shows a one-statement summary and the linked activities first; the remaining evidence
 * is one click away, with its evidence levels shown on the toggle.
 */
export function ChallengeItem({ profile, challenge, open, citations, onToggle, onSelectOpportunity }: Props) {
  const opportunities = opportunitiesForChallenge(profile, challenge.id)
  const n = opportunities.length
  const [summary, ...rest] = challenge.statements
  const [allEvidence, setAllEvidence] = useState(false)
  const restLevels = [...new Set(rest.map((s) => s.evidence))] as EvidenceLevel[]
  const ref = useRef<HTMLLIElement>(null)
  const mounted = useRef(false)
  const bodyId = `challenge-${challenge.id}`

  // Keep an opened challenge in view; when the list first appears (deep link, or back from an
  // activity) bring it to the top.
  useEffect(() => {
    if (open) ref.current?.scrollIntoView({ block: mounted.current ? 'nearest' : 'start' })
    mounted.current = true
  }, [open])

  return (
    <li ref={ref} className="scroll-mt-2">
      <div
        className={`rounded-xl bg-white ring-1 transition ${open ? 'ring-forest/50 shadow-card' : 'ring-line hover:bg-cream hover:ring-forest/40'}`}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={onToggle}
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold leading-snug text-ink">{challenge.title}</span>
            <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <ThemeTags themes={profile.themes.filter((t) => challenge.themeIds.includes(t.id))} />
            </span>
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${n > 0 ? 'bg-gold-soft text-amber-900' : 'bg-stone-100 text-stone-500'}`}
          >
            {n > 0 ? `${n} activit${n === 1 ? 'y' : 'ies'}` : 'No activity yet'}
          </span>
          <span className="text-ink-muted group-hover:text-forest">
            <Chevron direction={open ? 'up' : 'down'} />
          </span>
        </button>
        {open && (
          <div id={bodyId} className="flex flex-col gap-4 border-t border-line px-4 pt-3 pb-4">
            {summary && (
              <ul>
                <StatementItem statement={summary} citations={citations} />
              </ul>
            )}

            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-clay">
                Potential regenerative activities
              </p>
              {n === 0 ? (
                <p className="mt-2 rounded-lg bg-cream px-3 py-2.5 text-[13px] leading-relaxed text-ink-muted">
                  No potential activity is documented for this challenge yet. None is suggested without
                  supporting evidence.
                </p>
              ) : (
                <>
                  <p className="mt-1 mb-2.5 text-[12px] leading-snug text-ink-muted">
                    Discussion starters, not validated businesses or confirmed partnerships. Open one for
                    its evidence chain, questions to validate, organisations and sources.
                  </p>
                  <OpportunityCards opportunities={opportunities} onSelect={onSelectOpportunity} />
                </>
              )}
            </div>

            {rest.length > 0 && (
              <div>
                <button
                  type="button"
                  aria-expanded={allEvidence}
                  onClick={() => setAllEvidence((v) => !v)}
                  className="flex w-full flex-wrap items-center gap-1.5 text-left text-[13px] font-medium text-forest hover:underline"
                >
                  <Chevron direction={allEvidence ? 'up' : 'down'} />
                  {allEvidence ? 'Hide further evidence' : `Show all evidence (${rest.length} more statement${rest.length === 1 ? '' : 's'})`}
                  {!allEvidence && restLevels.map((l) => <EvidenceBadge key={l} level={l} />)}
                </button>
                {allEvidence && (
                  <div className="mt-3">
                    <StatementList statements={rest} citations={citations} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  )
}
