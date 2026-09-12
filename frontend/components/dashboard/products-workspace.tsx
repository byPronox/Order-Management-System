"use client"

import { useMemo, useState } from "react"
import { Archive, ArrowDownToLine, Check, Copy, Edit3, HardDrive, MoreHorizontal, Package, Plus, Search, Server, Sparkles, Trash2, TrendingUp } from "lucide-react"
import { StatusDot } from "@/components/ui/status"
import { formatCurrency } from "@/lib/utils"
import { workspaceSettings } from "@/lib/mock-data/workspace-settings"

import type { ProductStatus } from "@/lib/types"

const products: Array<{ name: string; description: string; sku: string; category: string; price: string; cadence: string; availability: string; status: ProductStatus; icon: typeof Sparkles }> = [
  { name: "Aura-TTS Ultra v2", description: "Annual license for expressive neural voice synthesis.", sku: "AUR-TTS-002", category: "Voice models", price: formatCurrency(1200, workspaceSettings.defaultCurrency), cadence: "/ year", availability: "Unlimited digital", status: "active", icon: Sparkles },
  { name: "Neural Speech SDK Pro", description: "Real-time transcription and speech synthesis pipeline.", sku: "AUR-SDK-104", category: "Audio SDKs", price: formatCurrency(450, workspaceSettings.defaultCurrency), cadence: "/ month", availability: "Unlimited digital", status: "active", icon: Server },
  { name: "Auralis Edge Processor v1", description: "Dedicated neural compute module for low-latency deployments.", sku: "AUR-HW-880", category: "Hardware", price: formatCurrency(2850, workspaceSettings.defaultCurrency), cadence: "/ unit", availability: "34 units", status: "active", icon: HardDrive },
  { name: "Voice Cloning Studio Tier 3", description: "Voice identity engine with three-second sample capture.", sku: "AUR-VCS-012", category: "Add-ons", price: formatCurrency(900, workspaceSettings.defaultCurrency), cadence: "/ license", availability: "Unlimited digital", status: "draft", icon: Archive },
  { name: "Auralis Acoustic Shield", description: "Precision acoustic treatment kit for studio environments.", sku: "AUR-ACS-220", category: "Hardware", price: formatCurrency(680, workspaceSettings.defaultCurrency), cadence: "/ kit", availability: "8 units", status: "out_of_stock", icon: Package },
]

const categories = ["All products", "Voice models", "Audio SDKs", "Hardware", "Add-ons"] as const
type Category = (typeof categories)[number]

