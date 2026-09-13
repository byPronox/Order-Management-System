"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, Download, Plus, Search } from "lucide-react"
import { ordersApi } from "@/lib/api/orders"
import { formatCurrency, getCookie, getInitials } from "@/lib/utils"
import type { Order, OrderStatus, OrderSummary } from "@/lib/types"

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
]

const STATUS_BADGE: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-neutral-100 text-neutral-500",
}

const STATUS_DOT: Record<string, string> = {
  completed: "bg-emerald-500",
  pending: "bg-amber-400",
  cancelled: "bg-neutral-400",
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

export function OrdersWorkspace() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [summary, setSummary] = useState<OrderSummary | null>(null)
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all")
  const [search, setSearch] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [workspaceId, setWorkspaceId] = useState<number | undefined>(undefined)

  // Lee la cookie al montar Y cada vez que la ventana recupera el foco
  // (cubre el caso de cambiar workspace y volver a esta pestaña)
  useEffect(() => {
    function syncWorkspace() {
      const raw = getCookie("workspace_id")
      setWorkspaceId(raw ? Number(raw) : undefined)
    }
    syncWorkspace()

    // Detecta el cambio de cookie por polling ligero (no hay evento nativo de "cookie changed")
    const interval = setInterval(syncWorkspace, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    ordersApi.getSummary(workspaceId).then(setSummary).catch(() => {})
  }, [workspaceId])

  useEffect(() => {
    const timeout = setTimeout(() => {
      ordersApi
        .list({
          workspaceId,
          status: activeTab === "all" ? undefined : activeTab,
          search: search || undefined,
        })
        .then(setOrders)
        .catch(() => setError("Could not load orders."))
    }, 300)

    return () => clearTimeout(timeout)
  }, [workspaceId, activeTab, search])

  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-neutral-400">
          Workspace / <span className="text-neutral-900">Orders</span>
        </p>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl tracking-[-.04em]">Orders</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">
              Track, manage and fulfill every order from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2.5 text-xs font-semibold">
              <Download size={14} /> Export report
            </button>
            <button type="button" className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-semibold text-white">
              <Plus size={14} /> Create order
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Total orders</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">{summary?.totalOrders.toLocaleString() ?? "—"}</p>
            {summary && (
              <p className="mt-2 text-xs text-neutral-500">
                <span className={summary.ordersGrowthPercent >= 0 ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>
                  {summary.ordersGrowthPercent >= 0 ? "+" : ""}{summary.ordersGrowthPercent}%
                </span>{" "}
                from last month
              </p>
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Pending fulfillment</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">{summary?.pendingFulfillment.toLocaleString() ?? "—"}</p>
            <p className="mt-2 text-xs text-amber-600">Needs attention today</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Revenue this month</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">{formatCurrency(summary?.revenueThisMonth ?? 0)}</p>
            {summary && (
              <p className="mt-2 text-xs text-neutral-500">
                <span className={summary.revenueGrowthPercent >= 0 ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>
                  {summary.revenueGrowthPercent >= 0 ? "+" : ""}{summary.revenueGrowthPercent}%
                </span>{" "}
                from last month
              </p>
            )}
          </div>
        </div>

        <div className="mt-7 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1 rounded-full bg-neutral-100 p-1">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeTab === tab.value ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                  }`}
                >
                  {tab.label}
                  {tab.value === "all" && summary && ` ${summary.totalOrders.toLocaleString()}`}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="w-56 rounded-full border border-black/10 bg-neutral-50 py-2 pl-9 pr-4 text-xs outline-none focus:border-black/25"
              />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/6 text-xs uppercase tracking-[.08em] text-neutral-400">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders === null && !error && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-neutral-400">
                      Loading orders...
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
                {orders && orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-neutral-400">
                      No orders match your filters.
                    </td>
                  </tr>
                )}
                {orders?.map((order) => (
                  <tr key={order.id} className="border-b border-black/4 last:border-0">
                    <td className="py-4 font-mono text-xs font-semibold">ORD-{order.id}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-7 place-items-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">
                          {getInitials(order.customer?.name ?? "??")}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-neutral-900">{order.customer?.name}</p>
                          <p className="text-[11px] text-neutral-400">{order.customer?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-neutral-500">{formatDate(order.createdAt)}</td>
                    <td className="py-4 text-xs text-neutral-500">{order.items?.length ?? 0}</td>
                    <td className="py-4 text-xs font-semibold">{formatCurrency(Number(order.totalAmount))}</td>
                    <td className="py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_BADGE[order.status]}`}>
                        <span className={`size-1.5 rounded-full ${STATUS_DOT[order.status]}`} />
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders && (
            <p className="mt-4 text-xs text-neutral-400">
              Showing {orders.length} of {summary?.totalOrders ?? orders.length} orders
            </p>
          )}
        </div>
      </div>
    </div>
  )
}