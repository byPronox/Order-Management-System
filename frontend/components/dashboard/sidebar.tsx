"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Box, ChevronDown, LayoutDashboard, Package, Settings, ShoppingCart, Users } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Products", href: "/products", icon: Package },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-black/8 bg-[#f7f3f2] px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-5">
      <div className="flex items-center justify-between lg:block">
        <BrandMark />
        <button className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-neutral-600 shadow-sm lg:mt-10 lg:flex lg:w-full lg:justify-between" aria-label="Switch workspace">
          <span className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-lg bg-black text-[10px] text-white">O</span> Orderly HQ</span>
          <ChevronDown size={14} />
        </button>
      </div>
      <nav className="mt-6 flex gap-1 overflow-x-auto lg:mt-8 lg:flex-col" aria-label="Workspace navigation">
        {navigation.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return <Link key={href} href={href} className={`module-row min-w-max lg:w-full ${active ? "module-active" : ""}`} aria-current={active ? "page" : undefined}>
            <Icon size={17} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span>
          </Link>
        })}
      </nav>
      <div className="mt-auto hidden rounded-2xl bg-white p-3 shadow-sm lg:block">
        <div className="flex items-center gap-3 rounded-xl bg-[#f7f3f2] p-2.5">
          <div className="relative grid size-10 shrink-0 place-items-center rounded-full bg-black text-xs font-semibold text-white" aria-hidden="true">
            AM
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#f7f3f2] bg-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-neutral-900">Alex Morgan</p>
            <p className="mt-0.5 truncate text-[11px] text-neutral-500">Administrator</p>
          </div>
          <button className="grid size-8 place-items-center rounded-lg text-neutral-400 transition hover:bg-white hover:text-neutral-900" aria-label="Open account menu">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export { Box }
