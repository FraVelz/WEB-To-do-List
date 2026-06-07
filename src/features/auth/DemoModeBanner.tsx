'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { useAuthSessionStore } from '@/stores/auth-session-store'

export function DemoModeBanner() {
  const mode = useAuthSessionStore((s) => s.mode)
  const hydrate = useAuthSessionStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (mode !== 'demo') return null

  return (
    <div
      role="status"
      className="border-border-default bg-[color-mix(in_srgb,var(--color-surface-sidebar)_70%,transparent)] text-text-secondary flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2 text-sm"
    >
      <p>
        <span className="text-text-heading font-medium">Modo demo</span>
        {' — '}
        Explora la interfaz con datos de ejemplo guardados en tu navegador.
      </p>
      <Link
        href="/logout"
        className="text-text-accent hover:text-text-heading shrink-0 font-medium whitespace-nowrap underline-offset-2 hover:underline"
      >
        Salir del demo
      </Link>
    </div>
  )
}
