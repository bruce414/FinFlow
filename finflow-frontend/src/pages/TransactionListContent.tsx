import { useState, useEffect } from 'react'
import { MOCK_CARDS } from '../components/Dashboard/RollingCardPanel'

const ITEMS_PER_PAGE = 10

const MOCK_TRANSACTIONS = [
  { id: '1', title: 'Coffee House', postedDate: 'Mar 5, 2025', amount: -4.85, paidFor: 'Personal' },
  { id: '2', title: 'Grocery Store', postedDate: 'Mar 4, 2025', amount: -127.32, paidFor: 'Household' },
  { id: '3', title: 'Salary Deposit', postedDate: 'Mar 1, 2025', amount: 3200.0, paidFor: 'Income' },
  { id: '4', title: 'Netflix', postedDate: 'Feb 28, 2025', amount: -15.99, paidFor: 'Subscriptions' },
  { id: '5', title: 'Gas Station', postedDate: 'Feb 27, 2025', amount: -52.4, paidFor: 'Transport' },
  { id: '6', title: 'Restaurant', postedDate: 'Feb 25, 2025', amount: -68.5, paidFor: 'Personal' },
  { id: '7', title: 'Amazon', postedDate: 'Feb 24, 2025', amount: -89.0, paidFor: 'Shopping' },
  { id: '8', title: 'Utility Bill', postedDate: 'Feb 22, 2025', amount: -134.5, paidFor: 'Household' },
]

export function TransactionListContent({
  cardIndex,
  onBack,
}: {
  cardIndex: number
  onBack: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const filteredTransactions = MOCK_TRANSACTIONS.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.paidFor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE))
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const pageTransactions = filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  const goPrev = () => setPage((p) => Math.max(1, p - 1))
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1))

  const accountLabel = MOCK_CARDS[cardIndex]?.label ?? 'Account'

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

      <h1 className="shrink-0 text-2xl font-bold text-gray-900">
        Transactions — {accountLabel}
      </h1>

      {/* Search bar — separate, with margin at bottom */}
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

      {/* Transaction list — fixed to viewport, scrollable list with clear space above pagination */}
      <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-white shadow-sm">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ul className="divide-y divide-gray-100 pb-6 sm:pb-8 md:pb-10">
            {pageTransactions.map((tx) => (
              <li
                key={tx.id}
                className="flex flex-row flex-wrap items-center justify-between gap-4 px-4 py-4"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-gray-900">{tx.title}</span>
                  <span className="text-sm text-gray-500">{tx.postedDate}</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className={`font-semibold ${
                      tx.amount >= 0 ? 'text-emerald-600' : 'text-gray-900'
                    }`}
                  >
                    {tx.amount >= 0 ? '+' : ''}
                    ${Math.abs(tx.amount).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">{tx.paidFor}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pagination — always fully visible below list with gap */}
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
