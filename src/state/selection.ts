import { useCallback, useEffect, useState } from 'react'
import type { Catalogue } from '../domain/types'

/** Where the user is in the Territory → Challenge → Activity journey. */
export interface Selection {
  territoryId: string | null
  challengeId: string | null
  opportunityId: string | null
}

export const emptySelection: Selection = { territoryId: null, challengeId: null, opportunityId: null }

/** Drops ids that do not exist or do not belong to the selected territory. */
export function sanitizeSelection(catalogue: Catalogue, s: Selection): Selection {
  const territory = catalogue.territories.find((t) => t.id === s.territoryId)
  if (!territory) return emptySelection
  const inTerritory = (item?: { territoryIds: string[] }) => item?.territoryIds.includes(territory.id)
  const challenge = catalogue.challenges.find((c) => c.id === s.challengeId)
  const opportunity = catalogue.opportunities.find((o) => o.id === s.opportunityId)
  return {
    territoryId: territory.id,
    challengeId: inTerritory(challenge) ? s.challengeId : null,
    opportunityId: inTerritory(opportunity) ? s.opportunityId : null,
  }
}

/** `#t=<territory>&c=<challenge>&o=<opportunity>` so a presenter can reload or bookmark a view. */
export function parseHash(hash: string): Selection {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  return {
    territoryId: params.get('t'),
    challengeId: params.get('c'),
    opportunityId: params.get('o'),
  }
}

export function toHash(s: Selection): string {
  const params = new URLSearchParams()
  if (s.territoryId) params.set('t', s.territoryId)
  if (s.challengeId) params.set('c', s.challengeId)
  if (s.opportunityId) params.set('o', s.opportunityId)
  const query = params.toString()
  return query ? `#${query}` : ''
}

function readLocation(catalogue: Catalogue): Selection {
  return sanitizeSelection(catalogue, parseHash(window.location.hash))
}

export function useSelection(catalogue: Catalogue) {
  const [selection, setSelection] = useState<Selection>(() => readLocation(catalogue))

  useEffect(() => {
    const url = `${window.location.pathname}${window.location.search}${toHash(selection)}`
    window.history.replaceState(null, '', url)
  }, [selection])

  useEffect(() => {
    const onHashChange = () => setSelection(readLocation(catalogue))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [catalogue])

  const selectTerritory = useCallback(
    (territoryId: string | null) =>
      setSelection((s) =>
        s.territoryId === territoryId ? s : { ...emptySelection, territoryId },
      ),
    [],
  )
  const selectChallenge = useCallback(
    (challengeId: string | null) => setSelection((s) => ({ ...s, challengeId, opportunityId: null })),
    [],
  )
  const selectOpportunity = useCallback(
    (opportunityId: string | null) => setSelection((s) => ({ ...s, opportunityId })),
    [],
  )

  return { selection, selectTerritory, selectChallenge, selectOpportunity }
}
