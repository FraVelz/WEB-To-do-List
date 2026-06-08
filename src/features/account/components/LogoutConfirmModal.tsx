'use client'

import { LogOutIcon } from 'lucide-react'
import { useState } from 'react'

import { ModalRouteShell } from '@/components/modals/ModalRouteShell'
import { Button } from '@/components/ui/button'
import { signOutUser } from '@/lib/firebase/auth-client'
import { useAuthSessionStore } from '@/stores/auth-session-store'

type LogoutConfirmModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutConfirmModal({
  open,
  onOpenChange,
}: LogoutConfirmModalProps) {
  const [loading, setLoading] = useState(false)
  const clearSession = useAuthSessionStore((s) => s.clear)
  const mode = useAuthSessionStore((s) => s.mode)

  if (!open) return null

  async function handleLogout() {
    setLoading(true)
    try {
      if (mode === 'user') {
        await signOutUser()
      }
      clearSession()
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalRouteShell onClose={() => onOpenChange(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        className="border-border-default w-full max-w-md rounded-xl border bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] p-8 text-center shadow-xl"
      >
        <LogOutIcon
          className="text-text-secondary mx-auto size-12"
          aria-hidden
        />
        <p
          id="logout-modal-title"
          className="text-text-heading mt-4 text-base font-medium"
        >
          ¿Salir de la cuenta en este dispositivo?
        </p>
        <p className="text-text-secondary mt-2 text-sm">
          {mode === 'demo'
            ? 'Saldrás del modo demo. Podrás volver a entrar cuando quieras desde la pantalla de inicio.'
            : 'Se cerrará tu sesión de Firebase. Podrás volver a entrar cuando quieras desde la pantalla de inicio.'}
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
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </ModalRouteShell>
  )
}
