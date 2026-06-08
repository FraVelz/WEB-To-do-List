export const SITE_NAME = 'To-do'
export const SITE_TITLE = 'To-do — Organiza tu día'
export const SITE_DESCRIPTION =
  'Gestor de tareas con notificaciones y bandeja de entrada.'

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  return url ? url.replace(/\/$/, '') : 'http://localhost:3000'
}
