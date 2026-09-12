"use client"

import { useMemo, useState } from "react"
import { ArrowDownToLine, Building2, Check, Ellipsis, Pencil, Plus, Search, Trash2, TrendingUp, Users, Zap } from "lucide-react"
import { StatusDot } from "@/components/ui/status"

const customers = [
  { initials: "AW", name: "Alexander Wright", company: "Synthetix Lab", type: "Enterprise", email: "alexander@synthetix.io", phone: "+1 (555) 234-8901", orders: 14, joined: "Oct 12, 2023", status: "Active" },
  { initials: "VC", name: "Valeria Cruz", company: "AudioCraft Inc", type: "Enterprise", email: "valeria@audiocraft.ai", phone: "+1 (555) 441-9210", orders: 28, joined: "Nov 04, 2023", status: "Active" },
  { initials: "LG", name: "Liam Gallagher", company: "EchoMedia", type: "SMB", email: "liam@echomedia.co", phone: "+44 20 7946 0192", orders: 9, joined: "Jan 18, 2024", status: "Active" },
  { initials: "CS", name: "Camila Soto", company: "VoiceFlow Corp", type: "Enterprise", email: "camila@voiceflow.com", phone: "+1 (555) 789-0144", orders: 42, joined: "Feb 29, 2024", status: "Active" },
  { initials: "JM", name: "Julian Mercer", company: "Soundscape AI", type: "SMB", email: "julian@soundscape.ai", phone: "+1 (555) 902-3341", orders: 19, joined: "Mar 15, 2024", status: "Active" },
  { initials: "ER", name: "Elena Rossi", company: "Northstar Audio", type: "Individual", email: "elena@northstar.fm", phone: "+39 02 555 0178", orders: 6, joined: "Apr 02, 2024", status: "Paused" },
]

const filters = ["All customers", "Enterprise", "SMB", "Individual"] as const
type Filter = (typeof filters)[number]

export function CustomersWorkspace() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("All customers")
  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return customers.filter((customer) => {
      const matchesFilter = filter === "All customers" || customer.type === filter
      const searchable = `${customer.name} ${customer.company} ${customer.email}`.toLowerCase()
      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
  }, [filter, query])

  function exportCustomers() {
    const csv = ["Name,Company,Type,Email,Orders,Status", ...filteredCustomers.map((customer) => [customer.name, customer.company, customer.type, customer.email, customer.orders, customer.status].join(","))].join("\\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "orderly-customers.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-10 lg:py-9">
      <header className="flex flex-col gap-5 border-b border-black/[.07] pb-7 xl:flex-row xl:items-end xl:justify-between">
        <div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-black/40">Workspace / Customers</p><h1 className="mt-3 font-display text-4xl tracking-[-.06em] text-neutral-950 sm:text-5xl">Customers</h1><p className="mt-2 max-w-xl text-sm text-black/45">Manage customer relationships, account health and order activity from one place.</p></div>
        <div className="flex flex-wrap gap-2"><button onClick={exportCustomers} className="inline-flex items-center gap-2 rounded-xl border border-black/[.08] bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 transition hover:border-black/20"><ArrowDownToLine size={15} /> Export CSV</button><button className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800"><Plus size={15} /> Add customer</button></div>
      </header>

      <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={Building2} label="Active accounts" value="1,284" detail="98.2% monthly retention" trend="+8.4%" /><Metric icon={Check} label="Enterprise tiers" value="142" detail="11% of customer volume" /><Metric icon={TrendingUp} label="Order volume" value="8,920" detail="Last 30 days" trend="+14.1%" /><Metric icon={Zap} label="Network health" value="99.8ms" detail="Average node latency" pulse /></section>

      <section className="mt-7 overflow-hidden rounded-2xl border border-black/[.07] bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-black/[.07] p-4 lg:flex-row lg:items-center lg:justify-between"><label className="relative flex min-w-0 flex-1 items-center lg:max-w-xl"><Search size={15} className="pointer-events-none absolute left-3 text-black/35" /><span className="sr-only">Search customers</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email or company..." className="h-10 w-full rounded-xl border border-black/[.08] bg-[#fdfbfb] pl-9 pr-3 text-sm outline-none transition placeholder:text-black/30 focus:border-black/30" /></label><div className="flex gap-1 overflow-x-auto">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${filter === item ? "bg-black text-white" : "text-black/45 hover:bg-black/[.04]"}`}>{item}</button>)}</div></div><div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left"><thead className="bg-[#fcfafa]"><tr className="text-[10px] font-semibold uppercase tracking-[.14em] text-black/35"><th className="px-5 py-3">Customer & company</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Orders</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3">Status</th><th className="px-5 py-3 text-right"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-black/[.06]">{filteredCustomers.map((customer) => <tr key={customer.email} className="group transition hover:bg-[#fdfafa]"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ebe7e6] text-xs font-semibold text-neutral-900">{customer.initials}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-neutral-900">{customer.name}</p><p className="truncate text-xs text-black/45">{customer.company}</p></div></div></td><td className="px-4 py-4"><span className="rounded-full bg-[#f1eded] px-2.5 py-1 text-[11px] font-medium text-neutral-700">{customer.type}</span></td><td className="px-4 py-4 text-sm text-black/55">{customer.email}</td><td className="px-4 py-4 text-sm text-black/55">{customer.phone}</td><td className="px-4 py-4 text-sm font-semibold text-neutral-900">{customer.orders}</td><td className="px-4 py-4 text-xs text-black/45">{customer.joined}</td><td className="px-4 py-4"><StatusDot label={customer.status} status={customer.status === "Active" ? "success" : "warning"} /></td><td className="px-5 py-4 text-right"><div className="inline-flex items-center gap-1"><button className="grid size-8 place-items-center rounded-lg text-black/35 transition hover:bg-black/[.05] hover:text-black" aria-label={`Edit ${customer.name}`}><Pencil size={14} /></button><button className="grid size-8 place-items-center rounded-lg text-black/35 transition hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${customer.name}`}><Trash2 size={14} /></button><button className="grid size-8 place-items-center rounded-lg text-black/35 transition hover:bg-black/[.05] hover:text-black" aria-label={`More options for ${customer.name}`}><Ellipsis size={15} /></button></div></td></tr>)}</tbody></table></div>{filteredCustomers.length === 0 && <div className="p-12 text-center text-sm text-black/45">No customers match your search.</div>}<footer className="flex items-center justify-between border-t border-black/[.07] px-5 py-4 text-xs text-black/40"><span>Showing {filteredCustomers.length} of {customers.length} customers</span><span className="hidden sm:inline">Mock data · ready for API integration</span></footer></section>
    </main>
  )
}

function Metric({ icon: Icon, label, value, detail, trend, pulse }: { icon: typeof Users; label: string; value: string; detail: string; trend?: string; pulse?: boolean }) {
  return <div className="rounded-2xl border border-black/[.06] bg-white p-5"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-black/40">{label}</p><Icon size={18} className="text-black/35" /></div><div className="mt-4 flex items-center gap-2">{pulse && <span className="size-2.5 animate-pulse rounded-full bg-black" />}<p className="font-display text-3xl tracking-[-.05em]">{value}</p>{trend && <span className="text-xs font-medium text-emerald-600">{trend}</span>}</div><p className="mt-2 text-xs text-black/45">{detail}</p></div>
}

export const customersForLoading = customers
