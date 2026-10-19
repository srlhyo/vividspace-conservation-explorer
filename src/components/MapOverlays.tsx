import { evidenceMeta } from './labels'

export function MapLegend() {
  return (
    <div className="pointer-events-auto rounded-xl bg-white/95 px-4 py-3 text-xs text-ink shadow-card ring-1 ring-line backdrop-blur">
      <p className="mb-2 font-semibold uppercase tracking-wider text-ink-muted">Legend</p>
      <ul className="flex flex-col gap-1.5">
        <li className="flex items-center gap-2">
          <span className="size-3.5 rounded-[3px] border-2 border-forest bg-forest/15" />
          Region with sourced boundary
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3.5 rounded-full border-2 border-white bg-forest ring-1 ring-forest" />
          Site location (point only)
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3.5 rounded-full border-2 border-white bg-gold ring-1 ring-amber-600" />
          Selected
        </li>
        <li className="flex items-center gap-2">
          <span className="h-0 w-3.5 border-t-[1.5px] border-dashed border-stone-400" />
          Other regions (context, no data yet)
        </li>
      </ul>
    </div>
  )
}

export function SelectHint({ count }: { count: number }) {
  return (
    <div className="pointer-events-auto max-w-sm rounded-xl bg-white/95 px-5 py-4 shadow-card ring-1 ring-line backdrop-blur">
      <p className="font-display text-base font-semibold text-ink">Explore a territory</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        Select one of the {count} highlighted territories on the map or in the list to see its
        ecosystems, challenges, stakeholders and potential regenerative activities.
      </p>
      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-muted">
        {Object.values(evidenceMeta).map((m) => (
          <span key={m.short}>● {m.short}</span>
        ))}
        <span>— see “About the data”</span>
      </p>
    </div>
  )
}
