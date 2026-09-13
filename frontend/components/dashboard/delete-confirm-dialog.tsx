"use client"

import { AlertTriangle } from "lucide-react"

interface DeleteConfirmDialogProps {
  title: string
  description: string
  onCancel: () => void
  onConfirm: () => void
  loading?: boolean
}

export function DeleteConfirmDialog({ title, description, onCancel, onConfirm, loading }: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <div className="grid size-11 place-items-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle size={20} />
        </div>
        <h2 className="mt-4 font-display text-xl tracking-[-.02em]">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-2.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-full bg-red-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}