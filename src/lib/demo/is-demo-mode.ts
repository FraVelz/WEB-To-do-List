import { readAuthMode } from '@/lib/auth-session'

export function isDemoMode(): boolean {
  return readAuthMode() === 'demo'
}
