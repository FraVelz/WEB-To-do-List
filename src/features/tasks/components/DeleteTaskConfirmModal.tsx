'use client'

import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from '@pheralb/toast'

import { ModalRouteShell } from '@/components/modals/ModalRouteShell'
import { Button } from '@/components/ui/button'
import { deleteTask } from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'

type DeleteTaskConfirmModalProps = {
  open: boolean
  taskId: string
  taskTitle: string
  onOpenChange: (open: boolean) => void
}

export function DeleteTaskConfirmModal({
  open,
  taskId,
  taskTitle,
  onOpenChange,
}: DeleteTaskConfirmModalProps) {
  const [loading, setLoading] = useState(false)
  const bump = useTasksRefreshStore((s) => s.bump)

  if (!open) return null

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteTask(taskId)
      toast.success({ text: 'Tarea eliminada' })
      bump()
      onOpenChange(false)
      setLoading(false)
    } catch (e) {
      setLoading(false)
      toast.error({
        text: e instanceof Error ? e.message : 'Error al eliminar',
      })
    }
  }

  return createPortal(
    <ModalRouteShell onClose={() => onOpenChange(false)}>
      <dialog
        open
        aria-modal="true"
        aria-labelledby="delete-task-modal-title"
        className="border-border-default w-full max-w-md rounded-xl border bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] p-8 text-center shadow-xl"
      >
        <Trash2Icon
          className="mx-auto size-12 text-[var(--color-state-error)]"
          aria-hidden
        />
        <p
          id="delete-task-modal-title"
          className="text-text-heading mt-4 text-base font-medium"
        >
          ¿Eliminar esta tarea?
        </p>
        <p className="text-text-secondary mt-2 text-sm">
          Se eliminará «{taskTitle}». Esta acción no se puede deshacer.
        </p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
          >
            {loading ? 'Eliminando…' : 'Eliminar'}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            autoFocus
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
