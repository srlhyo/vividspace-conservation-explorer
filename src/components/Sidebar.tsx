import { useState } from 'react'
import {
  attributeKeys,
  countByKind,
  filterOptions,
  filterTerritories,
  hasAttributeFilters,
  territoriesInScope,
  territorySummary,
  type FilterKey,
  type FilterOption,
  type TerritoryFilters,
} from '../domain/catalogue'
import type { Catalogue, Country, CountryGroup, EvidenceLevel, Territory } from '../domain/types'
import { EvidenceBadge } from './EvidenceBadge'
import { GeometryGlyph } from './GeometryGlyph'
import { internationalDesignationIds, kindBreakdown, kindBreakdownHint, territoryKindLabel } from './labels'
import { Chevron } from './panel/parts'

interface SidebarProps {
  catalogue: Catalogue
  filters: TerritoryFilters
  onToggle: (key: FilterKey, value: string) => void
  /** Clears designation/ecosystem/theme filters; the selected country is kept. */
  onClear: () => void
  results: Territory[]
  selectedId: string | null
  onSelect: (id: string) => void
  /** Select a country (or null for the whole region). */
  onSelectCountry: (code: string | null) => void
  /** Focus the map on a country without changing the selection. */
  onFocusCountry: (code: string) => void
}

const groups: { key: FilterKey; title: string; sections?: FilterSection[] }[] = [
  {
    key: 'designations',
    title: 'Designation',
    // National legal designations and international recognitions are different kinds of status.
    sections: [
      { label: 'National (by law)', test: (id) => !internationalDesignationIds.has(id) },
      { label: 'International', test: (id) => internationalDesignationIds.has(id) },
    ],
  },
  { key: 'ecosystems', title: 'Ecosystem type' },
  { key: 'themes', title: 'Conservation theme' },
]

const countryGroups: { key: CountryGroup; title: string }[] = [
  { key: 'wasop', title: 'WASOP countries' },
  { key: 'additional', title: 'Additional African countries' },
]

const journey = [
  'Choose a country, then one of its catalogued areas',
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
  onSelectCountry,
  onFocusCountry,
}: SidebarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const attributeFiltering = hasAttributeFilters(filters)
  const active = attributeKeys.reduce((n, key) => n + filters[key].length, 0)
  const scope = territoriesInScope(catalogue, filters)
  const selectedCountry = catalogue.countries.find((c) => c.code === filters.countries[0])
  const scopeLabel = selectedCountry ? `in ${selectedCountry.name}` : `across ${catalogue.countries.length} countries`

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-line bg-white 2xl:w-80">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-line bg-cream/60 px-5 py-3.5">
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
          <div className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Evidence levels">
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
              Filter catalogued areas
              {active > 0 && (
                <span className="rounded-full bg-forest px-1.5 text-[11px] font-semibold text-white">{active}</span>
              )}
            </button>
            {attributeFiltering && (
              <button type="button" onClick={onClear} className="text-[12px] font-medium text-forest hover:underline">
                Clear
              </button>
            )}
          </div>
          {attributeFiltering && (
            <p className={`mt-1.5 text-[12.5px] font-semibold ${results.length === 0 ? 'text-clay' : 'text-ink'}`}>
              {results.length === 0
                ? `No catalogued area ${scopeLabel} matches all selected filters`
                : `${results.length} of ${scope.length} catalogued areas ${scopeLabel} match`}
            </p>
          )}
          {!filtersOpen && attributeFiltering && (
            <ActiveFilterChips catalogue={catalogue} filters={filters} onToggle={onToggle} />
          )}
          {filtersOpen && (
            <div className="mt-3 flex flex-col gap-4 pb-1">
              {groups.map((group) => (
                <FilterGroup
                  key={group.key}
                  title={group.title}
                  sections={group.sections}
                  options={filterOptions(catalogue, filters, group.key)}
                  selected={filters[group.key]}
                  onToggle={(value) => onToggle(group.key, value)}
                />
              ))}
              <div className="flex flex-col gap-1.5 text-[11.5px] leading-snug text-ink-muted">
                <p>
                  Numbers show how many catalogued areas {scopeLabel} each option would match. Within a
                  group, an area matches if it has any selected option; it must match every group you use.
                </p>
                <p>
                  Filters use the designations, ecosystems and themes documented for each area in the
                  cited sources. They do not map where ecosystems or conditions occur.
                </p>
              </div>
            </div>
          )}
        </div>

        <CountryTree
          catalogue={catalogue}
          // Every country stays listed, so its areas are matched on the attribute filters alone.
          attributeMatches={filterTerritories(catalogue, { ...filters, countries: [] })}
          selectedCountry={selectedCountry}
          selectedId={selectedId}
          filtering={attributeFiltering}
          onSelectCountry={onSelectCountry}
          onFocusCountry={onFocusCountry}
          onSelect={onSelect}
        />
      </div>
    </aside>
  )
}

