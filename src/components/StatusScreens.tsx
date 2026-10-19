import { config } from '../config'

export function LoadingScreen() {
  return (
    <div className="grid h-full place-items-center bg-cream">
      <div className="flex flex-col items-center gap-4">
        <img src={config.brand.iconUrl} alt="" className="size-14 animate-pulse rounded-xl" />
        <p className="text-sm text-ink-muted">Loading conservation dataset…</p>
      </div>
    </div>
  )
}

export function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="grid h-full place-items-center bg-cream p-6">
      <div className="max-w-md rounded-2xl bg-white p-7 text-center shadow-card ring-1 ring-line">
        <h2 className="font-display text-lg font-semibold text-ink">The dataset could not be loaded</h2>
        <p className="mt-2 text-sm text-ink-muted">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-full bg-forest px-5 py-2 text-sm font-medium text-white hover:bg-forest-deep"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
