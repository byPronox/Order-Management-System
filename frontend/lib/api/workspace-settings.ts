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

export type UpdateWorkspaceSettingsPayload = Partial<Omit<WorkspaceSettingsData, "workspaceId">>

export const workspaceSettingsApi = {
  get: (workspaceId: number) =>
    apiFetch<WorkspaceSettingsData>(`${endpoints.workspaceSettings}?workspaceId=${workspaceId}`),
  update: (workspaceId: number, data: UpdateWorkspaceSettingsPayload) =>
    apiFetch<WorkspaceSettingsData>(`${endpoints.workspaceSettings}?workspaceId=${workspaceId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
}