/**
 * All countries with their catalogued areas as one tree. Each row has two independent controls:
 * the chevron expands or collapses the country's areas, and the name selects the country.
 * Several countries can be open at once. A country opens once when it, or one of its areas,
 * becomes selected (including from a deep link); after that only the chevron opens or closes it.
 */
function CountryTree({
  catalogue,
  attributeMatches,
  selectedCountry,
  selectedId,
  filtering,
  onSelectCountry,
  onFocusCountry,
  onSelect,
}: {
  catalogue: Catalogue
  attributeMatches: Territory[]
  selectedCountry: Country | undefined
  selectedId: string | null
  filtering: boolean
  onSelectCountry: (code: string | null) => void
  onFocusCountry: (code: string) => void
  onSelect: (id: string) => void
}) {
  const matching = new Set(attributeMatches.map((t) => t.id))
  const selectedTerritory = catalogue.territories.find((t) => t.id === selectedId)
  const [expanded, setExpanded] = useState(
    () => new Set([selectedCountry?.code, selectedTerritory?.countryCode].filter((c): c is string => !!c)),
  )
  // Reveal a country only when the selected country or area changes, so a later manual
  // collapse is never undone by unrelated re-renders (filters, panel navigation, map moves).
  const [seen, setSeen] = useState({ country: selectedCountry?.code, area: selectedId })
  if (seen.country !== selectedCountry?.code || seen.area !== selectedId) {
    const reveal = [
      seen.country !== selectedCountry?.code ? selectedCountry?.code : undefined,
      seen.area !== selectedId ? selectedTerritory?.countryCode : undefined,
    ].filter((c): c is string => !!c)
    setSeen({ country: selectedCountry?.code, area: selectedId })
    if (reveal.length > 0) setExpanded((e) => new Set([...e, ...reveal]))
  }
  // The context region (an administrative area) is listed but is not a protected area.
  const contextCount = catalogue.territories.filter((t) => t.inventory?.category === 'context').length
  const areaCount = catalogue.territories.length - contextCount

  const toggleExpanded = (code: string) =>
    setExpanded((e) => {
      const next = new Set(e)
      if (!next.delete(code)) next.add(code)
      return next
    })

  return (
    <div className="px-3 py-3">
      <h2 className="px-2 font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Countries & catalogued areas
      </h2>
      <p className="mt-1 px-2 text-[11.5px] leading-snug text-ink-muted">
        {catalogue.countries.length} countries · {areaCount} catalogued areas
        {contextCount > 0 && ` and ${contextCount} context region${contextCount === 1 ? '' : 's'}`}. A partial,
        source-checked inventory of protected areas, not yet complete for any country.
      </p>
      {selectedCountry && (
        <button
          type="button"
          onClick={() => onSelectCountry(null)}
          className="mt-2 ml-1 inline-flex items-center gap-1 rounded px-1 py-0.5 text-[12.5px] font-medium text-forest hover:bg-forest-soft"
        >
          <Chevron direction="left" />
          Show the whole region
        </button>
      )}
      {countryGroups.map((group) => {
        const members = catalogue.countries.filter((c) => c.group === group.key)
        if (members.length === 0) return null
        return (
          <section key={group.key} aria-label={group.title}>
            <h3 className="mt-3 px-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              {group.title} <span className="font-normal normal-case tracking-normal">({members.length})</span>
            </h3>
            <ul className="mt-1 flex flex-col gap-0.5">
              {members.map((country) => {
                const own = catalogue.territories.filter((t) => t.countryCode === country.code)
                const shown = own.filter((t) => matching.has(t.id))
                const open = expanded.has(country.code)
                const isSelected = country.code === selectedCountry?.code
                const noMatch = filtering && shown.length === 0
                const listId = `country-areas-${country.code}`
                return (
                  <li key={country.code}>
                    <div
                      className={[
                        'flex items-center rounded-md transition-colors',
                        isSelected ? 'bg-gold-soft ring-1 ring-gold' : 'hover:bg-cream',
                      ].join(' ')}
                    >
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={listId}
                        aria-label={`${open ? 'Hide' : 'Show'} catalogued areas in ${country.name}`}
                        title={`${open ? 'Hide' : 'Show'} catalogued areas`}
                        onClick={() => toggleExpanded(country.code)}
                        className="grid size-7 shrink-0 place-items-center rounded-md text-ink-muted hover:bg-forest-soft hover:text-forest"
                      >
                        <Chevron direction={open ? 'down' : 'right'} />
                      </button>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => (isSelected ? onFocusCountry(country.code) : onSelectCountry(country.code))}
                        title={isSelected ? `${country.name} is selected — show it on the map` : `Select ${country.name} and show it on the map`}
                        className={[
                          'flex min-w-0 flex-1 items-center gap-1.5 rounded-md py-1.5 pr-2 pl-0.5 text-left text-[13px]',
                          isSelected ? 'font-semibold' : '',
                          noMatch ? 'text-ink-muted' : 'text-ink',
                        ].join(' ')}
                      >
                        <span className="min-w-0 flex-1">{country.name}</span>
                        <span
                          className={[
                            'shrink-0 text-[12px]',
                            filtering && shown.length > 0 ? 'rounded-full bg-forest-soft px-1.5 font-semibold text-forest' : 'text-ink-muted',
                          ].join(' ')}
                        >
                          {own.length === 0 ? 'no areas yet' : filtering ? `${shown.length} of ${own.length}` : own.length}
                        </span>
                      </button>
                    </div>
                    {open && (
                      <div id={listId}>
                        <CountryAreas
                          catalogue={catalogue}
                          own={own}
                          shown={shown}
                          selectedId={selectedId}
                          onSelect={onSelect}
                        />
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function CountryAreas({
  catalogue,
  own,
  shown,
  selectedId,
  onSelect,
}: {
  catalogue: Catalogue
  own: Territory[]
  shown: Territory[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const visible = new Set(shown.map((t) => t.id))
  // A selected area stays listed even when filters exclude it, so the selection is never lost.
  const keep = (t: Territory) => visible.has(t.id) || t.id === selectedId
  const roots = own.filter((t) => !t.parentId || !own.some((p) => p.id === t.parentId))
  const rows = roots
    .flatMap((root) => [
      { territory: root, depth: 0 },
      ...own.filter((t) => t.parentId === root.id).map((territory) => ({ territory, depth: 1 })),
    ])
    .filter(({ territory }) => keep(territory))
  const hidden = own.length - shown.length

  return (
    <div className="mb-2 ml-3 border-l border-line pl-2">
      <p className="px-2 pt-1 pb-1.5 text-[11.5px] text-ink-muted" title={kindBreakdownHint}>
        {kindBreakdown(countByKind(own))}
      </p>
      {rows.length === 0 ? (
        <p className="mx-1 rounded-md bg-cream px-2 py-1.5 text-[12px] text-ink-muted">
          No catalogued area here matches the current filters.
        </p>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {rows.map(({ territory, depth }) => (
            <li key={territory.id} className={depth ? 'ml-4' : ''}>
              <TerritoryListItem
                territory={territory}
                summary={territorySummary(catalogue, territory.id)}
                selected={territory.id === selectedId}
                dimmed={!visible.has(territory.id)}
                onSelect={() => onSelect(territory.id)}
              />
            </li>
          ))}
        </ul>
      )}
      {hidden > 0 && rows.length > 0 && (
        <p className="px-2 pt-1 text-[11.5px] text-ink-muted">
          {hidden} more {hidden === 1 ? 'area does' : 'areas do'} not match the current filters.
        </p>
      )}
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

interface FilterSection {
  label: string
  test: (id: string) => boolean
}

function FilterGroup({
  title,
  sections,
  options,
  selected,
  onToggle,
}: {
  title: string
  sections?: FilterSection[]
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  // An option that every listed area already has cannot narrow the results on its own.
  const noReduction = (o: FilterOption) => selected.length === 0 && o.coversAll
  const renderOption = (o: FilterOption) => {
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
            ? `No catalogued area matches “${o.label}” together with your other filters.`
            : all
              ? `Every catalogued area currently in view has “${o.label}”, so selecting it will not narrow the results.`
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
  }
  const rows = sections
    ? sections.map((section) => ({ label: section.label, options: options.filter((o) => section.test(o.id)) }))
    : [{ label: '', options }]
  return (
    <fieldset>
      <legend className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink-muted">{title}</legend>
      {rows.map(
        (row, i) =>
          row.options.length > 0 && (
            <div key={row.label} className={i > 0 ? 'mt-2' : undefined}>
              {row.label && <p className="mb-1 text-[11px] font-medium text-ink-muted">{row.label}</p>}
              <div className="flex flex-wrap gap-1.5">{row.options.map(renderOption)}</div>
            </div>
          ),
      )}
      {options.some((o) => !selected.includes(o.id) && noReduction(o)) && (
        <p className="mt-1.5 text-[11.5px] leading-snug text-ink-muted">
          “all” means every catalogued area currently in view has that value, so selecting it will not
          narrow the results.
        </p>
      )}
    </fieldset>
  )
}

function TerritoryListItem({
  territory,
  summary,
  selected,
  dimmed = false,
  onSelect,
}: {
  territory: Territory
  summary: { challenges: number; opportunities: number }
  selected: boolean
  /** Listed only because it is selected; it does not match the current filters. */
  dimmed?: boolean
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
        dimmed ? 'opacity-70' : '',
      ].join(' ')}
    >
      <GeometryGlyph representation={territory.geometry.representation} selected={selected} />
      <span className="min-w-0 flex-1" title={territoryKindLabel[territory.kind]}>
        <span className="block text-[13.5px] font-semibold leading-snug text-ink">{territory.name}</span>
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
