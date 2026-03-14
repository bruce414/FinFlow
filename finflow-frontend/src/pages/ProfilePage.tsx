import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMe, deleteMe } from '../api/meApi'
import type { UserDetails } from '../types/core/UserDetails'

export function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deactivating, setDeactivating] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [deactivated, setDeactivated] = useState(false)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!deactivated || countdown <= 0) return
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t)
          navigate('/', { replace: true })
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [deactivated, countdown, navigate])

  const handleDeleteClick = () => setDeleteModalOpen(true)
  const handleDeleteCancel = () => setDeleteModalOpen(false)
  const handleDeleteConfirm = async () => {
    setDeactivating(true)
    try {
      await deleteMe()
      setDeactivated(true)
      setCountdown(10)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate account')
    } finally {
      setDeactivating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-gray-500">Loading profile…</p>
      </div>
    )
  }

  if (error && !user) {
    const isSessionExpired = /session expired|invalid|log in again/i.test(error)
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="text-center text-red-600">{error}</p>
        {isSessionExpired && (
          <Link
            to="/"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Log in again
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto p-8">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View your profile. Use the buttons below to update or deactivate your account.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <dl className="mt-6 flex flex-col gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-0.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
              {user?.email ?? '—'}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">First name</dt>
              <dd className="mt-0.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
                {user?.firstName ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last name</dt>
              <dd className="mt-0.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
                {user?.lastName ?? '—'}
              </dd>
            </div>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="mt-0.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
              {user?.phoneNumber ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Date of birth</dt>
            <dd className="mt-0.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
              {user?.dateOfBirth ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Time zone</dt>
            <dd className="mt-0.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
              {user?.timeZone ?? '—'}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/app/profile/update')}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update profile
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete user
          </button>
        </div>
      </div>

      {/* Custom delete / deactivate modal */}
      {(deleteModalOpen || deactivated) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deactivate-modal-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-200">
            <h2 id="deactivate-modal-title" className="text-lg font-semibold text-gray-900">
              {deactivated ? 'Account deactivated' : 'Deactivate account?'}
            </h2>
            {deactivated ? (
              <p className="mt-2 text-sm text-gray-600">
                This user has been deactivated. The system will return to the login page in{' '}
                <span className="font-semibold text-indigo-600">{countdown}s</span>.
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                Deactivating your account will log you out. You will not be able to log in with this
                account again. Return to the login page?
              </p>
            )}
            {!deactivated && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  disabled={deactivating}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deactivating}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70"
                >
                  {deactivating ? 'Deactivating…' : 'Deactivate'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
