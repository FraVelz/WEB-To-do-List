'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { RescheduleConfirmModal } from '@/features/tasks/components/RescheduleConfirmModal'
import { TaskRow } from '@/features/tasks/TaskRow'
import {
  fetchTasks,
  rescheduleTasks,
  type TaskDto,
} from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'

export function OverdueSection() {
  const version = useTasksRefreshStore((s) => s.version)
  const bump = useTasksRefreshStore((s) => s.bump)
  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) setLoading(true)
    })
    fetchTasks({ filter: 'overdue' })
      .then((data) => {
        if (!cancelled) setTasks(data)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          toast.error(
            e instanceof Error ? e.message : 'Error al cargar vencidas'
          )
          setTasks([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [version])

  async function handleReschedule() {
    const today = new Date()
    const dueDate = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
        12,
        0,
        0
      )
    ).toISOString()
    try {
      await rescheduleTasks(
        tasks.map((t) => t.id),
        dueDate
      )
      toast.success('Tareas reprogramadas para hoy')
      bump()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al reprogramar')
      throw e
    }
  }

  if (loading || tasks.length === 0) return null

  return (
    <section className="mt-6 max-w-2xl">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-text-heading font-semibold">Vencidas</h2>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="text-[var(--color-state-error)] text-sm font-medium hover:underline"
        >
          Reprogramar
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskRow task={task} />
          </li>
        ))}
      </ul>

      <RescheduleConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        count={tasks.length}
        onConfirm={handleReschedule}
      />
    </section>
  )
}
