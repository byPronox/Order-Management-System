import type { DashboardSummary } from '@/lib/types'
import { apiFetch, buildQuery } from './client'
import { endpoints } from './endpoints'

export const dashboardApi = {
  getSummary: (workspaceId?: number) => {
    return apiFetch<DashboardSummary>(`${endpoints.dashboard}${buildQuery({ workspaceId })}`)
  },
}