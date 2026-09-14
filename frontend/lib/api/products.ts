import type { Product, CreateProductPayload, UpdateProductPayload } from '@/lib/types'
import { apiFetch, buildQuery } from './client'
import { endpoints } from './endpoints'

export const productsApi = {
  list: (params?: { workspaceId?: number; search?: string }) => {
    return apiFetch<Product[]>(`${endpoints.products}${buildQuery(params)}`)
  },
  
  listSellable: (params?: { workspaceId?: number; search?: string }) => {
    return apiFetch<Product[]>(`${endpoints.products}/sellable${buildQuery(params)}`)
  },
  
  get: (id: number | string, workspaceId?: number) => {
    return apiFetch<Product>(`${endpoints.products}/${id}${buildQuery({ workspaceId })}`)
  },
  
  create: (data: CreateProductPayload, workspaceId?: number) => {
    return apiFetch<Product>(`${endpoints.products}${buildQuery({ workspaceId })}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  update: (id: number | string, data: UpdateProductPayload, workspaceId?: number) => {
    return apiFetch<Product>(`${endpoints.products}/${id}${buildQuery({ workspaceId })}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },
  
  remove: (id: number | string, workspaceId?: number) => {
    return apiFetch<{ success: boolean }>(`${endpoints.products}/${id}${buildQuery({ workspaceId })}`, {
      method: 'DELETE',
    })
  },
}