import { useMemo, useState } from 'react'
import { config } from './config'
import { AboutDialog } from './components/AboutDialog'
import { FilterPanel } from './components/FilterPanel'
import { Header } from './components/Header'
import { MapLegend, SelectHint } from './components/MapOverlays'
import { ErrorScreen, LoadingScreen } from './components/StatusScreens'
import { TerritoryPanel } from './components/TerritoryPanel'
import { createStaticRepository } from './data/repository'
import { useExplorerData } from './data/useExplorerData'
import {
  emptyFilters,
  filterTerritories,
  getTerritoryProfile,
  toggleFilter,
  type TerritoryFilters,
} from './domain/catalogue'
import type { Catalogue } from './domain/types'
import type { BoundaryLayers } from './data/repository'
import { ExplorerMap } from './map/ExplorerMap'

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
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [resetViewSignal, setResetViewSignal] = useState(0)

  const results = useMemo(() => filterTerritories(catalogue, filters), [catalogue, filters])
  const visibleIds = useMemo(() => new Set(results.map((t) => t.id)), [results])
  const profile = selectedId ? getTerritoryProfile(catalogue, selectedId) : undefined

  return (
    <div className="flex h-full">
      <FilterPanel
        catalogue={catalogue}
        filters={filters}
        onToggle={(key, value) => setFilters((f) => toggleFilter(f, key, value))}
        onClear={() => setFilters(emptyFilters)}
        results={results}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <div className="relative min-w-0 flex-1">
        <ExplorerMap
          boundaries={boundaries}
          territories={catalogue.territories}
          visibleIds={visibleIds}
          selectedId={selectedId}
          onSelect={setSelectedId}
          resetViewSignal={resetViewSignal}
        />
        {/* Overlays sit on the right: the focus territories are on the western coast. */}
        <div className="pointer-events-none absolute top-4 right-4 flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={() => setResetViewSignal((n) => n + 1)}
            className="pointer-events-auto rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-forest shadow-card ring-1 ring-line hover:bg-cream"
          >
            Reset view
          </button>
          {!profile && <SelectHint count={results.length} />}
        </div>
        <div className="pointer-events-none absolute right-14 bottom-10">
          <MapLegend />
        </div>
      </div>
      {profile && (
        <TerritoryPanel
          key={profile.territory.id}
          profile={profile}
          inCurrentResults={visibleIds.has(profile.territory.id)}
          onSelect={setSelectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
