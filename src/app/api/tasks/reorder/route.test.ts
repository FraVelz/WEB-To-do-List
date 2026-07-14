import { beforeEach, describe, expect, it, vi } from 'vitest'

import { POST } from './route'

const mocks = vi.hoisted(() => ({
  requireUserId: vi.fn(),
  reorderTasks: vi.fn(),
}))

vi.mock('@/lib/firebase/verify-auth', () => ({
  requireUserId: mocks.requireUserId,
}))

vi.mock('@/lib/firebase/repositories/tasks', () => ({
  reorderTasks: mocks.reorderTasks,
}))

describe('POST /api/tasks/reorder', () => {
  beforeEach(() => {
    mocks.requireUserId.mockReset()
    mocks.reorderTasks.mockReset()
    mocks.requireUserId.mockResolvedValue('user-1')
    mocks.reorderTasks.mockResolvedValue(2)
  })

  it('rechaza body sin updates', async () => {
    const res = await POST(
      new Request('http://localhost/api/tasks/reorder', {
        method: 'POST',
        body: JSON.stringify({}),
      })
    )
    expect(res.status).toBe(400)
    expect(mocks.reorderTasks).not.toHaveBeenCalled()
  })

  it('reordena con sectionId', async () => {
    const res = await POST(
      new Request('http://localhost/api/tasks/reorder', {
        method: 'POST',
        body: JSON.stringify({
          updates: [
            { id: 'a', order: 0, sectionId: 's1' },
            { id: 'b', order: 1, sectionId: null },
          ],
        }),
      })
    )
    expect(res.status).toBe(200)
    expect(mocks.reorderTasks).toHaveBeenCalledWith('user-1', [
      { id: 'a', order: 0, sectionId: 's1' },
      { id: 'b', order: 1, sectionId: null },
    ])
    const body = await res.json()
    expect(body.updated).toBe(2)
  })
})
