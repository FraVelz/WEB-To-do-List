'use client'

import Header from '@/components/layout/header/Header'
import { Button } from '@/components/ui/button'
import { CheckCircle2Icon, LogOutIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { useAuthSessionStore } from '@/stores/auth-session-store'

export function PageLogout() {
  const [done, setDone] = useState(false)
  const clearSession = useAuthSessionStore((s) => s.clear)

  return (
    <>
      <Header />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-4">
        <h1 className="text-text-heading text-2xl font-bold">Cerrar sesión</h1>
        <p className="text-text-secondary mt-1 text-sm">
          En una aplicación real aquí se invalidaría la sesión y las cookies de autenticación.
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
                  onClick={() => {
                    clearSession()
                    setDone(true)
                  }}
                >
                  Cerrar sesión
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/">Cancelar</Link>
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
                Esta es una simulación: no hay autenticación persistente en esta demo.
              </p>
              <Button className="mt-8" type="button" asChild>
                <Link href="/">Volver al inicio</Link>
              </Button>
            </>
          )}
        </div>
      </main>
    </>
  )
}
