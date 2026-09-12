import type { ReactNode } from 'react'

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="flex flex-col gap-4 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow mb-3 text-black/40">{eyebrow}</p> : null}
        <h1 className="font-display text-4xl tracking-[-0.06em] text-[#111] sm:text-5xl">{title}</h1>
        {description ? <p className="mt-3 max-w-xl text-sm leading-6 text-black/55">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  )
}
