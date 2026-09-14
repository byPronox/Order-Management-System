import type { Order, OrderStatus, OrderSummary } from '@/lib/types'
import { apiFetch, buildQuery } from './client'
import { endpoints } from './endpoints'

export const ordersApi = {
  list: (params?: { workspaceId?: number; status?: OrderStatus; search?: string; page?: number; limit?: number }) => {
    return apiFetch<Order[]>(`${endpoints.orders}${buildQuery(params)}`)
  },
  
  get: (id: number | string, workspaceId?: number) => {
    return apiFetch<Order>(`${endpoints.orders}/${id}${buildQuery({ workspaceId })}`)
  },
  
  getSummary: (workspaceId?: number) => {
    return apiFetch<OrderSummary>(`${endpoints.ordersSummary}${buildQuery({ workspaceId })}`)
  },
  
  create: (data: { customerId: number; items: { productId: number; quantity: number }[] }, workspaceId?: number) => {
    return apiFetch<Order>(`${endpoints.orders}${buildQuery({ workspaceId })}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  updateStatus: (id: number | string, status: OrderStatus, workspaceId?: number) => {
    return apiFetch<Order>(`${endpoints.orders}/${id}/status${buildQuery({ workspaceId })}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
}