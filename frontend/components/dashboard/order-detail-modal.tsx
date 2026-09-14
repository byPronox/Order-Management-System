"use client"

import { useEffect, useState } from "react"
import { X, Check, Ban, Package } from "lucide-react"
import { ordersApi } from "@/lib/api/orders"
import { formatCurrency, getInitials } from "@/lib/utils"
import type { Order, OrderStatus } from "@/lib/types"

interface OrderDetailModalProps {
  orderId: string
  workspaceId?: number
  onClose: () => void
  onUpdated: () => void
}

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

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function OrderDetailModal({ orderId, workspaceId, onClose, onUpdated }: OrderDetailModalProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  function loadOrder() {
    ordersApi
      .get(orderId, workspaceId)
      .then(setOrder)
      .catch(() => setError("Could not load this order."))
  }

  useEffect(() => {
    loadOrder()
  }, [orderId, workspaceId])

  async function handleStatusChange(status: OrderStatus) {
    setUpdating(true)
    setError(null)
    try {
      const updated = await ordersApi.updateStatus(orderId, status, workspaceId)
      setOrder(updated)
      onUpdated()
    } catch {
      setError("Could not update the order status.")
    } finally {
      setUpdating(false)
    }
  }

  const isPending = order?.status === "pending"

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-black/6 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.1em] text-neutral-400">Order details</p>
            <h2 className="mt-1 font-mono text-2xl font-semibold tracking-[-.01em]">
              ORD-{orderId}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-neutral-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!order && !error && (
            <p className="py-10 text-center text-sm text-neutral-400">Loading order...</p>
          )}
          {error && <p className="py-10 text-center text-sm text-red-500">{error}</p>}

          {order && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${STATUS_BADGE[order.status]}`}
                >
                  <span className={`size-1.5 rounded-full ${STATUS_DOT[order.status]}`} />
                  {order.status}
                </span>
                <p className="text-xs text-neutral-400">Created {formatDateTime(order.createdAt)}</p>
              </div>

              {/* Status timeline */}
              <div className="mt-6 flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-black text-white">
                    <Check size={12} />
                  </span>
                  <span className="text-xs font-semibold text-neutral-900">Pending</span>
                </div>
                <div
                  className={`h-px flex-1 ${order.status !== "pending" ? "bg-black" : "bg-neutral-200"}`}
                />
                <div className="flex items-center gap-2">
                  <span
                    className={`grid size-6 place-items-center rounded-full ${
                      order.status === "completed"
                        ? "bg-emerald-500 text-white"
                        : order.status === "cancelled"
                          ? "bg-neutral-200 text-neutral-400"
                          : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {order.status === "cancelled" ? <Ban size={12} /> : <Check size={12} />}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      order.status === "pending" ? "text-neutral-400" : "text-neutral-900"
                    }`}
                  >
                    {order.status === "cancelled" ? "Cancelled" : "Completed"}
                  </span>
                </div>
              </div>

              {/* Customer info */}
              <div className="mt-6 rounded-2xl bg-neutral-50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-neutral-400">Customer</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                    {getInitials(order.customer?.name ?? "??")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{order.customer?.name}</p>
                    <p className="text-xs text-neutral-400">{order.customer?.email}</p>
                  </div>
                </div>
              </div>

              {/* Items table */}
              <div className="mt-6">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.1em] text-neutral-400">
                  Items ({order.items?.length ?? 0})
                </p>
                <div className="overflow-hidden rounded-2xl border border-black/6">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-neutral-50 text-xs uppercase tracking-[.06em] text-neutral-400">
                        <th className="px-4 py-2.5 font-medium">Product</th>
                        <th className="px-4 py-2.5 font-medium">Unit price</th>
                        <th className="px-4 py-2.5 font-medium">Qty</th>
                        <th className="px-4 py-2.5 text-right font-medium">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item) => (
                        <tr key={item.id} className="border-t border-black/4">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <span className="grid size-7 place-items-center rounded-lg bg-neutral-100 text-neutral-400">
                                <Package size={13} />
                              </span>
                              <span className="text-xs font-semibold text-neutral-900">
                                {item.product?.name ?? `Product #${item.productId}`}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-neutral-500">
                            {formatCurrency(Number(item.unitPrice))}
                          </td>
                          <td className="px-4 py-3 text-xs text-neutral-500">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-xs font-semibold">
                            {formatCurrency(Number(item.subtotal))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-black px-5 py-4 text-white">
                <span className="text-xs font-semibold uppercase tracking-[.1em] text-white/60">Total amount</span>
                <span className="font-display text-2xl">{formatCurrency(Number(order.totalAmount))}</span>
              </div>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            </>
          )}
        </div>

        {order && (
          <div className="flex items-center justify-end gap-2 border-t border-black/6 px-6 py-4">
            {isPending ? (
              <>
                <button
                  type="button"
                  onClick={() => handleStatusChange("cancelled" as OrderStatus)}
                  disabled={updating}
                  className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-40"
                >
                  <Ban size={14} />
                  Cancel order
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("completed" as OrderStatus)}
                  disabled={updating}
                  className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-black/85 disabled:opacity-40"
                >
                  <Check size={14} />
                  {updating ? "Updating..." : "Mark as completed"}
                </button>
              </>
            ) : (
              <p className="text-xs text-neutral-400">
                This order is {order.status} and cannot be modified further.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}