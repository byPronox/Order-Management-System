import type { Workspace } from '@/lib/types'
import { apiFetch, endpoints } from './client'

export const workspacesApi = {
  list: () => apiFetch<Workspace[]>(endpoints.workspaces),
}