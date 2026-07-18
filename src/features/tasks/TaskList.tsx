'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { TaskEmptyState } from '@/features/tasks/TaskEmptyState'
import { fetchTasks, type TaskFilter } from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'

import { TaskRow } from './TaskRow'

type Props = {
  filter?: TaskFilter
  label?: string
  projectId?: string
  emptyView?: 'inbox' | 'today' | 'next' | 'generic'
}

export function TaskList({ filter, label, projectId, emptyView }: Props) {
  const version = useTasksRefreshStore((s) => s.version)
  const [tasks, setTasks] = useState<Awaited<ReturnType<typeof fetchTasks>>>([])
  const [loading, setLoading] = useState(true)
  const [focusIndex, setFocusIndex] = useState(0)
  const rowRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    let cancelled = false

    queueMicrotask(() => {
      if (!cancelled) setLoading(true)
    })

    fetchTasks({ filter, label, projectId })
      .then((data) => {
        if (!cancelled) {
          setTasks(data)
          setFocusIndex(0)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          toast.error(e instanceof Error ? e.message : 'Error al cargar tareas')
          setTasks([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [filter, label, projectId, version])

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, tasks.length)
  }, [tasks.length])

  function moveFocus(next: number) {
    if (tasks.length === 0) return
    const clamped = Math.max(0, Math.min(tasks.length - 1, next))
    setFocusIndex(clamped)
    queueMicrotask(() => {
      rowRefs.current[clamped]?.focus()
    })
  }

  function handleMoveFocus(target: 'prev' | 'next' | 'first' | 'last') {
    if (tasks.length === 0) return
    if (target === 'prev') moveFocus(focusIndex - 1)
    else if (target === 'next') moveFocus(focusIndex + 1)
    else if (target === 'first') moveFocus(0)
    else moveFocus(tasks.length - 1)
  }

  if (loading) {
    return <p className="text-text-secondary mt-6 text-sm">Cargando tareas…</p>
  }

  if (tasks.length === 0) {
    const view =
      emptyView ??
      (filter === 'inbox' || filter === 'today' || filter === 'next'
        ? filter
        : 'generic')
    return <TaskEmptyState view={view} />
  }

  return (
    <ul
      className="mt-6 flex max-w-2xl flex-col gap-2"
      aria-label="Lista de tareas"
    >
      {tasks.map((task, index) => (
        <li key={task.id}>
          <TaskRow
            task={task}
            hideProjectMeta={Boolean(projectId)}
            rowRef={(el) => {
              rowRefs.current[index] = el
            }}
            tabIndex={index === focusIndex ? 0 : -1}
            onRowFocus={() => setFocusIndex(index)}
            onMoveFocus={handleMoveFocus}
          />
        </li>
      ))}
    </ul>
  )
}
