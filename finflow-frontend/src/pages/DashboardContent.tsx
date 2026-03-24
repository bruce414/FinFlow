import { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { RollingCardPanel } from '../components/Dashboard/RollingCardPanel'
import { BalanceChartPanel } from '../components/Dashboard/BalanceChartPanel'
import type { DashboardChartData, ChartPeriod, ChartViewType } from '../components/Dashboard/BalanceChartPanel'
import type { AccountSummary } from '../types/core/account/AccountSummary'
import type { DashboardResponse, DashboardTransactionItem } from '../types/core/dashboard/DashboardResponse'
import { getAccounts } from '../api/accountApi'
import { getDashboard } from '../api/dashboardApi'
import { getBudgets } from '../api/budgetApi'
import type { BudgetSummary } from '../types/core/budget/BudgetSummary'

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

function formatPeriodType(periodType: string): string {
  const map: Record<string, string> = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    YEARLY: 'yearly',
    CUSTOM: 'custom',
  }
  return map[periodType] ?? periodType.toLowerCase()
}

function getDateRange(period: ChartPeriod): { start: Date; end: Date } {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  const start = new Date(end)
  switch (period) {
    case '1d':
      start.setHours(0, 0, 0, 0)
      break
    case '7d':
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      break
    case '14d':
      start.setDate(start.getDate() - 13)
      start.setHours(0, 0, 0, 0)
      break
    case '30d':
      start.setDate(start.getDate() - 29)
      start.setHours(0, 0, 0, 0)
      break
    case '6M':
      start.setMonth(start.getMonth() - 5)
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      break
    case '1Y':
      start.setFullYear(start.getFullYear() - 1)
      start.setMonth(start.getMonth())
      start.setDate(start.getDate() + 1)
      start.setHours(0, 0, 0, 0)
      break
    default:
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
  }
  return { start, end }
}

/** Format a Date as local YYYY-MM-DD so chart buckets match API postedDate (calendar date). */
function toLocalDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function buildChartDataFromTransactions(
  transactions: DashboardTransactionItem[],
  period: ChartPeriod
): Array<{ day: string; fullDate: string; savings: number; income: number; expenses: number }> {
  const { start, end } = getDateRange(period)
  const dayLabels: Array<{ date: Date; label: string; fullDate: string }> = []
  const cursor = new Date(start)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  while (cursor <= end) {
    dayLabels.push({
      date: new Date(cursor),
      label: period === '1d' ? 'Today' : dayNames[cursor.getDay()],
      fullDate: cursor.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    })
    cursor.setDate(cursor.getDate() + 1)
  }
  if (dayLabels.length === 0) return []

  const byDate = new Map<string, { income: number; expenses: number }>()
  for (const { date } of dayLabels) {
    const key = toLocalDateKey(date)
    byDate.set(key, { income: 0, expenses: 0 })
  }
  for (const t of transactions) {
    const key = t.postedDate?.slice(0, 10)
    if (!key) continue
    const amt = toNumber(t.amount?.amount ?? 0)
    const absAmt = Math.abs(amt)
    const entry = byDate.get(key)
    if (!entry) continue
    if (t.direction === 'IN') {
      entry.income += absAmt
    } else if (t.direction === 'OUT') {
      entry.expenses += absAmt
    }
  }

  return dayLabels.map(({ date, label, fullDate }) => {
    const key = toLocalDateKey(date)
    const entry = byDate.get(key) ?? { income: 0, expenses: 0 }
    return {
      day: period === '1d' ? label : `${label} ${date.getDate()}`,
      fullDate,
      savings: 0,
      income: entry.income,
      expenses: -entry.expenses,
    }
  })
}

