import Link from 'next/link'

export function BrandMark({ href = '/', className = '' }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-3 ${className}`} aria-label="Orderly home">
      <span className="flex size-8 items-center justify-center rounded-full bg-[#111] text-white" aria-hidden="true">
        <span className="size-2 rounded-full bg-[#d7f55a]" />
      </span>
      <span className="font-display text-xl tracking-[-0.05em] text-[#111]">ORDERLY.</span>
    </Link>
  )
}
