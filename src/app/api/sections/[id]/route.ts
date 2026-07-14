import {
  deleteSection,
  updateSection,
} from '@/lib/firebase/repositories/sections'
import { requireUserId } from '@/lib/firebase/verify-auth'
import { NextResponse } from 'next/server'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const { id } = await context.params
    const body = (await req.json()) as Record<string, unknown>

    const data: { name?: string; order?: number } = {}
    if (typeof body.name === 'string') {
      const name = body.name.trim()
      if (!name) {
        return NextResponse.json(
          { error: 'El nombre no puede estar vacío' },
          { status: 400 }
        )
      }
      data.name = name
    }
    if (typeof body.order === 'number' && Number.isFinite(body.order)) {
      data.order = body.order
    }

    const section = await updateSection(userId, id, data)
    if (!section) {
      return NextResponse.json(
        { error: 'Sección no encontrada' },
        { status: 404 }
      )
    }
    return NextResponse.json(section)
  } catch (e) {
    console.error('PATCH /api/sections/[id]', e)
    return NextResponse.json(
      { error: 'Error al actualizar sección' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const { id } = await context.params
    const ok = await deleteSection(userId, id)
    if (!ok) {
      return NextResponse.json(
        { error: 'Sección no encontrada' },
        { status: 404 }
      )
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('DELETE /api/sections/[id]', e)
    return NextResponse.json(
      { error: 'Error al eliminar sección' },
      { status: 500 }
    )
  }
}
