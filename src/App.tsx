import { useMemo, useState } from 'react'
import { config } from './config'
import { AboutDialog } from './components/AboutDialog'
import { Header } from './components/Header'
import { CountryCard, FilterSummary, MapLegend } from './components/MapOverlays'
import { kindBreakdown } from './components/labels'
import { TerritoryPanel } from './components/panel/TerritoryPanel'
import { Sidebar } from './components/Sidebar'
import { ErrorScreen, LoadingScreen } from './components/StatusScreens'
import { createStaticRepository, type BoundaryLayers } from './data/repository'
import { useExplorerData } from './data/useExplorerData'
import {
  attributeKeys,
  countByKind,
  emptyFilters,
  filterOptions,
  filterTerritories,
  hasActiveFilters,
  hasAttributeFilters,
  territoriesInScope,
  getTerritoryProfile,
  toggleFilter,
  type TerritoryFilters,
} from './domain/catalogue'
import type { Catalogue } from './domain/types'
import { ExplorerMap, type ViewRequest } from './map/ExplorerMap'
import { useSelection } from './state/selection'

const repository = createStaticRepository(config.dataBaseUrl)

export default function App() {
  const data = useExplorerData(repository)
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <div className="flex h-full min-w-[1024px] flex-col">
      <Header onOpenAbout={() => setAboutOpen(true)} />
      <main className="min-h-0 flex-1">
        {data.status === 'loading' && <LoadingScreen />}
        {data.status === 'error' && <ErrorScreen message={data.message} onRetry={data.retry} />}
        {data.status === 'ready' && (
          <>
            <Explorer catalogue={data.catalogue} boundaries={data.boundaries} />
            <AboutDialog catalogue={data.catalogue} open={aboutOpen} onClose={() => setAboutOpen(false)} />
          </>
        )}
      </main>
    </div>
  )
}

