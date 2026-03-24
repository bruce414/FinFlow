import type { MoneyDto } from '../money/MoneyDto'

export interface BudgetSummary {
  budgetId: string
  budgetName: string
  startDate: string
  budgetLimit: MoneyDto
  categoryId: string
  enableRollover: boolean
  active: boolean
}
