import type { DashboardSummary } from '@/lib/types'
import { apiFetch, endpoints } from './client'

export const dashboardApi = {
  getSummary: (workspaceId?: number) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : ''
    return apiFetch<DashboardSummary>(`${endpoints.dashboard}${query}`)
  },
}