import { useNavigate } from 'react-router-dom'

/** Placeholder until full budget creation UI is built (backend: POST /api/v1/me/budgets). */
export function BudgetNewPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-4 px-5 pt-2 pb-8">
      <button
        type="button"
        onClick={() => navigate('/app')}
        className="flex w-fit items-center gap-2 rounded-lg text-sm font-medium text-gray-600 transition hover:text-gray-900"
      >
        <i className="fa-solid fa-arrow-left" aria-hidden />
        Back
      </button>
      <div className="mx-auto w-full max-w-lg rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">New budget</h1>
        <p className="mt-3 text-gray-600">
          Full budget setup (limits, categories, periods) will be available here soon. You can use the API in the meantime.
        </p>
        <button
          type="button"
          onClick={() => navigate('/app')}
          className="mt-6 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}
