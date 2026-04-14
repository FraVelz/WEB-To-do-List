import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

function utcDayRange(ref: Date = new Date()) {
  const start = new Date(
    Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate())
  )
  const end = new Date(start.getTime() + 86400000)
  return { start, end }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()
    const filter = searchParams.get('filter') ?? 'inbox'
    const label = searchParams.get('label')?.trim()

    const where: Prisma.TaskWhereInput = {}

    if (label) {
      where.label = label
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ]
    }

    const { start: dayStart } = utcDayRange()
    const weekEnd = new Date(dayStart.getTime() + 7 * 86400000)

    switch (filter) {
      case 'completed':
        where.completed = true
        break
      case 'today': {
        const { start, end } = utcDayRange()
        where.completed = false
        where.dueDate = { gte: start, lt: end }
        break
      }
      case 'next':
        where.completed = false
        where.dueDate = { gte: dayStart, lt: weekEnd }
        break
      case 'inbox':
      default:
        where.completed = false
        break
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [
        { completed: 'asc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
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
    const body = (await req.json()) as Record<string, unknown>
    const title =
      typeof body.title === 'string' ? body.title.trim() : ''
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

    const task = await prisma.task.create({
      data: { title, description, label, dueDate, priority },
    })

    return NextResponse.json(task)
  } catch (e) {
    console.error('POST /api/tasks', e)
    return NextResponse.json(
      { error: 'Error al crear tarea' },
      { status: 500 }
    )
  }
}
