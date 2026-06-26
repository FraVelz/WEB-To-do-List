import { FieldValue, Timestamp } from 'firebase-admin/firestore'

import { getAdminDb } from '@/lib/firebase/admin'

export type TaskRecord = {
  id: string
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
  priority: number
  label: string | null
  createdAt: string
  updatedAt: string
}

export type TaskFilter = 'inbox' | 'today' | 'next' | 'completed'

type TaskDoc = {
  userId: string
  title: string
  description: string | null
  completed: boolean
  dueDate: Timestamp | null
  priority: number
  label: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

const COLLECTION = 'tasks'

function utcDayRange(ref: Date = new Date()) {
  const start = new Date(
    Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate())
  )
  const end = new Date(start.getTime() + 86400000)
  return { start, end }
}

function toIso(value: Timestamp | null | undefined): string | null {
  return value?.toDate().toISOString() ?? null
}

function toTaskRecord(id: string, data: TaskDoc): TaskRecord {
  return {
    id,
    title: data.title,
    description: data.description ?? null,
    completed: data.completed ?? false,
    dueDate: toIso(data.dueDate),
    priority: data.priority ?? 0,
    label: data.label ?? null,
    createdAt: toIso(data.createdAt) ?? new Date().toISOString(),
    updatedAt: toIso(data.updatedAt) ?? new Date().toISOString(),
  }
}

function matchesSearch(task: TaskRecord, q: string) {
  const needle = q.toLowerCase()
  return (
    task.title.toLowerCase().includes(needle) ||
    (task.description?.toLowerCase().includes(needle) ?? false)
  )
}

function matchesFilter(task: TaskRecord, filter: TaskFilter) {
  const { start: dayStart } = utcDayRange()
  const weekEnd = new Date(dayStart.getTime() + 7 * 86400000)
  const due = task.dueDate ? new Date(task.dueDate) : null

  switch (filter) {
    case 'completed':
      return task.completed
    case 'today': {
      if (task.completed || !due) return false
      const { start, end } = utcDayRange()
      return due >= start && due < end
    }
    case 'next':
      if (task.completed || !due) return false
      return due >= dayStart && due < weekEnd
    case 'inbox':
    default:
      return !task.completed
  }
}

export async function listTasks(
  userId: string,
  params: { filter?: TaskFilter; q?: string; label?: string }
): Promise<TaskRecord[]> {
  const snap = await getAdminDb()
    .collection(COLLECTION)
    .where('userId', '==', userId)
    .get()

  const filter = params.filter ?? 'inbox'
  const q = params.q?.trim()
  const label = params.label?.trim()

  let tasks = snap.docs.map((doc) =>
    toTaskRecord(doc.id, doc.data() as TaskDoc)
  )

  if (label) tasks = tasks.filter((task) => task.label === label)
  if (q) tasks = tasks.filter((task) => matchesSearch(task, q))
  tasks = tasks.filter((task) => matchesFilter(task, filter))

  tasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const aDue = a.dueDate
      ? new Date(a.dueDate).getTime()
      : Number.MAX_SAFE_INTEGER
    const bDue = b.dueDate
      ? new Date(b.dueDate).getTime()
      : Number.MAX_SAFE_INTEGER
    if (aDue !== bDue) return aDue - bDue
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return tasks
}

export async function createTask(
  userId: string,
  data: {
    title: string
    description?: string | null
    dueDate?: Date | null
    label?: string | null
    priority?: number
  }
): Promise<TaskRecord> {
  const now = FieldValue.serverTimestamp()
  const payload = {
    userId,
    title: data.title,
    description: data.description ?? null,
    completed: false,
    dueDate: data.dueDate ? Timestamp.fromDate(data.dueDate) : null,
    priority: data.priority ?? 0,
    label: data.label ?? null,
    createdAt: now,
    updatedAt: now,
  }

  const ref = await getAdminDb().collection(COLLECTION).add(payload)
  const created = await ref.get()
  const createdData = created.data() as TaskDoc

  return toTaskRecord(created.id, {
    ...createdData,
    createdAt: createdData.createdAt ?? Timestamp.now(),
    updatedAt: createdData.updatedAt ?? Timestamp.now(),
  })
}

export async function updateTask(
  userId: string,
  id: string,
  data: Partial<{
    title: string
    description: string | null
    completed: boolean
    dueDate: Date | null
    priority: number
    label: string | null
  }>
): Promise<TaskRecord | null> {
  const ref = getAdminDb().collection(COLLECTION).doc(id)
  const existing = await ref.get()

  if (!existing.exists || (existing.data() as TaskDoc).userId !== userId) {
    return null
  }

  const patch: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  }
  if (data.title !== undefined) patch.title = data.title
  if (data.description !== undefined) patch.description = data.description
  if (data.completed !== undefined) patch.completed = data.completed
  if (data.priority !== undefined) patch.priority = data.priority
  if (data.label !== undefined) patch.label = data.label
  if (data.dueDate === null) patch.dueDate = null
  else if (data.dueDate instanceof Date) {
    patch.dueDate = Timestamp.fromDate(data.dueDate)
  }

  await ref.update(patch)
  const updated = await ref.get()
  return toTaskRecord(updated.id, updated.data() as TaskDoc)
}

export async function deleteTask(userId: string, id: string): Promise<boolean> {
  const ref = getAdminDb().collection(COLLECTION).doc(id)
  const existing = await ref.get()

  if (!existing.exists || (existing.data() as TaskDoc).userId !== userId) {
    return false
  }

  await ref.delete()
  return true
}

export async function listTaskLabels(userId: string): Promise<string[]> {
  const snap = await getAdminDb()
    .collection(COLLECTION)
    .where('userId', '==', userId)
    .get()

  const labels = new Set<string>()
  for (const doc of snap.docs) {
    const label = (doc.data() as TaskDoc).label
    if (label) labels.add(label)
  }

  return [...labels].sort((a, b) => a.localeCompare(b, 'es'))
}
