import { useState } from 'react'
import {
  filterOptions,
  hasActiveFilters,
  territorySummary,
  type FilterKey,
  type FilterOption,
  type TerritoryFilters,
} from '../domain/catalogue'
import type { Catalogue, EvidenceLevel, Territory } from '../domain/types'
import { EvidenceBadge } from './EvidenceBadge'
import { GeometryGlyph } from './GeometryGlyph'
import { territoryKindLabel } from './labels'
import { Chevron } from './panel/parts'

interface SidebarProps {
  catalogue: Catalogue
  filters: TerritoryFilters
  onToggle: (key: FilterKey, value: string) => void
  onClear: () => void
  results: Territory[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const groups: { key: FilterKey; title: string }[] = [
  { key: 'countries', title: 'Country' },
  { key: 'ecosystems', title: 'Ecosystem type' },
  { key: 'themes', title: 'Conservation theme' },
]

const journey = [
  'Choose a territory on the map or below',
  'Open one of its conservation challenges',
  'Review potential regenerative activities',
  'Check the evidence and next steps',
]

export function Sidebar({ catalogue, filters, onToggle, onClear, results, selectedId, onSelect }: SidebarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const active = filters.countries.length + filters.ecosystems.length + filters.themes.length
  const visible = new Set(results.map((t) => t.id))

  // Parents first, each followed by its children, keeping only filter matches.
  const roots = catalogue.territories.filter((t) => !t.parentId || !catalogue.territories.some((p) => p.id === t.parentId))
  const tree = roots.flatMap((root) => [
    { territory: root, depth: 0 },
    ...catalogue.territories.filter((t) => t.parentId === root.id).map((territory) => ({ territory, depth: 1 })),
  ]).filter(({ territory }) => visible.has(territory.id))

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-line bg-white 2xl:w-80">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-line bg-cream/60 px-5 py-4">
          <h2 className="font-display text-[15px] font-semibold text-ink">How to explore</h2>
          <ol className="mt-2 flex flex-col gap-1.5">
            {journey.map((step, i) => (
              <li key={step} className="flex items-start gap-2 text-[12.5px] leading-snug text-ink">
                <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-forest text-[10.5px] font-semibold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Evidence levels">
            {(['verified', 'interpretation', 'hypothesis'] as EvidenceLevel[]).map((l) => (
              <EvidenceBadge key={l} level={l} />
            ))}
          </div>
        </div>

        <div className="border-b border-line px-5 py-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((o) => !o)}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-ink hover:text-forest"
            >
              <Chevron direction={filtersOpen ? 'down' : 'right'} />
              Filter territories
              {active > 0 && (
                <span className="rounded-full bg-forest px-1.5 text-[11px] font-semibold text-white">{active}</span>
              )}
            </button>
            {hasActiveFilters(filters) && (
              <button type="button" onClick={onClear} className="text-[12px] font-medium text-forest hover:underline">
                Clear
              </button>
            )}
          </div>
          {!filtersOpen && active > 0 && (
            <ActiveFilterChips catalogue={catalogue} filters={filters} onToggle={onToggle} />
          )}
          {filtersOpen && (
            <div className="mt-3 flex flex-col gap-4 pb-1">
              {groups.map((group) => (
                <FilterGroup
                  key={group.key}
                  title={group.title}
                  options={filterOptions(catalogue, filters, group.key)}
                  selected={filters[group.key]}
                  onToggle={(value) => onToggle(group.key, value)}
                  note={
                    group.key === 'countries' && catalogue.countries.length === 1
                      ? 'Only Guinea-Bissau is covered so far; the data model supports more countries.'
                      : undefined
                  }
                />
              ))}
              <p className="text-[11.5px] leading-snug text-ink-muted">
                Numbers show matching territories. Greyed-out options would return no results with your
                other filters.
              </p>
            </div>
          )}
        </div>

        <div className="px-3 py-3">
          <h2 className="mb-1.5 flex items-baseline justify-between px-2 font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Territories
            <span className="font-sans text-[12px] font-medium normal-case tracking-normal">
              {results.length} of {catalogue.territories.length}
            </span>
          </h2>
          {tree.length === 0 ? (
            <p className="mx-2 rounded-lg bg-cream p-3 text-[13px] text-ink-muted">
              No territory matches all selected filters. Remove a filter to see results.
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {tree.map(({ territory, depth }) => (
                <li key={territory.id} className={depth ? 'ml-5' : ''}>
                  <TerritoryListItem
                    territory={territory}
                    summary={territorySummary(catalogue, territory.id)}
                    selected={territory.id === selectedId}
                    onSelect={() => onSelect(territory.id)}
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

function ActiveFilterChips({
  catalogue,
  filters,
  onToggle,
}: {
  catalogue: Catalogue
  filters: TerritoryFilters
  onToggle: (key: FilterKey, value: string) => void
}) {
  const chips = groups.flatMap(({ key }) =>
    filterOptions(catalogue, filters, key)
      .filter((o) => filters[key].includes(o.id))
      .map((o) => ({ key, option: o })),
  )
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {chips.map(({ key, option }) => (
        <button
          key={`${key}-${option.id}`}
          type="button"
          onClick={() => onToggle(key, option.id)}
          className="inline-flex items-center gap-1 rounded-full bg-forest px-2.5 py-0.5 text-[11.5px] font-medium text-white hover:bg-forest-deep"
          title="Remove filter"
        >
          {option.label}
          <span aria-hidden>×</span>
        </button>
      ))}
    </div>
  )
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  note,
}: {
  title: string
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
  note?: string
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink-muted">{title}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = selected.includes(o.id)
          const unavailable = !on && o.available === 0
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              disabled={unavailable}
              onClick={() => onToggle(o.id)}
              title={unavailable ? `No territory matches “${o.label}” together with your other filters.` : undefined}
              className={[
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ring-1 transition-colors',
                on
                  ? 'bg-forest text-white ring-forest'
                  : unavailable
                    ? 'cursor-not-allowed bg-stone-50 text-stone-400 ring-stone-200'
                    : 'bg-white text-ink ring-line hover:bg-forest-soft hover:ring-forest/40',
              ].join(' ')}
            >
              {o.label}
              <span className={on ? 'text-white/75' : 'text-ink-muted/70'}>{o.available}</span>
            </button>
          )
        })}
      </div>
      {note && <p className="mt-1.5 text-[11.5px] leading-snug text-ink-muted">{note}</p>}
    </fieldset>
  )
}

function TerritoryListItem({
  territory,
  summary,
  selected,
  onSelect,
}: {
  territory: Territory
  summary: { challenges: number; opportunities: number }
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected}
      className={[
        'flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left ring-1 transition-colors',
        selected ? 'bg-gold-soft ring-gold' : 'ring-transparent hover:bg-cream',
      ].join(' ')}
    >
      <GeometryGlyph representation={territory.geometry.representation} selected={selected} />
      <span className="min-w-0 flex-1" title={territoryKindLabel[territory.kind]}>
        <span className="block text-[14px] font-semibold leading-snug text-ink">{territory.name}</span>
        <span className="mt-0.5 block text-[12px] text-ink-muted">
          {summary.challenges} challenge{summary.challenges === 1 ? '' : 's'}
          {summary.opportunities > 0 && ` · ${summary.opportunities} activit${summary.opportunities === 1 ? 'y' : 'ies'}`}
        </span>
      </span>
    </button>
  )
}
