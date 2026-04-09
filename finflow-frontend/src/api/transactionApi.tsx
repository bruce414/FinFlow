import { getCsrf, authFetch, parseJsonOrThrow } from './authApi'
import type { TransactionCreateRequest } from '../types/core/transaction/TransactionCreateRequest'

function transactionPath(accountId: string) {
  return `/api/v1/me/accounts/${accountId}/transactions`
}

function handleAuthError(res: Response): void {
  if (res.status === 401 || res.status === 403) {
    throw new Error('Session expired or invalid. Please log in again.')
  }
}

/** POST /api/v1/me/accounts/{accountId}/transactions – create a manual transaction */
export async function createTransaction(
  accountId: string,
  body: TransactionCreateRequest
): Promise<unknown> {
  const { token } = await getCsrf()
  const res = await authFetch(transactionPath(accountId), {
    method: 'POST',
    body: JSON.stringify(body),
    csrfToken: token,
  })
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  return parseJsonOrThrow(res)
}

/** GET /api/v1/me/accounts/{accountId}/transactions – list transactions for account */
export async function getTransactions(accountId: string): Promise<unknown[]> {
  const res = await authFetch(transactionPath(accountId))
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  return parseJsonOrThrow(res) as Promise<unknown[]>
}
