import { useState } from 'react'

const NAV_ITEMS = [
  { id: 'dashboard', icon: DashboardIcon },
  { id: 'transactions', icon: TransactionsIcon },
  { id: 'accounts', icon: AccountsIcon },
  { id: 'budget', icon: BudgetIcon },
  { id: 'reports', icon: ReportsIcon },
] as const

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function TransactionsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="m8 7 4-4 4 4" />
      <path d="m8 17 4 4 4-4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
    </svg>
  )
}

function AccountsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 14h2" />
      <path d="M10 14h4" />
    </svg>
  )
}

function BudgetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function ReportsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  )
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  )
}

export function Sidebar() {
  const [activeId, setActiveId] = useState<string>('dashboard')

  return (
    <aside className="flex h-screen w-16 shrink-0 flex-col bg-black">
      <div className="px-3 pt-5">
        <div
          className="aspect-square w-10 rounded-lg bg-white/10"
          aria-hidden
        />
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-1 px-2">
        {NAV_ITEMS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveId(id)}
            className={`flex h-11 w-full items-center justify-center rounded-lg font-[inherit] transition-[background-color,color] duration-200 ${
              activeId === id
                ? 'bg-linear-to-br from-blue-500 to-purple-600 text-white'
                : 'bg-transparent text-gray-400 hover:bg-white/10 hover:text-gray-200'
            }`}
          >
            <Icon className="shrink-0" />
          </button>
        ))}
      </nav>

      <div className="border-t border-white/10 px-2 pb-6 pt-4">
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center rounded-lg bg-transparent text-gray-400 font-[inherit] transition-[background-color,color] duration-200 hover:bg-white/10 hover:text-gray-200"
        >
          <HelpIcon className="shrink-0" />
        </button>
      </div>
    </aside>
  )
}
