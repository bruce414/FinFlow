import { authFetch, parseJsonOrThrow } from './authApi'
import type { BudgetSummary } from '../types/core/budget/BudgetSummary'

const BUDGETS_PATH = '/api/v1/me/budgets'

function handleAuthError(res: Response): void {
  if (res.status === 401 || res.status === 403) {
    throw new Error('Session expired or invalid. Please log in again.')
  }
}

/** GET /api/v1/me/budgets – list budgets for the current user */
export async function getBudgets(): Promise<BudgetSummary[]> {
  const res = await authFetch(BUDGETS_PATH)
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  return parseJsonOrThrow(res) as Promise<BudgetSummary[]>
}
