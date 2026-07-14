'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import Header from '@/components/layout/header/Header'
import {
  fetchProject,
  patchProject,
  type ProjectDto,
} from '@/services/projects'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'
import { useModalNavigation } from '@/hooks/useModalNavigation'

import { TaskListBySections } from './components/TaskListBySections'

type Props = {
  projectId: string
}

export function PageProject({ projectId }: Props) {
  const version = useTasksRefreshStore((s) => s.version)
  const { openAddTask } = useModalNavigation()
  const [project, setProject] = useState<ProjectDto | null>(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) setLoading(true)
    })
    fetchProject(projectId)
      .then((p) => {
        if (cancelled) return
        setProject(p)
        setDescription(p.description ?? '')
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          toast.error(
            e instanceof Error ? e.message : 'Error al cargar proyecto'
          )
          setProject(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [projectId, version])

  async function saveDescription() {
    if (!project) return
    const next = description.trim() || null
    if ((project.description ?? null) === next) return
    try {
      const updated = await patchProject(project.id, { description: next })
      setProject(updated)
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Error al guardar descripción'
      )
    }
  }

  return (
    <>
      <Header />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6">
        {loading && (
          <p className="text-text-secondary text-sm">Cargando proyecto…</p>
        )}
        {!loading && !project && (
          <p className="text-text-secondary text-sm">Proyecto no encontrado.</p>
        )}
        {project && (
          <>
            <p className="text-text-secondary text-sm">Mis Proyectos /</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-text-heading text-2xl font-bold">
                {project.name}
              </h1>
              <button
                type="button"
                onClick={() => openAddTask({ projectId: project.id })}
                className="bg-interactive-primary hover:bg-interactive-primary-hover text-text-primary rounded-md px-3 py-1.5 text-sm font-semibold"
              >
                Añadir tarea
              </button>
            </div>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={saveDescription}
              placeholder="Añade una descripción"
              className="text-text-secondary placeholder:text-text-secondary/70 mt-2 w-full max-w-2xl bg-transparent text-sm outline-none"
            />
            <TaskListBySections projectId={project.id} />
          </>
        )}
      </main>
    </>
  )
}
