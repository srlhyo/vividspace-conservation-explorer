import type { Statement } from '../domain/types'
import { EvidenceBadge } from './EvidenceBadge'

interface CitationsProps {
  sourceIds: string[]
  citations: Map<string, number>
}

/** Scrolls to a source entry rendered by SourceList and briefly highlights it. */
function revealSource(id: string) {
  const el = document.getElementById(`source-${id}`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.add('bg-gold-soft')
  setTimeout(() => el.classList.remove('bg-gold-soft'), 1600)
}

/** Numbered citations pointing into the source list of the current view. */
export function Citations({ sourceIds, citations }: CitationsProps) {
  if (sourceIds.length === 0) return null
  return (
    <span className="ml-1 whitespace-nowrap align-super text-[10px]">
      {sourceIds.map((id) => {
        const n = citations.get(id)
        return n ? (
          <button
            key={id}
            type="button"
            onClick={() => revealSource(id)}
            className="ml-0.5 font-semibold text-forest hover:underline"
            title="Show source"
          >
            [{n}]
          </button>
        ) : null
      })}
    </span>
  )
}

export function StatementItem({
  statement,
  citations,
}: {
  statement: Statement
  citations: Map<string, number>
}) {
  return (
    <li className="flex flex-col gap-1">
      <span>
        <EvidenceBadge level={statement.evidence} />
      </span>
      <p className="text-[13.5px] leading-relaxed text-ink">
        {statement.text}
        <Citations sourceIds={statement.sourceIds} citations={citations} />
      </p>
    </li>
  )
}

export function StatementList({
  statements,
  citations,
}: {
  statements: Statement[]
  citations: Map<string, number>
}) {
  return (
    <ul className="flex flex-col gap-3">
      {statements.map((s, i) => (
        <StatementItem key={i} statement={s} citations={citations} />
      ))}
    </ul>
  )
}
