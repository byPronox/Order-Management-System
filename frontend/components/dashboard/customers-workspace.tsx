"use client"

import { useEffect, useState } from "react"
import { Download, Plus, Search } from "lucide-react"
import { customersApi } from "@/lib/api/customers"
import { getInitials } from "@/lib/utils"
import type { Customer, CustomerType, CustomerStatus } from "@/lib/types"
import { useWorkspaceId } from "@/lib/hooks/use-workspace-id"

const TYPE_TABS: { label: string; value: CustomerType | "all" }[] = [
  { label: "All customers", value: "all" },
  { label: "Enterprise", value: "enterprise" },
  { label: "SMB", value: "smb" },
  { label: "Individual", value: "individual" },
]

const TYPE_BADGE: Record<string, string> = {
  enterprise: "bg-indigo-50 text-indigo-700",
  smb: "bg-blue-50 text-blue-700",
  individual: "bg-neutral-100 text-neutral-500",
}

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  paused: "bg-neutral-100 text-neutral-500",
}

const STATUS_DOT: Record<string, string> = {
  active: "bg-emerald-500",
  paused: "bg-neutral-400",
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

export function CustomersWorkspace() {
  const workspaceId = useWorkspaceId()
  const [customers, setCustomers] = useState<Customer[] | null>(null)
  const [activeTab, setActiveTab] = useState<CustomerType | "all">("all")
  const [search, setSearch] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      customersApi
        .list({ workspaceId, search: search || undefined })
        .then(setCustomers)
        .catch(() => setError("Could not load customers."))
    }, 300)

    return () => clearTimeout(timeout)
  }, [workspaceId, search])

  const filteredCustomers = customers?.filter((c) => activeTab === "all" || c.customerType === activeTab) ?? null

  const totalActive = customers?.filter((c) => c.status === "active").length ?? 0
  const totalEnterprise = customers?.filter((c) => c.customerType === "enterprise").length ?? 0

  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-neutral-400">
          Workspace / <span className="text-neutral-900">Customers</span>
        </p>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl tracking-[-.04em]">Customers</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">
              Manage customer relationships, account health and order activity from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2.5 text-xs font-semibold">
              <Download size={14} /> Export CSV
            </button>
            <button type="button" className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-semibold text-white">
              <Plus size={14} /> Add customer
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Active accounts</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">{totalActive.toLocaleString()}</p>
            <p className="mt-2 text-xs text-neutral-500">out of {customers?.length ?? 0} total</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Enterprise tiers</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">{totalEnterprise.toLocaleString()}</p>
            <p className="mt-2 text-xs text-neutral-500">
              {customers?.length ? Math.round((totalEnterprise / customers.length) * 100) : 0}% of customer volume
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Total customers</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">{customers?.length.toLocaleString() ?? "—"}</p>
            <p className="mt-2 text-xs text-neutral-500">this workspace</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Retention</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">
              {customers?.length ? Math.round((totalActive / customers.length) * 100) : 0}%
            </p>
            <p className="mt-2 text-xs text-neutral-500">accounts marked active</p>
          </div>
        </div>

        <div className="mt-7 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1 rounded-full bg-neutral-100 p-1">
              {TYPE_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeTab === tab.value ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or company..."
                className="w-64 rounded-full border border-black/10 bg-neutral-50 py-2 pl-9 pr-4 text-xs outline-none focus:border-black/25"
              />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/6 text-xs uppercase tracking-[.08em] text-neutral-400">
                  <th className="pb-3 font-medium">Customer & company</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers === null && !error && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-neutral-400">
                      Loading customers...
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                )}
                {filteredCustomers && filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-neutral-400">
                      No customers match your filters.
                    </td>
                  </tr>
                )}
                {filteredCustomers?.map((customer) => (
                  <tr key={customer.id} className="border-b border-black/4 last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 place-items-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">
                          {getInitials(customer.name)}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-neutral-900">{customer.name}</p>
                          {customer.companyName && (
                            <p className="text-[11px] text-neutral-400">{customer.companyName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${TYPE_BADGE[customer.customerType]}`}>
                        {customer.customerType}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-neutral-600">{customer.email}</td>
                    <td className="py-4 text-xs text-neutral-500">{customer.phone || "—"}</td>
                    <td className="py-4 text-xs text-neutral-500">{formatDate(customer.createdAt)}</td>
                    <td className="py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_BADGE[customer.status]}`}>
                        <span className={`size-1.5 rounded-full ${STATUS_DOT[customer.status]}`} />
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers && (
            <p className="mt-4 text-xs text-neutral-400">
              Showing {filteredCustomers.length} of {customers?.length ?? 0} customers
            </p>
          )}
        </div>
      </div>
    </div>
  )
}