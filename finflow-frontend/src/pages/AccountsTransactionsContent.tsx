import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CardStackView,
  CardNavButtons,
} from '../components/Dashboard/RollingCardPanel'
import type { AccountSummary } from '../types/core/account/AccountSummary'
import { getAccounts, deleteAccount } from '../api/accountApi'

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

  const refresh = () => {
    setLoading(true)
    getAccounts()
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
        <h1 className="text-2xl font-bold text-gray-900">Accounts & Transactions</h1>
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <p className="text-gray-500">Loading…</p>
        </div>
      </div>
    )
  }

  if (!hasAccounts) {
    return (
      <div className="flex flex-col gap-6 px-5 pt-2 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">Accounts & Transactions</h1>
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-white p-8 shadow-sm">
          <p className="text-center text-gray-600">There&apos;s nothing to show.</p>
          <button
            type="button"
            onClick={() => navigate('/app/transactions/accounts/create')}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            Add accounts
          </button>
        </div>
      </div>
    )
  }

  const card = selectedAccount!

  return (
    <div className="flex flex-col gap-6 px-5 pt-2 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Accounts & Transactions
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/app/transactions/archived')}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <i className="fa-solid fa-archive" aria-hidden />
            Archived accounts
          </button>
          <button
            type="button"
            onClick={() => navigate('/app/transactions/accounts/create')}
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
              onClick={async () => {
                if (!window.confirm('Deactivate this account? It will be moved to Archived accounts.')) return
                try {
                  await deleteAccount(card.accountId)
                  refresh()
                } catch (e) {
                  console.error(e)
                  window.alert('Failed to deactivate account.')
                }
              }}
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
  )
}
