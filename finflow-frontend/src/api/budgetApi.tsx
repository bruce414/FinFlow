import { getCsrf, authFetch, parseJsonOrThrow } from './authApi'
import type { BudgetSummary } from '../types/core/budget/BudgetSummary'

const BASE = '/api/v1/me/budgets'

function handleAuthError(res: Response): void {
  if (res.status === 401 || res.status === 403) {
    throw new Error('Session expired or invalid. Please log in again.')
  }
}

export async function getBudgets(): Promise<BudgetSummary[]> {
  const res = await authFetch(BASE)
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  const data = await parseJsonOrThrow(res)
  return Array.isArray(data) ? (data as BudgetSummary[]) : []
}

export interface BudgetCreatePayload {
  budgetName: string
  periodType: string
  startDate: string
  budgetLimit: { amount: number; currencyCode: string }
  enableRollover: boolean
  categoryId: string
}

export async function createBudget(body: BudgetCreatePayload): Promise<unknown> {
  const { token } = await getCsrf()
  const res = await authFetch(BASE, {
    method: 'POST',
    body: JSON.stringify(body),
    csrfToken: token,
  })
  handleAuthError(res)
  if (!res.ok) {
    const text = await res.text()
    let msg = text || res.statusText || `Request failed (${res.status})`
    try {
      const j = JSON.parse(text) as { message?: string }
      if (j?.message) msg = j.message
    } catch {
      /* use msg */
    }
    throw new Error(msg)
  }
  return parseJsonOrThrow(res)
}
