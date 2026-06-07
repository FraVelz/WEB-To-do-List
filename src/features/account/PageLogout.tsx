'use client'

import Header from '@/components/layout/header/Header'
import { Button } from '@/components/ui/button'
import { signOutUser } from '@/lib/firebase/auth-client'
import { CheckCircle2Icon, LogOutIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useAuthSessionStore } from '@/stores/auth-session-store'

export function PageLogout() {
  const router = useRouter()
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const clearSession = useAuthSessionStore((s) => s.clear)
  const mode = useAuthSessionStore((s) => s.mode)

  async function handleLogout() {
    setLoading(true)
    try {
      if (mode === 'user') {
        await signOutUser()
      }
      clearSession()
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-4">
        <h1 className="text-text-heading text-2xl font-bold">Cerrar sesión</h1>
        <p className="text-text-secondary mt-1 text-sm">
          {mode === 'demo'
            ? 'Saldrás del modo demo en este dispositivo.'
            : 'Se cerrará tu sesión de Firebase en este dispositivo.'}
        </p>

        <div className="border-border-default mt-10 max-w-md rounded-xl border bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] p-8 text-center">
          {!done ? (
            <>
              <LogOutIcon
                className="text-text-secondary mx-auto size-12"
                aria-hidden
              />
              <p className="text-text-heading mt-4 text-base font-medium">
                ¿Salir de la cuenta en este dispositivo?
              </p>
              <p className="text-text-secondary mt-2 text-sm">
                Podrás volver a entrar cuando quieras desde la pantalla de inicio.
              </p>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={loading}
                  onClick={handleLogout}
                >
                  {loading ? 'Cerrando…' : 'Cerrar sesión'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/inbox">Cancelar</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <CheckCircle2Icon
                className="mx-auto size-12 text-[var(--color-state-success)]"
                aria-hidden
              />
              <p className="text-text-heading mt-4 text-base font-medium">
                Sesión cerrada
              </p>
              <p className="text-text-secondary mt-2 text-sm">
                {mode === 'demo'
                  ? 'Has salido del modo demo. Tus datos locales siguen en el navegador.'
                  : 'Tu sesión de Firebase se ha invalidado correctamente.'}
              </p>
              <Button
                className="mt-8"
                type="button"
                onClick={() => router.push('/')}
              >
                Volver al inicio
              </Button>
            </>
          )}
        </div>
      </main>
    </>
  )
}
