import {
  createProject,
  listProjects,
} from '@/lib/firebase/repositories/projects'
import { requireUserId } from '@/lib/firebase/verify-auth'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const projects = await listProjects(userId)
    return NextResponse.json(projects)
  } catch (e) {
    console.error('GET /api/projects', e)
    return NextResponse.json(
      { error: 'Error al listar proyectos' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId(req)
    if (userId instanceof NextResponse) return userId

    const body = (await req.json()) as Record<string, unknown>
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!name) {
      return NextResponse.json(
        { error: 'El nombre es obligatorio' },
        { status: 400 }
      )
    }

    const description =
      typeof body.description === 'string'
        ? body.description.trim() || null
        : null

    const project = await createProject(userId, { name, description })
    return NextResponse.json(project)
  } catch (e) {
    console.error('POST /api/projects', e)
    return NextResponse.json(
      { error: 'Error al crear proyecto' },
      { status: 500 }
    )
  }
}