export function DashboardContent() {
  const navigate = useNavigate()
  const [selectedCardIndex, setSelectedCardIndex] = useState(0)
  const [viewAllAccounts, setViewAllAccounts] = useState(false)
  const [accounts, setAccounts] = useState<AccountSummary[]>([])
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [budgetsList, setBudgetsList] = useState<BudgetSummary[]>([])
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('7d')
  const [chartView, setChartView] = useState<ChartViewType>('bar')
  const [loading, setLoading] = useState(true)

  const activeAccountId =
    viewAllAccounts || !accounts.length ? null : accounts[selectedCardIndex]?.accountId ?? null
  const activeAccount = activeAccountId ? accounts.find((a) => a.accountId === activeAccountId) : null

  const refresh = useCallback(() => {
    setLoading(true)
    Promise.all([
      getAccounts().catch(() => [] as AccountSummary[]),
      getDashboard().catch(() => null),
      getBudgets().catch(() => [] as BudgetSummary[]),
    ])
      .then(([accountsData, dashboardRes, budgetsData]) => {
        setAccounts(accountsData)
        setDashboard(dashboardRes)
        setBudgetsList(budgetsData)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [refresh])

  const transactionsForView = useMemo(() => {
    const list = dashboard?.recentTransactions ?? []
    if (!activeAccountId) return list
    return list.filter((t) => t.accountId === activeAccountId)
  }, [dashboard?.recentTransactions, activeAccountId])

  const chartData = useMemo(() => {
    if (!dashboard) return undefined
    const data = buildChartDataFromTransactions(transactionsForView, chartPeriod)
    const hasAny = data.some((d) => d.income !== 0 || d.expenses !== 0)
    return hasAny ? data : undefined
  }, [dashboard, chartPeriod, transactionsForView])

  const dashboardData: DashboardChartData | null = useMemo(() => {
    if (!dashboard) return null
    if (activeAccountId && activeAccount) {
      const totalBalance = toNumber(activeAccount.money?.amount ?? 0)
      const totalIncome = transactionsForView.reduce(
        (sum, t) => (t.direction === 'IN' ? sum + Math.abs(toNumber(t.amount?.amount)) : sum),
        0
      )
      const totalExpenses = transactionsForView.reduce(
        (sum, t) => (t.direction === 'OUT' ? sum + Math.abs(toNumber(t.amount?.amount)) : sum),
        0
      )
      return {
        totalBalance,
        totalIncome: totalIncome !== 0 ? totalIncome : undefined,
        totalExpenses: totalExpenses !== 0 ? totalExpenses : undefined,
        savedBalance: undefined,
        incomeTrend: undefined,
        expensesTrend: undefined,
        savedTrend: undefined,
        chartData: chartData ?? undefined,
      }
    }
    const apiBalance = toNumber(dashboard.totalBalance?.totalBalance?.amount)
    const apiIncome = toNumber(dashboard.monthlyIncome?.monthlyIncome?.amount)
    const apiExpenses = toNumber(dashboard.monthlySpending?.monthlySpending?.amount)
    const balanceFromAccounts =
      dashboard.accounts?.reduce((sum, a) => sum + toNumber(a.balance?.amount), 0) ?? 0
    const totalBalance = apiBalance !== 0 ? apiBalance : balanceFromAccounts
    let totalIncome = apiIncome
    let totalExpenses = apiExpenses
    if (totalIncome === 0 && totalExpenses === 0 && (dashboard.recentTransactions?.length ?? 0) > 0) {
      totalIncome = (dashboard.recentTransactions ?? []).reduce(
        (sum, t) => (t.direction === 'IN' ? sum + Math.abs(toNumber(t.amount?.amount)) : sum),
        0
      )
      totalExpenses = (dashboard.recentTransactions ?? []).reduce(
        (sum, t) => (t.direction === 'OUT' ? sum + Math.abs(toNumber(t.amount?.amount)) : sum),
        0
      )
    }
    return {
      totalBalance,
      totalIncome: totalIncome !== 0 ? totalIncome : undefined,
      totalExpenses: totalExpenses !== 0 ? totalExpenses : undefined,
      savedBalance: undefined,
      incomeTrend: undefined,
      expensesTrend: undefined,
      savedTrend: undefined,
      chartData: chartData ?? undefined,
    }
  }, [dashboard, chartData, activeAccountId, activeAccount, transactionsForView])

  const handlePeriodChange = useCallback((period: ChartPeriod) => {
    setChartPeriod(period)
  }, [])

  const handleChartViewChange = useCallback((view: ChartViewType) => {
    setChartView(view)
  }, [])

  const handleSelectCardIndex = useCallback((index: number) => {
    setSelectedCardIndex(index)
    setViewAllAccounts(false)
  }, [])

  const hasAccounts = accounts.length > 0

  if (loading && !hasAccounts) {
    return (
      <div className="flex flex-col px-5 pt-2 pb-2">
        <div className="flex flex-row items-center justify-center gap-6 rounded-xl bg-white p-8 shadow-sm">
          <p className="text-gray-500">Loading…</p>
        </div>
      </div>
    )
  }

  if (!hasAccounts) {
    return (
      <div className="flex flex-col px-5 pt-2 pb-2">
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-white p-8 shadow-sm">
          <p className="text-center text-gray-600">There&apos;s nothing to show.</p>
          <button
            type="button"
            onClick={() => navigate('/app/transactions')}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            Add accounts
          </button>
        </div>
      </div>
    )
  }

  const budgetAlerts = dashboard?.budgetAlerts ?? []

  return (
    <div className="flex flex-col gap-4 px-5 pt-2 pb-2">
      {budgetAlerts.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm"
        >
          <p className="font-semibold text-amber-900">Budget limit reached</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-900/90">
            {budgetAlerts.map((a) => (
              <li key={a.budgetId}>
                Budget &quot;{a.budgetName}&quot; ({formatPeriodType(a.periodType)}): spent{' '}
                {formatMoney(a.spent)} vs limit {formatMoney(a.limit)} (period {a.periodStart} – {a.periodEnd}).
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-row items-center gap-6 rounded-xl bg-white p-4 shadow-sm">
        <RollingCardPanel
          accounts={accounts}
          selectedIndex={selectedCardIndex}
          onSelectIndex={handleSelectCardIndex}
        />
        <BalanceChartPanel
          dashboard={dashboardData}
          period={chartPeriod}
          onPeriodChange={handlePeriodChange}
          chartView={chartView}
          onChartViewChange={handleChartViewChange}
          showAllAccounts={viewAllAccounts}
          onToggleViewAll={() => setViewAllAccounts((v) => !v)}
        />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Budgets</h2>
          <button
            type="button"
            onClick={() => navigate('/app/budget')}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            Add budget
          </button>
        </div>
        {budgetsList.length === 0 ? (
          <p className="text-sm text-gray-600">
            No budgets yet. Add a budget to set limits by category and period and track spending.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {budgetsList.map((b) => (
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
