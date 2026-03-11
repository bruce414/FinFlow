export const CARD_HEIGHT = 176
export const CARD_WIDTH = 320
const PEEK_OFFSET = 52
export const STACK_HEIGHT = CARD_HEIGHT + PEEK_OFFSET * 2

export const CARD_GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #8b5cf6 100%)',
  'linear-gradient(135deg, #5b21b6 0%, #6d28d9 50%, #7c3aed 100%)',
  'linear-gradient(135deg, #3730a3 0%, #5b21b6 50%, #6d28d9 100%)',
]

export const MOCK_CARDS = [
  { last4: '7645', label: 'Excellence from start to end', balance: '$12,450' },
  { last4: '8921', label: 'Premium rewards', balance: '$8,230' },
  { last4: '4532', label: 'Business essentials', balance: '$24,100' },
  { last4: '1209', label: 'Savings goal', balance: '$5,670' },
]

export type CardItem = { last4: string; label: string; balance: string }

function formatBalance(money: { amount: number; currencyCode: string }): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode || 'USD',
    minimumFractionDigits: 2,
  }).format(money.amount)
}

export function CreditCard({
  last4,
  label,
  balance,
  gradient,
}: {
  last4: string
  label: string
  balance: string
  gradient: string
}) {
  return (
    <div
      className="flex shrink-0 flex-col justify-between rounded-2xl p-5 text-white shadow-lg"
      style={{
        height: CARD_HEIGHT,
        background: gradient,
        boxShadow: '0 10px 40px -10px rgba(99, 102, 241, 0.4)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="rounded-full bg-white/20 p-2">
          <i className="fa-regular fa-user text-sm" aria-hidden />
        </div>
        <span className="text-sm font-semibold tracking-widest opacity-95">VISA</span>
      </div>
      <div>
        <p className="font-mono text-lg font-medium tracking-wide opacity-95">
          **** **** **** {last4}
        </p>
        <p className="mt-0.5 text-xs text-white/70">{label}</p>
        <p className="mt-2 font-mono text-base font-semibold">{balance}</p>
      </div>
      <div className="flex justify-end">
        <div className="flex gap-1">
          <span
            className="h-6 w-6 rounded-full bg-red-500/90"
            aria-hidden
          />
          <span
            className="h-6 w-6 rounded-full bg-amber-500/90 -ml-2"
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}

function getStackStyle(offset: number) {
  // offset: -1 = previous (behind above), 0 = active, 1 = next (behind below), 2 = far
  const transitionCss = 'transform 300ms ease-out, opacity 300ms ease-out'
  let zIndex: number
  let opacity: number
  let transform: string
  if (offset === 0) {
    zIndex = 4
    opacity = 1
    transform = 'translate(-50%, -50%) scale(1)'
  } else if (offset === -1) {
    zIndex = 2
    opacity = 0.88
    transform = `translate(-50%, calc(-50% - ${PEEK_OFFSET}px)) scale(0.97)`
  } else if (offset === 1) {
    zIndex = 2
    opacity = 0.88
    transform = `translate(-50%, calc(-50% + ${PEEK_OFFSET}px)) scale(0.97)`
  } else {
    const dir = offset === 2 ? 1 : -1
    zIndex = 1
    opacity = 0.35
    transform = `translate(-50%, calc(-50% + ${dir * PEEK_OFFSET * 2}px)) scale(0.94)`
  }
  return {
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    width: CARD_WIDTH,
    transform,
    transition: transitionCss,
    zIndex,
    opacity,
  }
}

export interface AccountSummaryCard {
  accountId: string
  accountDisplayName: string
  accountNumberLast4?: string
  money: { amount: number; currencyCode: string }
}

export function CardStackView({
  selectedIndex,
  accounts,
}: {
  selectedIndex: number
  accounts?: AccountSummaryCard[] | null
}) {
  const cards: CardItem[] =
    accounts && accounts.length > 0
      ? accounts.map((a) => ({
          last4: a.accountNumberLast4 ?? '****',
          label: a.accountDisplayName,
          balance: formatBalance(a.money),
        }))
      : MOCK_CARDS
  const count = cards.length
  const safeIndex = Math.min(selectedIndex, count - 1)

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{ height: STACK_HEIGHT, width: CARD_WIDTH }}
    >
      {cards.map((card, cardIndex) => {
        const offset = (cardIndex - safeIndex + count * 2) % count
        const normalizedOffset = offset > count / 2 ? offset - count : offset
        const style = getStackStyle(normalizedOffset)
        return (
          <div
            key={accounts ? accounts[cardIndex]?.accountId ?? cardIndex : cardIndex}
            style={{
              position: style.position,
              left: style.left,
              top: style.top,
              width: style.width,
              transform: style.transform,
              transition: style.transition,
              zIndex: style.zIndex,
              opacity: style.opacity,
            }}
            className="origin-center"
          >
            <CreditCard
              last4={card.last4}
              label={card.label}
              balance={card.balance}
              gradient={CARD_GRADIENTS[cardIndex % CARD_GRADIENTS.length]}
            />
          </div>
        )
      })}
    </div>
  )
}

export function CardNavButtons({
  selectedIndex,
  onSelectIndex,
  totalCount = 4,
}: {
  selectedIndex: number
  onSelectIndex: (index: number) => void
  totalCount?: number
}) {
  const canGoUp = totalCount > 1 && selectedIndex > 0
  const canGoDown = totalCount > 1 && selectedIndex < totalCount - 1
  const goUp = () => onSelectIndex(Math.max(0, selectedIndex - 1))
  const goDown = () => onSelectIndex(Math.min(totalCount - 1, selectedIndex + 1))
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={goUp}
        disabled={!canGoUp}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-gray-50 hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
        aria-label="Previous card"
      >
        <i className="fa-solid fa-chevron-up text-sm" aria-hidden />
      </button>
      <button
        type="button"
        onClick={goDown}
        disabled={!canGoDown}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-gray-50 hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
        aria-label="Next card"
      >
        <i className="fa-solid fa-chevron-down text-sm" aria-hidden />
      </button>
    </div>
  )
}

export function RollingCardPanel({
  selectedIndex,
  onSelectIndex,
  accounts,
}: {
  selectedIndex: number
  onSelectIndex: (index: number) => void
  accounts?: AccountSummaryCard[] | null
}) {
  const count = accounts && accounts.length > 0 ? accounts.length : 4
  const safeIndex = Math.min(selectedIndex, count - 1)
  return (
    <div className="flex shrink-0 items-center gap-3">
      <CardStackView selectedIndex={safeIndex} accounts={accounts} />
      <CardNavButtons
        selectedIndex={safeIndex}
        onSelectIndex={onSelectIndex}
        totalCount={count}
      />
    </div>
  )
}
