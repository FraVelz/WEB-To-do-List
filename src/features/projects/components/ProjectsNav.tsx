'use client'

import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from '@pheralb/toast'
import clsx from 'clsx'

import { NameInputModal } from '@/features/projects/components/NameInputModal'
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
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchProjects()
      .then((data) => {
        if (!cancelled) setProjects(data)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          toast.error({
            text: e instanceof Error ? e.message : 'Error al cargar proyectos',
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [version])

  async function handleCreate(name: string) {
    const project = await createProject({ name })
    setProjects((prev) => [...prev, project])
    toast.success({ text: 'Proyecto creado' })
  }

  return (
    <div className="mt-4 px-3">
      <div className="mb-1 flex items-center justify-between px-2">
        <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
          Mis Proyectos
        </p>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
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

      <NameInputModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Nuevo proyecto"
        label="Nombre del proyecto"
        confirmLabel="Crear"
        onSubmit={handleCreate}
      />
    </div>
  )
}
