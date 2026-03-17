import { getCsrf, authFetch, parseJsonOrThrow } from './authApi'
import type { UserDetails } from '../types/core/UserDetails'
import type { MePatchRequest } from '../types/core/MePatchRequest'

const ME_PATH = '/api/v1/me'

function handleMeResponse(res: Response): Promise<UserDetails> {
  if (res.status === 401 || res.status === 403) {
    throw new Error('Session expired or invalid. Please log in again.')
  }
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  return parseJsonOrThrow(res) as Promise<UserDetails>
}

/** GET /api/v1/me – current user details */
export async function getMe(): Promise<UserDetails> {
  const res = await authFetch(ME_PATH)
  return handleMeResponse(res)
}

/** PATCH /api/v1/me – update current user (partial). Uses CSRF token from getCsrf() body (required when frontend and backend are different origins). */
export async function patchMe(body: MePatchRequest): Promise<UserDetails> {
  const { token } = await getCsrf()
  const res = await authFetch(ME_PATH, {
    method: 'PATCH',
    body: JSON.stringify(body),
    csrfToken: token,
  })
  return handleMeResponse(res)
}

/** DELETE /api/v1/me – deactivate current user. Uses CSRF token from getCsrf() body. */
export async function deleteMe(): Promise<void> {
  const { token } = await getCsrf()
  const res = await authFetch(ME_PATH, { method: 'DELETE', csrfToken: token })
  if (res.status === 401 || res.status === 403) {
    throw new Error('Session expired or invalid. Please log in again.')
  }
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
}
