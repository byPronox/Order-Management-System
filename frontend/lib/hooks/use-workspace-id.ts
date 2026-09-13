"use client"

import { useEffect, useState } from "react"
import { getCookie } from "@/lib/utils"

export function useWorkspaceId() {
  const [workspaceId, setWorkspaceId] = useState<number | undefined>(undefined)

  useEffect(() => {
    function sync() {
      const raw = getCookie("workspace_id")
      setWorkspaceId(raw ? Number(raw) : undefined)
    }
    sync()
    window.addEventListener("workspace-changed", sync)
    return () => window.removeEventListener("workspace-changed", sync)
  }, [])

  return workspaceId
}