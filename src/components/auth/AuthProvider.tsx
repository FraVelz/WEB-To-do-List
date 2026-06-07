'use client'

import { useEffect } from 'react'

import { readAuthMode } from '@/lib/auth-session'
import { isFirebaseConfigured } from '@/lib/firebase/client'
import { subscribeAuthState } from '@/lib/firebase/auth-client'

import { useAuthSessionStore } from '@/stores/auth-session-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const syncFromFirebase = useAuthSessionStore((s) => s.syncFromFirebase)

  useEffect(() => {
    if (!isFirebaseConfigured()) return

    return subscribeAuthState((user) => {
      if (readAuthMode() === 'demo') return

      if (user) {
        syncFromFirebase('user')
      } else {
        syncFromFirebase(null)
      }
    })
  }, [syncFromFirebase])

  return children
}
