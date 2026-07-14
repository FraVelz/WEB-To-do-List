'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'
import clsx from 'clsx'

import { ModalRouteShell } from '@/components/modals/ModalRouteShell'
import { PrioritySelect } from '@/features/tasks/components/PrioritySelect'
import {
  fetchProjects,
  fetchSections,
  type ProjectDto,
  type SectionDto,
} from '@/services/projects'
import { patchTask, type TaskDto } from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'

type Props = {
  open: boolean
  task: TaskDto
  onOpenChange: (open: boolean) => void
}

function toLocalInput(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function EditTaskModal({ open, task, onOpenChange }: Props) {
  const bump = useTasksRefreshStore((s) => s.bump)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [label, setLabel] = useState(task.label ?? '')
  const [dueDate, setDueDate] = useState(toLocalInput(task.dueDate))
  const [priority, setPriority] = useState(task.priority)
  const [projectId, setProjectId] = useState(task.projectId ?? '')
  const [sectionId, setSectionId] = useState(task.sectionId ?? '')
  const [projects, setProjects] = useState<ProjectDto[]>([])
  const [sections, setSections] = useState<SectionDto[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setTitle(task.title)
    setDescription(task.description ?? '')
    setLabel(task.label ?? '')
    setDueDate(toLocalInput(task.dueDate))
    setPriority(task.priority)
    setProjectId(task.projectId ?? '')
    setSectionId(task.sectionId ?? '')
  }, [open, task])

  useEffect(() => {
    if (!open) return
    fetchProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
  }, [open])

  useEffect(() => {
    if (!open || !projectId) {
      setSections([])
      return
    }
    fetchSections(projectId)
      .then(setSections)
      .catch(() => setSections([]))
  }, [open, projectId])

  if (!open) return null

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Escribe un título')
      return
    }
    setLoading(true)
    try {
      await patchTask(task.id, {
        title: title.trim(),
        description: description.trim() || null,
        label: label.trim() || null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority,
        projectId: projectId || null,
        sectionId: projectId && sectionId ? sectionId : null,
      })
      toast.success('Tarea actualizada')
      bump()
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <ModalRouteShell onClose={() => onOpenChange(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-modal-title"
        className="border-border-default bg-surface-sidebar w-full max-w-md rounded-xl border p-6 shadow-xl"
      >
        <form onSubmit={onSubmit}>
          <h2
            id="edit-task-modal-title"
            className="text-text-heading text-lg font-bold"
          >
            Editar tarea
          </h2>

          <label className="mt-4 block text-sm text-[var(--color-muted-foreground)]">
            Título
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-border-default bg-surface-app text-text-primary mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              autoFocus
            />
          </label>

          <label className="mt-3 block text-sm text-[var(--color-muted-foreground)]">
            Descripción
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
                {sections.map((s) => (
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
              onClick={() => onOpenChange(false)}
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
              {loading ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </ModalRouteShell>,
    document.body
  )
}
