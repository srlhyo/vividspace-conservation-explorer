import { useCallback, useEffect, useState } from 'react'
import type { Catalogue } from '../domain/types'
import { validateCatalogue } from '../domain/validate'
import type { BoundaryLayers, ConservationRepository } from './repository'

export type ExplorerData =
  | { status: 'loading' }
  | { status: 'error'; message: string; retry: () => void }
  | { status: 'ready'; catalogue: Catalogue; boundaries: BoundaryLayers }

export function useExplorerData(repository: ConservationRepository): ExplorerData {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<ExplorerData>({ status: 'loading' })
  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    Promise.all([repository.getCatalogue(), repository.getBoundaries()])
      .then(([catalogue, boundaries]) => {
        if (cancelled) return
        const problems = validateCatalogue(catalogue)
        if (problems.length > 0) console.warn('[catalogue] integrity problems:', problems)
        setState({ status: 'ready', catalogue, boundaries })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : String(err),
          retry,
        })
      })
    return () => {
      cancelled = true
    }
  }, [repository, attempt, retry])

  return state
}
