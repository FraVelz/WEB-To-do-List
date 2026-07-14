'use client'

import { ChevronDownIcon, PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import clsx from 'clsx'

import { useModalNavigation } from '@/hooks/useModalNavigation'
import {
  createSection,
  fetchSections,
  type SectionDto,
} from '@/services/projects'
import { fetchTasks, type TaskDto } from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'
import { TaskRow } from '@/features/tasks/TaskRow'

type Props = {
  projectId: string
}

function collapsedKey(sectionId: string) {
  return `section-collapsed:${sectionId}`
}

function readCollapsed(sectionId: string) {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(collapsedKey(sectionId)) === '1'
}

export function TaskListBySections({ projectId }: Props) {
  const version = useTasksRefreshStore((s) => s.version)
  const { openAddTask } = useModalNavigation()
  const [sections, setSections] = useState<SectionDto[]>([])
  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) setLoading(true)
    })

    Promise.all([fetchSections(projectId), fetchTasks({ projectId })])
      .then(([secs, taskList]) => {
        if (cancelled) return
        setSections(secs)
        setTasks(taskList)
        const next: Record<string, boolean> = {}
        for (const s of secs) next[s.id] = readCollapsed(s.id)
        setCollapsed(next)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          toast.error(e instanceof Error ? e.message : 'Error al cargar')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [projectId, version])

  const unsectioned = useMemo(
    () => tasks.filter((t) => !t.sectionId),
    [tasks]
  )

  const bySection = useMemo(() => {
    const map = new Map<string, TaskDto[]>()
    for (const s of sections) map.set(s.id, [])
    for (const t of tasks) {
      if (t.sectionId && map.has(t.sectionId)) {
        map.get(t.sectionId)!.push(t)
      }
    }
    return map
  }, [sections, tasks])

  function toggle(sectionId: string) {
    setCollapsed((prev) => {
      const next = !prev[sectionId]
      localStorage.setItem(collapsedKey(sectionId), next ? '1' : '0')
      return { ...prev, [sectionId]: next }
    })
  }

  async function handleAddSection() {
    const name = window.prompt('Nombre de la sección')
    if (!name?.trim()) return
    try {
      const section = await createSection({
        projectId,
        name: name.trim(),
      })
      setSections((prev) => [...prev, section])
      toast.success('Sección creada')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear sección')
    }
  }

  if (loading) {
    return <p className="text-text-secondary mt-6 text-sm">Cargando…</p>
  }

  return (
    <div className="mt-6 flex max-w-2xl flex-col gap-4">
      {sections.map((section) => {
        const sectionTasks = bySection.get(section.id) ?? []
        const isCollapsed = collapsed[section.id]
        return (
          <section key={section.id}>
            <div className="group flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggle(section.id)}
                className="text-text-heading flex min-w-0 flex-1 items-center gap-2 text-left font-semibold"
              >
                <ChevronDownIcon
                  className={clsx(
                    'text-text-secondary size-4 shrink-0 transition-transform',
                    isCollapsed && '-rotate-90'
                  )}
                />
                <span className="truncate">{section.name}</span>
                <span className="text-text-secondary text-sm font-normal">
                  {sectionTasks.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  openAddTask({
                    projectId,
                    sectionId: section.id,
                  })
                }
                className="text-interactive-primary hover:bg-interactive-hover-soft rounded p-1 opacity-0 group-hover:opacity-100"
                aria-label={`Añadir tarea a ${section.name}`}
              >
                <PlusIcon className="size-4" />
              </button>
            </div>

            {!isCollapsed && (
              <ul className="mt-2 flex flex-col gap-2">
                {sectionTasks.map((task) => (
                  <li key={task.id}>
                    <TaskRow task={task} hideProjectMeta />
                  </li>
                ))}
                {sectionTasks.length === 0 && (
                  <li className="text-text-secondary px-2 text-sm">
                    Sin tareas en esta sección.
                  </li>
                )}
              </ul>
            )}
          </section>
        )
      })}

      {unsectioned.length > 0 && (
        <section>
          <h3 className="text-text-heading font-semibold">Sin sección</h3>
          <ul className="mt-2 flex flex-col gap-2">
            {unsectioned.map((task) => (
              <li key={task.id}>
                <TaskRow task={task} hideProjectMeta />
              </li>
            ))}
          </ul>
        </section>
      )}

      <button
        type="button"
        onClick={handleAddSection}
        className="text-text-secondary hover:text-text-primary mt-2 flex items-center gap-2 text-sm"
      >
        <PlusIcon className="size-4" />
        Añadir sección
      </button>
    </div>
  )
}
