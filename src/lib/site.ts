export const SITE_NAME = 'To-do Lab'
export const SITE_TITLE = 'To-do Lab — Demo de gestión de tareas'
export const SITE_DESCRIPTION =
  'Laboratorio (Camino A): UI de tareas con modo demo local. No es un producto colaborativo.'

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  return url ? url.replace(/\/$/, '') : 'http://localhost:3000'
}
