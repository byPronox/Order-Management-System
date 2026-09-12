export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-label={label}>
      <span className="size-4 animate-spin rounded-full border-2 border-current/20 border-t-current" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export function LoadingDots() {
  return (
    <span className="inline-flex gap-1" role="status" aria-label="Loading">
      <span className="size-1.5 animate-pulse rounded-full bg-current [animation-delay:-200ms]" />
      <span className="size-1.5 animate-pulse rounded-full bg-current [animation-delay:-100ms]" />
      <span className="size-1.5 animate-pulse rounded-full bg-current" />
      <span className="sr-only">Loading</span>
    </span>
  )
}
