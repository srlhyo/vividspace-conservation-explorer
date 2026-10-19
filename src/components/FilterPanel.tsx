import type { Catalogue, Territory } from '../domain/types'
import {
  filterOptions,
  hasActiveFilters,
  type FilterKey,
  type TerritoryFilters,
} from '../domain/catalogue'
import { territoryKindLabel, verificationMeta } from './labels'

interface FilterPanelProps {
  catalogue: Catalogue
  filters: TerritoryFilters
  onToggle: (key: FilterKey, value: string) => void
  onClear: () => void
  results: Territory[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const groups: { key: FilterKey; title: string; hint: string }[] = [
  { key: 'countries', title: 'Country', hint: 'Countries with at least one territory in the dataset.' },
  { key: 'ecosystems', title: 'Ecosystem type', hint: 'Ecosystems documented by a cited source for a territory.' },
  { key: 'themes', title: 'Conservation theme', hint: 'Derived from the challenges and opportunities linked to each territory.' },
]

export function FilterPanel({
  catalogue,
  filters,
  onToggle,
  onClear,
  results,
  selectedId,
  onSelect,
}: FilterPanelProps) {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-line bg-white 2xl:w-80">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Filters
        </h2>
        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters(filters)}
          className="text-xs font-medium text-forest hover:underline disabled:cursor-default disabled:text-ink-muted/50 disabled:no-underline"
        >
          Clear all
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <FilterGroup
              key={group.key}
              title={group.title}
              hint={group.hint}
              options={filterOptions(catalogue, filters, group.key)}
              selected={filters[group.key]}
              onToggle={(value) => onToggle(group.key, value)}
              note={
                group.key === 'countries' && catalogue.countries.length === 1
                  ? 'Milestone 1 covers Guinea-Bissau only. The data model supports more countries.'
                  : undefined
              }
            />
          ))}
        </div>

        <div className="mt-7 border-t border-line pt-5">
          <h2 className="mb-3 flex items-baseline justify-between font-display text-sm font-semibold uppercase tracking-wider text-ink-muted">
            Territories
            <span className="font-sans text-xs font-medium normal-case tracking-normal">
              {results.length} of {catalogue.territories.length}
            </span>
          </h2>
          {results.length === 0 ? (
            <p className="rounded-lg bg-cream p-3 text-sm text-ink-muted">
              No territory in the current dataset matches all selected filters. Remove a filter to
              see results.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {results.map((t) => (
                <li key={t.id}>
                  <TerritoryListItem
                    territory={t}
                    selected={t.id === selectedId}
                    onSelect={() => onSelect(t.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  )
}

function FilterGroup({
  title,
  hint,
  options,
  selected,
  onToggle,
  note,
}: {
  title: string
  hint: string
  options: ReturnType<typeof filterOptions>
  selected: string[]
  onToggle: (value: string) => void
  note?: string
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-[13px] font-semibold text-ink" title={hint}>
        {title}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = selected.includes(o.id)
          const unavailable = !active && o.available === 0
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              disabled={unavailable}
              onClick={() => onToggle(o.id)}
              title={
                unavailable
                  ? `No territory matches “${o.label}” together with your other filters.`
                  : `${o.available} territor${o.available === 1 ? 'y' : 'ies'}`
              }
              className={[
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition',
                active
                  ? 'bg-forest text-white ring-forest'
                  : unavailable
                    ? 'cursor-not-allowed bg-stone-50 text-stone-400 ring-stone-200'
                    : 'bg-white text-ink ring-line hover:bg-forest-soft hover:ring-forest/40',
              ].join(' ')}
            >
              {o.label}
              <span className={active ? 'text-white/70' : 'text-ink-muted/70'}>{o.available}</span>
            </button>
          )
        })}
      </div>
      {note && <p className="mt-2 text-[11.5px] leading-snug text-ink-muted">{note}</p>}
      {options.some((o) => !selected.includes(o.id) && o.available === 0) && (
        <p className="mt-2 text-[11.5px] leading-snug text-ink-muted">
          Greyed-out options have no match with your other active filters.
        </p>
      )}
    </fieldset>
  )
}

function TerritoryListItem({
  territory,
  selected,
  onSelect,
}: {
  territory: Territory
  selected: boolean
  onSelect: () => void
}) {
  const verification = verificationMeta[territory.verification.status]
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected}
      className={[
        'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left ring-1 transition',
        selected ? 'bg-gold-soft ring-gold' : 'bg-white ring-transparent hover:bg-cream hover:ring-line',
      ].join(' ')}
    >
      <GeometryGlyph representation={territory.geometry.representation} selected={selected} />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-snug text-ink">{territory.name}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-ink-muted">
          {territoryKindLabel[territory.kind]}
          <span className={`rounded-full px-1.5 py-px text-[10px] font-semibold ring-1 ${verification.tone}`}>
            {verification.label}
          </span>
        </span>
      </span>
    </button>
  )
}

export function GeometryGlyph({
  representation,
  selected = false,
}: {
  representation: 'boundary' | 'point'
  selected?: boolean
}) {
  return representation === 'boundary' ? (
    <span
      aria-label="Mapped as boundary"
      className={`mt-0.5 size-4 shrink-0 rounded-[4px] border-2 ${selected ? 'border-amber-600 bg-gold/40' : 'border-forest bg-forest/15'}`}
    />
  ) : (
    <span
      aria-label="Mapped as point"
      className={`mt-0.5 size-4 shrink-0 rounded-full border-2 border-white ring-1 ${selected ? 'bg-gold ring-amber-600' : 'bg-forest ring-forest'}`}
    />
  )
}
