'use client'

import { Button } from '@/components/ui/button'
import { signInUser } from '@/lib/firebase/auth-client'
import { useAuthSessionStore } from '@/stores/auth-session-store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function firebaseAuthMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: string }).code === 'string'
  ) {
    const code = (error as { code: string }).code
    if (code === 'auth/invalid-email') return 'Email no válido.'
    if (code === 'auth/wrong-password') return 'Contraseña incorrecta.'
    if (code === 'auth/weak-password') {
      return 'La contraseña debe tener al menos 6 caracteres.'
    }
    if (code === 'auth/invalid-credential') {
      return 'Credenciales incorrectas.'
    }
  }

  if (error instanceof Error && error.message) return error.message
  return 'No se pudo iniciar sesión.'
}

export function PageLogin() {
  const router = useRouter()
  const enterDemo = useAuthSessionStore((s) => s.enterDemo)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Introduce email y contraseña.')
      return
    }

    setLoading(true)
    try {
      await signInUser(email, password)
      router.push('/inbox')
    } catch (err) {
      setError(firebaseAuthMessage(err))
    } finally {
      setLoading(false)
    }
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
          Entra con Firebase o explora la interfaz en modo demo sin conexión.
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
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

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleDemo}
          disabled={loading}
        >
          Probar en modo demo
        </Button>
        <p className="text-text-secondary mt-3 text-center text-xs">
          Sin Firebase ni credenciales: datos de ejemplo en tu navegador.
        </p>
      </div>
    </main>
  )
}
