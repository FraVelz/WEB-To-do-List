import {
  createTask,
  listTasks,
  type TaskFilter,
} from '@/lib/firebase/repositories/tasks'
import { requireUserId } from '@/lib/firebase/verify-auth'
import { NextResponse } from 'next/server'

const VALID_FILTERS = new Set<TaskFilter>([
  'inbox',
  'today',
  'next',
  'completed',
  'overdue',
  'all',
])

export async function GET(req: Request) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim() || undefined
    const label = searchParams.get('label')?.trim() || undefined
    const projectId = searchParams.get('projectId')?.trim() || undefined
    const filterParam = searchParams.get('filter')
    const filter =
      filterParam && VALID_FILTERS.has(filterParam as TaskFilter)
        ? (filterParam as TaskFilter)
        : undefined

    const tasks = await listTasks(userId, {
      filter: projectId ? filter : (filter ?? 'inbox'),
      q,
      label,
      projectId,
    })
    return NextResponse.json(tasks)
  } catch (e) {
    console.error('GET /api/tasks', e)
    return NextResponse.json(
      { error: 'Error al listar tareas' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const body = (await req.json()) as Record<string, unknown>
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    if (!title) {
      return NextResponse.json(
        { error: 'El título es obligatorio' },
        { status: 400 }
      )
    }

    const description =
      typeof body.description === 'string'
        ? body.description.trim() || null
        : null

    const label =
      typeof body.label === 'string' ? body.label.trim() || null : null

    let dueDate: Date | null = null
    if (typeof body.dueDate === 'string' && body.dueDate) {
      const d = new Date(body.dueDate)
      if (!Number.isNaN(d.getTime())) dueDate = d
    }

    const priority =
      typeof body.priority === 'number' && Number.isFinite(body.priority)
        ? body.priority
        : 0

    const projectId =
      body.projectId === null
        ? null
        : typeof body.projectId === 'string'
          ? body.projectId.trim() || null
          : null

    const sectionId =
      body.sectionId === null
        ? null
        : typeof body.sectionId === 'string'
          ? body.sectionId.trim() || null
          : null

    const task = await createTask(userId, {
      title,
      description,
      label,
      dueDate,
      priority,
      projectId,
      sectionId,
    })

    return NextResponse.json(task)
  } catch (e) {
    console.error('POST /api/tasks', e)
    return NextResponse.json({ error: 'Error al crear tarea' }, { status: 500 })
  }
}
