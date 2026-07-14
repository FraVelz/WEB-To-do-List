import { reorderTasks } from '@/lib/firebase/repositories/tasks'
import { requireUserId } from '@/lib/firebase/verify-auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const body = (await req.json()) as Record<string, unknown>
    if (!Array.isArray(body.updates)) {
      return NextResponse.json(
        { error: 'updates es obligatorio' },
        { status: 400 }
      )
    }

    const updates: Array<{
      id: string
      order: number
      sectionId?: string | null
    }> = []

    for (const item of body.updates) {
      if (!item || typeof item !== 'object') continue
      const row = item as Record<string, unknown>
      if (typeof row.id !== 'string' || !row.id.trim()) continue
      if (typeof row.order !== 'number' || !Number.isFinite(row.order)) continue
      const update: {
        id: string
        order: number
        sectionId?: string | null
      } = { id: row.id.trim(), order: row.order }
      if (row.sectionId === null) update.sectionId = null
      else if (typeof row.sectionId === 'string') {
        update.sectionId = row.sectionId.trim() || null
      }
      updates.push(update)
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No hay actualizaciones válidas' },
        { status: 400 }
      )
    }

    const updated = await reorderTasks(userId, updates)
    return NextResponse.json({ updated })
  } catch (e) {
    console.error('POST /api/tasks/reorder', e)
    return NextResponse.json(
      { error: 'Error al reordenar tareas' },
      { status: 500 }
    )
  }
}
