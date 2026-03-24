import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar/Sidebar'
import { TopBar } from './components/TopBar/TopBar'
import { DashboardContent } from './pages/DashboardContent'
import { AccountsTransactionsContent } from './pages/AccountsTransactionsContent'
import { ArchivedAccountsContent } from './pages/ArchivedAccountsContent'
import { TransactionListContent } from './pages/TransactionListContent'
import { AccountCreatePage } from './pages/AccountCreatePage'
import { TransactionCreatePage } from './pages/TransactionCreatePage'
import { ProfilePage } from './pages/ProfilePage'
import { ProfileUpdatePage } from './pages/ProfileUpdatePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { CompleteProfilePage } from './pages/CompleteProfilePage'
import { BudgetPage } from './pages/BudgetPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { ReportsPage } from './pages/ReportsPage'

function MainApp() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  const isProfile = pathname === '/app/profile'
  const isProfileUpdate = pathname === '/app/profile/update'
  const isBudget = pathname === '/app/budget'
  const isCategories = pathname === '/app/categories'
  const isReports = pathname === '/app/reports'
  const isAccountCreate = pathname === '/app/transactions/accounts/create'
  const isArchived = pathname === '/app/transactions/archived'
  const isTransactionCreate = pathname.match(/^\/app\/transactions\/accounts\/[^/]+\/create-transaction$/)
  const transactionsMatch = pathname.match(/^\/app\/transactions(?:\/|$)/)
  const accountIdMatch = pathname.match(/^\/app\/transactions\/accounts\/([^/]+)(?:\/|$)/)
  const accountId = accountIdMatch?.[1] ?? null
  const isTransactionList = accountId != null && !pathname.endsWith('/create-transaction')

  const activeNavId = isProfile || isProfileUpdate
    ? 'profile'
    : isBudget
      ? 'budget'
      : isCategories
        ? 'categories'
        : isReports
          ? 'reports'
          : transactionsMatch && !isAccountCreate && !isTransactionCreate && !isArchived
            ? 'transactions'
            : 'dashboard'

  const accountsTransactions = (
    <AccountsTransactionsContent
      onViewTransactions={(id: string) => navigate(`/app/transactions/accounts/${id}`)}
    />
  )

  let content: React.ReactNode
  if (isProfileUpdate) {
    content = <ProfileUpdatePage />
  } else if (isProfile) {
    content = <ProfilePage />
  } else if (isBudget) {
    content = <BudgetPage />
  } else if (isCategories) {
    content = <CategoriesPage />
  } else if (isReports) {
    content = <ReportsPage />
  } else if (isAccountCreate) {
    content = <AccountCreatePage />
  } else if (isTransactionCreate && accountId) {
    content = (
      <TransactionCreatePage
        accountId={accountId}
        onSuccess={() => navigate(`/app/transactions/accounts/${accountId}`)}
        onBack={() => navigate(`/app/transactions/accounts/${accountId}`)}
      />
    )
  } else if (isArchived) {
    content = <ArchivedAccountsContent />
  } else if (isTransactionList && accountId) {
    content = (
      <TransactionListContent
        accountId={accountId}
        onBack={() => navigate('/app/transactions')}
      />
    )
  } else if (transactionsMatch) {
    content = accountsTransactions
  } else {
    content = <DashboardContent />
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar activeId={activeNavId} onActiveIdChange={(id) => {
        if (id === 'dashboard') navigate('/app')
        else if (id === 'transactions') navigate('/app/transactions')
        else if (id === 'categories') navigate('/app/categories')
        else if (id === 'budget') navigate('/app/budget')
        else if (id === 'reports') navigate('/app/reports')
        else if (id === 'profile') navigate('/app/profile')
      }} />
      <main className="min-w-0 flex-1 flex flex-col overflow-hidden bg-gray-100">
        <TopBar />
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          {content}
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
        <Route path="/app/*" element={<MainApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
