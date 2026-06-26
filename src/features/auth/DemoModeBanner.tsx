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
    <div
      role="status"
      className="border-border-default text-text-secondary flex shrink-0 items-center justify-between gap-3 border-b bg-[color-mix(in_srgb,var(--color-surface-sidebar)_70%,transparent)] px-4 py-2 text-sm"
    >
      <p>
        <span className="text-text-heading font-medium">Modo demo</span>
        {' — '}
        Explora la interfaz con datos de ejemplo guardados en tu navegador.
      </p>
      <button
        type="button"
        onClick={() => setLogoutOpen(true)}
        className="text-text-accent hover:text-text-heading shrink-0 font-medium whitespace-nowrap underline-offset-2 hover:underline"
      >
        Salir del demo
      </button>

      <LogoutConfirmModal open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  )
}
