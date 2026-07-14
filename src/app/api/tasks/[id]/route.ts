import { deleteTask, updateTask } from '@/lib/firebase/repositories/tasks'
import { requireUserId } from '@/lib/firebase/verify-auth'
import { NextResponse } from 'next/server'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const { id } = await context.params
    const body = (await req.json()) as Record<string, unknown>

    const data: {
      title?: string
      description?: string | null
      completed?: boolean
      dueDate?: Date | null
      priority?: number
      label?: string | null
      projectId?: string | null
      sectionId?: string | null
    } = {}

    if (typeof body.title === 'string') {
      const t = body.title.trim()
      if (!t) {
        return NextResponse.json(
          { error: 'El título no puede estar vacío' },
          { status: 400 }
        )
      }
      data.title = t
    }
    if (body.description === null || typeof body.description === 'string') {
      data.description =
        typeof body.description === 'string'
          ? body.description.trim() || null
          : null
    }
    if (typeof body.completed === 'boolean') data.completed = body.completed
    if (body.dueDate === null) {
      data.dueDate = null
    } else if (typeof body.dueDate === 'string' && body.dueDate) {
      const d = new Date(body.dueDate)
      if (!Number.isNaN(d.getTime())) data.dueDate = d
    }
    if (typeof body.priority === 'number' && Number.isFinite(body.priority)) {
      data.priority = body.priority
    }
    if (body.label === null || typeof body.label === 'string') {
      data.label =
        typeof body.label === 'string' ? body.label.trim() || null : null
    }
    if (body.projectId === null || typeof body.projectId === 'string') {
      data.projectId =
        typeof body.projectId === 'string'
          ? body.projectId.trim() || null
          : null
    }
    if (body.sectionId === null || typeof body.sectionId === 'string') {
      data.sectionId =
        typeof body.sectionId === 'string'
          ? body.sectionId.trim() || null
          : null
    }

    const task = await updateTask(userId, id, data)
    if (!task) {
      return NextResponse.json(
        { error: 'Tarea no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (e) {
    console.error('PATCH /api/tasks/[id]', e)
    return NextResponse.json(
      { error: 'Error al actualizar tarea' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId(_req)
    if (userId instanceof NextResponse) return userId

    const { id } = await context.params
    const ok = await deleteTask(userId, id)
    if (!ok) {
      return NextResponse.json(
        { error: 'Tarea no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('DELETE /api/tasks/[id]', e)
    return NextResponse.json(
      { error: 'Error al eliminar tarea' },
      { status: 500 }
    )
  }
}
