import { reorderSections } from '@/lib/firebase/repositories/sections'
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

    const updates: Array<{ id: string; order: number }> = []
    for (const item of body.updates) {
      if (!item || typeof item !== 'object') continue
      const row = item as Record<string, unknown>
      if (typeof row.id !== 'string' || !row.id.trim()) continue
      if (typeof row.order !== 'number' || !Number.isFinite(row.order)) continue
      updates.push({ id: row.id.trim(), order: row.order })
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No hay actualizaciones válidas' },
        { status: 400 }
      )
    }

    const updated = await reorderSections(userId, updates)
    return NextResponse.json({ updated })
  } catch (e) {
    console.error('POST /api/sections/reorder', e)
    return NextResponse.json(
      { error: 'Error al reordenar secciones' },
      { status: 500 }
    )
  }
}
