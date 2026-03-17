import { getCsrf, authFetch, parseJsonOrThrow } from './authApi'

const ONBOARDING_BASE = '/api/v1/auth/onboarding'

export interface OnboardingStatusResponse {
  authenticated: boolean
  pendingGoogleSignup: boolean
}

export interface CompleteGoogleProfileRequest {
  dateOfBirth: string // YYYY-MM-DD
  timeZone: string
  baseCurrencyCode: string
}

/** GET /api/v1/auth/onboarding/status – requires session (e.g. after Google OAuth redirect). */
export async function getOnboardingStatus(): Promise<OnboardingStatusResponse> {
  const res = await authFetch(`${ONBOARDING_BASE}/status`)
  if (!res.ok) throw new Error('Failed to get onboarding status')
  return parseJsonOrThrow(res) as Promise<OnboardingStatusResponse>
}

/** POST /api/v1/auth/onboarding/complete-profile – complete Google signup with extra fields. */
export async function completeGoogleProfile(body: CompleteGoogleProfileRequest): Promise<void> {
  const { token } = await getCsrf()
  const res = await authFetch(`${ONBOARDING_BASE}/complete-profile`, {
    method: 'POST',
    body: JSON.stringify(body),
    csrfToken: token,
  })
  if (!res.ok) {
    const text = await res.text()
    let msg = text || res.statusText || 'Failed to complete profile'
    try {
      const j = JSON.parse(text)
      if (j && typeof j.message === 'string') msg = j.message
    } catch {
      /* use msg as-is */
    }
    throw new Error(msg)
  }
}
