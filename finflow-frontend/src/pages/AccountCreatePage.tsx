import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAccount } from '../api/accountApi'
import type { AccountCreateRequest } from '../types/core/account/AccountCreateRequest'
import { CURRENCY_OPTIONS } from '../constants/currencies'

const ACCOUNT_TYPES = ['CASH', 'CREDIT_CARD', 'CHECKING', 'SAVINGS']
const ACCOUNT_ORIGINS = ['MANUAL', 'OPEN_BANKING', 'IMPORT']

export function AccountCreatePage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accountDisplayName, setAccountDisplayName] = useState('')
  const [providerAccountName, setProviderAccountName] = useState('')
  const [accountType, setAccountType] = useState('CHECKING')
  const [accountOrigin, setAccountOrigin] = useState('MANUAL')
  const [accountNumberLast4, setAccountNumberLast4] = useState('')
  const [institutionName, setInstitutionName] = useState('')
  const [institutionCode, setInstitutionCode] = useState('USD')
  const [amount, setAmount] = useState('0')
  const [currencyCode, setCurrencyCode] = useState('USD')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const body: AccountCreateRequest = {
        accountDisplayName: accountDisplayName.trim() || providerAccountName.trim() || 'My account',
        providerAccountName: providerAccountName.trim() || accountDisplayName.trim() || 'Account',
        accountType,
        accountOrigin,
        accountNumberLast4: accountNumberLast4.replace(/\D/g, '').slice(-4) || '0000',
        institutionName: institutionName.trim() || 'Manual',
        institutionCode: institutionCode.trim().slice(0, 3).toUpperCase() || 'USD',
        moneyRequest: {
          amount: parseFloat(amount) || 0,
          currencyCode: currencyCode.trim() || 'USD',
        },
      }
      await createAccount(body)
      navigate('/app/accounts')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto p-8">
      <div className="mx-auto w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate('/app/accounts')}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <i className="fa-solid fa-arrow-left" aria-hidden />
          Go back
        </button>
        <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Add account
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your account information. You can add more later.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="account-display-name" className="mb-1 block text-sm font-medium text-gray-700">
              Account display name
            </label>
            <input
              id="account-display-name"
              type="text"
              value={accountDisplayName}
              onChange={(e) => setAccountDisplayName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Main checking"
              maxLength={30}
            />
          </div>

          <div>
            <label htmlFor="account-provider-name" className="mb-1 block text-sm font-medium text-gray-700">
              Provider account name
            </label>
            <input
              id="account-provider-name"
              type="text"
              value={providerAccountName}
              onChange={(e) => setProviderAccountName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Chase Checking"
              maxLength={30}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="account-type" className="mb-1 block text-sm font-medium text-gray-700">
                Account type
              </label>
              <select
                id="account-type"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="account-origin" className="mb-1 block text-sm font-medium text-gray-700">
                Origin
              </label>
              <select
                id="account-origin"
                value={accountOrigin}
                onChange={(e) => setAccountOrigin(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {ACCOUNT_ORIGINS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="account-last4" className="mb-1 block text-sm font-medium text-gray-700">
              Account number (last 4 digits)
            </label>
            <input
              id="account-last4"
              type="text"
              value={accountNumberLast4}
              onChange={(e) => setAccountNumberLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="1234"
              maxLength={4}
            />
          </div>

          <div>
            <label htmlFor="institution-name" className="mb-1 block text-sm font-medium text-gray-700">
              Institution name
            </label>
            <input
              id="institution-name"
              type="text"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Chase Bank"
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="institution-code" className="mb-1 block text-sm font-medium text-gray-700">
              Institution code (3 letters)
            </label>
            <input
              id="institution-code"
              type="text"
              value={institutionCode}
              onChange={(e) => setInstitutionCode(e.target.value.slice(0, 3).toUpperCase())}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="USD"
              maxLength={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="initial-amount" className="mb-1 block text-sm font-medium text-gray-700">
                Initial balance (amount)
              </label>
              <input
                id="initial-amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="currency" className="mb-1 block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                id="currency"
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {CURRENCY_OPTIONS.map(({ code, name }) => (
                  <option key={code} value={code}>
                    {code} – {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {saving ? 'Creating…' : 'Add account'}
          </button>
        </form>
      </div>
    </div>
  )
}
