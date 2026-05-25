import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const rows = await prisma.task.findMany({
      where: { label: { not: null } },
      select: { label: true },
    })

    const labels = rows.map((r: { label: string | null }) => r.label)
    const unique = [
      ...new Set(labels.filter((l: string | null): l is string => Boolean(l))),
    ].sort()

    return NextResponse.json(unique)
  } catch (e) {
    console.error('GET /api/task-labels', e)
    return NextResponse.json(
      { error: 'Error al listar etiquetas' },
      { status: 500 }
    )
  }
}
