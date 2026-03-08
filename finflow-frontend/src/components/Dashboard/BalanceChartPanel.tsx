import {
  Bar,
  BarChart,
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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const MOCK_CHART_DATA = DAYS.map((day, i) => ({
  day,
  fullDate: `${day}, ${7 + i} Jan 2025`,
  savings: [240, 180, 320, 240, 200, 280, 220][i],
  income: [700, 500, 650, 700, 600, 720, 580][i],
  expenses: [-460, -380, -520, -460, -420, -490, -410][i],
}))

const MOCK_SUMMARY = {
  balance: 12450,
  totalIncome: 15000,
  totalExpenses: 6700,
  savedBalance: 8300,
  incomeTrend: 5.1,
  expensesTrend: -15.5,
  savedTrend: 20.7,
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length || !label) return null
  const point = MOCK_CHART_DATA.find((d) => d.day === label)
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

export function BalanceChartPanel() {
  return (
    <div className="flex min-w-0 flex-1 gap-6">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              ${MOCK_SUMMARY.balance.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Balance overview</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
              <option>7d</option>
              <option>14d</option>
              <option>30d</option>
            </select>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                type="button"
                className="rounded-md bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700"
              >
                <i className="fa-solid fa-chart-bar" aria-hidden />
              </button>
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100"
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MOCK_CHART_DATA}
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
                domain={[-10, 30]}
                tickFormatter={(v) => (v >= 0 ? v : v)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }} />
              <Bar dataKey="expenses" stackId="a" fill={THEME.expenses} radius={[0, 0, 4, 4]} />
              <Bar dataKey="income" stackId="a" fill={THEME.income} />
              <Bar dataKey="savings" stackId="a" fill={THEME.savings} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex w-52 shrink-0 flex-col gap-6 border-l border-gray-100 pl-6">
        <div>
          <p className="text-sm font-medium text-gray-500">Total income</p>
          <p className="text-2xl font-bold text-gray-900">
            ${MOCK_SUMMARY.totalIncome.toLocaleString()}
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm text-emerald-600">
            <i className="fa-solid fa-arrow-up" aria-hidden />
            {MOCK_SUMMARY.incomeTrend}% from last month
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total expenses</p>
          <p className="text-2xl font-bold text-gray-900">
            ${MOCK_SUMMARY.totalExpenses.toLocaleString()}
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm text-amber-600">
            <i className="fa-solid fa-arrow-down" aria-hidden />
            {Math.abs(MOCK_SUMMARY.expensesTrend)}% from last month
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Saved balance</p>
          <p className="text-2xl font-bold text-gray-900">
            ${MOCK_SUMMARY.savedBalance.toLocaleString()}
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm text-emerald-600">
            <i className="fa-solid fa-arrow-up" aria-hidden />
            {MOCK_SUMMARY.savedTrend}% from last month
          </p>
        </div>
      </div>
    </div>
  )
}
