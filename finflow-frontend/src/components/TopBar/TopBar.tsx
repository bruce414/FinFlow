import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../api/meApi'
import { logout } from '../../api/authApi'
import type { UserDetails } from '../../types/core/UserDetails'

const BAR_ITEM_HEIGHT = 'h-11'

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function TopBar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const handleLogout = async () => {
    try {
      await logout()
      setDropdownOpen(false)
      navigate('/', { replace: true })
    } catch {
      setDropdownOpen(false)
      navigate('/', { replace: true })
    }
  }

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'Loading…'
  const displayEmail = user?.email ?? '—'

  return (
    <header
      className={`flex shrink-0 items-center justify-between gap-4 bg-gray-100 px-7 py-10 ${BAR_ITEM_HEIGHT}`}
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Quick search */}
      <div className={`flex min-w-0 flex-1 max-w-md items-center gap-3 rounded-2xl bg-white pl-4 pr-4 ${BAR_ITEM_HEIGHT}`}>
        <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm shrink-0" aria-hidden />
        <input
          type="search"
          placeholder="Quick Search ..."
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 font-medium placeholder:text-gray-400 outline-none"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        />
      </div>

      {/* Right group: notification, premium, profile, add widget */}
      <div className={`flex items-center gap-3 ${BAR_ITEM_HEIGHT}`}>
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800"
          aria-label="Notifications"
        >
          <i className="fa-regular fa-bell text-lg" aria-hidden />
        </button>

        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white text-yellow-500 transition-colors hover:bg-gray-50 hover:text-yellow-600"
          aria-label="Premium"
        >
          <i className="fa-solid fa-crown text-lg" aria-hidden />
        </button>

        {/* Profile card + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex h-full items-center gap-3 rounded-lg bg-white pl-2 pr-4 transition-colors hover:bg-gray-50"
            aria-label="Profile"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.userId ?? 'user')}&backgroundColor=b6e3f4`}
              alt=""
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium text-gray-800 leading-tight">
                {displayName}
              </span>
              <span className="text-xs text-gray-500 leading-tight">
                {displayEmail}
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
              role="menu"
            >
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false)
                  navigate('/app/profile')
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                role="menuitem"
              >
                <ProfileIcon className="shrink-0 text-gray-500" />
                <span>Profile</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                role="menuitem"
              >
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex h-full items-center gap-2 rounded-lg bg-white px-4 transition-colors hover:bg-gray-50 text-gray-700 hover:text-gray-900"
        >
          <i className="fa-solid fa-plus text-sm" aria-hidden />
          <span className="text-sm font-medium">add widget</span>
        </button>
      </div>
    </header>
  )
}
