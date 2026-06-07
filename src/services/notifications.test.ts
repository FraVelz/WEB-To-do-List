import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchNotifications, markNotificationRead } from './notifications'

vi.mock('@/lib/firebase/auth-client', () => ({
  getIdToken: vi.fn().mockResolvedValue('test-token'),
}))

describe('notifications (cliente fetch)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetchNotifications sin unreadOnly no añade query', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })
    vi.stubGlobal('fetch', fetchMock)

    await fetchNotifications()

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/notifications?',
      expect.objectContaining({ cache: 'no-store' })
    )
  })

  it('fetchNotifications con unreadOnly añade unread=true', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })
    vi.stubGlobal('fetch', fetchMock)

    await fetchNotifications({ unreadOnly: true })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/notifications?unread=true',
      expect.objectContaining({ cache: 'no-store' })
    )
  })

  it('markNotificationRead hace PATCH con read true', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await markNotificationRead('notif-42')

    expect(fetchMock).toHaveBeenCalledWith('/api/notifications/notif-42', {
      method: 'PATCH',
      headers: expect.any(Headers),
      body: JSON.stringify({ read: true }),
    })
  })
})
