'use client'

import { useEffect, useState } from 'react'

import { LogoutConfirmModal } from '@/features/account/components/LogoutConfirmModal'
import { useAuthSessionStore } from '@/stores/auth-session-store'

export function DemoModeBanner() {
  const [logoutOpen, setLogoutOpen] = useState(false)
  const mode = useAuthSessionStore((s) => s.mode)
  const hydrate = useAuthSessionStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (mode !== 'demo') return null

  return (
    <output className="border-border-default text-text-secondary flex shrink-0 flex-col gap-2 border-b bg-[color-mix(in_srgb,var(--color-surface-sidebar)_70%,transparent)] px-4 py-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <p className="min-w-0 leading-snug">
        <span className="text-text-heading font-medium">Modo demo</span>
        <span className="hidden sm:inline">
          {' — '}
          Explora la interfaz con datos de ejemplo guardados en tu navegador.
        </span>
        <span className="text-text-secondary sm:hidden">
          {' — '}Datos de ejemplo en el navegador.
        </span>
      </p>
      <button
        type="button"
        onClick={() => setLogoutOpen(true)}
        className="text-text-accent hover:text-text-heading shrink-0 self-start font-medium whitespace-nowrap underline-offset-2 hover:underline sm:self-auto"
      >
        Salir del demo
      </button>

      <LogoutConfirmModal open={logoutOpen} onOpenChange={setLogoutOpen} />
    </output>
  )
}
