import { useEffect, useRef } from 'react'
import type { Catalogue, EvidenceLevel } from '../domain/types'
import { EvidenceBadge } from './EvidenceBadge'
import { evidenceMeta } from './labels'
import { SourceList } from './panel/parts'

export function AboutDialog({
  catalogue,
  open,
  onClose,
}: {
  catalogue: Catalogue
  open: boolean
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto max-h-[85vh] w-[min(760px,92vw)] overflow-hidden rounded-2xl bg-white p-0 text-ink shadow-2xl backdrop:bg-forest-deep/50"
    >
      <div className="flex max-h-[85vh] flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-line px-7 py-5">
          <div>
            <h2 className="font-display text-xl font-semibold">About this explorer</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Dataset v{catalogue.meta.version} · updated {catalogue.meta.updated}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm font-medium text-forest ring-1 ring-line hover:bg-cream"
          >
            Close
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto px-7 py-6">
          <p className="text-sm leading-relaxed">{catalogue.meta.description}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            This is a discussion prototype exploring a potential collaboration. It is not an
            existing joint product or an agreed partnership. No figure, boundary or species record
            is shown unless a cited source supports it. Outside Guinea-Bissau, the catalogue is a
            researched selection of marine and coastal sites across the 13 WASOP countries, mostly
            Ramsar sites. It is not an exhaustive official inventory. In each of those 12 countries one
            area has researched challenges, potential activities and organisations; the other sites
            are location and designation records only.
          </p>

          <h3 className="mt-6 mb-3 font-display text-[13px] font-semibold uppercase tracking-wider text-ink-muted">
            How to read evidence labels
          </h3>
          <ul className="flex flex-col gap-2.5">
            {(Object.keys(evidenceMeta) as EvidenceLevel[]).map((level) => (
              <li key={level} className="flex items-start gap-3">
                <span className="w-32 shrink-0">
                  <EvidenceBadge level={level} />
                </span>
                <span className="text-sm">
                  <strong className="font-semibold">{evidenceMeta[level].label}.</strong>{' '}
                  {evidenceMeta[level].description}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 mb-3 font-display text-[13px] font-semibold uppercase tracking-wider text-ink-muted">
            All sources & licences ({catalogue.sources.length})
          </h3>
          <SourceList sources={catalogue.sources} />
          <p className="mt-4 text-xs text-ink-muted">
            Basemap: © OpenStreetMap contributors (ODbL), served by OpenFreeMap. Copyrighted
            sources are cited for reference only: the explorer records short factual statements and
            links, and redistributes no content from them.
          </p>
        </div>
      </div>
    </dialog>
  )
}
