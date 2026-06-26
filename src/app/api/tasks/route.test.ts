import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GET, POST } from './route'

const mocks = vi.hoisted(() => ({
  requireUserId: vi.fn(),
  listTasks: vi.fn(),
  createTask: vi.fn(),
}))

vi.mock('@/lib/firebase/verify-auth', () => ({
  requireUserId: mocks.requireUserId,
}))

vi.mock('@/lib/firebase/repositories/tasks', () => ({
  listTasks: mocks.listTasks,
  createTask: mocks.createTask,
}))

describe('GET /api/tasks', () => {
  beforeEach(() => {
    mocks.requireUserId.mockReset()
    mocks.listTasks.mockReset()
    mocks.createTask.mockReset()
    mocks.requireUserId.mockResolvedValue('user-1')
    mocks.listTasks.mockResolvedValue([])
  })

  it('filtra inbox con completed false', async () => {
    const req = new Request('http://localhost/api/tasks?filter=inbox')
    await GET(req)

    expect(mocks.listTasks).toHaveBeenCalledWith('user-1', {
      filter: 'inbox',
      q: undefined,
      label: undefined,
    })
  })

  it('filtra completed', async () => {
    await GET(new Request('http://localhost/api/tasks?filter=completed'))

    expect(mocks.listTasks).toHaveBeenCalledWith('user-1', {
      filter: 'completed',
      q: undefined,
      label: undefined,
    })
  })

  it('pasa búsqueda y label al repositorio', async () => {
    await GET(
      new Request(
        'http://localhost/api/tasks?filter=inbox&q=  hola  &label=Trabajo'
      )
    )

    expect(mocks.listTasks).toHaveBeenCalledWith('user-1', {
      filter: 'inbox',
      q: 'hola',
      label: 'Trabajo',
    })
  })

  it('devuelve 401 si no hay token', async () => {
    const { NextResponse } = await import('next/server')
    mocks.requireUserId.mockResolvedValue(
      NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    )

    const res = await GET(new Request('http://localhost/api/tasks'))
    expect(res.status).toBe(401)
  })
})

describe('POST /api/tasks', () => {
  beforeEach(() => {
    mocks.requireUserId.mockReset()
    mocks.createTask.mockReset()
    mocks.requireUserId.mockResolvedValue('user-1')
  })

  it('rechaza título vacío con 400', async () => {
    const req = new Request('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: '   ' }),
    })

    const res = await POST(req)

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/título/i)
    expect(mocks.createTask).not.toHaveBeenCalled()
  })

  it('crea tarea con datos válidos', async () => {
    mocks.createTask.mockResolvedValue({
      id: 'c1',
      title: 'Ok',
      description: null,
      completed: false,
      dueDate: null,
      priority: 0,
      label: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    const req = new Request('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: '  Ok  ' }),
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(mocks.createTask).toHaveBeenCalledWith('user-1', {
      title: 'Ok',
      description: null,
      label: null,
      dueDate: null,
      priority: 0,
    })
  })
})
