import type { MoneyDto } from '../money/MoneyDto'

/** Request body for creating a transaction. Matches backend TransactionCreateDto. */
export interface TransactionCreateRequest {
  moneyRequest: MoneyDto
  postedDate: string // YYYY-MM-DD
  transactionType: 'CREDIT' | 'DEBIT' | 'TRANSFER'
  reference?: string | null
  counterpartyName: string
  counterpartyType: 'PERSON' | 'MERCHANT' | 'BANK' | 'Government' | 'UNKNOWN'
}
