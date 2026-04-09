import { authFetch, parseJsonOrThrow } from './authApi'
import type { CategoryItem } from '../types/core/category/CategoryItem'

const BASE = '/api/v1/me/categories'

function handleAuthError(res: Response): void {
  if (res.status === 401 || res.status === 403) {
    throw new Error('Session expired or invalid. Please log in again.')
  }
}

export async function getCategories(): Promise<CategoryItem[]> {
  const res = await authFetch(BASE)
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  const data = await parseJsonOrThrow(res)
  return Array.isArray(data) ? (data as CategoryItem[]) : []
}
