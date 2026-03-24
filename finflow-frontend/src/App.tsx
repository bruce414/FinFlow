import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar/Sidebar'
import { TopBar } from './components/TopBar/TopBar'
import { DashboardContent } from './pages/DashboardContent'
import { CategoriesContent } from './pages/CategoriesContent'
import { BudgetNewPage } from './pages/BudgetNewPage'
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

/** Old `/app/transactions/...` URLs → `/app/accounts/...` */
function mapLegacyTransactionsPath(path: string): string | null {
  if (!path.startsWith('/app/transactions')) return null
  const p = path.replace(/\/$/, '') || '/'
  if (p === '/app/transactions') return '/app/accounts'
  if (p === '/app/transactions/archived' || p === '/app/transactions/accounts/archived') {
    return '/app/accounts/archived'
  }
  if (p === '/app/transactions/accounts/create') return '/app/accounts/create'
  const withCreateTx = p.match(/^\/app\/transactions\/accounts\/([^/]+)\/create-transaction$/)
  if (withCreateTx) return `/app/accounts/${withCreateTx[1]}/create-transaction`
  const accountOnly = p.match(/^\/app\/transactions\/accounts\/([^/]+)$/)
  if (accountOnly) return `/app/accounts/${accountOnly[1]}`
  return '/app/accounts'
}

function MainApp() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const path = pathname.replace(/\/$/, '') || '/'

  const legacyTarget = mapLegacyTransactionsPath(path)
  if (legacyTarget) {
    return <Navigate to={legacyTarget} replace />
  }

  const isProfile = path === '/app/profile'
  const isProfileUpdate = path === '/app/profile/update'
  const isCategories = path === '/app/categories'
  const isBudgetNew = path === '/app/budgets/new'
  const isAccountCreate = path === '/app/accounts/create'
  const isArchived =
    path === '/app/accounts/archived' || path === '/app/accounts/accounts/archived'
  const isTransactionCreate = path.match(/^\/app\/accounts\/[^/]+\/create-transaction$/)
  const accountsSectionMatch = path.match(/^\/app\/accounts(?:\/|$)/)
  const accountIdMatch = path.match(/^\/app\/accounts\/([^/]+)(?:\/|$)/)
  const rawAccountSegment = accountIdMatch?.[1] ?? null
  const accountId =
    rawAccountSegment && rawAccountSegment !== 'create' && rawAccountSegment !== 'archived'
      ? rawAccountSegment
      : null
  const isTransactionList = accountId != null && !path.endsWith('/create-transaction')

  const activeNavId = isProfile || isProfileUpdate
    ? 'profile'
    : isCategories
      ? 'categories'
      : isBudgetNew
        ? 'budget'
        : accountsSectionMatch && !isAccountCreate && !isTransactionCreate && !isArchived
          ? 'transactions'
          : 'dashboard'

  let content: React.ReactNode
  if (isProfileUpdate) {
    content = <ProfileUpdatePage />
  } else if (isProfile) {
    content = <ProfilePage />
  } else if (isBudgetNew) {
    content = <BudgetNewPage />
  } else if (isCategories) {
    content = <CategoriesContent />
  } else if (isAccountCreate) {
    content = <AccountCreatePage />
  } else if (isTransactionCreate && accountId) {
    content = (
      <TransactionCreatePage
        accountId={accountId}
        onSuccess={() => navigate(`/app/accounts/${accountId}`)}
        onBack={() => navigate(`/app/accounts/${accountId}`)}
      />
    )
  } else if (isArchived) {
    content = <ArchivedAccountsContent />
  } else if (isTransactionList && accountId) {
    content = (
      <TransactionListContent
        accountId={accountId}
        onBack={() => navigate('/app/accounts')}
      />
    )
  } else if (accountsSectionMatch) {
    content = (
      <AccountsTransactionsContent
        onViewTransactions={(accountId: string) => navigate(`/app/accounts/${accountId}`)}
      />
    )
  } else {
    content = <DashboardContent />
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar activeId={activeNavId} onActiveIdChange={(id) => {
        if (id === 'transactions') navigate('/app/accounts')
        else if (id === 'dashboard') navigate('/app')
        else if (id === 'categories') navigate('/app/categories')
        else if (id === 'budget') navigate('/app/budgets/new')
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
