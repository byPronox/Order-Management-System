"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { workspacesApi } from "@/lib/api/workspaces"

interface CreateWorkspaceModalProps {
  onClose: () => void
  onCreated: () => void
}

export function CreateWorkspaceModal({ onClose, onCreated }: CreateWorkspaceModalProps) {
  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    setError(null)

    try {
      await workspacesApi.create(name.trim())
      onCreated()
      onClose()
    } catch {
      setError("Could not create the workspace. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-black/6 px-6 py-5">
          <h2 className="font-display text-xl tracking-[-.02em]">New workspace</h2>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-neutral-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Workspace name</label>
          <input
            type="text"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Orderly APAC"
            className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/25"
          />

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="rounded-full bg-black px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-40"
            >
              {submitting ? "Creating..." : "Create workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}