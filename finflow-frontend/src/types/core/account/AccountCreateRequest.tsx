import type { MoneyDto } from "../money/MoneyDto"

/** Request body for creating an account. Matches backend AccountCreateDto. */
export interface AccountCreateRequest {
    accountDisplayName: string
    providerAccountName: string
    accountType: string
    accountOrigin: string
    accountNumberLast4: string
    institutionName: string
    institutionCode: string
    moneyRequest: MoneyDto
  }