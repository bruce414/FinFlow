import { useEffect, useState, useCallback } from 'react'
import { createBudget, getBudgets } from '../api/budgetApi'
import { getCategories } from '../api/categoriesApi'
import { getDashboard } from '../api/dashboardApi'
import type { BudgetSummary } from '../types/core/budget/BudgetSummary'
import type { CategoryItem } from '../types/core/category/CategoryItem'
import { CURRENCY_OPTIONS } from '../constants/currencies'

const PERIOD_TYPES = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM'] as const

function todayIsoDate(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatMoney(m: { amount: number; currencyCode: string }) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: m.currencyCode || 'USD',
    minimumFractionDigits: 2,
  }).format(m.amount)
}

export function BudgetPage() {
  const [budgets, setBudgets] = useState<BudgetSummary[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const [budgetName, setBudgetName] = useState('')
  const [periodType, setPeriodType] = useState<string>('MONTHLY')
  const [startDate, setStartDate] = useState(todayIsoDate)
  const [limitAmount, setLimitAmount] = useState('')
  const [currencyCode, setCurrencyCode] = useState('USD')
  const [categoryId, setCategoryId] = useState('')
  const [enableRollover, setEnableRollover] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const loadAll = useCallback(() => {
    setLoading(true)
    Promise.all([
      getBudgets().catch(() => [] as BudgetSummary[]),
      getCategories().catch(() => [] as CategoryItem[]),
      getDashboard().catch(() => null),
    ])
      .then(([b, c, dash]) => {
        setBudgets(b)
        setCategories(c)
        if (dash?.currency) setCurrencyCode(dash.currency)
        setListError(null)
      })
      .catch((e: unknown) => {
        setListError(e instanceof Error ? e.message : 'Failed to load budgets')
        setBudgets([])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!categoryId) {
      setFormError('Select a category.')
      return
    }
    const amount = parseFloat(limitAmount)
    if (!Number.isFinite(amount) || amount < 0) {
      setFormError('Enter a valid budget limit.')
      return
    }
    const ccy = currencyCode.trim().toUpperCase().slice(0, 3) || 'USD'
    setSaving(true)
    try {
      await createBudget({
        budgetName: budgetName.trim() || 'My budget',
        periodType,
        startDate,
        budgetLimit: { amount, currencyCode: ccy },
        enableRollover,
        categoryId,
      })
      setBudgetName('')
      setLimitAmount('')
      await loadAll()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create budget')
    } finally {
      setSaving(false)
    }
  }

  const sortedCategories = [...categories].sort((a, b) => a.categoryName.localeCompare(b.categoryName))

  return (
    <div className="flex flex-col gap-6 px-5 pt-2 pb-2">
      <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Create budget</h2>
        <form onSubmit={handleCreate} className="flex max-w-xl flex-col gap-4">
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          )}
          <div>
            <label htmlFor="budget-name" className="mb-1 block text-sm font-medium text-gray-700">
              Budget name
            </label>
            <input
              id="budget-name"
              type="text"
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Groceries"
              maxLength={255}
            />
          </div>
          <div>
            <label htmlFor="budget-category" className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="budget-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            >
              <option value="">Select category…</option>
              {sortedCategories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="budget-period" className="mb-1 block text-sm font-medium text-gray-700">
                Period type
              </label>
              <select
                id="budget-period"
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {PERIOD_TYPES.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0) + p.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="budget-start" className="mb-1 block text-sm font-medium text-gray-700">
                Start date
              </label>
              <input
                id="budget-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="budget-limit" className="mb-1 block text-sm font-medium text-gray-700">
                Limit amount
              </label>
              <input
                id="budget-limit"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="budget-currency" className="mb-1 block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                id="budget-currency"
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {CURRENCY_OPTIONS.map(({ code }) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={enableRollover}
              onChange={(e) => setEnableRollover(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Enable rollover
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-fit rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Create budget'}
          </button>
        </form>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Your budgets</h2>
        {loading && (
          <p className="text-gray-500">Loading…</p>
        )}
        {!loading && listError && (
          <p className="text-sm text-red-700">{listError}</p>
        )}
        {!loading && !listError && budgets.length === 0 && (
          <p className="text-sm text-gray-600">No budgets yet. Create one above.</p>
        )}
        {!loading && !listError && budgets.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {budgets.map((b) => (
              <li
                key={b.budgetId}
                className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{b.budgetName}</p>
                  <p className="text-sm text-gray-600">
                    Limit {formatMoney(b.budgetLimit)} · starts {b.startDate}
                  </p>
                </div>
                <span className="shrink-0 text-sm text-gray-500">{b.active ? 'Active' : 'Inactive'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
