import { create } from 'zustand'

import {
  readAuthMode,
  writeAuthMode,
  type AuthMode,
} from '@/lib/auth-session'

type AuthSessionState = {
  mode: AuthMode | null
  hydrated: boolean
  hydrate: () => void
  enterDemo: () => void
  enterUser: () => void
  clear: () => void
}

export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  mode: null,
  hydrated: false,
  hydrate: () => set({ mode: readAuthMode(), hydrated: true }),
  enterDemo: () => {
    writeAuthMode('demo')
    set({ mode: 'demo', hydrated: true })
  },
  enterUser: () => {
    writeAuthMode('user')
    set({ mode: 'user', hydrated: true })
  },
  clear: () => {
    writeAuthMode(null)
    set({ mode: null, hydrated: true })
  },
}))
