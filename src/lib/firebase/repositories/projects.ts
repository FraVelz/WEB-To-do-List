import { FieldValue, Timestamp } from 'firebase-admin/firestore'

import { getAdminDb } from '@/lib/firebase/admin'

export type ProjectRecord = {
  id: string
  name: string
  description: string | null
  order: number
  createdAt: string
  updatedAt: string
}

type ProjectDoc = {
  userId: string
  name: string
  description: string | null
  order: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

const COLLECTION = 'projects'

function toIso(value: Timestamp | null | undefined): string {
  return value?.toDate().toISOString() ?? new Date().toISOString()
}

function toProjectRecord(id: string, data: ProjectDoc): ProjectRecord {
  return {
    id,
    name: data.name,
    description: data.description ?? null,
    order: data.order ?? 0,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  }
}

export async function listProjects(userId: string): Promise<ProjectRecord[]> {
  const snap = await getAdminDb()
    .collection(COLLECTION)
    .where('userId', '==', userId)
    .get()

  const projects = snap.docs.map((doc) =>
    toProjectRecord(doc.id, doc.data() as ProjectDoc)
  )

  projects.sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name, 'es')
  )
  return projects
}

export async function getProject(
  userId: string,
  id: string
): Promise<ProjectRecord | null> {
  const ref = getAdminDb().collection(COLLECTION).doc(id)
  const existing = await ref.get()
  if (!existing.exists) return null
  const data = existing.data() as ProjectDoc
  if (data.userId !== userId) return null
  return toProjectRecord(existing.id, data)
}

export async function createProject(
  userId: string,
  data: { name: string; description?: string | null; order?: number }
): Promise<ProjectRecord> {
  const now = FieldValue.serverTimestamp()
  const payload = {
    userId,
    name: data.name,
    description: data.description ?? null,
    order: data.order ?? Date.now(),
    createdAt: now,
    updatedAt: now,
  }

  const ref = await getAdminDb().collection(COLLECTION).add(payload)
  const created = await ref.get()
  const createdData = created.data() as ProjectDoc

  return toProjectRecord(created.id, {
    ...createdData,
    createdAt: createdData.createdAt ?? Timestamp.now(),
    updatedAt: createdData.updatedAt ?? Timestamp.now(),
  })
}

export async function updateProject(
  userId: string,
  id: string,
  data: Partial<{
    name: string
    description: string | null
    order: number
  }>
): Promise<ProjectRecord | null> {
  const ref = getAdminDb().collection(COLLECTION).doc(id)
  const existing = await ref.get()
  if (!existing.exists || (existing.data() as ProjectDoc).userId !== userId) {
    return null
  }

  const patch: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  }
  if (data.name !== undefined) patch.name = data.name
  if (data.description !== undefined) patch.description = data.description
  if (data.order !== undefined) patch.order = data.order

  await ref.update(patch)
  const updated = await ref.get()
  return toProjectRecord(updated.id, updated.data() as ProjectDoc)
}

export async function deleteProject(
  userId: string,
  id: string
): Promise<boolean> {
  const ref = getAdminDb().collection(COLLECTION).doc(id)
  const existing = await ref.get()
  if (!existing.exists || (existing.data() as ProjectDoc).userId !== userId) {
    return false
  }

  const db = getAdminDb()
  const batch = db.batch()

  const sections = await db
    .collection('sections')
    .where('userId', '==', userId)
    .where('projectId', '==', id)
    .get()
  for (const doc of sections.docs) batch.delete(doc.ref)

  const tasks = await db
    .collection('tasks')
    .where('userId', '==', userId)
    .where('projectId', '==', id)
    .get()
  for (const doc of tasks.docs) {
    batch.update(doc.ref, {
      projectId: null,
      sectionId: null,
      updatedAt: FieldValue.serverTimestamp(),
    })
  }

  batch.delete(ref)
  await batch.commit()
  return true
}
