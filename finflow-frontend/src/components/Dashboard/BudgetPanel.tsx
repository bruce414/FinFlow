import { useNavigate } from 'react-router-dom'
import type { BudgetSummary } from '../../types/core/budget/BudgetSummary'

function formatMoney(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount)
}

export function BudgetPanel({
  budgets,
  loading,
}: {
  budgets: BudgetSummary[]
  loading: boolean
}) {
  const navigate = useNavigate()
  const active = budgets.filter((b) => b.active)

  if (loading) {
    return (
      <section className="mt-4 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Budgets</h2>
        <p className="text-center text-sm text-gray-500">Loading…</p>
      </section>
    )
  }

  if (active.length === 0) {
    return (
      <section className="mt-4 rounded-xl bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Budgets</h2>
        <div className="flex min-h-[140px] flex-col items-center justify-center gap-4">
          <p className="text-center text-gray-600">No active budgets</p>
          <button
            type="button"
            onClick={() => navigate('/app/budgets/new')}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            Add budget
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-4 rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900">Active budgets</h2>
        <button
          type="button"
          onClick={() => navigate('/app/budgets/new')}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          Add budget
        </button>
      </div>
      <ul className="divide-y divide-gray-100">
        {active.map((b) => (
          <li key={b.budgetId} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
            <span className="font-medium text-gray-900">{b.budgetName}</span>
            <span className="text-sm text-gray-600">
              {formatMoney(b.budgetLimit?.amount ?? 0, b.budgetLimit?.currencyCode ?? 'USD')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
