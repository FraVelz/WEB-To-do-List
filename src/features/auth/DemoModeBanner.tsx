'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import { useAuthSessionStore } from '@/stores/auth-session-store'

export function DemoModeBanner() {
  const mode = useAuthSessionStore((s) => s.mode)
  const hydrate = useAuthSessionStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (mode !== 'demo') return null

  return (
    <output className="border-border-default text-text-secondary flex shrink-0 flex-col gap-2 border-b bg-[color-mix(in_srgb,var(--color-surface-sidebar)_70%,transparent)] px-4 py-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <p className="min-w-0 leading-snug">
        <span className="text-text-heading font-medium">Lab / Modo demo</span>
        <span className="hidden sm:inline">
          {' — '}
          Datos locales en el navegador; no tocan Firebase de producción.
        </span>
        <span className="text-text-secondary sm:hidden">
          {' — '}Datos locales (Lab); sin Firebase prod.
        </span>
      </p>
      <Link
        href="/login"
        className="text-text-accent hover:text-text-heading shrink-0 self-start font-medium whitespace-nowrap underline-offset-2 hover:underline sm:self-auto"
      >
        Iniciar sesión
      </Link>
    </output>
  )
}
