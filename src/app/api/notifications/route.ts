import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const where = unreadOnly ? { read: false } : {}

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { id: 'desc' },
    })

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

    const row = await prisma.notification.create({
      data: { title, color, content },
    })

    return NextResponse.json(row)
  } catch (e) {
    console.error('POST /api/notifications', e)
    return NextResponse.json(
      { error: 'Error al crear notificación' },
      { status: 500 }
    )
  }
}
