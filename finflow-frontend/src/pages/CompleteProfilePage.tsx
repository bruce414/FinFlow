import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/Auth/AuthLayout'
import { getOnboardingStatus, completeGoogleProfile } from '../api/onboardingApi'
import { CURRENCY_OPTIONS } from '../constants/currencies'

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'UTC',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
]

export function CompleteProfilePage() {
  const navigate = useNavigate()
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [timeZone, setTimeZone] = useState('America/New_York')
  const [baseCurrencyCode, setBaseCurrencyCode] = useState('USD')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(true)
  const [hasPendingSignup, setHasPendingSignup] = useState(false)

  useEffect(() => {
    getOnboardingStatus()
      .then((status) => {
        if (status.authenticated && status.pendingGoogleSignup) {
          setHasPendingSignup(true)
        } else if (status.authenticated && !status.pendingGoogleSignup) {
          navigate('/app', { replace: true })
        } else {
          setError('Session expired. Please sign in with Google again.')
        }
      })
      .catch(() => setError('Unable to load. Please sign in with Google again.'))
      .finally(() => setStatusLoading(false))
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await completeGoogleProfile({
        dateOfBirth,
        timeZone,
        baseCurrencyCode,
      })
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete profile')
    } finally {
      setLoading(false)
    }
  }

  if (statusLoading) {
    return (
      <AuthLayout>
        <div className="flex w-full max-w-sm flex-col gap-6 px-8">
          <p className="text-gray-500">Checking session…</p>
        </div>
      </AuthLayout>
    )
  }

  if (error && !hasPendingSignup) {
    return (
      <AuthLayout>
        <div className="flex w-full max-w-sm flex-col gap-6 px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Complete your profile</h1>
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
          <a
            href="/"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-center font-medium text-white hover:bg-indigo-700"
          >
            Back to login
          </a>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="flex w-full max-w-sm flex-col gap-6 px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Complete your profile
        </h1>
        <p className="text-sm text-gray-600">
          Add a few details to finish setting up your account.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="complete-dob"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Date of birth
            </label>
            <input
              id="complete-dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="complete-timezone"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Time zone
            </label>
            <select
              id="complete-timezone"
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="complete-currency"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Base currency
            </label>
            <select
              id="complete-currency"
              value={baseCurrencyCode}
              onChange={(e) => setBaseCurrencyCode(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {CURRENCY_OPTIONS.map(({ code, name }) => (
                <option key={code} value={code}>
                  {code} – {name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {loading ? 'Completing…' : 'Complete profile'}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
