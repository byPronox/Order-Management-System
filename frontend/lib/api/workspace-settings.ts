import type { WorkspaceSettingsData, UpdateWorkspaceSettingsPayload } from '@/lib/types'
import { apiFetch, buildQuery } from './client'
import { endpoints } from './endpoints'

export const workspaceSettingsApi = {
  get: (workspaceId: number) => {
    return apiFetch<WorkspaceSettingsData>(`${endpoints.workspaceSettings}${buildQuery({ workspaceId })}`)
  },
  
  update: (workspaceId: number, data: UpdateWorkspaceSettingsPayload) => {
    return apiFetch<WorkspaceSettingsData>(`${endpoints.workspaceSettings}${buildQuery({ workspaceId })}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },
}