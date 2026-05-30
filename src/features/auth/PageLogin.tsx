'use client'

import { Button } from '@/components/ui/button'
import { useAuthSessionStore } from '@/stores/auth-session-store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function PageLogin() {
  const router = useRouter()
  const enterDemo = useAuthSessionStore((s) => s.enterDemo)
  const enterUser = useAuthSessionStore((s) => s.enterUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Introduce email y contraseña.')
      return
    }

    enterUser()
    router.push('/inbox')
  }

  function handleDemo() {
    setError(null)
    enterDemo()
    router.push('/inbox')
  }

  return (
    <main className="w-full max-w-md px-6">
      <div className="border-border-default rounded-xl border bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] p-8">
        <h1 className="text-text-heading text-center text-2xl font-bold">
          Iniciar sesión
        </h1>
        <p className="text-text-secondary mt-2 text-center text-sm">
          Autenticación simulada: cualquier credencial inicia una sesión de prueba.
        </p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-text-primary text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border-default bg-surface-app text-text-primary focus-visible:ring-ring/50 rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-3"
              placeholder="tu@email.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-text-primary text-sm font-medium"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border-default bg-surface-app text-text-primary focus-visible:ring-ring/50 rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-3"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="mt-2 w-full">
            Entrar
          </Button>
        </form>

        <div className="relative my-6">
          <div className="border-border-default absolute inset-0 flex items-center">
            <span className="border-border-default w-full border-t" />
          </div>
          <p className="text-text-secondary relative mx-auto w-fit bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] px-3 text-xs">
            o
          </p>
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={handleDemo}>
          Probar en modo demo
        </Button>
        <p className="text-text-secondary mt-3 text-center text-xs">
          Entra sin credenciales y explora la app con datos de ejemplo.
        </p>
      </div>
    </main>
  )
}
