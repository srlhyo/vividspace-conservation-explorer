import type { EvidenceLevel } from '../domain/types'
import { evidenceMeta } from './labels'

export function EvidenceBadge({ level, long = false }: { level: EvidenceLevel; long?: boolean }) {
  const meta = evidenceMeta[level]
  return (
    <span
      title={`${meta.label}: ${meta.description}`}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-transparent px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide ring-1 ${meta.badge}`}
    >
      <EvidenceIcon level={level} />
      {long ? meta.label : meta.short}
    </span>
  )
}

function EvidenceIcon({ level }: { level: EvidenceLevel }) {
  const common = { width: 10, height: 10, viewBox: '0 0 12 12', 'aria-hidden': true }
  if (level === 'verified') {
    return (
      <svg {...common}>
        <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (level === 'interpretation') {
    return (
      <svg {...common}>
        <path d="M2 9.5 5 6l2 2 3-4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="6" cy="6" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 1.6" />
      <circle cx="6" cy="6" r="1.2" fill="currentColor" />
    </svg>
  )
}