function Explorer({ catalogue, boundaries }: { catalogue: Catalogue; boundaries: BoundaryLayers }) {
  const [filters, setFilters] = useState<TerritoryFilters>(emptyFilters)
  const { selection, selectTerritory, selectChallenge, selectOpportunity } = useSelection(catalogue)
  const [viewRequest, setViewRequest] = useState<ViewRequest | null>(null)
  const [projection, setProjection] = useState<'mercator' | 'globe'>('mercator')
  const requestView = (view: { view: 'region' } | { view: 'world' } | { view: 'country'; code: string }) =>
    setViewRequest((r) => ({ ...view, id: (r?.id ?? 0) + 1 }))

  const countryCounts = useMemo(
    () =>
      Object.fromEntries(
        catalogue.countries.map((c) => [c.code, catalogue.territories.filter((t) => t.countryCode === c.code).length]),
      ),
    [catalogue],
  )
  // Selecting a country filters to it and zooms there; selecting it again returns to the region.
  const selectCountry = (code: string | null) => {
    const deselect = code === null || (filters.countries.length === 1 && filters.countries[0] === code)
    setFilters((f) => ({ ...f, countries: deselect ? [] : [code] }))
    requestView(deselect ? { view: 'region' } : { view: 'country', code })
  }

  const results = useMemo(() => filterTerritories(catalogue, filters), [catalogue, filters])
  const visibleIds = useMemo(() => new Set(results.map((t) => t.id)), [results])
  const profile = selection.territoryId ? getTerritoryProfile(catalogue, selection.territoryId) : undefined
  const filtering = hasActiveFilters(filters)
  const attributeFiltering = hasAttributeFilters(filters)
  const scope = territoriesInScope(catalogue, filters)
  const selectedCountry = catalogue.countries.find((c) => c.code === filters.countries[0])
  const scopeLabel = selectedCountry ? `in ${selectedCountry.name}` : `across ${catalogue.countries.length} countries`
  const filterLabels = attributeKeys.flatMap((key) =>
    filterOptions(catalogue, filters, key).filter((o) => filters[key].includes(o.id)).map((o) => o.label),
  )
  // Choosing an area in another country from the list moves the country selection with it, so the
  // area stays in scope; the map then focuses on the area itself.
  const selectListedArea = (id: string) => {
    const code = catalogue.territories.find((t) => t.id === id)?.countryCode
    if (code && filters.countries.length > 0 && !filters.countries.includes(code)) {
      setFilters((f) => ({ ...f, countries: [code] }))
    }
    selectTerritory(id)
  }
  // Clearing filters keeps the selected country; the country is changed from the country list or card.
  const clearFilters = () => setFilters((f) => ({ ...emptyFilters, countries: f.countries }))

  return (
    <div className="flex h-full">
      <Sidebar
        catalogue={catalogue}
        filters={filters}
        onToggle={(key, value) => setFilters((f) => toggleFilter(f, key, value))}
        onClear={clearFilters}
        results={results}
        selectedId={selection.territoryId}
        onSelect={selectListedArea}
        onSelectCountry={selectCountry}
        onFocusCountry={(code) => requestView({ view: 'country', code })}
      />
      <div className="relative min-w-0 flex-1">
        <ExplorerMap
          boundaries={boundaries}
          territories={catalogue.territories}
          visibleIds={visibleIds}
          selectedId={selection.territoryId}
          onSelect={selectTerritory}
          selectedCountries={filters.countries}
          onSelectCountry={selectCountry}
          countryCounts={countryCounts}
          viewRequest={viewRequest}
          projection={projection}
        />
        {/* Overlays are kept to the top edge so the coast and islands stay clear. */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col items-start gap-2">
            <MapLegend filtersActive={filtering} />
            {/* Hidden while an area's panel is open: the panel names the country, the map needs the room. */}
            {selectedCountry && !profile && (
              <CountryCard
                name={selectedCountry.name}
                count={scope.length}
                breakdown={kindBreakdown(countByKind(scope))}
                onClose={() => selectCountry(null)}
              />
            )}
            {attributeFiltering && (
              <FilterSummary
                matching={results.length}
                total={scope.length}
                scopeLabel={scopeLabel}
                labels={filterLabels}
                onClear={clearFilters}
              />
            )}
          </div>
          <div className="pointer-events-auto flex shrink-0 flex-col items-end gap-2">
            <div className="flex gap-1.5">
              <MapButton onClick={() => requestView({ view: 'world' })} title="Zoom out to a world-scale view">
                Explore world
              </MapButton>
              <MapButton onClick={() => requestView({ view: 'region' })} title="Return to the WASOP regional overview">
                Reset view
              </MapButton>
            </div>
            <Segmented
              label="Map projection"
              value={projection}
              onChange={setProjection}
              options={[
                ['mercator', '2D map'],
                ['globe', '3D globe'],
              ]}
            />
          </div>
        </div>
      </div>
      {profile && (
        <TerritoryPanel
          profile={profile}
          challengeId={selection.challengeId}
          opportunityId={selection.opportunityId}
          allTerritories={catalogue.territories}
          inCurrentResults={visibleIds.has(profile.territory.id)}
          // From the panel, clear everything (country included) so the selected area matches again.
          onClearFilters={() => setFilters(emptyFilters)}
          onSelectTerritory={selectTerritory}
          onSelectChallenge={selectChallenge}
          onSelectOpportunity={selectOpportunity}
          onOpenOpportunityIn={(territoryId, opportunityId) => {
            selectTerritory(territoryId)
            selectOpportunity(opportunityId)
          }}
          onClose={() => selectTerritory(null)}
        />
      )}
    </div>
  )
}

function MapButton({ onClick, title, children }: { onClick: () => void; title: string; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded-full bg-white px-3.5 py-1.5 text-[12px] font-medium text-forest shadow-card ring-1 ring-line hover:bg-cream"
    >
      {children}
    </button>
  )
}

function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: [T, string][]
}) {
  return (
    <div className="flex rounded-full bg-white p-0.5 text-[12px] font-medium shadow-card ring-1 ring-line" role="group" aria-label={label}>
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={`rounded-full px-3 py-1 ${value === v ? 'bg-forest text-white' : 'text-forest hover:bg-cream'}`}
        >
          {text}
        </button>
      ))}
    </div>
  )
}
