"use client"

import { useEffect, useState } from "react"
import { X, Search, Plus, Minus, Trash2 } from "lucide-react"
import { customersApi } from "@/lib/api/customers"
import { productsApi } from "@/lib/api/products"
import { ordersApi } from "@/lib/api/orders"
import { formatCurrency, getInitials } from "@/lib/utils"
import type { Customer, Product } from "@/lib/types"

interface CreateOrderModalProps {
  workspaceId?: number
  onClose: () => void
  onCreated: () => void
}

interface CartLine {
  product: Product
  quantity: number
}

export function CreateOrderModal({ workspaceId, onClose, onCreated }: CreateOrderModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [customerSearch, setCustomerSearch] = useState("")
  const [productSearch, setProductSearch] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [cart, setCart] = useState<CartLine[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    customersApi.list({ workspaceId, search: customerSearch || undefined }).then(setCustomers).catch(() => {})
  }, [workspaceId, customerSearch])

  useEffect(() => {
  productsApi.listSellable({ workspaceId, search: productSearch || undefined }).then(setProducts).catch(() => {})
  }, [workspaceId, productSearch])

  function addProduct(product: Product) {
    setCart((prev) => {
      const existing = prev.find((line) => line.product.id === product.id)
      if (existing) {
        return prev.map((line) =>
          line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  function updateQuantity(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((line) =>
          line.product.id === productId ? { ...line, quantity: line.quantity + delta } : line,
        )
        .filter((line) => line.quantity > 0),
    )
  }

  function removeLine(productId: string) {
    setCart((prev) => prev.filter((line) => line.product.id !== productId))
  }

  const total = cart.reduce((sum, line) => sum + Number(line.product.price) * line.quantity, 0)

  async function handleSubmit() {
    if (!selectedCustomer || cart.length === 0) return
    setSubmitting(true)
    setError(null)

    try {
      await ordersApi.create(
        {
          customerId: Number(selectedCustomer.id),
          items: cart.map((line) => ({ productId: Number(line.product.id), quantity: line.quantity })),
        },
        workspaceId,
      )
      onCreated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-black/6 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">
              Step {step} of 2
            </p>
            <h2 className="mt-1 font-display text-2xl tracking-[-.02em]">
              {step === 1 ? "Select a customer" : "Add products"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-neutral-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 1 && (
            <div>
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search customers by name or email..."
                  className="w-full rounded-full border border-black/10 bg-neutral-50 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-black/25"
                />
              </div>

              <div className="mt-4 space-y-1.5">
                {customers.length === 0 && (
                  <p className="py-8 text-center text-sm text-neutral-400">No customers found.</p>
                )}
                {customers.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => setSelectedCustomer(customer)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      selectedCustomer?.id === customer.id
                        ? "border-black bg-neutral-50"
                        : "border-black/8 hover:bg-neutral-50"
                    }`}
                  >
                    <span className="grid size-9 place-items-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                      {getInitials(customer.name)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{customer.name}</p>
                      <p className="text-xs text-neutral-400">{customer.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6 sm:grid-cols-[1.3fr_1fr]">
              <div>
                <div className="relative">
                  <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-full border border-black/10 bg-neutral-50 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-black/25"
                  />
                </div>

                <div className="mt-4 max-h-80 space-y-1.5 overflow-y-auto pr-1">
                  {products.length === 0 && (
                    <p className="py-8 text-center text-sm text-neutral-400">No products found.</p>
                  )}
                  {products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProduct(product)}
                      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-black/8 p-3 text-left transition hover:bg-neutral-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{product.name}</p>
                        <p className="text-xs text-neutral-400">
                          {formatCurrency(Number(product.price))}
                          {product.stock !== null && product.stock !== undefined && (
                            <span className="ml-2 text-neutral-400">· {product.stock} in stock</span>
                          )}
                        </p>
                      </div>
                      <Plus size={16} className="text-neutral-400" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Order summary</p>

                <div className="mt-3 space-y-3">
                  {cart.length === 0 && (
                    <p className="py-6 text-center text-xs text-neutral-400">No products added yet.</p>
                  )}
                  {cart.map((line) => (
                    <div key={line.product.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-neutral-900">{line.product.name}</p>
                        <p className="text-[11px] text-neutral-400">{formatCurrency(Number(line.product.price))} each</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.product.id, -1)}
                          className="grid size-6 place-items-center rounded-full bg-white text-neutral-500 hover:bg-neutral-200"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.product.id, 1)}
                          className="grid size-6 place-items-center rounded-full bg-white text-neutral-500 hover:bg-neutral-200"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeLine(line.product.id)}
                          className="grid size-6 place-items-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-black/8 pt-3">
                  <span className="text-xs font-semibold text-neutral-500">Total</span>
                  <span className="font-display text-xl">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex items-center justify-between border-t border-black/6 px-6 py-4">
          <button
            type="button"
            onClick={() => (step === 2 ? setStep(1) : onClose())}
            className="rounded-full px-4 py-2.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-100"
          >
            {step === 2 ? "Back" : "Cancel"}
          </button>

          {step === 1 ? (
            <button
              type="button"
              disabled={!selectedCustomer}
              onClick={() => setStep(2)}
              className="rounded-full bg-black px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              disabled={cart.length === 0 || submitting}
              onClick={handleSubmit}
              className="rounded-full bg-black px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-40"
            >
              {submitting ? "Creating..." : "Create order"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}