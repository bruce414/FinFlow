import { getCsrf, authFetch, parseJsonOrThrow } from './authApi'
import type { AccountDetails } from '../types/core/account/AccountDetails'
import type { AccountSummary } from '../types/core/account/AccountSummary'
import type { AccountCreateRequest } from '../types/core/account/AccountCreateRequest'
import type { AccountRenameRequest } from '../types/core/account/AccountRenameRequest'

const ACCOUNT_PATH = '/api/v1/me/accounts'

function handleAuthError(res: Response): void {
  if (res.status === 401 || res.status === 403) {
    throw new Error('Session expired or invalid. Please log in again.')
  }
}

/** GET /api/v1/me/accounts – list all active accounts for the current user */
export async function getAccounts(): Promise<AccountSummary[]> {
  const res = await authFetch(ACCOUNT_PATH)
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  return parseJsonOrThrow(res) as Promise<AccountSummary[]>
}

/** GET /api/v1/me/accounts/archived – list archived (deactivated) accounts */
export async function getArchivedAccounts(): Promise<AccountSummary[]> {
  const res = await authFetch(`${ACCOUNT_PATH}/archived`)
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  return parseJsonOrThrow(res) as Promise<AccountSummary[]>
}

/** GET /api/v1/me/accounts/{accountId} – get one account by id */
export async function getAccountById(accountId: string): Promise<AccountDetails> {
  const res = await authFetch(`${ACCOUNT_PATH}/${accountId}`)
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  return parseJsonOrThrow(res) as Promise<AccountDetails>
}

/** POST /api/v1/me/accounts – create an account. Uses CSRF token. */
export async function createAccount(body: AccountCreateRequest): Promise<AccountDetails> {
  const { token } = await getCsrf()
  const res = await authFetch(ACCOUNT_PATH, {
    method: 'POST',
    body: JSON.stringify(body),
    csrfToken: token,
  })
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  return parseJsonOrThrow(res) as Promise<AccountDetails>
}

/** PATCH /api/v1/me/accounts/{accountId} – rename an account. Uses CSRF token. */
export async function patchAccount(accountId: string, body: AccountRenameRequest): Promise<AccountDetails> {
  const { token } = await getCsrf()
  const res = await authFetch(`${ACCOUNT_PATH}/${accountId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    csrfToken: token,
  })
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
  return parseJsonOrThrow(res) as Promise<AccountDetails>
}

/** DELETE /api/v1/me/accounts/{accountId} – deactivate an account. Uses CSRF token. */
export async function deleteAccount(accountId: string): Promise<void> {
  const { token } = await getCsrf()
  const res = await authFetch(`${ACCOUNT_PATH}/${accountId}`, { method: 'DELETE', csrfToken: token })
  handleAuthError(res)
  if (!res.ok) {
    throw new Error(res.statusText || `Request failed (${res.status})`)
  }
}
