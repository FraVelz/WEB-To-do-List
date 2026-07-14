'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import Header from '@/components/layout/header/Header'
import {
  WeekCalendarStrip,
  isSameUtcDay,
} from '@/features/next/components/WeekCalendarStrip'
import { OverdueSection } from '@/features/tasks/components/OverdueSection'
import { TaskRow } from '@/features/tasks/TaskRow'
import { fetchTasks, type TaskDto } from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'

export function PageNext() {
  const version = useTasksRefreshStore((s) => s.version)
  const [selected, setSelected] = useState(() => {
    const now = new Date()
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    )
  })
  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) setLoading(true)
    })
    fetchTasks({ filter: 'next' })
      .then((data) => {
        if (!cancelled) setTasks(data)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          toast.error(e instanceof Error ? e.message : 'Error al cargar')
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

  const dayTasks = useMemo(
    () => tasks.filter((t) => isSameUtcDay(t.dueDate, selected)),
    [tasks, selected]
  )

  return (
    <>
      <Header />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6">
        <h1 className="text-text-heading text-2xl font-bold">Próximo</h1>
        <WeekCalendarStrip selected={selected} onSelect={setSelected} />
        <OverdueSection />

        <section className="mt-6 max-w-2xl">
          <h2 className="text-text-heading font-semibold capitalize">
            {selected.toLocaleDateString('es', {
              weekday: 'long',
              day: 'numeric',
              month: 'short',
              timeZone: 'UTC',
            })}
          </h2>
          {loading && (
            <p className="text-text-secondary mt-4 text-sm">Cargando…</p>
          )}
          {!loading && dayTasks.length === 0 && (
            <p className="text-text-secondary mt-4 text-sm">
              No hay tareas para este día.
            </p>
          )}
          {!loading && dayTasks.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2">
              {dayTasks.map((task) => (
                <li key={task.id}>
                  <TaskRow task={task} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  )
}
