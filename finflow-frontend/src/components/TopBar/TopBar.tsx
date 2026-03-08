const BAR_ITEM_HEIGHT = 'h-11'

export function TopBar() {
  return (
    <header
      className={`flex shrink-0 items-center justify-between gap-4 bg-gray-100 px-7 py-10 ${BAR_ITEM_HEIGHT}`}
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Quick search */}
      <div className={`flex min-w-0 flex-1 max-w-md items-center gap-3 rounded-2xl bg-white pl-4 pr-4 ${BAR_ITEM_HEIGHT}`}>
        <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm shrink-0" aria-hidden />
        <input
          type="search"
          placeholder="Quick Search ..."
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 font-medium placeholder:text-gray-400 outline-none"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        />
      </div>

      {/* Right group: notification, premium, profile, add widget */}
      <div className={`flex items-center gap-3 ${BAR_ITEM_HEIGHT}`}>
        {/* Notification button */}
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800"
          aria-label="Notifications"
        >
          <i className="fa-regular fa-bell text-lg" aria-hidden />
        </button>

        {/* Premium button */}
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white text-yellow-500 transition-colors hover:bg-gray-50 hover:text-yellow-600"
          aria-label="Premium"
        >
          <i className="fa-solid fa-crown text-lg" aria-hidden />
        </button>

        {/* Profile card */}
        <button
          type="button"
          className="flex h-full items-center gap-3 rounded-lg bg-white pl-2 pr-4 transition-colors hover:bg-gray-50"
          aria-label="Profile"
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bruce&backgroundColor=b6e3f4"
            alt=""
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium text-gray-800 leading-tight">
              Bruce Zhang
            </span>
            <span className="text-xs text-gray-500 leading-tight">
              user@example.com
            </span>
          </div>
        </button>

        {/* Add widget button */}
        <button
          type="button"
          className="flex h-full items-center gap-2 rounded-lg bg-white px-4 transition-colors hover:bg-gray-50 text-gray-700 hover:text-gray-900"
        >
          <i className="fa-solid fa-plus text-sm" aria-hidden />
          <span className="text-sm font-medium">add widget</span>
        </button>
      </div>
    </header>
  )
}
