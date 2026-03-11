import type { MoneyDto } from "../money/MoneyDto"

/** Single account full details (GET by id, POST create, PATCH rename). Matches backend AccountDetailsOutDto. */
export interface AccountDetails {
  accountId: string
  accountType: string
  accountOrigin: string
  providerAccountName: string
  accountDisplayName: string
  accountNumberLast4: string
  institutionName: string
  institutionCode: string
  money: MoneyDto
  active: boolean
}