import type { MoneyDto } from '../money/MoneyDto'

export interface DashboardTotalBalance {
  totalBalance: MoneyDto
}

export interface DashboardMonthlySpending {
  monthlySpending: MoneyDto
}

export interface DashboardIncome {
  monthlyIncome: MoneyDto
}

export interface DashboardSpendingByCategoryItem {
  categoryId: string | null
  categoryName: string | null
  colorHex: string | null
  amount: MoneyDto
}

export interface DashboardAccountItem {
  accountId: string
  displayName: string
  balance: MoneyDto
  accountType: string
  institutionName: string
}

export interface DashboardTransactionItem {
  transactionId: string
  accountId: string
  direction: string
  amount: MoneyDto
  postedDate: string
  counterpartyName: string
  categoryId: string | null
}

export interface DashboardBudgetAlertItem {
  budgetId: string
  budgetName: string
  periodType: string
  periodStart: string
  periodEnd: string
  limit: MoneyDto
  spent: MoneyDto
}

export interface DashboardResponse {
  asOf: string
  currency: string
  totalBalance: DashboardTotalBalance
  monthlySpending: DashboardMonthlySpending
  monthlyIncome: DashboardIncome
  spendingByCategory: DashboardSpendingByCategoryItem[]
  accounts: DashboardAccountItem[]
  recentTransactions: DashboardTransactionItem[]
  budgetAlerts: DashboardBudgetAlertItem[]
}
