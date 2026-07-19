'use client'

import { Button } from '@/components/ui/button'
import { signInUser, signUpUser } from '@/lib/firebase/auth-client'
import { useAuthSessionStore } from '@/stores/auth-session-store'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@pheralb/toast'

type AuthView = 'login' | 'signup'

function firebaseAuthMessage(error: unknown, view: AuthView): string {
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
    if (code === 'auth/email-already-in-use') {
      return 'Ese email ya tiene cuenta. Inicia sesión.'
    }
  }

  if (error instanceof Error && error.message) return error.message
  return view === 'signup'
    ? 'No se pudo crear la cuenta.'
    : 'No se pudo iniciar sesión.'
}

export function PageLogin() {
  const router = useRouter()
  const enterUser = useAuthSessionStore((s) => s.enterUser)
  const [view, setView] = useState<AuthView>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function switchView(next: AuthView) {
    setView(next)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      const message = 'Introduce email y contraseña.'
      setError(message)
      toast.error({ text: message })
      return
    }

    setLoading(true)
    try {
      if (view === 'signup') {
        await signUpUser(email, password)
      } else {
        await signInUser(email, password)
      }
      enterUser()
      router.push('/inbox')
    } catch (err) {
      const message = firebaseAuthMessage(err, view)
      setError(message)
      toast.error({ text: message })
      setLoading(false)
    }
  }

  const isLogin = view === 'login'

  return (
    <main className="w-full max-w-md px-6">
      <div className="mb-8 text-center">
        <p className="text-text-accent text-sm font-semibold tracking-wide uppercase">
          WEB To-Do List
        </p>
        <h1 className="text-text-heading mt-2 text-3xl font-bold tracking-tight">
          {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        </h1>
        <p className="text-text-secondary mt-2 text-sm">
          {isLogin
            ? 'Usa email y contraseña si ya tienes cuenta.'
            : 'Regístrate con email y contraseña para guardar tus tareas.'}
        </p>
      </div>

      <div className="border-border-default rounded-xl border bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] p-8">
        <div
          className="border-border-default grid grid-cols-2 gap-1 rounded-lg border p-1"
          role="tablist"
          aria-label="Acceso"
        >
          <button
            type="button"
            role="tab"
            aria-selected={isLogin}
            className={clsx(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isLogin
                ? 'bg-interactive-primary text-text-primary'
                : 'text-text-secondary hover:text-text-heading'
            )}
            onClick={() => switchView('login')}
            disabled={loading}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isLogin}
            className={clsx(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              !isLogin
                ? 'bg-interactive-primary text-text-primary'
                : 'text-text-secondary hover:text-text-heading'
            )}
            onClick={() => switchView('signup')}
            disabled={loading}
          >
            Crear cuenta
          </button>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-text-primary text-sm font-medium"
            >
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
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border-default bg-surface-app text-text-primary focus-visible:ring-ring/50 rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-3"
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
          </div>

          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading
              ? isLogin
                ? 'Entrando…'
                : 'Creando…'
              : isLogin
                ? 'Entrar'
                : 'Crear cuenta'}
          </Button>
        </form>

        <p className="text-text-secondary mt-4 text-center text-sm">
          {isLogin ? (
            <>
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                className="text-text-accent hover:text-text-heading font-medium underline-offset-2 hover:underline"
                onClick={() => switchView('signup')}
                disabled={loading}
              >
                Crear una
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                className="text-text-accent hover:text-text-heading font-medium underline-offset-2 hover:underline"
                onClick={() => switchView('login')}
                disabled={loading}
              >
                Iniciar sesión
              </button>
            </>
          )}
        </p>
      </div>

      <p className="text-text-secondary mt-6 text-center text-sm">
        <Link
          href="/inbox"
          className="text-text-accent hover:text-text-heading font-medium underline-offset-2 hover:underline"
        >
          Continuar sin cuenta
        </Link>
      </p>
    </main>
  )
}
