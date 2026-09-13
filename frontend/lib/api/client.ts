const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } })
  if (!response.ok) throw new Error(`API request failed: ${response.status}`)
  return response.json() as Promise<T>
}

export const endpoints = {
  customers: '/customers',
  products: '/products',
  orders: '/orders',
  ordersSummary: '/orders/summary',
  auth: '/auth',
  workspaces: '/workspaces',
  workspaceSettings: '/workspace-settings',
  dashboard: '/dashboard/summary',
} as const