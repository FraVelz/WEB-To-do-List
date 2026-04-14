export type TaskDto = {
  id: string
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
  priority: number
  label: string | null
  createdAt: string
  updatedAt: string
}

export type TaskFilter = 'inbox' | 'today' | 'next' | 'completed'

export async function fetchTasks(params: {
  filter?: TaskFilter
  q?: string
  label?: string
}): Promise<TaskDto[]> {
  const sp = new URLSearchParams()
  if (params.filter) sp.set('filter', params.filter)
  if (params.q) sp.set('q', params.q)
  if (params.label) sp.set('label', params.label)

  const res = await fetch(`/api/tasks?${sp.toString()}`, {
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

export async function createTask(data: {
  title: string
  description?: string | null
  dueDate?: string | null
  label?: string | null
  priority?: number
}): Promise<TaskDto> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  }>
): Promise<TaskDto> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
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

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Error al eliminar tarea'
    )
  }
}

export async function fetchTaskLabels(): Promise<string[]> {
  const res = await fetch('/api/task-labels', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Error al cargar etiquetas')
  }
  return res.json() as Promise<string[]>
}
