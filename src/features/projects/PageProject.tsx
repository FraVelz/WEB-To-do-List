'use client'

import { useEffect, useState } from 'react'
import { toast } from '@pheralb/toast'

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
  const bump = useTasksRefreshStore((s) => s.bump)
  const { openAddTask } = useModalNavigation()
  const [project, setProject] = useState<ProjectDto | null>(null)
  const [name, setName] = useState('')
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
        setName(p.name)
        setDescription(p.description ?? '')
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          toast.error({
            text: e instanceof Error ? e.message : 'Error al cargar proyecto',
          })
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

  async function saveName() {
    if (!project) return
    const next = name.trim()
    if (!next) {
      setName(project.name)
      toast.error({ text: 'El nombre no puede estar vacío' })
      return
    }
    if (project.name === next) return
    try {
      const updated = await patchProject(project.id, { name: next })
      setProject(updated)
      setName(updated.name)
      bump()
    } catch (e) {
      setName(project.name)
      toast.error({
        text: e instanceof Error ? e.message : 'Error al guardar nombre',
      })
    }
  }

  async function saveDescription() {
    if (!project) return
    const next = description.trim() || null
    if ((project.description ?? null) === next) return
    try {
      const updated = await patchProject(project.id, { description: next })
      setProject(updated)
    } catch (e) {
      toast.error({
        text: e instanceof Error ? e.message : 'Error al guardar descripción',
      })
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
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => void saveName()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur()
                  }
                }}
                aria-label="Nombre del proyecto"
                className="text-text-heading min-w-0 flex-1 bg-transparent text-2xl font-bold outline-none"
              />
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
              onBlur={() => void saveDescription()}
              placeholder="Añade una descripción"
              aria-label="Descripción del proyecto"
              className="text-text-secondary placeholder:text-text-secondary/70 mt-2 w-full max-w-2xl bg-transparent text-sm outline-none"
            />
            <TaskListBySections projectId={project.id} />
          </>
        )}
      </main>
    </>
  )
}
