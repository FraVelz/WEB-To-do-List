'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuthSessionStore } from '@/stores/auth-session-store'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const mode = useAuthSessionStore((s) => s.mode)
  const hydrated = useAuthSessionStore((s) => s.hydrated)
  const hydrate = useAuthSessionStore((s) => s.hydrate)
  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (hydrated && !mode) {
      router.replace('/')
    }
  }, [hydrated, mode, router])

  if (!hydrated) {
    return (
      <div className="text-text-secondary flex flex-1 items-center justify-center text-sm">
        Cargando sesión…
      </div>
    )
  }

  if (!mode) {
    return (
      <div className="text-text-secondary flex flex-1 items-center justify-center text-sm">
        Cargando sesión…
      </div>
    )
  }

  return children
}
