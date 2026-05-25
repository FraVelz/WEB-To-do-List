import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const rows = await prisma.task.findMany({
      where: { label: { not: null } },
      select: { label: true },
    })

    const unique = [
      ...new Set(
        rows
          .map((r: { label: string | null }) => r.label)
          .filter((l): l is string => Boolean(l))
      ),
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
