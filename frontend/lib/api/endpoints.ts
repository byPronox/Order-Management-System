import type { Customer, Order, Product, Workspace } from '@/lib/types'
import { apiFetch, endpoints } from './client'

export const customersApi = { list: () => apiFetch<Customer[]>(endpoints.customers), get: (id: string) => apiFetch<Customer>(`${endpoints.customers}/${id}`), create: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => apiFetch<Customer>(endpoints.customers, { method: 'POST', body: JSON.stringify(data) }) }
export const productsApi = { list: () => apiFetch<Product[]>(endpoints.products), get: (id: string) => apiFetch<Product>(`${endpoints.products}/${id}`), create: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => apiFetch<Product>(endpoints.products, { method: 'POST', body: JSON.stringify(data) }) }
export const ordersApi = { list: () => apiFetch<Order[]>(endpoints.orders), get: (id: string) => apiFetch<Order>(`${endpoints.orders}/${id}`), create: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => apiFetch<Order>(endpoints.orders, { method: 'POST', body: JSON.stringify(data) }) }
export const workspacesApi = { list: () => apiFetch<Workspace[]>(endpoints.workspaces) }