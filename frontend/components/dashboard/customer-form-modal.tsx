"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { customersApi, type CreateCustomerPayload } from "@/lib/api/customers"
import type { Customer } from "@/lib/types"

interface CustomerFormModalProps {
  workspaceId?: number
  customer?: Customer | null // si viene, es modo edición
  onClose: () => void
  onSaved: () => void
}

const EMPTY_FORM: CreateCustomerPayload = {
  name: "",
  email: "",
  companyName: "",
  customerType: "individual",
  phone: "",
  address: "",
  status: "active",
}

export function CustomerFormModal({ workspaceId, customer, onClose, onSaved }: CustomerFormModalProps) {
  const isEditing = Boolean(customer)
  const [form, setForm] = useState<CreateCustomerPayload>(
    customer
      ? {
          name: customer.name,
          email: customer.email,
          companyName: customer.companyName ?? "",
          customerType: customer.customerType,
          phone: customer.phone ?? "",
          address: customer.address ?? "",
          status: customer.status,
        }
      : EMPTY_FORM,
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateField<K extends keyof CreateCustomerPayload>(key: K, value: CreateCustomerPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (isEditing && customer) {
        await customersApi.update(customer.id, form, workspaceId)
      } else {
        await customersApi.create(form, workspaceId)
      }
      onSaved()
      onClose()
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes("409")
          ? "A customer with this email already exists."
          : "Could not save the customer. Please try again.",
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
            {isEditing ? "Edit customer" : "Add customer"}
          </h2>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-neutral-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Full name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/25"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/25"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Company</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/25"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Type</label>
              <select
                value={form.customerType}
                onChange={(e) => updateField("customerType", e.target.value)}
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm capitalize outline-none focus:border-black/25"
              >
                <option value="individual">Individual</option>
                <option value="smb">SMB</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
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
                <option value="paused">Paused</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/25"
              />
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
              {submitting ? "Saving..." : isEditing ? "Save changes" : "Add customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}