import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTransactions } from '../api/transactionApi'
import { getAccountById } from '../api/accountApi'
import type { TransactionSummary } from '../types/core/transaction/TransactionSummary'

const ITEMS_PER_PAGE = 10

export function TransactionListContent({
  accountId,
  onBack,
}: {
  accountId: string
  onBack: () => void
}) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [transactions, setTransactions] = useState<TransactionSummary[]>([])
  const [accountLabel, setAccountLabel] = useState('Account')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAccountById(accountId).then((a) => setAccountLabel(a.accountDisplayName)).catch(() => {}),
      getTransactions(accountId)
        .then((data: unknown) => {
          setTransactions(Array.isArray(data) ? (data as TransactionSummary[]) : [])
        })
        .catch(() => setTransactions([])),
    ]).finally(() => setLoading(false))
  }, [accountId])

  const filteredTransactions = transactions.filter((t) => {
    const q = searchQuery.toLowerCase()
    return (
      t.counterpartyName?.toLowerCase().includes(q) ||
      (t.categoryName?.toLowerCase().includes(q) ?? false)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE))
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const pageTransactions = filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  const goPrev = () => setPage((p) => Math.max(1, p - 1))
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1))

  const formatAmount = (tx: Pick<TransactionSummary, 'direction' | 'moneyResponse'>) => {
    const amt = tx.moneyResponse?.amount ?? 0
    const code = tx.moneyResponse?.currencyCode ?? 'USD'
    const sign = amt >= 0 ? '+' : ''
    return `${sign}${new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(amt)}`
  }

  if (loading) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden px-5 pt-2 pb-2">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          <i className="fa-solid fa-arrow-left" aria-hidden /> Back
        </button>
        <p className="text-gray-500">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden px-5 pt-2 pb-2">
      <div className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 transition hover:text-gray-900"
          aria-label="Back to accounts"
        >
          <i className="fa-solid fa-arrow-left" aria-hidden />
          Back
        </button>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Transactions — {accountLabel}
        </h1>
        <button
          type="button"
          onClick={() => navigate(`/app/transactions/accounts/${accountId}/create-transaction`)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          <i className="fa-solid fa-plus" aria-hidden />
          Add transaction
        </button>
      </div>

      <div className="mb-2 shrink-0 rounded-xl bg-white px-4 py-3 shadow-sm">
        <input
          type="search"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-0 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0"
          aria-label="Search transactions"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-white shadow-sm">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ul className="divide-y divide-gray-100 pb-6 sm:pb-8 md:pb-10">
            {pageTransactions.length === 0 ? (
              <li className="flex flex-col items-center justify-center gap-4 px-4 py-12">
                <p className="text-center text-sm text-gray-500">
                  No transactions yet.
                </p>
                <button
                  type="button"
                  onClick={() => navigate(`/app/transactions/accounts/${accountId}/create-transaction`)}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                >
                  <i className="fa-solid fa-plus" aria-hidden />
                  Add transaction
                </button>
              </li>
            ) : (
              pageTransactions.map((tx) => (
                <li
                  key={tx.transactionId}
                  className="flex flex-row flex-wrap items-center justify-between gap-4 px-4 py-4"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-gray-900">{tx.counterpartyName ?? '—'}</span>
                    <span className="text-sm text-gray-500">
                      {tx.direction}
                      {tx.categoryName ? (
                        <span className="text-gray-400"> · {tx.categoryName}</span>
                      ) : null}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <div className='font-medium text-gray-900 mr-2'>{tx.postedDate}</div>
                    <span
                      className={`font-semibold ${
                        (tx.moneyResponse?.amount ?? 0) >= 0 ? 'text-emerald-600' : 'text-gray-900'
                      }`}
                    >
                      {formatAmount(tx)}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-4 py-3 sm:py-4 md:py-4">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
            {filteredTransactions.length > 0 && (
              <span className="ml-1">
                ({filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''})
              </span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={page <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
              aria-label="Previous page"
            >
              <i className="fa-solid fa-chevron-left text-sm" aria-hidden />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={page >= totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
              aria-label="Next page"
            >
              <i className="fa-solid fa-chevron-right text-sm" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
