import { updateNotificationRead } from '@/lib/firebase/repositories/notifications'
import { requireUserId } from '@/lib/firebase/verify-auth'
import { NextResponse } from 'next/server'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const { id } = await context.params
    const body = (await req.json()) as { read?: boolean }
    const read = body.read === true

    const row = await updateNotificationRead(userId, id, read)
    if (!row) {
      return NextResponse.json(
        { error: 'Notificación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(row)
  } catch (e) {
    console.error('PATCH /api/notifications/[id]', e)
    return NextResponse.json(
      { error: 'Error al actualizar notificación' },
      { status: 500 }
    )
  }
}
