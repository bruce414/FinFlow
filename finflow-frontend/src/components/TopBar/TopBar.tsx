import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../api/meApi'
import { logout } from '../../api/authApi'
import { getNotifications, markNotificationRead } from '../../api/notificationsApi'
import type { UserDetails } from '../../types/core/UserDetails'
import type { NotificationItem } from '../../types/core/notification/NotificationItem'

const BAR_ITEM_HEIGHT = 'h-11'
const NOTIFICATION_POLL_MS = 3000
const BUDGET_TOAST_MS = 5000

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function formatNotificationTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

export function TopBar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [budgetToast, setBudgetToast] = useState<NotificationItem | null>(null)
  const seenBudgetAlertIdsRef = useRef<Set<string>>(new Set())
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  const refreshNotifications = useCallback(() => {
    getNotifications()
      .then((items) => {
        setNotifications(items)

        const newestUnseenExceeded = items
          .filter((n) => n.notificationType === 'BUDGET_EXCEEDED' && !seenBudgetAlertIdsRef.current.has(n.id))
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0]

        if (newestUnseenExceeded) {
          seenBudgetAlertIdsRef.current.add(newestUnseenExceeded.id)
          setBudgetToast(newestUnseenExceeded)
        }
      })
      .catch(() => setNotifications([]))
  }, [])

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    refreshNotifications()
    const id = window.setInterval(refreshNotifications, NOTIFICATION_POLL_MS)
    const onFocus = () => refreshNotifications()
    window.addEventListener('focus', onFocus)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('focus', onFocus)
    }
  }, [refreshNotifications])

  useEffect(() => {
    if (!budgetToast) return
    const id = window.setTimeout(() => setBudgetToast(null), BUDGET_TOAST_MS)
    return () => window.clearTimeout(id)
  }, [budgetToast])

  useEffect(() => {
    if (!dropdownOpen && !notificationsOpen) return
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false)
      }
      if (notificationsOpen && notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen, notificationsOpen])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleOpenNotifications = () => {
    setNotificationsOpen((o) => !o)
    setDropdownOpen(false)
    refreshNotifications()
  }

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      if (budgetToast?.id === id) {
        setBudgetToast(null)
      }
      refreshNotifications()
    } catch {
      /* ignore */
    }
  }

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
    <>
      {budgetToast && (
        <div className="pointer-events-none fixed left-1/2 top-4 z-[120] w-[min(92vw,760px)] -translate-x-1/2">
          <div className="pointer-events-auto flex items-start justify-between gap-3 rounded-lg border border-amber-300 bg-amber-100 px-4 py-3 text-sm text-amber-950 shadow-lg">
            <div className="flex min-w-0 items-start gap-2">
              <i className="fa-solid fa-triangle-exclamation mt-0.5 text-amber-600" aria-hidden />
              <div className="min-w-0">
                <p className="font-semibold">Budget limit exceeded</p>
                <p className="truncate">{budgetToast.body}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBudgetToast(null)}
              className="rounded p-1 text-amber-700 hover:bg-amber-200"
              aria-label="Dismiss budget alert"
            >
              <i className="fa-solid fa-xmark" aria-hidden />
            </button>
          </div>
        </div>
      )}

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
          <div className="relative shrink-0" ref={notificationsRef}>
            <button
              type="button"
              onClick={handleOpenNotifications}
              className="relative flex size-11 items-center justify-center rounded-lg bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              aria-haspopup="true"
            >
              <i className="fa-regular fa-bell text-lg" aria-hidden />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notificationsOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-1 w-[min(100vw-2rem,22rem)] max-h-[min(24rem,70vh)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
                role="region"
                aria-label="Notifications"
              >
                <div className="border-b border-gray-100 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Notifications</p>
                </div>
                <ul className="max-h-[min(20rem,60vh)] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <li className="px-3 py-6 text-center text-sm text-gray-500">No notifications yet.</li>
                  ) : (
                    notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`border-b border-gray-50 px-3 py-3 text-left text-sm last:border-b-0 ${
                          n.read ? 'bg-white' : 'bg-indigo-50/40'
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-gray-900">{n.title}</span>
                          <span className="text-xs text-gray-500">{formatNotificationTime(n.createdAt)}</span>
                          <p className="text-gray-700 leading-snug">{n.body}</p>
                          {!n.read && (
                            <button
                              type="button"
                              onClick={() => handleMarkRead(n.id)}
                              className="mt-1 self-start text-xs font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

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
              onClick={() => {
                setNotificationsOpen(false)
                setDropdownOpen((o) => !o)
              }}
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
                <span className="text-sm font-medium text-gray-800 leading-tight">{displayName}</span>
                <span className="text-xs text-gray-500 leading-tight">{displayEmail}</span>
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
    </>
  )
}
