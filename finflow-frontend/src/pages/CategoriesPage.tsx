import { useEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getCategories } from '../api/categoriesApi'
import { getDashboard } from '../api/dashboardApi'
import type { CategoryItem } from '../types/core/category/CategoryItem'
import type { DashboardSpendingByCategoryItem } from '../types/core/dashboard/DashboardResponse'

const CHART_FALLBACK_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c084fc', '#818cf8', '#94a3b8']

function toNumber(v: unknown): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') return parseFloat(v) || 0
  return 0
}

function formatMoney(amount: number, currencyCode: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [spendingRows, setSpendingRows] = useState<DashboardSpendingByCategoryItem[]>([])
  const [baseCurrency, setBaseCurrency] = useState('USD')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([getCategories().catch(() => [] as CategoryItem[]), getDashboard().catch(() => null)])
      .then(([cats, dash]) => {
        setCategories(cats)
        setSpendingRows(dash?.spendingByCategory ?? [])
        setBaseCurrency(dash?.currency ?? 'USD')
        setError(null)
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Failed to load')
        setCategories([])
        setSpendingRows([])
      })
      .finally(() => setLoading(false))
  }, [])

  const spendingById = useMemo(() => {
    const m = new Map<string, number>()
    for (const row of spendingRows) {
      if (row.categoryId) m.set(row.categoryId, Math.abs(toNumber(row.amount?.amount)))
    }
    return m
  }, [spendingRows])

  const chartData = useMemo(() => {
    return spendingRows
      .filter((r) => Math.abs(toNumber(r.amount?.amount)) > 0)
      .map((r, i) => ({
        name: r.categoryName ?? 'Uncategorized',
        value: Math.abs(toNumber(r.amount?.amount)),
        fill: r.colorHex || CHART_FALLBACK_COLORS[i % CHART_FALLBACK_COLORS.length],
      }))
  }, [spendingRows])

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.categoryName.localeCompare(b.categoryName))
  }, [categories])

  if (loading) {
    return (
      <div className="flex flex-col gap-6 px-5 pt-2 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <p className="text-gray-500">Loading…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 px-5 pt-2 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-5 pt-2 pb-2">
      <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

      <div className="flex flex-row flex-wrap items-stretch gap-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex min-w-[260px] flex-1 flex-col">
          <p className="text-sm font-medium text-gray-500">Spending by category (this month)</p>
          <div className="mt-2 min-h-[260px] w-full flex-1">
            {chartData.length === 0 ? (
              <div className="flex h-[260px] items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-500">
                No category spending this month yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatMoney(value, baseCurrency)}
                    contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0">
          <p className="text-sm font-medium text-gray-500">Breakdown</p>
          {spendingRows.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600">No spending recorded for the current month.</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100">
              {spendingRows.map((row) => (
                <li
                  key={row.categoryId ?? row.categoryName ?? 'uncat'}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {row.colorHex ? (
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: row.colorHex }}
                        aria-hidden
                      />
                    ) : (
                      <span className="h-3 w-3 shrink-0 rounded-full bg-gray-300" aria-hidden />
                    )}
                    <span className="truncate font-medium text-gray-900">
                      {row.categoryName ?? 'Uncategorized'}
                    </span>
                  </div>
                  <span className="shrink-0 font-semibold text-gray-900">
                    {formatMoney(Math.abs(toNumber(row.amount?.amount)), row.amount?.currencyCode ?? baseCurrency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">All categories</h2>
        {sortedCategories.length === 0 ? (
          <p className="text-sm text-gray-600">No categories found.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sortedCategories.map((c) => {
              const spent = c.categoryId ? spendingById.get(c.categoryId) ?? 0 : 0
              return (
                <li key={c.categoryId} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
                  <div className="flex min-w-0 items-center gap-3">
                    {c.categoryColorHex ? (
                      <span
                        className="h-4 w-4 shrink-0 rounded"
                        style={{ backgroundColor: c.categoryColorHex }}
                        aria-hidden
                      />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                        <i className={c.categoryIcon || 'fa-solid fa-tag'} aria-hidden />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{c.categoryName}</p>
                      {c.categorySystemDefined && (
                        <p className="text-xs text-gray-500">System category</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-500">MTD spending</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatMoney(spent, baseCurrency)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
