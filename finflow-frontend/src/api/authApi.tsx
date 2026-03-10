import type { LoginRequest } from '../types/LoginRequest'
import type { RegisterRequest } from '../types/RegisterRequest'
import type { MeResponse } from '../types/core/Me'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

export type AuthFetchOptions = RequestInit & {
  /** CSRF token to send (use when cross-origin so cookie is not readable by JS). Prefer token from getCsrf() response body. */
  csrfToken?: string | null
}

/** Authenticated fetch: credentials, optional CSRF. Use for all /api/v1/* calls after login. */
export async function authFetch(path: string, options: AuthFetchOptions = {}) {
  const { csrfToken: explicitCsrfToken, ...init } = options
  const method = init.method?.toUpperCase() ?? 'GET'
  const headers = new Headers(init.headers ?? {})

  if (!headers.has('Content-Type') && method !== 'GET') {
    headers.set('Content-Type', 'application/json')
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = explicitCsrfToken !== undefined ? explicitCsrfToken : getCookie('XSRF-TOKEN')
    if (csrfToken) {
      headers.set('X-XSRF-TOKEN', csrfToken)
    }
  }

  if (!API_BASE_URL) {
    throw new Error(
      'VITE_API_BASE_URL is not set. Create a .env file with VITE_API_BASE_URL=http://localhost:8080 (or your backend URL), then restart the dev server.'
    )
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  })
  return response
}

export async function parseJsonOrThrow(res: Response): Promise<unknown> {
  const text = await res.text()
  const trimmed = text.trim().toLowerCase()
  if (trimmed.startsWith('<!') || trimmed.startsWith('<html')) {
    throw new Error(
      'Backend returned HTML instead of JSON. Is VITE_API_BASE_URL in .env set to your backend URL (e.g. http://localhost:8080)? Restart the dev server after changing .env.'
    )
  }
  try {
    return text ? JSON.parse(text) : null
  } catch {
    throw new Error(text || res.statusText || 'Invalid response')
  }
}

/** Fetch CSRF token so the cookie is set for subsequent mutating requests. */
export async function getCsrf(): Promise<{ token: string; headerName: string }> {
  const res = await authFetch('/api/v1/auth/csrf')
  if (!res.ok) throw new Error('Failed to get CSRF token')
  return parseJsonOrThrow(res) as Promise<{ token: string; headerName: string }>
}

/** Local login. Uses CSRF token from getCsrf() so it works when frontend and backend are different origins. */
export async function login(body: LoginRequest): Promise<void> {
  const { token } = await getCsrf()
  const res = await authFetch('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
    csrfToken: token,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText || 'Login failed')
  }
}

/** Local register. Uses CSRF token from getCsrf() for cross-origin. */
export async function register(body: RegisterRequest): Promise<void> {
  const { token } = await getCsrf()
  const res = await authFetch('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
    csrfToken: token,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText || 'Registration failed')
  }
}

export async function logout(): Promise<void> {
  const { token } = await getCsrf()
  const res = await authFetch('/api/v1/auth/logout', { method: 'POST', csrfToken: token })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText || 'Logout failed')
  }
}

export async function me(): Promise<MeResponse> {
  const res = await authFetch('/api/v1/auth/me')
  if (!res.ok) throw new Error('Not authenticated')
  return parseJsonOrThrow(res) as Promise<MeResponse>
}
