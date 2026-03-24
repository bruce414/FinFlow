import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CardStackView,
  CardNavButtons,
} from '../components/Dashboard/RollingCardPanel'
import type { AccountSummary } from '../types/core/account/AccountSummary'
import { getArchivedAccounts } from '../api/accountApi'

function formatMoney(money: { amount: number; currencyCode: string }) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode || 'USD',
    minimumFractionDigits: 2,
  }).format(money.amount)
}

export function ArchivedAccountsContent() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState<AccountSummary[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const refresh = () => {
    setLoading(true)
    getArchivedAccounts()
      .then(setAccounts)
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refresh()
  }, [])

  const hasAccounts = accounts.length > 0
  const selectedAccount = hasAccounts ? accounts[selectedIndex] : null
  const safeIndex = hasAccounts ? Math.min(selectedIndex, accounts.length - 1) : 0

  if (loading) {
    return (
      <div className="flex flex-col gap-6 px-5 pt-2 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">Archived accounts</h1>
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <p className="text-gray-500">Loading…</p>
        </div>
      </div>
    )
  }

  if (!hasAccounts) {
    return (
      <div className="flex flex-col gap-6 px-5 pt-2 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Archived accounts</h1>
          <button
            type="button"
            onClick={() => navigate('/app/accounts')}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <i className="fa-solid fa-arrow-left" aria-hidden />
            Back to accounts
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-white p-8 shadow-sm">
          <p className="text-center text-gray-600">No archived accounts.</p>
          <button
            type="button"
            onClick={() => navigate('/app/accounts')}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            Back to accounts
          </button>
        </div>
      </div>
    )
  }

  const card = selectedAccount!

  return (
    <div className="flex flex-col gap-6 px-5 pt-2 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Archived accounts</h1>
        <button
          type="button"
          onClick={() => navigate('/app/accounts')}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <i className="fa-solid fa-arrow-left" aria-hidden />
          Back to accounts
        </button>
      </div>

      <div className="flex flex-row flex-wrap items-stretch gap-6 rounded-xl bg-white p-6 shadow-sm">
        <CardStackView selectedIndex={safeIndex} accounts={accounts} />

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            This account is deactivated and archived. It no longer appears in your main accounts or dashboard.
          </div>
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
            <p className="text-sm font-medium text-gray-500">Balance at archive</p>
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
  )
}
