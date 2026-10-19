import { palette } from '../map/palette'
/** Compact single-row legend; explains what boundaries and points do and do not represent. */
export function MapLegend({ filtersActive = false }: { filtersActive?: boolean }) {
  return (
    <div className="pointer-events-auto flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl bg-white/95 px-4 py-1.5 text-[12px] text-ink shadow-card ring-1 ring-line backdrop-blur">
      <span className="flex items-center gap-1.5" title="WASOP country outline (Natural Earth, generalised).">
        <span className="h-0 w-3.5 border-t-2 border-forest/70" />
        Country
      </span>
      <span className="flex items-center gap-1.5" title="Administrative region outline (geoBoundaries). Not a protected-area boundary.">
        <span className="size-3 rounded-[3px] border-2 border-forest bg-forest/15" />
        Administrative region (Guinea-Bissau)
      </span>
      <span className="flex items-center gap-1.5" title="Reference location (Ramsar, UNESCO or Wikidata). The official protected-area boundary is not shown.">
        <span className="size-3 rounded-full border-2 border-white bg-forest ring-1 ring-forest" />
        Protected area (location only)
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded-full border-2 border-white bg-gold ring-1 ring-amber-600" />
        Selected
      </span>
      {filtersActive && (
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full border border-white opacity-70 ring-1 ring-stone-300" style={{ backgroundColor: palette.muted }} />
          Not matching filters
        </span>
      )}
    </div>
  )
}

/** Shown on the map while filters are active: what matches, and how to undo it. */
export function FilterSummary({
  matching,
  total,
  labels,
  onClear,
}: {
  matching: number
  total: number
  labels: string[]
  onClear: () => void
}) {
  return (
    <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl bg-white/95 px-4 py-2 text-[12px] leading-snug text-ink shadow-card ring-1 ring-line backdrop-blur">
      <p className="min-w-0">
        {matching === 0 ? (
          <span className="font-semibold text-clay">No territory matches all selected filters.</span>
        ) : (
          <>
            <span className="font-semibold">
              {matching} of {total} territories match
            </span>{' '}
            <span className="text-ink-muted">· others are shown in grey</span>
          </>
        )}
        <span className="mt-0.5 block text-ink-muted">Filters: {labels.join(', ')}</span>
      </p>
      <button type="button" onClick={onClear} className="shrink-0 rounded-full bg-forest px-2.5 py-1 text-[11.5px] font-medium text-white hover:bg-forest-deep">
        Clear filters
      </button>
    </div>
  )
}
