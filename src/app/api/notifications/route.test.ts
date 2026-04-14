import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GET, POST } from './route'

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(),
  create: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    notification: {
      findMany: mocks.findMany,
      create: mocks.create,
    },
  },
}))

describe('GET /api/notifications', () => {
  beforeEach(() => {
    mocks.findMany.mockReset()
    mocks.findMany.mockResolvedValue([])
  })

  it('lista todas si no hay unread', async () => {
    await GET(new Request('http://localhost/api/notifications'))

    expect(mocks.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { id: 'desc' },
    })
  })

  it('filtra no leídas con unread=true', async () => {
    await GET(
      new Request('http://localhost/api/notifications?unread=true')
    )

    expect(mocks.findMany).toHaveBeenCalledWith({
      where: { read: false },
      orderBy: { id: 'desc' },
    })
  })
})

describe('POST /api/notifications', () => {
  beforeEach(() => {
    mocks.create.mockReset()
  })

  it('400 si falta título o contenido', async () => {
    const req = new Request('http://localhost/api/notifications', {
      method: 'POST',
      body: JSON.stringify({ title: '', content: 'c' }),
    })

    const res = await POST(req)

    expect(res.status).toBe(400)
    expect(mocks.create).not.toHaveBeenCalled()
  })

  it('crea notificación válida', async () => {
    mocks.create.mockResolvedValue({
      id: 1,
      title: 'Hola',
      content: 'Mundo',
      color: 'red',
      read: false,
    })

    const req = new Request('http://localhost/api/notifications', {
      method: 'POST',
      body: JSON.stringify({
        title: ' Hola ',
        content: ' Mundo ',
        color: 'blue',
      }),
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(mocks.create).toHaveBeenCalledWith({
      data: { title: 'Hola', content: 'Mundo', color: 'blue' },
    })
  })
})
