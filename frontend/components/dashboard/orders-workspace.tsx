"use client"

import { useMemo, useState } from "react"
import { ArrowDownToLine, Plus, Search, SlidersHorizontal } from "lucide-react"
import { StatusDot } from "@/components/ui/status"
import { formatCurrency } from "@/lib/utils"
import type { OrderStatus } from "@/lib/types"
import { workspaceSettings } from "@/lib/mock-data/workspace-settings"

const orders: Array<{ id: string; customer: string; email: string; date: string; total: number; items: number; status: OrderStatus }> = [
  { id: "ORD-1048", customer: "Olivia Martin", email: "olivia.martin@example.com", date: "Sep 11, 2026", total: 248, items: 3, status: "pending" },
  { id: "ORD-1047", customer: "Ethan Walker", email: "ethan.walker@example.com", date: "Sep 11, 2026", total: 84.5, items: 1, status: "completed" },
  { id: "ORD-1046", customer: "Sophia Carter", email: "sophia.carter@example.com", date: "Sep 10, 2026", total: 512.25, items: 5, status: "completed" },
  { id: "ORD-1045", customer: "James Wilson", email: "james.wilson@example.com", date: "Sep 10, 2026", total: 129, items: 2, status: "pending" },
  { id: "ORD-1044", customer: "Amelia Brown", email: "amelia.brown@example.com", date: "Sep 09, 2026", total: 76, items: 1, status: "cancelled" },
  { id: "ORD-1043", customer: "Noah Davis", email: "noah.davis@example.com", date: "Sep 09, 2026", total: 346.8, items: 4, status: "completed" },
]
const tabs = ["All orders", "Pending", "Completed", "Cancelled"] as const
type Tab = (typeof tabs)[number]
const statusTone: Record<OrderStatus, "success" | "warning" | "danger"> = { pending: "warning", completed: "success", cancelled: "danger" }
const statusLabels: Record<OrderStatus, string> = { pending: "Pending", completed: "Completed", cancelled: "Cancelled" }

export function OrdersWorkspace() {
  const [activeTab, setActiveTab] = useState<Tab>("All orders")
  const [query, setQuery] = useState("")
  const filteredOrders = useMemo(() => orders.filter((order) => {
    const matchesTab = activeTab === "All orders" || statusLabels[order.status] === activeTab
    const normalizedQuery = query.trim().toLowerCase()
    return matchesTab && (!normalizedQuery || `${order.id} ${order.customer} ${order.email}`.toLowerCase().includes(normalizedQuery))
  }), [activeTab, query])
  return <main className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-10 lg:py-9"><header className="flex flex-col gap-5 border-b border-black/[.07] pb-7 xl:flex-row xl:items-end xl:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-black/40">Workspace / Orders</p><h1 className="mt-3 font-display text-4xl tracking-[-.06em] text-neutral-950 sm:text-5xl">Orders</h1><p className="mt-2 text-sm text-black/45">Track, manage and fulfill every order from one place.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-xl border border-black/[.08] bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700"><ArrowDownToLine size={15} /> Export report</button><button className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white"><Plus size={15} /> Create order</button></div></header><section className="mt-7 grid gap-3 sm:grid-cols-3"><Metric label="Total orders" value="1,284" detail="+12.4% from last month" /><Metric label="Pending fulfillment" value="38" detail="Needs attention today" /><Metric label="Revenue this month" value={formatCurrency(48920, workspaceSettings.defaultCurrency)} detail="+8.7% from last month" /></section><section className="mt-7 overflow-hidden rounded-2xl border border-black/[.07] bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-black/[.07] p-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex gap-1 overflow-x-auto">{tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold ${activeTab === tab ? "bg-black text-white" : "text-black/45 hover:bg-black/[.04]"}`}>{tab}{tab === "All orders" && <span className="ml-1.5 opacity-60">1,284</span>}</button>)}</div><div className="flex gap-2"><label className="relative flex min-w-0 flex-1 items-center sm:w-64"><Search size={15} className="pointer-events-none absolute left-3 text-black/35" /><span className="sr-only">Search orders</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders..." className="h-9 w-full rounded-lg border border-black/[.08] bg-[#fdfbfb] pl-9 pr-3 text-xs outline-none" /></label><button className="grid size-9 place-items-center rounded-lg border border-black/[.08] text-black/45" aria-label="Filter orders"><SlidersHorizontal size={15} /></button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-[#fcfafa]"><tr className="text-[10px] font-semibold uppercase tracking-[.14em] text-black/35"><th className="px-5 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-black/[.06]">{filteredOrders.map((order) => <tr key={order.id} className="transition hover:bg-[#fdfafa]"><td className="px-5 py-4 font-mono text-xs font-medium">{order.id}</td><td className="px-4 py-4"><p className="font-semibold text-sm">{order.customer}</p><p className="mt-1 text-xs text-black/40">{order.email}</p></td><td className="px-4 py-4 text-sm text-black/55">{order.date}</td><td className="px-4 py-4 text-sm">{order.items}</td><td className="px-4 py-4 text-sm font-semibold">{formatCurrency(order.total, workspaceSettings.defaultCurrency)}</td><td className="px-4 py-4"><StatusDot label={statusLabels[order.status]} status={statusTone[order.status]} /></td></tr>)}</tbody></table></div></section></main>
}
function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="rounded-2xl border border-black/[.06] bg-white p-5"><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-black/40">{label}</p><p className="mt-3 font-display text-3xl tracking-[-.05em]">{value}</p><p className="mt-2 text-xs text-black/40">{detail}</p></div> }
export const ordersForLoading = orders
