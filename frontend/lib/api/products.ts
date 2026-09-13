import type { Product, CreateProductPayload } from '@/lib/types'
import { apiFetch, endpoints } from './client'

export const productsApi = {
  list: (params: { workspaceId?: number; search?: string }) => {
    const query = new URLSearchParams()
    if (params.workspaceId) query.set('workspaceId', String(params.workspaceId))
    if (params.search) query.set('search', params.search)
    const qs = query.toString()
    return apiFetch<Product[]>(`${endpoints.products}${qs ? `?${qs}` : ''}`)
  },
  get: (id: string, workspaceId?: number) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : ''
    return apiFetch<Product>(`${endpoints.products}/${id}${query}`)
  },
  create: (data: CreateProductPayload, workspaceId?: number) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : ''
    return apiFetch<Product>(`${endpoints.products}${query}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: (id: string, data: Partial<CreateProductPayload>, workspaceId?: number) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : ''
    return apiFetch<Product>(`${endpoints.products}/${id}${query}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },
  remove: (id: string, workspaceId?: number) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : ''
    return apiFetch<{ success: boolean }>(`${endpoints.products}/${id}${query}`, {
      method: 'DELETE',
    })
  },
}