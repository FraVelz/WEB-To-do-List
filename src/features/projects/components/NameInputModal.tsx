'use client'

import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'

import { ModalRouteShell } from '@/components/modals/ModalRouteShell'
import { Button } from '@/components/ui/button'

type NameInputModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  label: string
  confirmLabel: string
  onSubmit: (name: string) => void | Promise<void>
}

export function NameInputModal({
  open,
  onOpenChange,
  title,
  label,
  confirmLabel,
  onSubmit,
}: NameInputModalProps) {
  const titleId = useId()
  const inputId = useId()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) setName('')
  }, [open])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('Escribe un nombre')
      return
    }
    setLoading(true)
    try {
      await onSubmit(trimmed)
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <ModalRouteShell onClose={() => !loading && onOpenChange(false)}>
      <div
        role="dialog"
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
      </div>
    </ModalRouteShell>,
    document.body
  )
}
