import type { Order, OrderStatus, OrderSummary } from '@/lib/types'
import { apiFetch, endpoints } from './client'

export const ordersApi = {
  list: (params: { workspaceId?: number; status?: OrderStatus; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams()
    if (params.workspaceId) query.set('workspaceId', String(params.workspaceId))
    if (params.status) query.set('status', params.status)
    if (params.search) query.set('search', params.search)
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return apiFetch<Order[]>(`${endpoints.orders}${qs ? `?${qs}` : ''}`)
  },
  get: (id: string, workspaceId?: number) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : ''
    return apiFetch<Order>(`${endpoints.orders}/${id}${query}`)
  },
  getSummary: (workspaceId?: number) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : ''
    return apiFetch<OrderSummary>(`${endpoints.ordersSummary}${query}`)
  },
  create: (data: { customerId: number; items: { productId: number; quantity: number }[] }, workspaceId?: number) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : ''
    return apiFetch<Order>(`${endpoints.orders}${query}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  updateStatus: (id: string, status: OrderStatus, workspaceId?: number) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : ''
    return apiFetch<Order>(`${endpoints.orders}/${id}/status${query}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
}