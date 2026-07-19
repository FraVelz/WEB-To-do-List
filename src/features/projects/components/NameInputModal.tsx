'use client'

import { useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from '@pheralb/toast'

import { ModalRouteShell } from '@/components/modals/ModalRouteShell'
import { Button } from '@/components/ui/button'

type NameInputModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  label: string
  confirmLabel: string
  /** Valor inicial del campo (p. ej. al renombrar). */
  initialValue?: string
  onSubmit: (name: string) => void | Promise<void>
}

export function NameInputModal({
  open,
  onOpenChange,
  title,
  label,
  confirmLabel,
  initialValue = '',
  onSubmit,
}: NameInputModalProps) {
  if (!open) return null

  return createPortal(
    <NameInputModalForm
      key={initialValue}
      onOpenChange={onOpenChange}
      title={title}
      label={label}
      confirmLabel={confirmLabel}
      initialValue={initialValue}
      onSubmit={onSubmit}
    />,
    document.body
  )
}

function NameInputModalForm({
  onOpenChange,
  title,
  label,
  confirmLabel,
  initialValue = '',
  onSubmit,
}: Omit<NameInputModalProps, 'open'>) {
  const titleId = useId()
  const inputId = useId()
  const [name, setName] = useState(initialValue)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error({ text: 'Escribe un nombre' })
      return
    }
    setLoading(true)
    try {
      await onSubmit(trimmed)
      setLoading(false)
      onOpenChange(false)
    } catch (err) {
      setLoading(false)
      toast.error({
        text: err instanceof Error ? err.message : 'Error al guardar',
      })
    }
  }

  return (
    <ModalRouteShell onClose={() => !loading && onOpenChange(false)}>
      <dialog
        open
        aria-modal="true"
        aria-labelledby={titleId}
        className="border-border-default w-full max-w-md rounded-xl border bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] p-6 shadow-xl"
      >
        <form onSubmit={handleSubmit}>
          <h2 id={titleId} className="text-text-heading text-lg font-bold">
            {title}
          </h2>

          <label
            htmlFor={inputId}
            className="text-text-secondary mt-4 block text-sm"
          >
            {label}
            <input
              id={inputId}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoFocus
              className="border-border-default bg-surface-app text-text-primary mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            />
          </label>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando…' : confirmLabel}
            </Button>
          </div>
        </form>
      </dialog>
    </ModalRouteShell>
  )
}
