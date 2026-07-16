'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import Header from '@/components/layout/header/Header'
import {
  WeekCalendarStrip,
  isSameUtcDay,
} from '@/features/next/components/WeekCalendarStrip'
import { OverdueSection } from '@/features/tasks/components/OverdueSection'
import { TaskEmptyState } from '@/features/tasks/TaskEmptyState'
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
  const [focusIndex, setFocusIndex] = useState(0)
  const rowRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) setLoading(true)
    })
    fetchTasks({ filter: 'next' })
      .then((data) => {
        if (!cancelled) {
          setTasks(data)
          setFocusIndex(0)
        }
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

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, dayTasks.length)
  }, [dayTasks.length])

  function moveFocus(next: number) {
    if (dayTasks.length === 0) return
    const clamped = Math.max(0, Math.min(dayTasks.length - 1, next))
    setFocusIndex(clamped)
    queueMicrotask(() => {
      rowRefs.current[clamped]?.focus()
    })
  }

  function onListKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    if (dayTasks.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveFocus(focusIndex + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveFocus(focusIndex - 1)
    }
  }

  return (
    <>
      <Header />

      <main
        id="main-content"
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6"
      >
        <h1 className="text-text-heading text-2xl font-bold">Próximo</h1>
        <WeekCalendarStrip
          selected={selected}
          onSelect={(day) => {
            setSelected(day)
            setFocusIndex(0)
          }}
        />
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
            <TaskEmptyState
              view="next"
              className="border-border-subtle bg-surface-sidebar/40 mt-4 max-w-2xl rounded-lg border px-4 py-6"
            />
          )}
          {!loading && dayTasks.length > 0 && (
            <ul
              className="mt-4 flex flex-col gap-2"
              role="list"
              aria-label="Tareas del día"
              onKeyDown={onListKeyDown}
            >
              {dayTasks.map((task, index) => (
                <li key={task.id} role="none">
                  <TaskRow
                    task={task}
                    rowRef={(el) => {
                      rowRefs.current[index] = el
                    }}
                    tabIndex={index === focusIndex ? 0 : -1}
                    onRowFocus={() => setFocusIndex(index)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  )
}
