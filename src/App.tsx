import { useMemo, useState } from 'react'
import { config } from './config'
import { AboutDialog } from './components/AboutDialog'
import { Header } from './components/Header'
import { MapLegend } from './components/MapOverlays'
import { TerritoryPanel } from './components/panel/TerritoryPanel'
import { Sidebar } from './components/Sidebar'
import { ErrorScreen, LoadingScreen } from './components/StatusScreens'
import { createStaticRepository, type BoundaryLayers } from './data/repository'
import { useExplorerData } from './data/useExplorerData'
import {
  emptyFilters,
  filterTerritories,
  getTerritoryProfile,
  toggleFilter,
  type TerritoryFilters,
} from './domain/catalogue'
import type { Catalogue } from './domain/types'
import { ExplorerMap } from './map/ExplorerMap'
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
  const [resetViewSignal, setResetViewSignal] = useState(0)

  const results = useMemo(() => filterTerritories(catalogue, filters), [catalogue, filters])
  const visibleIds = useMemo(() => new Set(results.map((t) => t.id)), [results])
  const profile = selection.territoryId ? getTerritoryProfile(catalogue, selection.territoryId) : undefined

  return (
    <div className="flex h-full">
      <Sidebar
        catalogue={catalogue}
        filters={filters}
        onToggle={(key, value) => setFilters((f) => toggleFilter(f, key, value))}
        onClear={() => setFilters(emptyFilters)}
        results={results}
        selectedId={selection.territoryId}
        onSelect={selectTerritory}
      />
      <div className="relative min-w-0 flex-1">
        <ExplorerMap
          boundaries={boundaries}
          territories={catalogue.territories}
          visibleIds={visibleIds}
          selectedId={selection.territoryId}
          onSelect={selectTerritory}
          resetViewSignal={resetViewSignal}
        />
        {/* Overlays are kept to the top edge so the coast and islands stay clear. */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3">
          <MapLegend />
          <button
            type="button"
            onClick={() => setResetViewSignal((n) => n + 1)}
            className="pointer-events-auto shrink-0 rounded-full bg-white px-3.5 py-1.5 text-[12px] font-medium text-forest shadow-card ring-1 ring-line hover:bg-cream"
          >
            Reset view
          </button>
        </div>
      </div>
      {profile && (
        <TerritoryPanel
          profile={profile}
          challengeId={selection.challengeId}
          opportunityId={selection.opportunityId}
          allTerritories={catalogue.territories}
          inCurrentResults={visibleIds.has(profile.territory.id)}
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
