'use client'

import { CalendarIcon, Trash2Icon } from 'lucide-react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { toast } from '@pheralb/toast'

import { formatTaskDate } from '@/lib/date-format'
import { EditTaskModal } from '@/features/tasks/components/EditTaskModal'
import { PriorityDot } from '@/features/tasks/components/PrioritySelect'
import { fetchProjects, fetchSections } from '@/services/projects'
import { patchTask, type TaskDto } from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'

import { DeleteTaskConfirmModal } from './components/DeleteTaskConfirmModal'

type Props = {
  task: TaskDto
  hideProjectMeta?: boolean
  rowRef?: (el: HTMLDivElement | null) => void
  tabIndex?: number
  onRowFocus?: () => void
  onMoveFocus?: (target: 'prev' | 'next' | 'first' | 'last') => void
}

function isOverdue(dueDate: string | null, completed: boolean) {
  if (!dueDate || completed) return false
  const due = new Date(dueDate)
  const start = new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate()
    )
  )
  return due < start
}

export function TaskRow({
  task,
  hideProjectMeta,
  rowRef,
  tabIndex = 0,
  onRowFocus,
  onMoveFocus,
}: Props) {
  const bump = useTasksRefreshStore((s) => s.bump)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [projectName, setProjectName] = useState<string | null>(null)
  const [sectionName, setSectionName] = useState<string | null>(null)
  const [liveMessage, setLiveMessage] = useState('')

  const showProjectMeta = !hideProjectMeta && Boolean(task.projectId)

  useEffect(() => {
    if (!showProjectMeta || !task.projectId) return
    let cancelled = false
    fetchProjects()
      .then((projects) => {
        if (cancelled) return
        const project = projects.find((p) => p.id === task.projectId)
        setProjectName(project?.name ?? null)
        if (!task.sectionId || !task.projectId) {
          setSectionName(null)
          return
        }
        return fetchSections(task.projectId).then((sections) => {
          if (cancelled) return
          setSectionName(
            sections.find((s) => s.id === task.sectionId)?.name ?? null
          )
        })
      })
      .catch(() => {
        if (!cancelled) {
          setProjectName(null)
          setSectionName(null)
        }
      })
    return () => {
      cancelled = true
    }
  }, [showProjectMeta, task.projectId, task.sectionId])

  async function toggleDone() {
    const nextCompleted = !task.completed
    try {
      await patchTask(task.id, { completed: nextCompleted })
      setLiveMessage(
        nextCompleted ? `Completada: ${task.title}` : `Pendiente: ${task.title}`
      )
      toast.success({
        text: nextCompleted
          ? 'Tarea completada'
          : 'Tarea marcada como pendiente',
      })
      bump()
    } catch (e) {
      toast.error({
        text: e instanceof Error ? e.message : 'Error al actualizar',
      })
    }
  }

  function onRowKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement
    if (target !== e.currentTarget) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      onMoveFocus?.('next')
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      onMoveFocus?.('prev')
      return
    }
    if (e.key === 'Home') {
      e.preventDefault()
      onMoveFocus?.('first')
      return
    }
    if (e.key === 'End') {
      e.preventDefault()
      onMoveFocus?.('last')
      return
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (e.key === ' ') {
        void toggleDone()
      } else {
        setEditOpen(true)
      }
    }
  }

  const overdue = isOverdue(task.dueDate, task.completed)
  const metaParts = showProjectMeta
    ? [projectName, sectionName].filter(Boolean)
    : []
  const checkboxLabel = task.completed
    ? `Marcar pendiente: ${task.title}`
    : `Marcar hecha: ${task.title}`

  return (
    <>
      <div
        ref={rowRef}
        tabIndex={tabIndex}
        onFocus={onRowFocus}
        onKeyDown={onRowKeyDown}
        aria-label={task.title}
        className={clsx(
          'border-border-subtle hover:bg-interactive-hover-soft focus-visible:ring-text-accent flex items-start gap-3 rounded-lg border px-3 py-3 focus-visible:ring-2 focus-visible:outline-none',
          task.completed && 'opacity-60'
        )}
      >
        <PriorityDot priority={task.priority} />
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggleDone}
          className="border-border-default mt-1 size-4 shrink-0 cursor-pointer rounded"
          style={
            task.priority
              ? { accentColor: undefined, borderColor: undefined }
              : undefined
          }
          aria-label={checkboxLabel}
        />

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className={clsx(
              'text-left font-medium hover:underline',
              task.completed && 'text-text-secondary line-through'
            )}
          >
            {task.title}
          </button>
          {task.description && (
            <p className="text-text-secondary mt-1 text-sm">
              {task.description}
            </p>
          )}
          <div className="text-text-secondary mt-2 flex flex-wrap items-center gap-2 text-xs">
            {task.dueDate && (
              <span
                className={clsx(
                  'inline-flex items-center gap-1',
                  overdue && 'text-[var(--color-state-error)]'
                )}
              >
                <CalendarIcon className="size-3" aria-hidden />
                {formatTaskDate(task.dueDate)}
              </span>
            )}
            {task.label && (
              <span className="bg-surface-accent-soft text-text-accent rounded px-1.5 py-0.5">
                {task.label}
              </span>
            )}
            {metaParts.length > 0 && (
              <span className="text-text-secondary">
                # {metaParts.join(' / ')}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="text-text-secondary shrink-0 cursor-pointer rounded-md p-1.5 hover:text-[var(--color-state-error)]"
          aria-label={`Eliminar tarea: ${task.title}`}
        >
          <Trash2Icon className="size-4" />
        </button>
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>

      <DeleteTaskConfirmModal
        open={deleteOpen}
        taskId={task.id}
        taskTitle={task.title}
        onOpenChange={setDeleteOpen}
      />
      <EditTaskModal open={editOpen} task={task} onOpenChange={setEditOpen} />
    </>
  )
}
