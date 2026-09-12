"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react"

interface HeaderAccountMenuProps {
  initials: string
}

export function HeaderAccountMenu({ initials }: HeaderAccountMenuProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return // clave: solo escuchamos cuando el menú está abierto

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    // el pequeño delay evita que el MISMO click que abrió el menú
    // sea interpretado como un click "afuera"
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timer)
      document.removeEventListener("click", handleClickOutside)
    }
  }, [open])

  async function handleLogout() {
    setOpen(false)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      router.push("/login")
      router.refresh()
    }
  }

  function handleDashboard() {
    setOpen(false)
    router.push("/dashboard")
  }

  return (
    <div className="relative z-50" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-black/10 bg-white py-1.5 pl-1.5 pr-3 text-xs font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <span className="grid size-7 place-items-center rounded-full bg-black text-[11px] font-semibold text-white">
          {initials}
        </span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-black/8 bg-white shadow-lg">
          <button
            type="button"
            onClick={handleDashboard}
            className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            <LayoutDashboard size={15} strokeWidth={1.8} aria-hidden="true" />
            Dashboard
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 border-t border-black/6 px-4 py-3 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={15} strokeWidth={1.8} aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}