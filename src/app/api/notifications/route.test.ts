import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GET, POST } from './route'

const mocks = vi.hoisted(() => ({
  requireUserId: vi.fn(),
  listNotifications: vi.fn(),
  createNotification: vi.fn(),
}))

vi.mock('@/lib/firebase/verify-auth', () => ({
  requireUserId: mocks.requireUserId,
}))

vi.mock('@/lib/firebase/repositories/notifications', () => ({
  listNotifications: mocks.listNotifications,
  createNotification: mocks.createNotification,
}))

describe('GET /api/notifications', () => {
  beforeEach(() => {
    mocks.requireUserId.mockReset()
    mocks.listNotifications.mockReset()
    mocks.requireUserId.mockResolvedValue('user-1')
    mocks.listNotifications.mockResolvedValue([])
  })

  it('lista todas si no hay unread', async () => {
    await GET(new Request('http://localhost/api/notifications'))

    expect(mocks.listNotifications).toHaveBeenCalledWith('user-1', false)
  })

  it('filtra no leídas con unread=true', async () => {
    await GET(
      new Request('http://localhost/api/notifications?unread=true')
    )

    expect(mocks.listNotifications).toHaveBeenCalledWith('user-1', true)
  })
})

describe('POST /api/notifications', () => {
  beforeEach(() => {
    mocks.requireUserId.mockReset()
    mocks.createNotification.mockReset()
    mocks.requireUserId.mockResolvedValue('user-1')
  })

  it('400 si falta título o contenido', async () => {
    const req = new Request('http://localhost/api/notifications', {
      method: 'POST',
      body: JSON.stringify({ title: '', content: 'c' }),
    })

    const res = await POST(req)

    expect(res.status).toBe(400)
    expect(mocks.createNotification).not.toHaveBeenCalled()
  })

  it('crea notificación válida', async () => {
    mocks.createNotification.mockResolvedValue({
      id: 'n1',
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
    expect(mocks.createNotification).toHaveBeenCalledWith('user-1', {
      title: 'Hola',
      content: 'Mundo',
      color: 'blue',
    })
  })
})
