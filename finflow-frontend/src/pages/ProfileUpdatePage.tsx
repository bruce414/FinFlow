import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMe, patchMe } from '../api/meApi'
import type { UserDetails } from '../types/core/UserDetails'
import type { MePatchRequest } from '../types/core/MePatchRequest'

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

export function ProfileUpdatePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [timeZone, setTimeZone] = useState('America/New_York')

  useEffect(() => {
    getMe()
      .then((data) => {
        setUser(data)
        setFirstName(data.firstName ?? '')
        setLastName(data.lastName ?? '')
        setPhoneNumber(data.phoneNumber ?? '')
        setDateOfBirth(data.dateOfBirth ?? '')
        setTimeZone(data.timeZone ?? 'America/New_York')
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError(null)
    setSuccess(false)
    setSaving(true)
    try {
      const payload: MePatchRequest = {
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        phoneNumber: phoneNumber.trim() || null,
        dateOfBirth: dateOfBirth || null,
        timeZone: timeZone || null,
      }
      const updated = await patchMe(payload)
      setUser(updated)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
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
        <button
          type="button"
          onClick={() => navigate('/app/profile')}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <i className="fa-solid fa-arrow-left" aria-hidden />
          Back to profile
        </button>
        <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Update profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Edit your details below. Email cannot be changed.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              Profile saved.
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email ?? ''}
              readOnly
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-update-firstName" className="mb-1 block text-sm font-medium text-gray-700">
                First name
              </label>
              <input
                id="profile-update-firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                maxLength={50}
              />
            </div>
            <div>
              <label htmlFor="profile-update-lastName" className="mb-1 block text-sm font-medium text-gray-700">
                Last name
              </label>
              <input
                id="profile-update-lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile-update-phone" className="mb-1 block text-sm font-medium text-gray-700">
              Phone <span className="text-gray-400">(E.164)</span>
            </label>
            <input
              id="profile-update-phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="+15551234567"
            />
          </div>

          <div>
            <label htmlFor="profile-update-dob" className="mb-1 block text-sm font-medium text-gray-700">
              Date of birth
            </label>
            <input
              id="profile-update-dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="profile-update-timezone" className="mb-1 block text-sm font-medium text-gray-700">
              Time zone
            </label>
            <select
              id="profile-update-timezone"
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

          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
