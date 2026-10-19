import type { Statement } from '../domain/types'
import { EvidenceBadge } from './EvidenceBadge'

interface CitationsProps {
  sourceIds: string[]
  citations: Map<string, number>
}

/** Numbered links into the profile's source list. */
export function Citations({ sourceIds, citations }: CitationsProps) {
  if (sourceIds.length === 0) return null
  return (
    <span className="ml-1 whitespace-nowrap align-super text-[10px]">
      {sourceIds.map((id) => {
        const n = citations.get(id)
        return n ? (
          <a
            key={id}
            href={`#source-${id}`}
            className="ml-0.5 font-semibold text-forest hover:underline"
            title="Jump to source"
          >
            [{n}]
          </a>
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
