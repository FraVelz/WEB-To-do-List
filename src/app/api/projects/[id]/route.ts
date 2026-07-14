import {
  deleteProject,
  getProject,
  updateProject,
} from '@/lib/firebase/repositories/projects'
import { requireUserId } from '@/lib/firebase/verify-auth'
import { NextResponse } from 'next/server'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const { id } = await context.params
    const project = await getProject(userId, id)
    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(project)
  } catch (e) {
    console.error('GET /api/projects/[id]', e)
    return NextResponse.json(
      { error: 'Error al cargar proyecto' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const { id } = await context.params
    const body = (await req.json()) as Record<string, unknown>

    const data: {
      name?: string
      description?: string | null
      order?: number
    } = {}

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
    if (body.description === null || typeof body.description === 'string') {
      data.description =
        typeof body.description === 'string'
          ? body.description.trim() || null
          : null
    }
    if (typeof body.order === 'number' && Number.isFinite(body.order)) {
      data.order = body.order
    }

    const project = await updateProject(userId, id, data)
    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(project)
  } catch (e) {
    console.error('PATCH /api/projects/[id]', e)
    return NextResponse.json(
      { error: 'Error al actualizar proyecto' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const { id } = await context.params
    const ok = await deleteProject(userId, id)
    if (!ok) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('DELETE /api/projects/[id]', e)
    return NextResponse.json(
      { error: 'Error al eliminar proyecto' },
      { status: 500 }
    )
  }
}
