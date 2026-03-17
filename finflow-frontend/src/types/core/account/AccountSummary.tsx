import type { MoneyDto } from '../money/MoneyDto'

/** Summary item in list (GET all accounts). Matches backend AccountSummaryResponseDto. */
export interface AccountSummary {
  accountId: string
  accountType: string
  accountOrigin: string
  providerAccountName: string
  accountDisplayName: string
  accountNumberLast4: string
  money: MoneyDto
  active: boolean
}
  