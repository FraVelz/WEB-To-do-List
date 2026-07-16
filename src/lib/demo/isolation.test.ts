import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { writeAuthMode } from '@/lib/auth-session'
import { createTask, fetchTasks, patchTask } from '@/services/tasks'

vi.mock('@/lib/firebase/auth-client', () => ({
  getIdToken: vi.fn().mockResolvedValue('should-not-be-used'),
}))

describe('demo isolation (L6-4)', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    writeAuthMode('demo')
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetchTasks in demo never calls fetch / network', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const tasks = await fetchTasks({ filter: 'inbox' })
    expect(tasks.length).toBeGreaterThan(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('createTask + patchTask in demo stay in localStorage only', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const created = await createTask({ title: 'Aislada', label: ' Lab ' })
    expect(created.label).toBe('Lab')

    const patched = await patchTask(created.id, { completed: true })
    expect(patched.completed).toBe(true)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(localStorage.getItem('todo-demo-data-v2')).toBeTruthy()
  })
})
