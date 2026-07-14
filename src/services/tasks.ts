import {
  countDemoTasks,
  createDemoTask,
  deleteDemoTask,
  listDemoTaskLabels,
  listDemoTasks,
  patchDemoTask,
  rescheduleDemoTasks,
} from '@/lib/demo/local-store'
import { isDemoMode } from '@/lib/demo/is-demo-mode'

import { authFetch } from './auth-fetch'

export type TaskDto = {
  id: string
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
  priority: number
  label: string | null
  projectId: string | null
  sectionId: string | null
  order: number
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export type TaskFilter =
  | 'inbox'
  | 'today'
  | 'next'
  | 'completed'
  | 'overdue'
  | 'all'

export type TaskCounts = {
  inbox: number
  today: number
  next: number
  overdue: number
}

export async function fetchTasks(params: {
  filter?: TaskFilter
  q?: string
  label?: string
  projectId?: string
}): Promise<TaskDto[]> {
  if (isDemoMode()) {
    return listDemoTasks(params)
  }

  const sp = new URLSearchParams()
  if (params.filter) sp.set('filter', params.filter)
  if (params.q) sp.set('q', params.q)
  if (params.label) sp.set('label', params.label)
  if (params.projectId) sp.set('projectId', params.projectId)

  const res = await authFetch(`/api/tasks?${sp.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al cargar tareas'
    )
  }

  return res.json() as Promise<TaskDto[]>
}

export async function fetchTaskCounts(): Promise<TaskCounts> {
  if (isDemoMode()) {
    return countDemoTasks()
  }

  const res = await authFetch('/api/tasks/counts', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Error al cargar conteos')
  }
  return res.json() as Promise<TaskCounts>
}

export async function createTask(data: {
  title: string
  description?: string | null
  dueDate?: string | null
  label?: string | null
  priority?: number
  projectId?: string | null
  sectionId?: string | null
  order?: number
}): Promise<TaskDto> {
  if (isDemoMode()) {
    return createDemoTask(data)
  }

  const res = await authFetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al crear tarea'
    )
  }

  return res.json() as Promise<TaskDto>
}

export async function patchTask(
  id: string,
  data: Partial<{
    title: string
    description: string | null
    completed: boolean
    dueDate: string | null
    priority: number
    label: string | null
    projectId: string | null
    sectionId: string | null
    order: number
  }>
): Promise<TaskDto> {
  if (isDemoMode()) {
    const updated = patchDemoTask(id, data)
    if (!updated) throw new Error('Tarea no encontrada')
    return updated
  }

  const res = await authFetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al actualizar tarea'
    )
  }

  return res.json() as Promise<TaskDto>
}

export async function rescheduleTasks(
  ids: string[],
  dueDate: string
): Promise<number> {
  if (isDemoMode()) {
    return rescheduleDemoTasks(ids, dueDate)
  }

  const res = await authFetch('/api/tasks/reschedule', {
    method: 'POST',
    body: JSON.stringify({ ids, dueDate }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al reprogramar'
    )
  }

  const body = (await res.json()) as { updated: number }
  return body.updated
}

export async function deleteTask(id: string): Promise<void> {
  if (isDemoMode()) {
    const ok = deleteDemoTask(id)
    if (!ok) throw new Error('Tarea no encontrada')
    return
  }

  const res = await authFetch(`/api/tasks/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al eliminar tarea'
    )
  }
}

export async function fetchTaskLabels(): Promise<string[]> {
  if (isDemoMode()) {
    return listDemoTaskLabels()
  }

  const res = await authFetch('/api/task-labels', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Error al cargar etiquetas')
  }
  return res.json() as Promise<string[]>
}
