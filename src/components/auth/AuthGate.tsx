'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuthSessionStore } from '@/stores/auth-session-store'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const mode = useAuthSessionStore((s) => s.mode)
  const hydrated = useAuthSessionStore((s) => s.hydrated)
  const hydrate = useAuthSessionStore((s) => s.hydrate)
  const isLogoutRoute = pathname === '/logout'

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (hydrated && !mode && !isLogoutRoute) {
      router.replace('/')
    }
  }, [hydrated, mode, isLogoutRoute, router])

  if (!hydrated) {
    return (
      <div className="text-text-secondary flex flex-1 items-center justify-center text-sm">
        Cargando sesión…
      </div>
    )
  }

  if (!mode && !isLogoutRoute) {
    return (
      <div className="text-text-secondary flex flex-1 items-center justify-center text-sm">
        Cargando sesión…
      </div>
    )
  }

  return children
}
