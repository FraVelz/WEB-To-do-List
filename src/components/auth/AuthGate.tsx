'use client'

import { useEffect } from 'react'

import { useAuthSessionStore } from '@/stores/auth-session-store'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const mode = useAuthSessionStore((s) => s.mode)
  const hydrated = useAuthSessionStore((s) => s.hydrated)
  const hydrate = useAuthSessionStore((s) => s.hydrate)
  const enterDemo = useAuthSessionStore((s) => s.enterDemo)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (hydrated && !mode) {
      enterDemo()
    }
  }, [hydrated, mode, enterDemo])

  if (!hydrated || !mode) {
    return (
      <div className="text-text-secondary flex flex-1 items-center justify-center text-sm">
        Cargando sesión…
      </div>
    )
  }

  return children
}
