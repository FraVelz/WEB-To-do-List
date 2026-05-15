'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { fetchTasks, type TaskFilter } from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'

import { TaskRow } from './TaskRow'

type Props = {
  filter: TaskFilter
  label?: string
}

export function TaskList({ filter, label }: Props) {
  const version = useTasksRefreshStore((s) => s.version)
  const [tasks, setTasks] = useState<Awaited<ReturnType<typeof fetchTasks>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    queueMicrotask(() => {
      if (!cancelled) setLoading(true)
    })

    fetchTasks({ filter, label })
      .then((data) => {
        if (!cancelled) setTasks(data)
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
  }, [filter, label, version])

  if (loading) {
    return (
      <p className="text-text-secondary mt-6 text-sm">Cargando tareas…</p>
    )
  }

  if (tasks.length === 0) {
    return (
      <p className="text-text-secondary mt-6 text-sm">
        No hay tareas aquí. Crea una con «Agregar tarea».
      </p>
    )
  }

  return (
    <ul className="mt-6 flex max-w-2xl flex-col gap-2">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskRow task={task} />
        </li>
      ))}
    </ul>
  )
}
