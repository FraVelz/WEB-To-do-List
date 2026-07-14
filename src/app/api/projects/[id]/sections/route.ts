import { getProject } from '@/lib/firebase/repositories/projects'
import {
  createSection,
  listSections,
} from '@/lib/firebase/repositories/sections'
import { requireUserId } from '@/lib/firebase/verify-auth'
import { NextResponse } from 'next/server'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const { id: projectId } = await context.params
    const project = await getProject(userId, projectId)
    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    const sections = await listSections(userId, projectId)
    return NextResponse.json(sections)
  } catch (e) {
    console.error('GET /api/projects/[id]/sections', e)
    return NextResponse.json(
      { error: 'Error al listar secciones' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const { id: projectId } = await context.params
    const project = await getProject(userId, projectId)
    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    const body = (await req.json()) as Record<string, unknown>
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!name) {
      return NextResponse.json(
        { error: 'El nombre es obligatorio' },
        { status: 400 }
      )
    }

    const section = await createSection(userId, { projectId, name })
    return NextResponse.json(section)
  } catch (e) {
    console.error('POST /api/projects/[id]/sections', e)
    return NextResponse.json(
      { error: 'Error al crear sección' },
      { status: 500 }
    )
  }
}
