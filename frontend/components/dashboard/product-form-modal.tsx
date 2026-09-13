"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { productsApi } from "@/lib/api/products"
import type { Product, CreateProductPayload } from "@/lib/types"

interface ProductFormModalProps {
  workspaceId?: number
  product?: Product | null
  onClose: () => void
  onSaved: () => void
}

const EMPTY_FORM: CreateProductPayload = {
  name: "",
  description: "",
  category: "",
  sku: "",
  price: 0,
  stock: undefined,
  status: "active",
}

export function ProductFormModal({ workspaceId, product, onClose, onSaved }: ProductFormModalProps) {
  const isEditing = Boolean(product)
  const [form, setForm] = useState<CreateProductPayload>(
    product
      ? {
          name: product.name,
          description: product.description ?? "",
          category: product.category ?? "",
          sku: product.sku ?? "",
          price: Number(product.price),
          stock: product.stock,
          status: product.status,
        }
      : EMPTY_FORM,
  )
  const [unlimitedStock, setUnlimitedStock] = useState(product ? product.stock === null || product.stock === undefined : false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateField<K extends keyof CreateProductPayload>(key: K, value: CreateProductPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const payload: CreateProductPayload = {
      ...form,
      stock: unlimitedStock ? undefined : form.stock,
    }

    try {
      if (isEditing && product) {
        await productsApi.update(product.id, payload, workspaceId)
      } else {
        await productsApi.create(payload, workspaceId)
      }
      onSaved()
      onClose()
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes("409")
          ? "A product with this SKU already exists."
          : "Could not save the product. Please try again.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-black/6 px-6 py-5">
          <h2 className="font-display text-2xl tracking-[-.02em]">
            {isEditing ? "Edit product" : "Add product"}
          </h2>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-neutral-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Product name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/25"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={2}
                className="w-full resize-none rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/25"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600">SKU</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => updateField("sku", e.target.value)}
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/25"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/25"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Price *</label>
              <input
                type="number"
                required
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/25"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm capitalize outline-none focus:border-black/25"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-neutral-600">
                <input
                  type="checkbox"
                  checked={unlimitedStock}
                  onChange={(e) => setUnlimitedStock(e.target.checked)}
                  className="accent-black"
                />
                Unlimited / digital product (no stock tracking)
              </label>
              {!unlimitedStock && (
                <input
                  type="number"
                  min={0}
                  value={form.stock ?? 0}
                  onChange={(e) => updateField("stock", parseInt(e.target.value) || 0)}
                  placeholder="Stock quantity"
                  className="mt-2 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/25"
                />
              )}
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-black/6 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-black px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-40"
            >
              {submitting ? "Saving..." : isEditing ? "Save changes" : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}