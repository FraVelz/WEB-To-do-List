import {
  createDemoProject,
  deleteDemoProject,
  getDemoProject,
  listDemoProjects,
  patchDemoProject,
  createDemoSection,
  deleteDemoSection,
  listDemoSections,
  patchDemoSection,
  reorderDemoSections,
} from '@/lib/demo/local-store'
import { isDemoMode } from '@/lib/demo/is-demo-mode'

import { authFetch } from './auth-fetch'

export type ProjectDto = {
  id: string
  name: string
  description: string | null
  order: number
  createdAt: string
  updatedAt: string
}

export type SectionDto = {
  id: string
  projectId: string
  name: string
  order: number
  createdAt: string
  updatedAt: string
}

export async function fetchProjects(): Promise<ProjectDto[]> {
  if (isDemoMode()) return listDemoProjects()

  const res = await authFetch('/api/projects', { cache: 'no-store' })
  if (!res.ok) throw new Error('Error al cargar proyectos')
  return res.json() as Promise<ProjectDto[]>
}

export async function fetchProject(id: string): Promise<ProjectDto> {
  if (isDemoMode()) {
    const project = getDemoProject(id)
    if (!project) throw new Error('Proyecto no encontrado')
    return project
  }

  const res = await authFetch(`/api/projects/${id}`, { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al cargar proyecto'
    )
  }
  return res.json() as Promise<ProjectDto>
}

export async function createProject(data: {
  name: string
  description?: string | null
}): Promise<ProjectDto> {
  if (isDemoMode()) return createDemoProject(data)

  const res = await authFetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al crear proyecto'
    )
  }
  return res.json() as Promise<ProjectDto>
}

export async function patchProject(
  id: string,
  data: Partial<{ name: string; description: string | null; order: number }>
): Promise<ProjectDto> {
  if (isDemoMode()) {
    const updated = patchDemoProject(id, data)
    if (!updated) throw new Error('Proyecto no encontrado')
    return updated
  }

  const res = await authFetch(`/api/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al actualizar proyecto'
    )
  }
  return res.json() as Promise<ProjectDto>
}

export async function deleteProject(id: string): Promise<void> {
  if (isDemoMode()) {
    const ok = deleteDemoProject(id)
    if (!ok) throw new Error('Proyecto no encontrado')
    return
  }

  const res = await authFetch(`/api/projects/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al eliminar proyecto'
    )
  }
}

export async function fetchSections(projectId: string): Promise<SectionDto[]> {
  if (isDemoMode()) return listDemoSections(projectId)

  const res = await authFetch(`/api/projects/${projectId}/sections`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Error al cargar secciones')
  return res.json() as Promise<SectionDto[]>
}

export async function createSection(data: {
  projectId: string
  name: string
}): Promise<SectionDto> {
  if (isDemoMode()) return createDemoSection(data)

  const res = await authFetch(`/api/projects/${data.projectId}/sections`, {
    method: 'POST',
    body: JSON.stringify({ name: data.name }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al crear sección'
    )
  }
  return res.json() as Promise<SectionDto>
}

export async function patchSection(
  id: string,
  data: Partial<{ name: string; order: number }>
): Promise<SectionDto> {
  if (isDemoMode()) {
    const updated = patchDemoSection(id, data)
    if (!updated) throw new Error('Sección no encontrada')
    return updated
  }

  const res = await authFetch(`/api/sections/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al actualizar sección'
    )
  }
  return res.json() as Promise<SectionDto>
}

export async function reorderSections(
  updates: Array<{ id: string; order: number }>
): Promise<number> {
  if (updates.length === 0) return 0
  if (isDemoMode()) {
    return reorderDemoSections(updates)
  }

  const res = await authFetch('/api/sections/reorder', {
    method: 'POST',
    body: JSON.stringify({ updates }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al reordenar secciones'
    )
  }
  const body = (await res.json()) as { updated: number }
  return body.updated
}

export async function deleteSection(id: string): Promise<void> {
  if (isDemoMode()) {
    const ok = deleteDemoSection(id)
    if (!ok) throw new Error('Sección no encontrada')
    return
  }

  const res = await authFetch(`/api/sections/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al eliminar sección'
    )
  }
}
