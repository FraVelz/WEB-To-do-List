import {
  createNotification,
  listNotifications,
} from '@/lib/firebase/repositories/notifications'
import { requireUserId } from '@/lib/firebase/verify-auth'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get('unread') === 'true'

    const notifications = await listNotifications(userId, unreadOnly)
    return NextResponse.json(notifications)
  } catch (e) {
    console.error('GET /api/notifications', e)
    return NextResponse.json(
      { error: 'Error al listar notificaciones' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const body = await req.json()
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const content = typeof body.content === 'string' ? body.content.trim() : ''
    const color = typeof body.color === 'string' ? body.color.trim() : 'red'

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título y contenido son obligatorios' },
        { status: 400 }
      )
    }

    const row = await createNotification(userId, { title, content, color })
    return NextResponse.json(row)
  } catch (e) {
    console.error('POST /api/notifications', e)
    return NextResponse.json(
      { error: 'Error al crear notificación' },
      { status: 500 }
    )
  }
}
