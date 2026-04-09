import type { BudgetSummary } from '../../types/core/budget/BudgetSummary'

function toNumber(v: unknown): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') return parseFloat(v) || 0
  return 0
}

function formatMoney(m: { amount?: unknown; currencyCode?: string } | undefined): string {
  if (!m) return '—'
  const n = toNumber(m.amount)
  const ccy = m.currencyCode ?? ''
  return `${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${ccy}`.trim()
}

export function BudgetListItem({
  budget,
  exceeded = false,
}: {
  budget: BudgetSummary
  exceeded?: boolean
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="font-semibold text-gray-900">{budget.budgetName}</p>
        <p className="text-sm text-gray-600">
          Limit {formatMoney(budget.budgetLimit)} · starts {budget.startDate}
        </p>
        {exceeded && (
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
            <i className="fa-solid fa-circle-exclamation" aria-hidden />
            Budget limit exceeded
          </p>
        )}
      </div>
      <span className="shrink-0 text-sm text-gray-500">{budget.active ? 'Active' : 'Inactive'}</span>
    </li>
  )
}
