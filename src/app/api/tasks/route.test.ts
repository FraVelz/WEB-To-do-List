import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GET, POST } from './route'

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(),
  create: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    task: {
      findMany: mocks.findMany,
      create: mocks.create,
    },
  },
}))

describe('GET /api/tasks', () => {
  beforeEach(() => {
    mocks.findMany.mockReset()
    mocks.create.mockReset()
    mocks.findMany.mockResolvedValue([])
  })

  it('filtra inbox con completed false', async () => {
    const req = new Request('http://localhost/api/tasks?filter=inbox')
    await GET(req)

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ completed: false }),
      })
    )
  })

  it('filtra completed con completed true', async () => {
    await GET(new Request('http://localhost/api/tasks?filter=completed'))

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ completed: true }),
      })
    )
  })

  it('añade búsqueda insensible en título y descripción', async () => {
    await GET(new Request('http://localhost/api/tasks?q=  hola  '))

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { title: { contains: 'hola', mode: 'insensitive' } },
            { description: { contains: 'hola', mode: 'insensitive' } },
          ],
        }),
      })
    )
  })

  it('aplica label cuando viene en query', async () => {
    await GET(
      new Request('http://localhost/api/tasks?filter=inbox&label=Trabajo')
    )

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ label: 'Trabajo' }),
      })
    )
  })
})

describe('POST /api/tasks', () => {
  beforeEach(() => {
    mocks.findMany.mockReset()
    mocks.create.mockReset()
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
    expect(mocks.create).not.toHaveBeenCalled()
  })

  it('crea tarea con datos válidos', async () => {
    mocks.create.mockResolvedValue({
      id: 'c1',
      title: 'Ok',
      description: null,
      completed: false,
      dueDate: null,
      priority: 0,
      label: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const req = new Request('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: '  Ok  ' }),
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(mocks.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: 'Ok',
        description: null,
        label: null,
        dueDate: null,
        priority: 0,
      }),
    })
  })
})
