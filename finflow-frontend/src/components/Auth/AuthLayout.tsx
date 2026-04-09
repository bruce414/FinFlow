import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left half: blue/purple gradient + FinFlow logo */}
      <div className="flex w-1/2 min-h-screen items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-violet-700">
        <div className="flex flex-col items-center justify-center">
          <span className="text-5xl font-bold tracking-tight text-white drop-shadow-md">
            FinFlow
          </span>
        </div>
      </div>
      {/* Right half: white content area */}
      <div className="flex w-1/2 min-h-screen flex-col items-center justify-center bg-white">
        {children}
      </div>
    </div>
  )
}
