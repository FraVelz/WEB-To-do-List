import { rescheduleTasks } from '@/lib/firebase/repositories/tasks'
import { requireUserId } from '@/lib/firebase/verify-auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const body = (await req.json()) as Record<string, unknown>
    const ids = Array.isArray(body.ids)
      ? body.ids.filter(
          (id): id is string => typeof id === 'string' && Boolean(id.trim())
        )
      : []

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'Se requieren ids de tareas' },
        { status: 400 }
      )
    }

    if (typeof body.dueDate !== 'string' || !body.dueDate) {
      return NextResponse.json(
        { error: 'dueDate es obligatorio' },
        { status: 400 }
      )
    }

    const dueDate = new Date(body.dueDate)
    if (Number.isNaN(dueDate.getTime())) {
      return NextResponse.json({ error: 'dueDate inválido' }, { status: 400 })
    }

    const updated = await rescheduleTasks(userId, ids, dueDate)
    return NextResponse.json({ updated })
  } catch (e) {
    console.error('POST /api/tasks/reschedule', e)
    return NextResponse.json(
      { error: 'Error al reprogramar tareas' },
      { status: 500 }
    )
  }
}
