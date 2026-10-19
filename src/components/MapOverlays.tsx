/** Compact single-row legend; explains what boundaries and points do and do not represent. */
export function MapLegend() {
  return (
    <div className="pointer-events-auto flex items-center gap-4 rounded-full bg-white/95 px-4 py-1.5 text-[12px] text-ink shadow-card ring-1 ring-line backdrop-blur">
      <span className="flex items-center gap-1.5" title="Administrative region outline (geoBoundaries). Not a protected-area boundary.">
        <span className="size-3 rounded-[3px] border-2 border-forest bg-forest/15" />
        Administrative region
      </span>
      <span className="flex items-center gap-1.5" title="Representative location (Wikidata). The official protected-area boundary is not shown.">
        <span className="size-3 rounded-full border-2 border-white bg-forest ring-1 ring-forest" />
        Protected area (location only)
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded-full border-2 border-white bg-gold ring-1 ring-amber-600" />
        Selected
      </span>
    </div>
  )
}
