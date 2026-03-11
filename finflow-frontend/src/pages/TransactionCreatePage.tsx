import { useState } from 'react'
import { createTransaction } from '../api/transactionApi'
import type { TransactionCreateRequest } from '../types/core/transaction/TransactionCreateRequest'

const TRANSACTION_TYPES = ['CREDIT', 'DEBIT', 'TRANSFER'] as const
const COUNTERPARTY_TYPES = ['PERSON', 'MERCHANT', 'BANK', 'Government', 'UNKNOWN'] as const

export function TransactionCreatePage({
  accountId,
  onSuccess,
  onBack,
}: {
  accountId: string
  onSuccess: () => void
  onBack: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [currencyCode, setCurrencyCode] = useState('USD')
  const [postedDate, setPostedDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [transactionType, setTransactionType] = useState<'CREDIT' | 'DEBIT' | 'TRANSFER'>('DEBIT')
  const [reference, setReference] = useState('')
  const [counterpartyName, setCounterpartyName] = useState('')
  const [counterpartyType, setCounterpartyType] = useState<(typeof COUNTERPARTY_TYPES)[number]>('MERCHANT')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const numAmount = parseFloat(amount)
    if (Number.isNaN(numAmount)) {
      setError('Enter a valid amount')
      return
    }
    const sign = transactionType === 'CREDIT' ? 1 : transactionType === 'DEBIT' ? -1 : 0
    const signedAmount = sign * Math.abs(numAmount)
    setSaving(true)
    try {
      const body: TransactionCreateRequest = {
        moneyRequest: {
          amount: signedAmount,
          currencyCode: currencyCode.trim().slice(0, 3).toUpperCase() || 'USD',
        },
        postedDate,
        transactionType,
        reference: reference.trim() || undefined,
        counterpartyName: counterpartyName.trim() || 'Unknown',
        counterpartyType,
      }
      await createTransaction(accountId, body)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto p-8">
      <div className="mx-auto w-full max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <i className="fa-solid fa-arrow-left" aria-hidden />
          Go back
        </button>
        <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Add transaction
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manually add an income or expense for this account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="tx-type" className="mb-1 block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="tx-type"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as 'CREDIT' | 'DEBIT' | 'TRANSFER')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {TRANSACTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tx-amount" className="mb-1 block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                id="tx-amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label htmlFor="tx-currency" className="mb-1 block text-sm font-medium text-gray-700">
                Currency
              </label>
              <input
                id="tx-currency"
                type="text"
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value.slice(0, 3).toUpperCase())}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                maxLength={3}
              />
            </div>
          </div>

          <div>
            <label htmlFor="tx-date" className="mb-1 block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              id="tx-date"
              type="date"
              value={postedDate}
              onChange={(e) => setPostedDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="tx-counterparty" className="mb-1 block text-sm font-medium text-gray-700">
              Counterparty name
            </label>
            <input
              id="tx-counterparty"
              type="text"
              value={counterpartyName}
              onChange={(e) => setCounterpartyName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Coffee Shop"
              maxLength={255}
              required
            />
          </div>

          <div>
            <label htmlFor="tx-counterparty-type" className="mb-1 block text-sm font-medium text-gray-700">
              Counterparty type
            </label>
            <select
              id="tx-counterparty-type"
              value={counterpartyType}
              onChange={(e) => setCounterpartyType(e.target.value as (typeof COUNTERPARTY_TYPES)[number])}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {COUNTERPARTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tx-reference" className="mb-1 block text-sm font-medium text-gray-700">
              Reference (optional)
            </label>
            <input
              id="tx-reference"
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              maxLength={255}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {saving ? 'Adding…' : 'Add transaction'}
          </button>
        </form>
      </div>
    </div>
  )
}
