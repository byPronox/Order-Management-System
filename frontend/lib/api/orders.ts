import type { Order, OrderStatus, OrderSummary } from '@/lib/types'
import { apiFetch, endpoints } from './client'

export const ordersApi = {
  list: (params: { workspaceId?: number; status?: OrderStatus; search?: string }) => {
    const query = new URLSearchParams()
    if (params.workspaceId) query.set('workspaceId', String(params.workspaceId))
    if (params.status) query.set('status', params.status)
    if (params.search) query.set('search', params.search)
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
}