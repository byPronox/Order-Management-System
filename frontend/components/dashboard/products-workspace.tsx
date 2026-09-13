"use client"

import { useEffect, useState } from "react"
import { Download, Plus, Search } from "lucide-react"
import { productsApi } from "@/lib/api/products"
import { formatCurrency } from "@/lib/utils"
import type { Product, ProductStatus } from "@/lib/types"
import { useWorkspaceId } from "@/lib/hooks/use-workspace-id"

const STATUS_TABS: { label: string; value: ProductStatus | "all" }[] = [
  { label: "All products", value: "all" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Out of stock", value: "out_of_stock" },
]

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  draft: "bg-amber-50 text-amber-700",
  out_of_stock: "bg-red-50 text-red-600",
}

const STATUS_DOT: Record<string, string> = {
  active: "bg-emerald-500",
  draft: "bg-amber-400",
  out_of_stock: "bg-red-500",
}

function statusLabel(status: ProductStatus) {
  return status.replace(/_/g, " ")
}

export function ProductsWorkspace() {
  const workspaceId = useWorkspaceId()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [activeTab, setActiveTab] = useState<ProductStatus | "all">("all")
  const [search, setSearch] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      productsApi
        .list({ workspaceId, search: search || undefined })
        .then(setProducts)
        .catch(() => setError("Could not load products."))
    }, 300)

    return () => clearTimeout(timeout)
  }, [workspaceId, search])

  const filteredProducts = products?.filter((p) => activeTab === "all" || p.status === activeTab) ?? null
  const lowStockCount = products?.filter((p) => p.stock !== null && p.stock !== undefined && p.stock < 10).length ?? 0
  const activeCount = products?.filter((p) => p.status === "active").length ?? 0

  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-neutral-400">
          Workspace / <span className="text-neutral-900">Products</span>
        </p>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl tracking-[-.04em]">Products</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">
              Manage your catalog, pricing and availability across every order channel.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2.5 text-xs font-semibold">
              <Download size={14} /> Export CSV
            </button>
            <button type="button" className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-semibold text-white">
              <Plus size={14} /> Add product
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Active products</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">{activeCount.toLocaleString()}</p>
            <p className="mt-2 text-xs text-neutral-500">out of {products?.length ?? 0} total</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Total catalog</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">{products?.length.toLocaleString() ?? "—"}</p>
            <p className="mt-2 text-xs text-neutral-500">this workspace</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Stock alerts</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">{lowStockCount}</p>
            <p className="mt-2 text-xs text-amber-600">below 10 units</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Avg. price</p>
            <p className="mt-4 font-display text-4xl tracking-[-.03em]">
              {formatCurrency(
                products?.length ? products.reduce((sum, p) => sum + Number(p.price), 0) / products.length : 0
              )}
            </p>
            <p className="mt-2 text-xs text-neutral-500">across catalog</p>
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
                  className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
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
                placeholder="Search by SKU, name or category..."
                className="w-64 rounded-full border border-black/10 bg-neutral-50 py-2 pl-9 pr-4 text-xs outline-none focus:border-black/25"
              />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/6 text-xs uppercase tracking-[.08em] text-neutral-400">
                  <th className="pb-3 font-medium">Product & specification</th>
                  <th className="pb-3 font-medium">SKU</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Availability</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts === null && !error && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-neutral-400">
                      Loading products...
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                )}
                {filteredProducts && filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-neutral-400">
                      No products match your filters.
                    </td>
                  </tr>
                )}
                {filteredProducts?.map((product) => (
                  <tr key={product.id} className="border-b border-black/4 last:border-0">
                    <td className="py-4">
                      <p className="text-xs font-semibold text-neutral-900">{product.name}</p>
                      {product.description && (
                        <p className="mt-0.5 max-w-xs truncate text-[11px] text-neutral-400">{product.description}</p>
                      )}
                    </td>
                    <td className="py-4 font-mono text-xs text-neutral-500">{product.sku || "—"}</td>
                    <td className="py-4 text-xs font-semibold">{formatCurrency(Number(product.price))}</td>
                    <td className="py-4 text-xs text-neutral-500">
                      {product.stock === null || product.stock === undefined
                        ? "Unlimited digital"
                        : `${product.stock} units`}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_BADGE[product.status]}`}>
                        <span className={`size-1.5 rounded-full ${STATUS_DOT[product.status]}`} />
                        {statusLabel(product.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts && (
            <p className="mt-4 text-xs text-neutral-400">
              Showing {filteredProducts.length} of {products?.length ?? 0} catalog items
            </p>
          )}
        </div>
      </div>
    </div>
  )
}