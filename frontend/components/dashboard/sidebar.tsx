// frontend/components/dashboard/sidebar.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, LayoutDashboard, LogOut, Package, Settings, ShoppingCart, Users } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher"
import { authApi } from "@/lib/api/auth" // <-- Importamos nuestra API

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Products", href: "/products", icon: Package },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timer)
      document.removeEventListener("click", handleClickOutside)
    }
  }, [menuOpen])

  async function handleLogout() {
    setMenuOpen(false)
    try {
      await authApi.logout()
    } finally {
      router.push("/login")
      router.refresh()
    }
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-black/8 bg-[#f7f3f2] px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-5">
      <div className="flex items-center justify-between lg:block">
        <BrandMark />
        <div className="hidden lg:mt-10 lg:block">
          <WorkspaceSwitcher />
        </div>
      </div>
      <nav className="mt-6 flex gap-1 overflow-x-auto lg:mt-8 lg:flex-col" aria-label="Workspace navigation">
        {navigation.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className={`module-row min-w-max lg:w-full ${active ? "module-active" : ""}`} aria-current={active ? "page" : undefined}>
              <Icon size={17} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="relative mt-auto hidden rounded-2xl bg-white p-3 shadow-sm lg:block" ref={menuRef}>
        {menuOpen && (
          <div className="absolute bottom-full left-0 z-50 mb-2 w-full overflow-hidden rounded-xl border border-black/8 bg-white shadow-lg">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={15} strokeWidth={1.8} aria-hidden="true" />
              Log out
            </button>
          </div>
        )}
        <div className="flex items-center gap-3 rounded-xl bg-[#f7f3f2] p-2.5">
          <div className="relative grid size-10 shrink-0 place-items-center rounded-full bg-black text-xs font-semibold text-white" aria-hidden="true">
            AM
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#f7f3f2] bg-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-neutral-900">Alex Morgan</p>
            <p className="mt-0.5 truncate text-[11px] text-neutral-500">Administrator</p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="grid size-8 place-items-center rounded-lg text-neutral-400 transition hover:bg-white hover:text-neutral-900"
            aria-label="Open account menu"
            aria-expanded={menuOpen}
          >
            <ChevronDown size={14} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </aside>
  )
}