import { NextResponse } from 'next/server'

import { getAdminAuth } from './admin'

export async function requireUserId(
  req: Request
): Promise<string | NextResponse> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const token = authHeader.slice(7).trim()
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token)
    return decoded.uid
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
}
