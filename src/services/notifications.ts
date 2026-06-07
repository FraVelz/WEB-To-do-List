import {
  createDemoNotification,
  listDemoNotifications,
  markDemoNotificationRead,
} from '@/lib/demo/local-store'
import { isDemoMode } from '@/lib/demo/is-demo-mode'

import { authFetch } from './auth-fetch'

export type NotificationDto = {
  id: string
  title: string
  content: string
  color: string
  read: boolean
}

export async function fetchNotifications(params?: {
  unreadOnly?: boolean
}): Promise<NotificationDto[]> {
  if (isDemoMode()) {
    return listDemoNotifications(params?.unreadOnly ?? false)
  }

  const sp = new URLSearchParams()
  if (params?.unreadOnly) sp.set('unread', 'true')

  const res = await authFetch(`/api/notifications?${sp.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Error al cargar notificaciones')
  }

  return res.json() as Promise<NotificationDto[]>
}

export async function markNotificationRead(id: string): Promise<void> {
  if (isDemoMode()) {
    const ok = markDemoNotificationRead(id)
    if (!ok) throw new Error('Notificación no encontrada')
    return
  }

  const res = await authFetch(`/api/notifications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ read: true }),
  })

  if (!res.ok) {
    throw new Error('Error al marcar notificación')
  }
}

export async function sendNotification({
  title,
  content,
  color,
}: {
  title: string
  content: string
  color: string
}) {
  if (isDemoMode()) {
    return createDemoNotification({ title, content, color })
  }

  const res = await authFetch('/api/notifications', {
    method: 'POST',
    body: JSON.stringify({ title, content, color }),
  })

  const raw = await res.text()

  if (!res.ok) {
    console.warn('POST /api/notifications falló:', res.status, raw)
    return null
  }

  return JSON.parse(raw) as unknown
}
