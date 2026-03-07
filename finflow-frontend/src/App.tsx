import { Sidebar } from './components/Sidebar/Sidebar'

function App() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="min-w-0 flex-1 p-6">
        <p className="text-[0.9375rem] text-gray-600">
          Main content area — build your dashboard here.
        </p>
      </main>
    </div>
  )
}

export default App
