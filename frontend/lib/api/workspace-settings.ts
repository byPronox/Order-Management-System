import { apiFetch, endpoints } from './client'

export interface WorkspaceSettingsData {
  workspaceId: number
  workspaceName: string
  defaultTimezone: string
  defaultCurrency: string
  defaultOrderStatus: string
  requireOrderReview: boolean
  allowPartialFulfillment: boolean
  notifyCustomersOnStatus: boolean
}

export const workspaceSettingsApi = {
  get: (workspaceId: number) =>
    apiFetch<WorkspaceSettingsData>(`${endpoints.workspaceSettings}?workspaceId=${workspaceId}`),
}