'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

import { useAuthSessionStore } from '@/stores/auth-session-store'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const mode = useAuthSessionStore((s) => s.mode)
  const hydrated = useAuthSessionStore((s) => s.hydrated)
  const hydrate = useAuthSessionStore((s) => s.hydrate)
  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!hydrated) {
    return (
      <div className="text-text-secondary flex flex-1 items-center justify-center text-sm">
        Cargando sesión…
      </div>
    )
  }

  if (!mode) {
    redirect('/')
  }

  return children
}
