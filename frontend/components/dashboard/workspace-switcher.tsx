"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronDown } from "lucide-react"
import { workspacesApi } from "@/lib/api/workspaces"
import type { Workspace } from "@/lib/types"

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function WorkspaceSwitcher() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    workspacesApi.list().then((data) => {
      setWorkspaces(data)
      const cookieId = getCookie("workspace_id")
      setActiveId(cookieId ? Number(cookieId) : data[0]?.id ?? null)
    }).catch(() => {
      // silently fail; switcher just won't populate
    })
  }, [])

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const timer = setTimeout(() => document.addEventListener("click", handleClickOutside), 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener("click", handleClickOutside)
    }
  }, [open])

  async function handleSelect(workspace: Workspace) {
    setActiveId(workspace.id)
    setOpen(false)

    await fetch("/api/workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspaceId: workspace.id }),
    })

    router.refresh()
  }

  const activeWorkspace = workspaces.find((w) => w.id === activeId)

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-neutral-600 shadow-sm lg:mt-10 lg:flex lg:w-full lg:justify-between"
        aria-label="Switch workspace"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-lg bg-black text-[10px] text-white">
            {activeWorkspace?.name?.charAt(0) ?? "O"}
          </span>
          {activeWorkspace?.name ?? "Loading..."}
        </span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[220px] overflow-hidden rounded-xl border border-black/8 bg-white shadow-lg">
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              type="button"
              onClick={() => handleSelect(workspace)}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <span className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-lg bg-black text-[10px] text-white">
                  {workspace.name.charAt(0)}
                </span>
                {workspace.name}
              </span>
              {workspace.id === activeId && <Check size={14} className="text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}