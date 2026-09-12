const statusStyles = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  neutral: 'bg-black/30',
} as const

export function StatusDot({ status = 'neutral', label }: { status?: keyof typeof statusStyles; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[.14em] text-black/50">
      <span className={`size-1.5 rounded-full ${statusStyles[status]}`} aria-hidden="true" />
      {label}
    </span>
  )
}