export function ProductsWorkspace() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<Category>("All products")
  const [status, setStatus] = useState("All statuses")
  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = category === "All products" || product.category === category
      const matchesStatus = status === "All statuses" || product.status === status
      const searchable = `${product.name} ${product.sku} ${product.description} ${product.category}`.toLowerCase()
      return matchesCategory && matchesStatus && (!normalized || searchable.includes(normalized))
    })
  }, [category, query, status])

  function exportProducts() {
    const csv = ["Product,SKU,Category,Price,Availability,Status", ...filteredProducts.map((product) => [product.name, product.sku, product.category, product.price, product.availability, product.status].join(","))].join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "orderly-products.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  return <main className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-10 lg:py-9">
    <header className="flex flex-col gap-5 border-b border-black/[.07] pb-7 xl:flex-row xl:items-end xl:justify-between">
      <div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-black/40">Workspace / Products</p><h1 className="mt-3 font-display text-4xl tracking-[-.06em] text-neutral-950 sm:text-5xl">Products</h1><p className="mt-2 max-w-xl text-sm text-black/45">Manage your catalog, pricing and availability across every order channel.</p></div>
      <div className="flex flex-wrap gap-2"><button onClick={exportProducts} className="inline-flex items-center gap-2 rounded-xl border border-black/[.08] bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 transition hover:border-black/20"><ArrowDownToLine size={15} /> Export CSV</button><button className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800"><Plus size={15} /> Add product</button></div>
    </header>
    <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={Sparkles} label="Active models" value="42" detail="99.98% uptime" progress="82%" /><Metric icon={HardDrive} label="Hardware deployed" value="1,248" detail="34 units in stock" progress="64%" /><Metric icon={TrendingUp} label="License MRR" value={formatCurrency(184200, workspaceSettings.defaultCurrency)} detail="+12.4% vs last month" progress="91%" /><Metric icon={Archive} label="Stock alerts" value="2 SKU" detail="Reorder recommended" progress="35%" alert /></section>
    <section className="mt-7 overflow-hidden rounded-2xl border border-black/[.07] bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-black/[.07] p-4 lg:flex-row lg:items-center lg:justify-between"><label className="relative flex min-w-0 flex-1 items-center lg:max-w-xl"><Search size={15} className="pointer-events-none absolute left-3 text-black/35" /><span className="sr-only">Search products</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by SKU, name or category..." className="h-10 w-full rounded-xl border border-black/[.08] bg-[#fdfbfb] pl-9 pr-3 text-sm outline-none transition placeholder:text-black/30 focus:border-black/30" /></label><div className="flex flex-wrap gap-2"><div className="flex max-w-full gap-1 overflow-x-auto">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${category === item ? "bg-black text-white" : "text-black/45 hover:bg-black/[.04]"}`}>{item}</button>)}</div><select aria-label="Filter products by status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-black/[.08] bg-white px-3 py-2 text-xs font-semibold text-black/60 outline-none"><option>All statuses</option><option>Active</option><option>Draft</option><option>Out of stock</option></select></div></div><div className="overflow-x-auto"><table className="w-full min-w-[940px] text-left"><thead className="bg-[#fcfafa]"><tr className="text-[10px] font-semibold uppercase tracking-[.14em] text-black/35"><th className="px-5 py-3">Product & specification</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Base price</th><th className="px-4 py-3">Availability</th><th className="px-4 py-3">Status</th><th className="px-5 py-3 text-right"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-black/[.06]">{filteredProducts.map((product) => <ProductRow key={product.sku} product={product} />)}</tbody></table>{filteredProducts.length === 0 && <div className="p-12 text-center text-sm text-black/45">No products match your filters.</div>}</div></section><p className="mt-4 text-xs text-black/35">Showing {filteredProducts.length} of {products.length} catalog items</p>
  </main>
}

function ProductRow({ product }: { product: (typeof products)[number] }) { const Icon = product.icon; return <tr className="group transition hover:bg-[#fdfafa]"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#ebe7e6] text-neutral-900 transition group-hover:scale-105"><Icon size={20} strokeWidth={1.7} /></div><div className="min-w-0"><p className="font-semibold text-neutral-900">{product.name}</p><p className="mt-1 max-w-sm truncate text-xs text-black/45">{product.description}</p></div></div></td><td className="px-4 py-4"><code className="rounded-md bg-[#f1eded] px-2 py-1 text-[11px] font-medium text-black/65">{product.sku}</code></td><td className="px-4 py-4 text-sm font-semibold text-neutral-900">{product.price}<span className="ml-1 text-xs font-normal text-black/40">{product.cadence}</span></td><td className="px-4 py-4"><div className="flex items-center gap-2 text-xs font-medium text-black/65"><span className={`size-2 rounded-full ${product.status === "out_of_stock" ? "bg-red-500" : "bg-black"}`} />{product.availability}</div></td><td className="px-4 py-4"><StatusDot label={product.status === "active" ? "Active" : product.status === "draft" ? "Draft" : "Out of stock"} status={product.status === "active" ? "success" : product.status === "out_of_stock" ? "danger" : "neutral"} /></td><td className="px-5 py-4 text-right"><div className="inline-flex items-center gap-1 opacity-70 transition group-hover:opacity-100"><button className="rounded-lg p-2 text-black/40 transition hover:bg-black/[.05] hover:text-black" aria-label={`Edit ${product.name}`}><Edit3 size={15} /></button><button className="rounded-lg p-2 text-black/40 transition hover:bg-black/[.05] hover:text-black" aria-label={`Duplicate ${product.name}`}><Copy size={15} /></button><button className="rounded-lg p-2 text-black/40 transition hover:bg-black/[.05] hover:text-black" aria-label={`More actions for ${product.name}`}><MoreHorizontal size={15} /></button></div></td></tr> }

function Metric({ icon: Icon, label, value, detail, progress, alert }: { icon: typeof Package; label: string; value: string; detail: string; progress: string; alert?: boolean }) { return <div className="rounded-2xl border border-black/[.06] bg-white p-5"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-black/40">{label}</p><Icon size={18} className="text-black/35" /></div><div className="mt-4 flex items-baseline justify-between gap-2"><p className={`font-display text-3xl tracking-[-.05em] ${alert ? "text-red-600" : "text-neutral-950"}`}>{value}</p><span className={`text-[11px] font-medium ${alert ? "text-red-600" : "text-black/45"}`}>{detail}</span></div><div className="mt-4 h-1 overflow-hidden rounded-full bg-[#ebe7e6]"><div className={`h-full rounded-full ${alert ? "bg-red-500" : "bg-black"}`} style={{ width: progress }} /></div></div> }

export const productsForLoading = products
