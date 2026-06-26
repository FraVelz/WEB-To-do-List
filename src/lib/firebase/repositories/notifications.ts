import { FieldValue, Timestamp } from 'firebase-admin/firestore'

import { getAdminDb } from '@/lib/firebase/admin'

export type NotificationRecord = {
  id: string
  title: string
  content: string
  color: string
  read: boolean
}

type NotificationDoc = {
  userId: string
  title: string
  content: string
  color: string
  read: boolean
  createdAt: Timestamp
}

const COLLECTION = 'notifications'

function toNotificationRecord(
  id: string,
  data: NotificationDoc
): NotificationRecord {
  return {
    id,
    title: data.title,
    content: data.content,
    color: data.color,
    read: data.read ?? false,
  }
}

export async function listNotifications(
  userId: string,
  unreadOnly = false
): Promise<NotificationRecord[]> {
  const snap = await getAdminDb()
    .collection(COLLECTION)
    .where('userId', '==', userId)
    .get()

  let items = snap.docs.map((doc) =>
    toNotificationRecord(doc.id, doc.data() as NotificationDoc)
  )

  if (unreadOnly) items = items.filter((item) => !item.read)

  items.sort((a, b) => b.id.localeCompare(a.id))
  return items
}

export async function createNotification(
  userId: string,
  data: { title: string; content: string; color: string }
): Promise<NotificationRecord> {
  const payload = {
    userId,
    title: data.title,
    content: data.content,
    color: data.color,
    read: false,
    createdAt: FieldValue.serverTimestamp(),
  }

  const ref = await getAdminDb().collection(COLLECTION).add(payload)
  const created = await ref.get()
  return toNotificationRecord(created.id, created.data() as NotificationDoc)
}

export async function updateNotificationRead(
  userId: string,
  id: string,
  read: boolean
): Promise<NotificationRecord | null> {
  const ref = getAdminDb().collection(COLLECTION).doc(id)
  const existing = await ref.get()

  if (
    !existing.exists ||
    (existing.data() as NotificationDoc).userId !== userId
  ) {
    return null
  }

  await ref.update({ read })
  const updated = await ref.get()
  return toNotificationRecord(updated.id, updated.data() as NotificationDoc)
}
