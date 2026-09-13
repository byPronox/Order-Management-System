import type { Workspace } from '@/lib/types'
import { apiFetch, endpoints } from './client'

export const workspacesApi = {
  list: () => apiFetch<Workspace[]>(endpoints.workspaces),
  create: (name: string) =>
    apiFetch<Workspace>(endpoints.workspaces, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
}