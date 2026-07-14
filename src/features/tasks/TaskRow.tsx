'use client'

import { Trash2Icon } from 'lucide-react'
import clsx from 'clsx'
import { useState } from 'react'
import { toast } from 'sonner'

import { formatTaskDate } from '@/lib/date-format'
import { patchTask, type TaskDto } from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'

import { DeleteTaskConfirmModal } from './components/DeleteTaskConfirmModal'

type Props = {
  task: TaskDto
}

export function TaskRow({ task }: Props) {
  const bump = useTasksRefreshStore((s) => s.bump)
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function toggleDone() {
    const nextCompleted = !task.completed
    try {
      await patchTask(task.id, { completed: nextCompleted })
      toast.success(
        nextCompleted ? 'Tarea completada' : 'Tarea marcada como pendiente'
      )
      bump()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al actualizar')
    }
  }

  return (
    <>
      <div
        className={clsx(
          'border-border-subtle hover:bg-interactive-hover-soft flex items-start gap-3 rounded-lg border px-3 py-3',
          task.completed && 'opacity-60'
        )}
      >
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggleDone}
          className="border-border-default mt-1 size-4 shrink-0 cursor-pointer rounded"
          aria-label={task.completed ? 'Marcar pendiente' : 'Marcar hecha'}
        />

        <div className="min-w-0 flex-1">
          <p
            className={clsx(
              'font-medium',
              task.completed && 'text-text-secondary line-through'
            )}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-text-secondary mt-1 text-sm">{task.description}</p>
          )}
          <div className="text-text-secondary mt-2 flex flex-wrap gap-2 text-xs">
            {task.dueDate && <span>Vence: {formatTaskDate(task.dueDate)}</span>}
            {task.label && (
              <span className="bg-surface-accent-soft text-text-accent rounded px-1.5 py-0.5">
                {task.label}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="text-text-secondary shrink-0 cursor-pointer rounded-md p-1.5 hover:text-[var(--color-state-error)]"
          aria-label="Eliminar tarea"
        >
          <Trash2Icon className="size-4" />
        </button>
      </div>

      <DeleteTaskConfirmModal
        open={deleteOpen}
        taskId={task.id}
        taskTitle={task.title}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}
