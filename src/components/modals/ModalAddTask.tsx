'use client'

import { useEffect, useState } from 'react'
import { toast } from '@pheralb/toast'
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'

import { ModalRouteShell } from '@/components/modals/ModalRouteShell'
import { useModalNavigation } from '@/hooks/useModalNavigation'
import {
  fetchProjects,
  fetchSections,
  type ProjectDto,
  type SectionDto,
} from '@/services/projects'
import { createTask } from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'
import { PrioritySelect } from '@/features/tasks/components/PrioritySelect'

export function ModalAddTask() {
  const { closeModal } = useModalNavigation()
  const bump = useTasksRefreshStore((s) => s.bump)
  const searchParams = useSearchParams()

  const initialProjectId = searchParams.get('projectId') ?? ''
  const initialSectionId = searchParams.get('sectionId') ?? ''

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [label, setLabel] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [projectId, setProjectId] = useState(initialProjectId)
  const [sectionId, setSectionId] = useState(initialSectionId)
  const [priority, setPriority] = useState(0)
  const [projects, setProjects] = useState<ProjectDto[]>([])
  const [sections, setSections] = useState<SectionDto[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
  }, [])

  useEffect(() => {
    if (!projectId) return
    let cancelled = false
    fetchSections(projectId)
      .then((data) => {
        if (cancelled) return
        setSections(data)
        if (sectionId && !data.some((s) => s.id === sectionId)) {
          setSectionId('')
        }
      })
      .catch(() => {
        if (!cancelled) setSections([])
      })
    return () => {
      cancelled = true
    }
  }, [projectId, sectionId])

  const visibleSections = projectId ? sections : []

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error({ text: 'Escribe un título' })
      return
    }
    setLoading(true)
    const outcome = await createTask({
      title: title.trim(),
      description: description.trim() || null,
      label: label.trim() || null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      priority,
      projectId: projectId || null,
      sectionId: projectId && sectionId ? sectionId : null,
    }).then(
      () => ({ ok: true as const }),
      (e: unknown) => ({ ok: false as const, error: e })
    )

    if (!outcome.ok) {
      toast.error({
        text:
          outcome.error instanceof Error
            ? outcome.error.message
            : 'Error al crear',
      })
    } else {
      toast.success({ text: 'Tarea creada' })
      setTitle('')
      setDescription('')
      setLabel('')
      setDueDate('')
      setPriority(0)
      bump()
      closeModal()
    }
    setLoading(false)
  }

  return (
    <ModalRouteShell>
      <dialog
        open
        aria-labelledby="modal-add-task-title"
        className="border-border-default bg-surface-sidebar w-full max-w-md rounded-xl border p-6 shadow-xl"
      >
        <form onSubmit={onSubmit}>
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

          <div className="mt-3">
            <PrioritySelect value={priority} onChange={setPriority} />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-[var(--color-muted-foreground)]">
              Proyecto
              <select
                value={projectId}
                onChange={(e) => {
                  setProjectId(e.target.value)
                  setSectionId('')
                  setSections([])
                }}
                className="border-border-default bg-surface-app text-text-primary mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              >
                <option value="">Bandeja de entrada</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-[var(--color-muted-foreground)]">
              Sección
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                disabled={!projectId}
                className="border-border-default bg-surface-app text-text-primary mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:opacity-50"
              >
                <option value="">Sin sección</option>
                {visibleSections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
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
      </dialog>
    </ModalRouteShell>
  )
}
