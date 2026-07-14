import { FieldValue, Timestamp } from 'firebase-admin/firestore'

import { getAdminDb } from '@/lib/firebase/admin'

export type SectionRecord = {
  id: string
  projectId: string
  name: string
  order: number
  createdAt: string
  updatedAt: string
}

type SectionDoc = {
  userId: string
  projectId: string
  name: string
  order: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

const COLLECTION = 'sections'

function toIso(value: Timestamp | null | undefined): string {
  return value?.toDate().toISOString() ?? new Date().toISOString()
}

function toSectionRecord(id: string, data: SectionDoc): SectionRecord {
  return {
    id,
    projectId: data.projectId,
    name: data.name,
    order: data.order ?? 0,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  }
}

export async function listSections(
  userId: string,
  projectId: string
): Promise<SectionRecord[]> {
  const snap = await getAdminDb()
    .collection(COLLECTION)
    .where('userId', '==', userId)
    .where('projectId', '==', projectId)
    .get()

  const sections = snap.docs.map((doc) =>
    toSectionRecord(doc.id, doc.data() as SectionDoc)
  )

  sections.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'es'))
  return sections
}

export async function createSection(
  userId: string,
  data: { projectId: string; name: string; order?: number }
): Promise<SectionRecord> {
  const now = FieldValue.serverTimestamp()
  const payload = {
    userId,
    projectId: data.projectId,
    name: data.name,
    order: data.order ?? Date.now(),
    createdAt: now,
    updatedAt: now,
  }

  const ref = await getAdminDb().collection(COLLECTION).add(payload)
  const created = await ref.get()
  const createdData = created.data() as SectionDoc

  return toSectionRecord(created.id, {
    ...createdData,
    createdAt: createdData.createdAt ?? Timestamp.now(),
    updatedAt: createdData.updatedAt ?? Timestamp.now(),
  })
}

export async function updateSection(
  userId: string,
  id: string,
  data: Partial<{ name: string; order: number }>
): Promise<SectionRecord | null> {
  const ref = getAdminDb().collection(COLLECTION).doc(id)
  const existing = await ref.get()
  if (!existing.exists || (existing.data() as SectionDoc).userId !== userId) {
    return null
  }

  const patch: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  }
  if (data.name !== undefined) patch.name = data.name
  if (data.order !== undefined) patch.order = data.order

  await ref.update(patch)
  const updated = await ref.get()
  return toSectionRecord(updated.id, updated.data() as SectionDoc)
}

export async function reorderSections(
  userId: string,
  updates: Array<{ id: string; order: number }>
): Promise<number> {
  const db = getAdminDb()
  const batch = db.batch()
  let updated = 0

  for (const item of updates) {
    const ref = db.collection(COLLECTION).doc(item.id)
    const existing = await ref.get()
    if (!existing.exists || (existing.data() as SectionDoc).userId !== userId) {
      continue
    }
    batch.update(ref, {
      order: item.order,
      updatedAt: FieldValue.serverTimestamp(),
    })
    updated += 1
  }

  if (updated > 0) await batch.commit()
  return updated
}

export async function deleteSection(
  userId: string,
  id: string
): Promise<boolean> {
  const ref = getAdminDb().collection(COLLECTION).doc(id)
  const existing = await ref.get()
  if (!existing.exists || (existing.data() as SectionDoc).userId !== userId) {
    return false
  }

  const db = getAdminDb()
  const batch = db.batch()

  const tasks = await db
    .collection('tasks')
    .where('userId', '==', userId)
    .where('sectionId', '==', id)
    .get()
  for (const doc of tasks.docs) {
    batch.update(doc.ref, {
      sectionId: null,
      updatedAt: FieldValue.serverTimestamp(),
    })
  }

  batch.delete(ref)
  await batch.commit()
  return true
}
