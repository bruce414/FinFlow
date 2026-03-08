import { useState } from 'react'
import {
  CardStackView,
  CardNavButtons,
} from '../components/Dashboard/RollingCardPanel'

const CARD_DETAILS = [
  {
    cardName: 'Excellence from start to end',
    holderName: 'Alex Morgan',
    expiresAt: '12/28',
  },
  {
    cardName: 'Premium rewards',
    holderName: 'Jordan Lee',
    expiresAt: '09/27',
  },
  {
    cardName: 'Business essentials',
    holderName: 'Sam Chen',
    expiresAt: '03/29',
  },
  {
    cardName: 'Savings goal',
    holderName: 'Riley Kim',
    expiresAt: '06/26',
  },
]

const QUICK_PAYMENTS = [
  { id: '1', name: 'Emma Wilson', initials: 'EW', color: 'bg-indigo-500' },
  { id: '2', name: 'James Park', initials: 'JP', color: 'bg-emerald-500' },
  { id: '3', name: 'Maya Johnson', initials: 'MJ', color: 'bg-amber-500' },
  { id: '4', name: 'Oscar Davis', initials: 'OD', color: 'bg-rose-500' },
]

export function AccountsTransactionsContent({
  onViewTransactions,
}: {
  onViewTransactions: (cardIndex: number) => void
}) {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0)

  const card = CARD_DETAILS[selectedCardIndex]

  return (
    <div className="flex flex-col gap-6 px-5 pt-2 pb-2">
      <h1 className="text-2xl font-bold text-gray-900">
        Accounts & Transactions
      </h1>

      {/* Card + details + arrows container */}
      <div className="flex flex-row flex-wrap items-stretch gap-6 rounded-xl bg-white p-6 shadow-sm">
        <CardStackView selectedIndex={selectedCardIndex} />

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-500">Card name</p>
            <p className="text-base font-semibold text-gray-900">
              {card.cardName}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-500">Cardholder</p>
            <p className="text-base font-semibold text-gray-900">
              {card.holderName}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-500">Expires</p>
            <p className="text-base font-semibold text-gray-900">
              {card.expiresAt}
            </p>
          </div>
          <div className="mt-2">
            <p className="mb-3 text-sm font-medium text-gray-500">
              Quick payments
            </p>
            <div className="flex flex-wrap gap-3">
              {QUICK_PAYMENTS.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${person.color} text-xs font-semibold text-white`}
                  >
                    {person.initials}
                  </span>
                  <span>{person.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => onViewTransactions(selectedCardIndex)}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              <i className="fa-solid fa-list" aria-hidden />
              View transactions
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center">
          <CardNavButtons
            selectedIndex={selectedCardIndex}
            onSelectIndex={setSelectedCardIndex}
          />
        </div>
      </div>
    </div>
  )
}
