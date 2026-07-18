'use client'

import { CalendarClockIcon } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'

import { ModalRouteShell } from '@/components/modals/ModalRouteShell'
import { Button } from '@/components/ui/button'

type RescheduleConfirmModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  count: number
  onConfirm: () => void | Promise<void>
}

export function RescheduleConfirmModal({
  open,
  onOpenChange,
  count,
  onConfirm,
}: RescheduleConfirmModalProps) {
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const label =
    count === 1
      ? '¿Reprogramar 1 tarea vencida para hoy?'
      : `¿Reprogramar ${count} tareas vencidas para hoy?`

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm()
      setLoading(false)
      onOpenChange(false)
    } catch {
      setLoading(false)
    }
  }

  return createPortal(
    <ModalRouteShell onClose={() => !loading && onOpenChange(false)}>
      <dialog
        open
        aria-labelledby="reschedule-modal-title"
        className="border-border-default w-full max-w-md rounded-xl border bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] p-8 text-center shadow-xl"
      >
        <CalendarClockIcon
          className="text-interactive-primary mx-auto size-12"
          aria-hidden
        />
        <p
          id="reschedule-modal-title"
          className="text-text-heading mt-4 text-base font-medium"
        >
          {label}
        </p>
        <p className="text-text-secondary mt-2 text-sm">
          Las fechas se moverán al día de hoy (UTC).
        </p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button type="button" disabled={loading} onClick={handleConfirm}>
            {loading ? 'Reprogramando…' : 'Reprogramar'}
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
      </dialog>
    </ModalRouteShell>,
    document.body
  )
}
