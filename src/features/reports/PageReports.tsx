'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import Header from '@/components/layout/header/Header'
import { fetchTasks, type TaskDto } from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'

type DayStat = {
  key: string
  label: string
  created: number
  completed: number
}

function utcDayKey(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

function last7Days(): DayStat[] {
  const today = new Date()
  const start = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  )
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start.getTime() - (6 - i) * 86400000)
    return {
      key: utcDayKey(day),
      label: day.toLocaleDateString('es', {
        weekday: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      }),
      created: 0,
      completed: 0,
    }
  })
}

function inLast7Days(iso: string | null, windowStart: Date) {
  if (!iso) return false
  const d = new Date(iso)
  return d >= windowStart
}

export function PageReports() {
  const version = useTasksRefreshStore((s) => s.version)
  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) setLoading(true)
    })
    fetchTasks({ filter: 'all' })
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

  const stats = useMemo(() => {
    const days = last7Days()
    const today = new Date()
    const windowStart = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate()
      ) -
        6 * 86400000
    )
    const byKey = new Map(days.map((d) => [d.key, d]))

    for (const task of tasks) {
      if (inLast7Days(task.createdAt, windowStart)) {
        const key = utcDayKey(new Date(task.createdAt))
        const row = byKey.get(key)
        if (row) row.created += 1
      }
      if (task.completedAt && inLast7Days(task.completedAt, windowStart)) {
        const key = utcDayKey(new Date(task.completedAt))
        const row = byKey.get(key)
        if (row) row.completed += 1
      }
    }

    return days
  }, [tasks])

  const max = Math.max(1, ...stats.flatMap((d) => [d.created, d.completed]))
  const totalCreated = stats.reduce((s, d) => s + d.created, 0)
  const totalCompleted = stats.reduce((s, d) => s + d.completed, 0)

  return (
    <>
      <Header />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6">
        <h1 className="text-text-heading text-2xl font-bold">Reportes</h1>
        <p className="text-text-secondary mt-1 text-sm">
          Actividad de los últimos 7 días (UTC).
        </p>

        {loading ? (
          <p className="text-text-secondary mt-6 text-sm">Cargando…</p>
        ) : (
          <div className="mt-6 max-w-2xl">
            <div className="mb-6 flex gap-6 text-sm">
              <p>
                <span className="text-text-secondary">Creadas: </span>
                <span className="text-text-heading font-semibold">
                  {totalCreated}
                </span>
              </p>
              <p>
                <span className="text-text-secondary">Completadas: </span>
                <span className="text-text-heading font-semibold">
                  {totalCompleted}
                </span>
              </p>
            </div>

            <ul className="flex flex-col gap-4">
              {stats.map((day) => (
                <li key={day.key}>
                  <p className="text-text-secondary mb-1 text-xs capitalize">
                    {day.label}
                  </p>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary w-20 text-xs">
                        Creadas
                      </span>
                      <div className="bg-surface-accent-soft h-3 flex-1 overflow-hidden rounded">
                        <div
                          className="bg-interactive-primary h-full rounded"
                          style={{
                            width: `${(day.created / max) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-text-primary w-6 text-right text-xs tabular-nums">
                        {day.created}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary w-20 text-xs">
                        Hechas
                      </span>
                      <div className="bg-surface-accent-soft h-3 flex-1 overflow-hidden rounded">
                        <div
                          className="h-full rounded bg-emerald-500"
                          style={{
                            width: `${(day.completed / max) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-text-primary w-6 text-right text-xs tabular-nums">
                        {day.completed}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  )
}
