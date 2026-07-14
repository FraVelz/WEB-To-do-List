import { beforeEach, describe, expect, it, vi } from 'vitest'

import { POST } from './route'

const mocks = vi.hoisted(() => ({
  requireUserId: vi.fn(),
  reorderSections: vi.fn(),
}))

vi.mock('@/lib/firebase/verify-auth', () => ({
  requireUserId: mocks.requireUserId,
}))

vi.mock('@/lib/firebase/repositories/sections', () => ({
  reorderSections: mocks.reorderSections,
}))

describe('POST /api/sections/reorder', () => {
  beforeEach(() => {
    mocks.requireUserId.mockReset()
    mocks.reorderSections.mockReset()
    mocks.requireUserId.mockResolvedValue('user-1')
    mocks.reorderSections.mockResolvedValue(2)
  })

  it('rechaza updates vacíos', async () => {
    const res = await POST(
      new Request('http://localhost/api/sections/reorder', {
        method: 'POST',
        body: JSON.stringify({ updates: [{ id: 'x' }] }),
      })
    )
    expect(res.status).toBe(400)
    expect(mocks.reorderSections).not.toHaveBeenCalled()
  })

  it('reordena secciones', async () => {
    const res = await POST(
      new Request('http://localhost/api/sections/reorder', {
        method: 'POST',
        body: JSON.stringify({
          updates: [
            { id: 's1', order: 1 },
            { id: 's2', order: 0 },
          ],
        }),
      })
    )
    expect(res.status).toBe(200)
    expect(mocks.reorderSections).toHaveBeenCalledWith('user-1', [
      { id: 's1', order: 1 },
      { id: 's2', order: 0 },
    ])
  })
})
