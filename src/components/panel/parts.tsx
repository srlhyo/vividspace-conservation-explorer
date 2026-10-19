import { useState, type ReactNode } from 'react'
import type { ConservationTheme, Organisation, Source } from '../../domain/types'
import { organisationTypeLabel } from '../labels'
import { Citations } from '../StatementList'

export function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <section>
      <h3 className="font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {title}
      </h3>
      {hint && <p className="mt-1 text-[12.5px] leading-snug text-ink-muted">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  )
}

/** A collapsible section whose header shows a count. */
export function Disclosure({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string
  count?: number
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="border-t border-line pt-3">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 py-1 text-left"
      >
        <span className="font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
          {title}
          {count !== undefined && <span className="ml-1.5 font-sans normal-case tracking-normal">({count})</span>}
        </span>
        <Chevron direction={open ? 'up' : 'down'} />
      </button>
      {open && <div className="mt-3 pb-1">{children}</div>}
    </section>
  )
}

export function Chevron({ direction = 'right' }: { direction?: 'right' | 'left' | 'up' | 'down' }) {
  const rotate = { right: 0, down: 90, left: 180, up: 270 }[direction]
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden style={{ transform: `rotate(${rotate}deg)` }} className="shrink-0">
      <path d="M5 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BackLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-ml-1 inline-flex items-center gap-1 rounded px-1 py-0.5 text-[13px] font-medium text-forest hover:bg-forest-soft"
    >
      <Chevron direction="left" />
      {children}
    </button>
  )
}

export function ThemeTags({ themes }: { themes: ConservationTheme[] }) {
  if (themes.length === 0) return null
  return (
    <span className="flex flex-wrap gap-1">
      {themes.map((t) => (
        <span key={t.id} className="rounded bg-forest-soft px-1.5 py-px text-[11px] font-medium text-forest">
          {t.name}
        </span>
      ))}
    </span>
  )
}

export function LinkChip({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-forest-soft px-2.5 py-0.5 text-[12px] font-medium text-forest hover:bg-forest hover:text-white"
    >
      {children}
    </button>
  )
}

export function OrganisationList({
  organisations,
  citations,
}: {
  organisations: Organisation[]
  citations: Map<string, number>
}) {
  return (
    <ul className="flex flex-col gap-3">
      {organisations.map((o) => (
        <li key={o.id}>
          <span className="flex flex-wrap items-baseline gap-x-2">
            {o.url ? (
              <a href={o.url} target="_blank" rel="noreferrer" className="text-[14px] font-semibold text-forest hover:underline">
                {o.name}
              </a>
            ) : (
              <span className="text-[14px] font-semibold text-ink">{o.name}</span>
            )}
            <span className="text-[11px] uppercase tracking-wide text-ink-muted">{organisationTypeLabel[o.type]}</span>
          </span>
          <p className="mt-0.5 text-[13px] leading-relaxed text-ink">
            {o.role.text}
            <Citations sourceIds={o.role.sourceIds} citations={citations} />
          </p>
        </li>
      ))}
    </ul>
  )
}

/** Sources, numbered by `citations` when given (so numbers match inline citations). */
export function SourceList({ sources, citations }: { sources: Source[]; citations?: Map<string, number> }) {
  return (
    <ol className="flex flex-col gap-2.5">
      {sources.map((s) => {
        const n = citations?.get(s.id)
        return (
          <li
            key={s.id}
            id={n ? `source-${s.id}` : undefined}
            className="flex gap-2 rounded text-[12.5px] leading-snug transition-colors duration-500"
          >
            {n && <span className="w-7 shrink-0 font-semibold text-forest">[{n}]</span>}
            <span className="min-w-0">
              <a href={s.url} target="_blank" rel="noreferrer" className="font-medium text-ink hover:text-forest hover:underline">
                {s.title}
              </a>
              <span className="text-ink-muted"> — {s.publisher}</span>
              <span className="mt-0.5 block text-[11.5px] text-ink-muted">
                {s.licenceUrl ? (
                  <a href={s.licenceUrl} target="_blank" rel="noreferrer" className="hover:underline">
                    {s.licence}
                  </a>
                ) : (
                  s.licence
                )}{' '}
                · accessed {s.accessed}
              </span>
              {s.note && <span className="mt-0.5 block text-[11.5px] italic text-ink-muted">{s.note}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
