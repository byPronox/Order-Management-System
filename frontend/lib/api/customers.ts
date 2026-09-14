import type { Customer, CreateCustomerPayload } from '@/lib/types'
import { apiFetch, buildQuery } from './client'
import { endpoints } from './endpoints'

export const customersApi = {
  list: (params?: { workspaceId?: number; search?: string }) => {
    return apiFetch<Customer[]>(`${endpoints.customers}${buildQuery(params)}`);
  },
  
  get: (id: string, workspaceId?: number) => {
    return apiFetch<Customer>(`${endpoints.customers}/${id}${buildQuery({ workspaceId })}`);
  },
  
  create: (data: CreateCustomerPayload, workspaceId?: number) => {
    return apiFetch<Customer>(`${endpoints.customers}${buildQuery({ workspaceId })}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: (id: string, data: Partial<CreateCustomerPayload>, workspaceId?: number) => {
    return apiFetch<Customer>(`${endpoints.customers}/${id}${buildQuery({ workspaceId })}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  remove: (id: string, workspaceId?: number) => {
    return apiFetch<{ success: boolean }>(`${endpoints.customers}/${id}${buildQuery({ workspaceId })}`, {
      method: 'DELETE',
    });
  },
}