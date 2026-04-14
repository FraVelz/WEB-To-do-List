import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DELETE, PATCH } from './route'

const mocks = vi.hoisted(() => ({
  update: vi.fn(),
  deleteTask: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    task: {
      update: mocks.update,
      delete: mocks.deleteTask,
    },
  },
}))

const ctx = (id: string) =>
  ({
    params: Promise.resolve({ id }),
  }) as { params: Promise<{ id: string }> }

describe('PATCH /api/tasks/[id]', () => {
  beforeEach(() => {
    mocks.update.mockReset()
    mocks.update.mockResolvedValue({
      id: '1',
      title: 'T',
      description: null,
      completed: true,
      dueDate: null,
      priority: 0,
      label: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })

  it('rechaza título solo espacios con 400', async () => {
    const req = new Request('http://localhost/api/tasks/1', {
      method: 'PATCH',
      body: JSON.stringify({ title: '  ' }),
    })

    const res = await PATCH(req, ctx('1'))

    expect(res.status).toBe(400)
    expect(mocks.update).not.toHaveBeenCalled()
  })

  it('actualiza completed', async () => {
    const req = new Request('http://localhost/api/tasks/abc', {
      method: 'PATCH',
      body: JSON.stringify({ completed: true }),
    })

    const res = await PATCH(req, ctx('abc'))

    expect(res.status).toBe(200)
    expect(mocks.update).toHaveBeenCalledWith({
      where: { id: 'abc' },
      data: { completed: true },
    })
  })
})

describe('DELETE /api/tasks/[id]', () => {
  beforeEach(() => {
    mocks.deleteTask.mockReset()
    mocks.deleteTask.mockResolvedValue({})
  })

  it('elimina por id', async () => {
    const res = await DELETE(
      new Request('http://localhost/api/tasks/x'),
      ctx('x')
    )

    expect(res.status).toBe(200)
    expect(mocks.deleteTask).toHaveBeenCalledWith({ where: { id: 'x' } })
  })
})
