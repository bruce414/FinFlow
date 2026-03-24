import { authFetch, parseJsonOrThrow } from './authApi'
import type { NotificationItem } from '../types/core/notification/NotificationItem'

const BASE = '/api/v1/me/notifications'

function handleAuthError(res: Response): void {
  if (res.status === 401 || res.status === 403) {
    throw new Error('Session expired or invalid. Please log in again.')
  }
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const res = await authFetch(BASE)
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  const data = await parseJsonOrThrow(res)
  return Array.isArray(data) ? (data as NotificationItem[]) : []
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const res = await authFetch(`${BASE}/${encodeURIComponent(notificationId)}/read`, {
    method: 'PATCH',
  })
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
}
