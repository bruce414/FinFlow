import { useEffect, useMemo, useState, useCallback } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { getCategories } from '../api/categoryApi'
import { getDashboard } from '../api/dashboardApi'
import type { CategoryResponse } from '../types/core/category/CategoryResponse'
import type { DashboardSpendingByCategoryItem } from '../types/core/dashboard/DashboardResponse'

function toNumber(v: unknown): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') return parseFloat(v) || 0
  return 0
}

const FALLBACK_COLORS = ['#6366f1', '#a78bfa', '#c084fc', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#64748b']

export function CategoriesContent() {
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [spendingByCategory, setSpendingByCategory] = useState<DashboardSpendingByCategoryItem[]>([])
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)
    Promise.all([getCategories(), getDashboard()])
      .then(([cats, dash]) => {
        setCategories(cats)
        setSpendingByCategory(dash.spendingByCategory ?? [])
        setCurrency(dash.currency ?? 'USD')
      })
      .catch(() => {
        setCategories([])
        setSpendingByCategory([])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const pieData = useMemo(() => {
    const rows = spendingByCategory
      .map((row) => ({
        name: row.categoryName ?? 'Uncategorized',
        value: Math.abs(toNumber(row.amount?.amount)),
        color: row.colorHex && /^#[0-9A-Fa-f]{6}$/.test(row.colorHex) ? row.colorHex : undefined,
      }))
      .filter((r) => r.value > 0)
    let colorIdx = 0
    return rows.map((r) => ({
      ...r,
      color: r.color ?? FALLBACK_COLORS[colorIdx++ % FALLBACK_COLORS.length],
    }))
  }, [spendingByCategory])

  const formatMoney = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-5 pt-2 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <p className="text-center text-gray-500">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-5 pt-2 pb-8">
      <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

      <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Your categories</h2>
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories yet.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <li
                key={c.categoryId}
                className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2.5"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: c.categoryColorHex }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{c.categoryName}</p>
                  {c.categorySystemDefined && (
                    <p className="text-xs text-gray-500">System</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Spending by category</h2>
        <p className="mb-4 text-sm text-gray-500">Based on your outflows this month (dashboard data).</p>
        {pieData.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <p className="text-center text-sm text-gray-500">No spending data to chart yet.</p>
          </div>
        ) : (
          <div className="h-[320px] w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="#fff" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    value != null ? [formatMoney(Number(value)), 'Spent'] : ['—', 'Spent']
                  }
                />
                <Legend layout="horizontal" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
