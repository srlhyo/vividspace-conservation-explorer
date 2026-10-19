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
  /** Catalogued areas per country code. */
  countryCounts: Record<string, number>
  /** Select a country (or null for the whole region). */
  onSelectCountry: (code: string | null) => void
}

const groups: { key: FilterKey; title: string }[] = [
  { key: 'countries', title: 'Country' },
  { key: 'designations', title: 'Designation' },
  { key: 'ecosystems', title: 'Ecosystem type' },
  { key: 'themes', title: 'Conservation theme' },
]

const journey = [
  'Choose a country, then a protected area or territory',
  'Open one of its conservation challenges',
  'Review potential regenerative activities',
  'Check the evidence and next steps',
]

export function Sidebar({
  catalogue,
  filters,
  onToggle,
  onClear,
  results,
  selectedId,
  onSelect,
  countryCounts,
  onSelectCountry,
}: SidebarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const active = Object.values(filters).reduce((n, values) => n + values.length, 0)
  const visible = new Set(results.map((t) => t.id))
  // Countries are chosen from the country list above, so the filter panel omits that group.
  const visibleGroups = groups.filter((g) => g.key !== 'countries')

  // Grouped by country; within a country, parents first, each followed by its children.
  const byCountry = catalogue.countries.flatMap((country) => {
    const own = catalogue.territories.filter((t) => t.countryCode === country.code)
    const roots = own.filter((t) => !t.parentId || !own.some((p) => p.id === t.parentId))
    const rows = roots
      .flatMap((root) => [
        { territory: root, depth: 0 },
        ...own.filter((t) => t.parentId === root.id).map((territory) => ({ territory, depth: 1 })),
      ])
      .filter(({ territory }) => visible.has(territory.id))
    return rows.length > 0 ? [{ country, rows }] : []
  })

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

        <CountryList
          catalogue={catalogue}
          counts={countryCounts}
          selected={filters.countries}
          onSelect={onSelectCountry}
        />

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
          {active > 0 && (
            <p className={`mt-1.5 text-[12.5px] font-semibold ${results.length === 0 ? 'text-clay' : 'text-ink'}`}>
              {results.length === 0
                ? 'No territory matches all selected filters'
                : `${results.length} of ${catalogue.territories.length} territories match`}
            </p>
          )}
          {!filtersOpen && active > 0 && (
            <ActiveFilterChips catalogue={catalogue} filters={filters} onToggle={onToggle} />
          )}
          {filtersOpen && (
            <div className="mt-3 flex flex-col gap-4 pb-1">
              {visibleGroups.map((group) => (
                <FilterGroup
                  key={group.key}
                  title={group.title}
                  options={filterOptions(catalogue, filters, group.key)}
                  selected={filters[group.key]}
                  onToggle={(value) => onToggle(group.key, value)}
                />
              ))}
              <div className="flex flex-col gap-1.5 text-[11.5px] leading-snug text-ink-muted">
                <p>
                  Numbers show how many territories each option would match. Within a group, a territory
                  matches if it has any selected option; it must match every group you use.
                </p>
                <p>
                  Filters use the ecosystems and themes documented for each territory in the cited
                  sources. They do not map where ecosystems or conditions occur across the area.
                </p>
              </div>
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
          {byCountry.length === 0 ? (
            <p className="mx-2 rounded-lg bg-cream p-3 text-[13px] text-ink-muted">
              No territory matches all selected filters. Remove a filter to see results.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {byCountry.map(({ country, rows }) => (
                <section key={country.code}>
                  {byCountry.length > 1 && (
                    <h3 className="px-2 pb-1 text-[11.5px] font-semibold uppercase tracking-wide text-ink-muted">
                      {country.name}
                    </h3>
                  )}
                  <ul className="flex flex-col gap-0.5">
                    {rows.map(({ territory, depth }) => (
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
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

/** WASOP countries with their catalogued-area counts; choosing one filters and zooms to it. */
function CountryList({
  catalogue,
  counts,
  selected,
  onSelect,
}: {
  catalogue: Catalogue
  counts: Record<string, number>
  selected: string[]
  onSelect: (code: string | null) => void
}) {
  const total = catalogue.territories.length
  const row = (isSelected: boolean) =>
    [
      'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-[13px] transition-colors',
      isSelected ? 'bg-gold-soft font-semibold text-ink ring-1 ring-gold' : 'text-ink hover:bg-cream',
    ].join(' ')
  return (
    <div className="border-b border-line px-3 py-3">
      <h2 className="flex items-baseline justify-between px-2 font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        WASOP countries
        <span className="font-sans text-[12px] font-medium normal-case tracking-normal">{catalogue.countries.length}</span>
      </h2>
      <p className="mt-1 px-2 text-[11.5px] leading-snug text-ink-muted">
        A researched selection of marine and coastal sites, not an exhaustive official inventory. The map
        itself can be explored worldwide.
      </p>
      <ul className="mt-2 flex flex-col gap-0.5">
        <li>
          <button type="button" onClick={() => onSelect(null)} className={row(selected.length === 0)}>
            All countries
            <span className="text-[12px] text-ink-muted">{total}</span>
          </button>
        </li>
        {catalogue.countries.map((c) => {
          const n = counts[c.code] ?? 0
          return (
            <li key={c.code}>
              <button
                type="button"
                aria-pressed={selected.includes(c.code)}
                onClick={() => onSelect(c.code)}
                className={row(selected.includes(c.code))}
              >
                {c.name}
                <span className={`text-[12px] ${n === 0 ? 'italic text-clay' : 'text-ink-muted'}`}>
                  {n === 0 ? 'no records yet' : n}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
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
  // All groups, so any active country filter stays visible and removable.
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
}: {
  title: string
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  // An option that every listed territory already has cannot narrow the results on its own.
  const noReduction = (o: FilterOption) => selected.length === 0 && o.coversAll
  return (
    <fieldset>
      <legend className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink-muted">{title}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = selected.includes(o.id)
          const unavailable = !on && o.available === 0
          const all = !on && noReduction(o)
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              disabled={unavailable}
              onClick={() => onToggle(o.id)}
              title={
                unavailable
                  ? `No territory matches “${o.label}” together with your other filters.`
                  : all
                    ? `Every territory currently listed has “${o.label}”, so selecting it will not narrow the results.`
                    : undefined
              }
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
              <span className={on ? 'text-white/75' : 'text-ink-muted/70'}>{all ? 'all' : o.available}</span>
            </button>
          )
        })}
      </div>
      {options.some((o) => !selected.includes(o.id) && noReduction(o)) && (
        <p className="mt-1.5 text-[11.5px] leading-snug text-ink-muted">
          “all” means every territory currently listed has that value, so selecting it will not narrow
          the results.
        </p>
      )}
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
          {summary.challenges === 0 && summary.opportunities === 0 ? (
            territoryKindLabel[territory.kind]
          ) : (
            <>
              {summary.challenges} challenge{summary.challenges === 1 ? '' : 's'}
              {summary.opportunities > 0 && ` · ${summary.opportunities} activit${summary.opportunities === 1 ? 'y' : 'ies'}`}
            </>
          )}
        </span>
      </span>
    </button>
  )
}
