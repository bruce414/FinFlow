import { useState } from 'react'
import { RollingCardPanel } from '../components/Dashboard/RollingCardPanel'
import { BalanceChartPanel } from '../components/Dashboard/BalanceChartPanel'

export function DashboardContent() {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0)

  return (
    <div className="flex flex-col px-5 pt-2 pb-2">
      <div className="flex flex-row items-center gap-6 rounded-xl bg-white p-4 shadow-sm">
        <RollingCardPanel
          selectedIndex={selectedCardIndex}
          onSelectIndex={setSelectedCardIndex}
        />
        <BalanceChartPanel />
      </div>
    </div>
  )
}
