import type { MoneyDto } from '../money/MoneyDto'

export interface TransactionSummary {
  transactionId: string
  postedDate: string
  direction: string
  moneyResponse: MoneyDto
  categoryId: string | null
  categoryName: string | null
  counterpartyName: string
}
