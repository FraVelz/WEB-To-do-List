import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  createTask,
  deleteTask,
  fetchTaskLabels,
  fetchTasks,
  patchTask,
} from './tasks'

describe('tasks (cliente fetch)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetchTasks construye la URL con filtros', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })
    vi.stubGlobal('fetch', fetchMock)

    await fetchTasks({ filter: 'inbox', q: 'hola', label: 'Trabajo' })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tasks?filter=inbox&q=hola&label=Trabajo',
      expect.objectContaining({ cache: 'no-store' })
    )
  })

  it('fetchTasks lanza con mensaje del servidor si res.ok es false', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'falló' }),
      })
    )

    await expect(fetchTasks({ filter: 'today' })).rejects.toThrow('falló')
  })

  it('createTask envía POST con JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: '1',
          title: 'T',
          description: null,
          completed: false,
          dueDate: null,
          priority: 0,
          label: null,
          createdAt: '',
          updatedAt: '',
        }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await createTask({ title: 'Nueva', description: 'desc' })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tasks',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Nueva',
          description: 'desc',
          dueDate: undefined,
          label: undefined,
          priority: undefined,
        }),
      })
    )
  })

  it('patchTask llama al endpoint con PATCH', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 'x',
          title: 'T',
          description: null,
          completed: true,
          dueDate: null,
          priority: 0,
          label: null,
          createdAt: '',
          updatedAt: '',
        }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await patchTask('abc', { completed: true })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tasks/abc',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ completed: true }),
      })
    )
  })

  it('deleteTask usa DELETE', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await deleteTask('id-1')

    expect(fetchMock).toHaveBeenCalledWith('/api/tasks/id-1', {
      method: 'DELETE',
    })
  })

  it('fetchTaskLabels pide /api/task-labels', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(['a', 'b']),
    })
    vi.stubGlobal('fetch', fetchMock)

    const labels = await fetchTaskLabels()

    expect(fetchMock).toHaveBeenCalledWith('/api/task-labels', {
      cache: 'no-store',
    })
    expect(labels).toEqual(['a', 'b'])
  })
})
