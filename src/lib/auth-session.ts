export type AuthMode = 'demo' | 'user'

const STORAGE_KEY = 'todo-auth-mode'

export function readAuthMode(): AuthMode | null {
  if (typeof window === 'undefined') return null
  const value = sessionStorage.getItem(STORAGE_KEY)
  if (value === 'demo' || value === 'user') return value
  return null
}

export function writeAuthMode(mode: AuthMode | null): void {
  if (typeof window === 'undefined') return
  if (mode) sessionStorage.setItem(STORAGE_KEY, mode)
  else sessionStorage.removeItem(STORAGE_KEY)
}
