import { getCsrf, authFetch, parseJsonOrThrow } from './authApi'
import type { CategoryResponse } from '../types/core/category/CategoryResponse'

const CATEGORIES_PATH = '/api/v1/me/categories'

function handleAuthError(res: Response): void {
  if (res.status === 401 || res.status === 403) {
    throw new Error('Session expired or invalid. Please log in again.')
  }
}

/** GET /api/v1/me/categories – list categories (backend requires CSRF header on this GET). */
export async function getCategories(): Promise<CategoryResponse[]> {
  const { token } = await getCsrf()
  const res = await authFetch(CATEGORIES_PATH, {
    headers: { 'X-XSRF-TOKEN': token },
  })
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  return parseJsonOrThrow(res) as Promise<CategoryResponse[]>
}
