import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DELETE, PATCH } from './route'

const mocks = vi.hoisted(() => ({
  requireUserId: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}))

vi.mock('@/lib/firebase/verify-auth', () => ({
  requireUserId: mocks.requireUserId,
}))

vi.mock('@/lib/firebase/repositories/tasks', () => ({
  updateTask: mocks.updateTask,
  deleteTask: mocks.deleteTask,
}))

const ctx = (id: string) =>
  ({
    params: Promise.resolve({ id }),
  }) as { params: Promise<{ id: string }> }

describe('PATCH /api/tasks/[id]', () => {
  beforeEach(() => {
    mocks.requireUserId.mockReset()
    mocks.updateTask.mockReset()
    mocks.requireUserId.mockResolvedValue('user-1')
    mocks.updateTask.mockResolvedValue({
      id: '1',
      title: 'T',
      description: null,
      completed: true,
      dueDate: null,
      priority: 0,
      label: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  })

  it('rechaza título solo espacios con 400', async () => {
    const req = new Request('http://localhost/api/tasks/1', {
      method: 'PATCH',
      body: JSON.stringify({ title: '  ' }),
    })

    const res = await PATCH(req, ctx('1'))

    expect(res.status).toBe(400)
    expect(mocks.updateTask).not.toHaveBeenCalled()
  })

  it('actualiza completed', async () => {
    const req = new Request('http://localhost/api/tasks/abc', {
      method: 'PATCH',
      body: JSON.stringify({ completed: true }),
    })

    const res = await PATCH(req, ctx('abc'))

    expect(res.status).toBe(200)
    expect(mocks.updateTask).toHaveBeenCalledWith('user-1', 'abc', {
      completed: true,
    })
  })
})

describe('DELETE /api/tasks/[id]', () => {
  beforeEach(() => {
    mocks.requireUserId.mockReset()
    mocks.deleteTask.mockReset()
    mocks.requireUserId.mockResolvedValue('user-1')
    mocks.deleteTask.mockResolvedValue(true)
  })

  it('elimina por id', async () => {
    const res = await DELETE(
      new Request('http://localhost/api/tasks/x'),
      ctx('x')
    )

    expect(res.status).toBe(200)
    expect(mocks.deleteTask).toHaveBeenCalledWith('user-1', 'x')
  })
})
