'use client'

import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import clsx from 'clsx'

import {
  createProject,
  fetchProjects,
  type ProjectDto,
} from '@/services/projects'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'

type Props = {
  onNavigate?: () => void
}

export function ProjectsNav({ onNavigate }: Props) {
  const pathname = usePathname()
  const version = useTasksRefreshStore((s) => s.version)
  const [projects, setProjects] = useState<ProjectDto[]>([])
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchProjects()
      .then((data) => {
        if (!cancelled) setProjects(data)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          toast.error(
            e instanceof Error ? e.message : 'Error al cargar proyectos'
          )
        }
      })
    return () => {
      cancelled = true
    }
  }, [version])

  async function handleAdd() {
    const name = window.prompt('Nombre del proyecto')
    if (!name?.trim()) return
    setCreating(true)
    try {
      const project = await createProject({ name: name.trim() })
      setProjects((prev) => [...prev, project])
      toast.success('Proyecto creado')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear proyecto')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="mt-4 px-3">
      <div className="mb-1 flex items-center justify-between px-2">
        <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
          Mis Proyectos
        </p>
        <button
          type="button"
          onClick={handleAdd}
          disabled={creating}
          className="text-text-secondary hover:text-text-primary rounded p-0.5"
          aria-label="Añadir proyecto"
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
      <ul className="flex flex-col gap-0.5">
        {projects.map((project) => {
          const href = `/projects/${project.id}`
          const active = pathname === href
          return (
            <li key={project.id}>
              <Link
                href={href}
                onClick={onNavigate}
                className={clsx(
                  'hover:bg-interactive-hover-soft flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                  active
                    ? 'bg-surface-accent-soft text-text-accent'
                    : 'text-text-primary'
                )}
              >
                <span className="text-text-accent font-semibold">#</span>
                <span className="min-w-0 truncate">{project.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
