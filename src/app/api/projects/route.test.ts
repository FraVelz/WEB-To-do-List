import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GET, POST } from './route'

const mocks = vi.hoisted(() => ({
  requireUserId: vi.fn(),
  listProjects: vi.fn(),
  createProject: vi.fn(),
}))

vi.mock('@/lib/firebase/verify-auth', () => ({
  requireUserId: mocks.requireUserId,
}))

vi.mock('@/lib/firebase/repositories/projects', () => ({
  listProjects: mocks.listProjects,
  createProject: mocks.createProject,
}))

describe('GET /api/projects', () => {
  beforeEach(() => {
    mocks.requireUserId.mockReset()
    mocks.listProjects.mockReset()
    mocks.requireUserId.mockResolvedValue('user-1')
    mocks.listProjects.mockResolvedValue([])
  })

  it('lista proyectos del usuario', async () => {
    await GET(new Request('http://localhost/api/projects'))
    expect(mocks.listProjects).toHaveBeenCalledWith('user-1')
  })
})

describe('POST /api/projects', () => {
  beforeEach(() => {
    mocks.requireUserId.mockReset()
    mocks.createProject.mockReset()
    mocks.requireUserId.mockResolvedValue('user-1')
  })

  it('rechaza nombre vacío', async () => {
    const res = await POST(
      new Request('http://localhost/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name: '  ' }),
      })
    )
    expect(res.status).toBe(400)
    expect(mocks.createProject).not.toHaveBeenCalled()
  })

  it('crea proyecto', async () => {
    mocks.createProject.mockResolvedValue({
      id: 'p1',
      name: 'Hoy',
      description: null,
      order: 1,
      createdAt: '',
      updatedAt: '',
    })

    const res = await POST(
      new Request('http://localhost/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name: 'Hoy' }),
      })
    )
    expect(res.status).toBe(200)
    expect(mocks.createProject).toHaveBeenCalledWith('user-1', {
      name: 'Hoy',
      description: null,
    })
  })
})
