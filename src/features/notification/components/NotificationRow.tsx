'use client'

import clsx from 'clsx'
import { toast } from 'sonner'

import {
  markNotificationRead,
  type NotificationDto,
} from '@/services/notifications'

type Props = {
  item: NotificationDto
  onUpdated: () => void
}

export function NotificationRow({ item, onUpdated }: Props) {
  const bgColor =
    item.color === 'red'
      ? 'bg-accent-400'
      : item.color === 'blue'
        ? 'bg-blue-400'
        : 'bg-gray-400'

  async function handleOpen() {
    if (!item.read) {
      try {
        await markNotificationRead(item.id)
        onUpdated()
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : 'No se pudo marcar como leída'
        )
      }
    }
  }

  return (
    <button
      type="button"
      className={clsx(
        'hover:bg-interactive-hover-soft flex w-full cursor-pointer gap-3 rounded-lg px-3 py-2 text-left',
        !item.read && 'bg-interactive-hover-soft/40'
      )}
      onClick={handleOpen}
    >
      <div>
        <div className={clsx('size-8 rounded-full p-2', bgColor)} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-bold">{item.title}</p>
        <p className="mt-3 text-[14px] text-[var(--color-muted-foreground)]">
          {item.content}
        </p>
      </div>
    </button>
  )
}
