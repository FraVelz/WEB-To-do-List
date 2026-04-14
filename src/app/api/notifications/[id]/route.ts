import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id: raw } = await context.params
    const id = Number.parseInt(raw, 10)
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const body = (await req.json()) as { read?: boolean }
    const read = body.read === true

    const row = await prisma.notification.update({
      where: { id },
      data: { read },
    })

    return NextResponse.json(row)
  } catch (e) {
    console.error('PATCH /api/notifications/[id]', e)
    return NextResponse.json(
      { error: 'Error al actualizar notificación' },
      { status: 500 }
    )
  }
}
