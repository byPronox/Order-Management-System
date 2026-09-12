"use client"

import { useEffect, useState } from "react"
import { Calendar, Download, Plus, Filter, ArrowUpRight } from "lucide-react"
import { dashboardApi } from "@/lib/api/dashboard"
import { formatCurrency, formatRelativeDate, getInitials, getCookie } from "@/lib/utils"
import type { DashboardSummary } from "@/lib/types"
import { PageHeader } from "@/components/page-header"

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-emerald-500",
  pending: "bg-amber-400",
  cancelled: "bg-neutral-300",
}

const STATUS_BADGE: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-neutral-100 text-neutral-500",
}

function StatusLabel({ status }: { status: string }) {
  return <span className="capitalize">{status}</span>
}

export function DashboardWorkspace() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const workspaceId = getCookie("workspace_id")
    dashboardApi
      .getSummary(workspaceId ? Number(workspaceId) : undefined)
      .then(setData)
      .catch(() => setError("Could not load dashboard data."))
  }, [])

  if (error) {
    return (
      <div className="flex-1 p-6 lg:p-10">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  if (!data) {
    return null // el archivo loading.tsx de Next.js cubre este estado
  }

  const { metrics, ordersByStatus, conversionRate, recentOrders } = data

  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-neutral-400">
          Orderly OMS / <span className="text-neutral-900">Executive overview</span>
        </p>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl tracking-[-.04em]">Good morning, Admin.</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">
              Monitor your commerce operation, track order flow, and keep every fulfillment moving.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2.5 text-xs font-semibold">
              <Calendar size={14} /> Last 30 days
            </button>
            <button type="button" className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2.5 text-xs font-semibold">
              <Download size={14} /> Export report
            </button>
            <button type="button" className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-semibold text-white">
              <Plus size={14} /> New order
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Total customers</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">{metrics.totalCustomers.toLocaleString()}</p>
            <p className="mt-2 text-xs text-neutral-500">
              <span className={metrics.customersGrowthPercent >= 0 ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>
                {metrics.customersGrowthPercent >= 0 ? "+" : ""}{metrics.customersGrowthPercent}%
              </span>{" "}
              vs. last month
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Total products</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">{metrics.totalProducts.toLocaleString()}</p>
            <p className="mt-2 text-xs text-neutral-500">
              <span className="font-semibold text-amber-600">{metrics.lowStockCount} low stock</span> need attention
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Total orders</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">{metrics.totalOrders.toLocaleString()}</p>
            <p className="mt-2 text-xs text-neutral-500">
              <span className={metrics.ordersGrowthPercent >= 0 ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>
                {metrics.ordersGrowthPercent >= 0 ? "+" : ""}{metrics.ordersGrowthPercent}%
              </span>{" "}
              this month
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Total revenue</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">{formatCurrency(metrics.totalRevenue)}</p>
            <p className="mt-2 text-xs text-neutral-500">
              <span className="font-semibold text-emerald-600">{formatCurrency(metrics.revenueCompleted)} complete</span>{" "}
              {formatCurrency(metrics.revenuePending)} pending
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Operational performance</p>
            <div className="mt-2 flex items-center justify-between">
              <h2 className="font-display text-2xl tracking-[-.02em]">Orders by status</h2>
              <span className="text-xs text-neutral-400">Conversion rate: {conversionRate}%</span>
            </div>

            <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="flex h-full">
                {ordersByStatus.map((item) => (
                  <div
                    key={item.status}
                    className={STATUS_STYLES[item.status]}
                    style={{ width: `${item.percentage}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-neutral-400">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {ordersByStatus.map((item) => (
                <div key={item.status} className="rounded-2xl bg-neutral-50 p-4">
                  <div className="flex items-center justify-between text-xs font-medium text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <span className={`size-1.5 rounded-full ${STATUS_STYLES[item.status]}`} />
                      <StatusLabel status={item.status} />
                    </span>
                    <span className="text-neutral-400">{item.percentage}%</span>
                  </div>
                  <p className="mt-2 font-display text-2xl">{item.count.toLocaleString()}</p>
                  <p className="mt-1 text-[11px] text-neutral-400">orders in this period</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-black p-7 text-white">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[.1em] text-white/40">Fulfillment pulse</p>
              <span className="size-2 rounded-full bg-emerald-400" />
            </div>
            <h2 className="mt-3 font-display text-2xl tracking-[-.02em]">Everything is moving.</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Your operations are running smoothly across every active sales channel.
            </p>
            <div className="mt-10 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[.1em] text-white/40">Average processing</p>
                <p className="mt-1 font-display text-3xl">42 min</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[.1em] text-white/40">Accuracy</p>
                <p className="mt-1 font-display text-3xl">99.7%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl tracking-[-.02em]">Recent orders</h2>
              <p className="mt-1 text-sm text-neutral-500">The latest activity across your connected channels.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold">
                <Filter size={13} /> Filter
              </button>
              <button type="button" className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold">
                View all <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/6 text-xs uppercase tracking-[.08em] text-neutral-400">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-neutral-400">
                      No orders yet for this workspace.
                    </td>
                  </tr>
                )}
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-black/4 last:border-0">
                    <td className="py-4 font-mono text-xs font-semibold">#ORD-{order.id}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-7 place-items-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">
                          {getInitials(order.customerName)}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-neutral-900">{order.customerName}</p>
                          <p className="text-[11px] text-neutral-400">{order.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-neutral-500">{formatRelativeDate(order.createdAt)}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_BADGE[order.status]}`}>
                        <span className={`size-1.5 rounded-full ${STATUS_STYLES[order.status]}`} />
                        <StatusLabel status={order.status} />
                      </span>
                    </td>
                    <td className="py-4 text-right text-xs font-semibold">{formatCurrency(order.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}