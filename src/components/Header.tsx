import { config } from '../config'

export function Header({ onOpenAbout }: { onOpenAbout: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-6 bg-forest-deep px-5 text-white">
      <div className="flex min-w-0 items-center gap-3">
        <a href={config.brand.url} target="_blank" rel="noreferrer" className="flex items-center gap-2.5">
          <img src={config.brand.iconUrl} alt="" className="size-9 rounded-lg" />
          <span className="font-display text-[15px] font-semibold uppercase tracking-[0.14em]">
            {config.brand.name}
          </span>
        </a>
        <span className="h-6 w-px bg-white/20" aria-hidden />
        <div className="min-w-0">
          <h1 className="truncate font-display text-lg font-medium leading-tight">{config.appName}</h1>
          <p className="truncate text-xs text-white/60">
            Guinea-Bissau · Bijagós Archipelago & Cacheu
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span
          className="hidden rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold ring-1 ring-gold/40 lg:inline"
          title="This is a demonstration of a potential collaboration, not an existing joint product or agreed partnership."
        >
          Discussion prototype · not an agreed product
        </span>
        <button
          type="button"
          onClick={onOpenAbout}
          className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20"
        >
          About the data
        </button>
      </div>
    </header>
  )
}
