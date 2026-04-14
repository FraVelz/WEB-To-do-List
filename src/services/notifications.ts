export type NotificationDto = {
  id: number
  title: string
  content: string
  color: string
  read: boolean
}

export async function fetchNotifications(params?: {
  unreadOnly?: boolean
}): Promise<NotificationDto[]> {
  const sp = new URLSearchParams()
  if (params?.unreadOnly) sp.set('unread', 'true')

  const res = await fetch(`/api/notifications?${sp.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Error al cargar notificaciones')
  }

  return res.json() as Promise<NotificationDto[]>
}

export async function markNotificationRead(id: number): Promise<void> {
  const res = await fetch(`/api/notifications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
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
  const res = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, color }),
  })

  const raw = await res.text()

  if (!res.ok) {
    console.warn('POST /api/notifications falló:', res.status, raw)
    return null
  }

  return JSON.parse(raw) as unknown
}
