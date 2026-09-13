import type { Customer } from '@/lib/types'
import { apiFetch, endpoints } from './client'

export const customersApi = {
  list: (params: { workspaceId?: number; search?: string }) => {
    const query = new URLSearchParams()
    if (params.workspaceId) query.set('workspaceId', String(params.workspaceId))
    if (params.search) query.set('search', params.search)
    const qs = query.toString()
    return apiFetch<Customer[]>(`${endpoints.customers}${qs ? `?${qs}` : ''}`)
  },
  get: (id: string, workspaceId?: number) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : ''
    return apiFetch<Customer>(`${endpoints.customers}/${id}${query}`)
  },
}