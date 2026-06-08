export const PROFILE_STORAGE_KEY = 'todo-user-profiles'

export type StoredProfile = {
  displayName?: string
  bio?: string
}

type ProfileMap = Record<string, StoredProfile>

export function displayNameFromEmail(email: string): string {
  return email.split('@')[0]?.trim() || 'Usuario'
}

function readProfileMap(): ProfileMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === 'object' ? (parsed as ProfileMap) : {}
  } catch {
    return {}
  }
}

function writeProfileMap(map: ProfileMap): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(map))
}

export function readStoredProfile(profileKey: string): StoredProfile {
  if (!profileKey) return {}
  return readProfileMap()[profileKey] ?? {}
}

export function writeStoredProfile(
  profileKey: string,
  data: StoredProfile,
): void {
  if (!profileKey) return
  const map = readProfileMap()
  map[profileKey] = data
  writeProfileMap(map)
}

export const DEMO_PROFILE_KEY = '__demo__'
export const DEMO_PROFILE_EMAIL = 'usuario@demo.local'
