'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  fetchNotifications,
  type NotificationDto,
} from '@/services/notifications'

import { NotificationRow } from './components/NotificationRow'

export function SectionNotification({ unreadOnly }: { unreadOnly?: boolean }) {
  const [items, setItems] = useState<NotificationDto[]>([])

  function load() {
    fetchNotifications({ unreadOnly })
      .then(setItems)
      .catch(() => toast.error('No se pudieron cargar las notificaciones'))
  }

  useEffect(() => {
    fetchNotifications({ unreadOnly })
      .then(setItems)
      .catch(() => toast.error('No se pudieron cargar las notificaciones'))
  }, [unreadOnly])

  return (
    <section>
      <hr className="border-border-subtle my-4" />
      {items.length === 0 ? (
        <p className="text-text-secondary text-sm">
          {unreadOnly
            ? 'No tienes notificaciones sin leer.'
            : 'No hay notificaciones.'}
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <NotificationRow item={item} onUpdated={load} />
            </li>
          ))}
        </ul>
      )}
      <hr className="border-border-subtle my-4" />
    </section>
  )
}
