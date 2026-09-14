import type { Workspace } from '@/lib/types'
import { apiFetch } from './client'
import { endpoints } from './endpoints'

export const workspacesApi = {
  list: () => {
    return apiFetch<Workspace[]>(endpoints.workspaces)
  },
  
  create: (name: string) => {
    return apiFetch<Workspace>(endpoints.workspaces, {
      method: "POST",
      body: JSON.stringify({ name }),
    })
  },
}