'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import clsx from 'clsx'

import { createTask } from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'
import { useUiStore } from '@/stores/ui-store'

export function ModalAddTask() {
  const addTaskOpen = useUiStore((s) => s.addTaskOpen)
  const closeAddTask = useUiStore((s) => s.closeAddTask)
  const bump = useTasksRefreshStore((s) => s.bump)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [label, setLabel] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!addTaskOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAddTask()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [addTaskOpen, closeAddTask])

  if (!addTaskOpen) return null

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Escribe un título')
      return
    }
    setLoading(true)
    const outcome = await createTask({
      title: title.trim(),
      description: description.trim() || null,
      label: label.trim() || null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    }).then(
      () => ({ ok: true as const }),
      (e: unknown) => ({ ok: false as const, error: e }),
    )

    if (!outcome.ok) {
      toast.error(
        outcome.error instanceof Error
          ? outcome.error.message
          : 'Error al crear',
      )
    } else {
      toast.success('Tarea creada')
      setTitle('')
      setDescription('')
      setLabel('')
      setDueDate('')
      bump()
      closeAddTask()
    }
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="presentation"
      onClick={closeAddTask}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-add-task-title"
        className="border-border-default bg-surface-sidebar w-full max-w-md rounded-xl border p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmit}
      >
        <h2
          id="modal-add-task-title"
          className="text-text-heading text-lg font-bold"
        >
          Nueva tarea
        </h2>

        <label className="mt-4 block text-sm text-[var(--color-muted-foreground)]">
          Título
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-border-default bg-surface-app text-text-primary mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            placeholder="Qué hay que hacer"
            autoFocus
          />
        </label>

        <label className="mt-3 block text-sm text-[var(--color-muted-foreground)]">
          Descripción (opcional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="border-border-default bg-surface-app text-text-primary mt-1 w-full resize-none rounded-md border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          />
        </label>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-[var(--color-muted-foreground)]">
            Fecha límite
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border-border-default bg-surface-app text-text-primary mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            />
          </label>

          <label className="block text-sm text-[var(--color-muted-foreground)]">
            Etiqueta
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="border-border-default bg-surface-app text-text-primary mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              placeholder="Ej. Trabajo"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeAddTask}
            className="hover:bg-interactive-hover-soft rounded-md px-4 py-2 text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={clsx(
              'bg-interactive-primary hover:bg-interactive-primary-hover text-text-primary rounded-md px-4 py-2 text-sm font-semibold',
              loading && 'opacity-60'
            )}
          >
            {loading ? 'Guardando…' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  )
}
