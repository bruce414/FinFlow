import { useState } from 'react'
import { Sidebar } from './components/Sidebar/Sidebar'
import { TopBar } from './components/TopBar/TopBar'
import { DashboardContent } from './pages/DashboardContent'
import { AccountsTransactionsContent } from './pages/AccountsTransactionsContent'
import { TransactionListContent } from './pages/TransactionListContent'

function App() {
  const [activeNavId, setActiveNavId] = useState<string>('dashboard')
  const [transactionsView, setTransactionsView] = useState<'accounts' | 'list'>('accounts')
  const [transactionListCardIndex, setTransactionListCardIndex] = useState(0)

  const handleViewTransactions = (cardIndex: number) => {
    setTransactionListCardIndex(cardIndex)
    setTransactionsView('list')
  }

  const transactionsContent =
    transactionsView === 'list' ? (
      <TransactionListContent
        cardIndex={transactionListCardIndex}
        onBack={() => setTransactionsView('accounts')}
      />
    ) : (
      <AccountsTransactionsContent onViewTransactions={handleViewTransactions} />
    )

  const content =
    activeNavId === 'transactions' ? transactionsContent : <DashboardContent />

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar activeId={activeNavId} onActiveIdChange={setActiveNavId} />
      <main className="min-w-0 flex-1 flex flex-col overflow-hidden bg-gray-100">
        <TopBar />
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          {content}
        </div>
      </main>
    </div>
  )
}

export default App
