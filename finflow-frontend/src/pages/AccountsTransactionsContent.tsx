import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CardStackView,
  CardNavButtons,
} from '../components/Dashboard/RollingCardPanel'
import type { AccountSummary } from '../types/core/account/AccountSummary'
import { getAccounts, deleteAccount } from '../api/accountApi'

const SUCCESS_BANNER_MS = 5000
const ERROR_BANNER_MS = 6000

function formatMoney(money: { amount: number; currencyCode: string }) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode || 'USD',
    minimumFractionDigits: 2,
  }).format(money.amount)
}

export function AccountsTransactionsContent({
  onViewTransactions,
}: {
  onViewTransactions: (accountId: string) => void
}) {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState<AccountSummary[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false)
  const [pendingDeactivateAccountId, setPendingDeactivateAccountId] = useState<string | null>(null)
  const [deactivating, setDeactivating] = useState(false)
  const [successBannerMessage, setSuccessBannerMessage] = useState<string | null>(null)
  const [errorBanner, setErrorBanner] = useState<string | null>(null)

  const refresh = () => {
    setLoading(true)
    getAccounts()
      .then(setAccounts)
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false))
  }

  /** Reconcile with server without replacing the whole view (avoids a blank loading flash). */
  const syncAccountsQuietly = () => {
    getAccounts()
      .then(setAccounts)
      .catch(() => {
        /* keep current list; user can refresh */
      })
  }

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    if (!successBannerMessage) return
    const t = window.setTimeout(() => setSuccessBannerMessage(null), SUCCESS_BANNER_MS)
    return () => window.clearTimeout(t)
  }, [successBannerMessage])

  useEffect(() => {
    if (!errorBanner) return
    const t = window.setTimeout(() => setErrorBanner(null), ERROR_BANNER_MS)
    return () => window.clearTimeout(t)
  }, [errorBanner])

  const hasAccounts = accounts.length > 0
  const safeIndex = hasAccounts ? Math.min(selectedIndex, accounts.length - 1) : 0
  const selectedAccount = hasAccounts ? accounts[safeIndex] ?? null : null

  const pendingAccountLabel =
    pendingDeactivateAccountId != null
      ? accounts.find((a) => a.accountId === pendingDeactivateAccountId)?.accountDisplayName ?? 'this account'
      : ''

  const openDeactivateModal = (accountId: string) => {
    setPendingDeactivateAccountId(accountId)
    setDeactivateModalOpen(true)
  }

  const closeDeactivateModal = () => {
    if (deactivating) return
    setDeactivateModalOpen(false)
    setPendingDeactivateAccountId(null)
  }

  const confirmDeactivate = async () => {
    if (pendingDeactivateAccountId == null) return
    const id = pendingDeactivateAccountId
    const accountName =
      accounts.find((a) => a.accountId === id)?.accountDisplayName?.trim() || 'Account'
    setDeactivating(true)
    try {
      await deleteAccount(id)
      setDeactivateModalOpen(false)
      setPendingDeactivateAccountId(null)
      setSuccessBannerMessage(`${accountName} has been removed successfully.`)
      setAccounts((prev) => {
        const next = prev.filter((a) => a.accountId !== id)
        setSelectedIndex((sel) => Math.min(sel, Math.max(0, next.length - 1)))
        return next
      })
      syncAccountsQuietly()
    } catch (e) {
      console.error(e)
      setErrorBanner('Failed to deactivate account.')
    } finally {
      setDeactivating(false)
    }
  }

  const bannerLayer = (
    <>
      {successBannerMessage && (
        <div
          className="fixed inset-x-0 top-0 z-100 flex items-center justify-center gap-2 border-b border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-900 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <i className="fa-solid fa-circle-check text-lg text-green-600" aria-hidden />
          <span>{successBannerMessage}</span>
        </div>
      )}
      {errorBanner && (
        <div
          className="fixed inset-x-0 top-0 z-100 flex items-center justify-center gap-2 border-b border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900 shadow-sm"
          role="alert"
          aria-live="assertive"
        >
          <i className="fa-solid fa-circle-exclamation text-lg text-red-600" aria-hidden />
          <span>{errorBanner}</span>
        </div>
      )}
    </>
  )

  const deactivateModal =
    deactivateModalOpen && pendingDeactivateAccountId != null ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deactivate-account-modal-title"
      >
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-200">
          <h2 id="deactivate-account-modal-title" className="text-lg font-semibold text-gray-900">
            Deactivate account?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium text-gray-800">{pendingAccountLabel}</span> will be moved to Archived
            accounts. You can review it there anytime.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeDeactivateModal}
              disabled={deactivating}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                void confirmDeactivate()
              }}
              disabled={deactivating}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {deactivating ? 'Deactivating…' : 'Deactivate'}
            </button>
          </div>
        </div>
      </div>
    ) : null

  if (loading) {
    return (
      <>
        {bannerLayer}
        {deactivateModal}
        <div className="flex flex-col gap-6 px-5 pt-2 pb-2">
          <h1 className="text-2xl font-bold text-gray-900">Accounts & Transactions</h1>
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <p className="text-gray-500">Loading…</p>
          </div>
        </div>
      </>
    )
  }

  if (!hasAccounts) {
    return (
      <>
        {bannerLayer}
        {deactivateModal}
        <div className="flex flex-col gap-6 px-5 pt-2 pb-2">
          <h1 className="text-2xl font-bold text-gray-900">Accounts & Transactions</h1>
          <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-white p-8 shadow-sm">
            <p className="text-center text-gray-600">There&apos;s nothing to show.</p>
            <button
              type="button"
              onClick={() => navigate('/app/accounts/create')}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              Add accounts
            </button>
          </div>
        </div>
      </>
    )
  }

  const card = selectedAccount!

  return (
    <>
      {bannerLayer}
      {deactivateModal}
      <div className="flex flex-col gap-6 px-5 pt-2 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Accounts & Transactions
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/app/accounts/archived')}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <i className="fa-solid fa-archive" aria-hidden />
              Archived accounts
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/accounts/create')}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              <i className="fa-solid fa-plus" aria-hidden />
              Add account
            </button>
          </div>
        </div>

        <div className="flex flex-row flex-wrap items-stretch gap-6 rounded-xl bg-white p-6 shadow-sm">
          <CardStackView selectedIndex={safeIndex} accounts={accounts} />

          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-500">Account name</p>
              <p className="text-base font-semibold text-gray-900">
                {card.accountDisplayName}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-500">Provider</p>
              <p className="text-base font-semibold text-gray-900">
                {card.providerAccountName}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-500">Balance</p>
              <p className="text-base font-semibold text-gray-900">
                {formatMoney(card.money)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="text-base font-semibold text-gray-900">
                {card.accountType}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onViewTransactions(card.accountId)}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                <i className="fa-solid fa-list" aria-hidden />
                View transactions
              </button>
              <button
                type="button"
                onClick={() => openDeactivateModal(card.accountId)}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
              >
                <i className="fa-solid fa-ban" aria-hidden />
                Deactivate account
              </button>
            </div>
          </div>

          <div className="flex shrink-0 items-center">
            <CardNavButtons
              selectedIndex={safeIndex}
              onSelectIndex={setSelectedIndex}
              totalCount={accounts.length}
            />
          </div>
        </div>
      </div>
    </>
  )
}
