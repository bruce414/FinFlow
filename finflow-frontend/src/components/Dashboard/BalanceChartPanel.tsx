import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts'

const THEME = {
  savings: '#a78bfa',
  income: '#6366f1',
  expenses: '#c084fc',
  text: '#374151',
  textMuted: '#6b7280',
  grid: '#e5e7eb',
}

export type ChartPeriod = '1d' | '7d' | '14d' | '30d' | '6M' | '1Y'

export const CHART_PERIODS: ChartPeriod[] = ['1d', '7d', '14d', '30d', '6M', '1Y']

export interface DashboardChartData {
  totalBalance: number
  totalIncome?: number
  totalExpenses?: number
  savedBalance?: number
  incomeTrend?: number
  expensesTrend?: number
  savedTrend?: number
  chartData?: Array<{ day: string; fullDate: string; savings: number; income: number; expenses: number }>
}

function CustomTooltip(props: {
  active?: boolean
  payload?: readonly unknown[]
  label?: string
  chartData?: Array<{ day: string; fullDate: string; savings: number; income: number; expenses: number }>
}) {
  const { active, payload, label, chartData } = props
  if (!active || !payload?.length || label === undefined || !chartData?.length) return null
  const point = chartData.find((d) => d.day === label)
  if (!point) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-medium text-gray-800">{point.fullDate}</p>
      <div className="mt-2 space-y-1">
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <span className="h-2 w-2 rounded-full" style={{ background: THEME.savings }} />
          Savings ${point.savings}
        </p>
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <span className="h-2 w-2 rounded-full" style={{ background: THEME.income }} />
          Income ${point.income}
        </p>
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <span className="h-2 w-2 rounded-full" style={{ background: THEME.expenses }} />
          Expenses ${Math.abs(point.expenses)}
        </p>
      </div>
    </div>
  )
}

export type ChartViewType = 'bar' | 'line'

export function BalanceChartPanel({
  dashboard,
  period = '7d',
  onPeriodChange,
  chartView = 'bar',
  onChartViewChange,
  showAllAccounts = false,
  onToggleViewAll,
}: {
  dashboard?: DashboardChartData | null
  period?: ChartPeriod
  onPeriodChange?: (period: ChartPeriod) => void
  chartView?: ChartViewType
  onChartViewChange?: (view: ChartViewType) => void
  showAllAccounts?: boolean
  onToggleViewAll?: () => void
}) {
  const hasSpending =
    dashboard?.chartData && dashboard.chartData.length > 0
  const balance = dashboard?.totalBalance ?? 0
  const totalIncome = dashboard?.totalIncome
  const totalExpenses = dashboard?.totalExpenses
  const savedBalance = dashboard?.savedBalance
  const chartData = hasSpending ? dashboard!.chartData! : []
  const showPlaceholderChart = !hasSpending

  return (
    <div className="flex min-w-0 flex-1 gap-6">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              ${typeof balance === 'number' ? balance.toLocaleString() : balance}
            </p>
            <p className="text-sm text-gray-500">
              Balance overview
              {showAllAccounts ? ' (all accounts)' : ' (active account)'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onToggleViewAll && (
              <button
                type="button"
                onClick={onToggleViewAll}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                {showAllAccounts ? 'View active account' : 'View all accounts'}
              </button>
            )}
            <select
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700"
              value={period}
              onChange={(e) => onPeriodChange?.(e.target.value as ChartPeriod)}
              aria-label="Chart period"
            >
              {CHART_PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => onChartViewChange?.('bar')}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  chartView === 'bar'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="Bar chart"
                aria-pressed={chartView === 'bar'}
              >
                <i className="fa-solid fa-chart-bar" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => onChartViewChange?.('line')}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  chartView === 'line'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="Line chart"
                aria-pressed={chartView === 'line'}
              >
                <i className="fa-solid fa-chart-line" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded"
              style={{ background: THEME.savings }}
              aria-hidden
            />
            Savings
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded"
              style={{ background: THEME.income }}
              aria-hidden
            />
            Income
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded"
              style={{ background: THEME.expenses }}
              aria-hidden
            />
            Expenses
          </span>
        </div>

        <div className="mt-4 h-64 w-full">
          {showPlaceholderChart && (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 text-sm text-gray-500">
              No spending activity yet. Add transactions to see the chart.
            </div>
          )}
          {!showPlaceholderChart && chartView === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 8, left: 8, bottom: 0 }}
              stackOffset="sign"
            >
              <ReferenceLine y={0} stroke={THEME.grid} strokeWidth={1} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: THEME.textMuted }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: THEME.textMuted }}
                domain={['auto', 'auto']}
                tickFormatter={(v) => (typeof v === 'number' && v >= 0 ? v : v)}
              />
              <Tooltip
                content={(props: Record<string, unknown>) => (
                  <CustomTooltip {...(props as Parameters<typeof CustomTooltip>[0])} chartData={chartData} />
                )}
                cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }}
              />
              <Bar dataKey="expenses" stackId="a" fill={THEME.expenses} radius={[0, 0, 4, 4]} />
              <Bar dataKey="income" stackId="a" fill={THEME.income} />
              <Bar dataKey="savings" stackId="a" fill={THEME.savings} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          )}
          {!showPlaceholderChart && chartView === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 12, right: 8, left: 8, bottom: 0 }}
            >
              <ReferenceLine y={0} stroke={THEME.grid} strokeWidth={1} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: THEME.textMuted }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: THEME.textMuted }}
                domain={['auto', 'auto']}
                tickFormatter={(v) => (typeof v === 'number' && v >= 0 ? v : v)}
              />
              <Tooltip
                content={(props: Record<string, unknown>) => (
                  <CustomTooltip {...(props as Parameters<typeof CustomTooltip>[0])} chartData={chartData} />
                )}
                cursor={{ stroke: THEME.grid, strokeWidth: 1 }}
              />
              <Line type="monotone" dataKey="income" stroke={THEME.income} strokeWidth={2} dot={{ r: 3 }} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke={THEME.expenses} strokeWidth={2} dot={{ r: 3 }} name="Expenses" />
              <Line type="monotone" dataKey="savings" stroke={THEME.savings} strokeWidth={2} dot={{ r: 3 }} name="Savings" />
            </LineChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="flex w-52 shrink-0 flex-col gap-6 border-l border-gray-100 pl-6">
        <div>
          <p className="text-sm font-medium text-gray-500">Total income</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalIncome != null ? `$${totalIncome.toLocaleString()}` : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total expenses</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalExpenses != null ? `$${totalExpenses.toLocaleString()}` : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Saved balance</p>
          <p className="text-2xl font-bold text-gray-900">
            {savedBalance != null ? `$${savedBalance.toLocaleString()}` : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}
