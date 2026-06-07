import { listTaskLabels } from '@/lib/firebase/repositories/tasks'
import { requireUserId } from '@/lib/firebase/verify-auth'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const labels = await listTaskLabels(userId)
    return NextResponse.json(labels)
  } catch (e) {
    console.error('GET /api/task-labels', e)
    return NextResponse.json(
      { error: 'Error al listar etiquetas' },
      { status: 500 }
    )
  }
}
