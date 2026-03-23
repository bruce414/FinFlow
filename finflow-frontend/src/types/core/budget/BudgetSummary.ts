export interface BudgetSummary {
  budgetId: string
  budgetName: string
  startDate: string
  budgetLimit: { amount: number; currencyCode: string }
  categoryId: string
  enableRollover: boolean
  active: boolean
}
