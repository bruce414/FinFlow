import { authFetch, parseJsonOrThrow } from './authApi'
import type { DashboardResponse } from '../types/core/dashboard/DashboardResponse'

const DASHBOARD_PATH = '/api/v1/dashboard'

function handleAuthError(res: Response): void {
  if (res.status === 401 || res.status === 403) {
    throw new Error('Session expired or invalid. Please log in again.')
  }
}

/** GET /api/v1/dashboard – dashboard data for current user */
export async function getDashboard(): Promise<DashboardResponse> {
  const res = await authFetch(DASHBOARD_PATH)
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  return parseJsonOrThrow(res) as Promise<DashboardResponse>
}
