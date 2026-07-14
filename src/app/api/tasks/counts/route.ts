import { countTasks } from '@/lib/firebase/repositories/tasks'
import { requireUserId } from '@/lib/firebase/verify-auth'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const counts = await countTasks(userId)
    return NextResponse.json(counts)
  } catch (e) {
    console.error('GET /api/tasks/counts', e)
    return NextResponse.json(
      { error: 'Error al cargar conteos' },
      { status: 500 }
    )
  }
}
