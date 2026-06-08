'use client'

import { useCallback, useEffect, useState } from 'react'

import { subscribeAuthState } from '@/lib/firebase/auth-client'
import { useAuthSessionStore } from '@/stores/auth-session-store'

import {
  DEMO_PROFILE_EMAIL,
  DEMO_PROFILE_KEY,
  displayNameFromEmail,
  readStoredProfile,
  writeStoredProfile,
} from '../utils/profile-storage'

export function useUserProfile() {
  const mode = useAuthSessionStore((s) => s.mode)
  const hydrate = useAuthSessionStore((s) => s.hydrate)
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [ready, setReady] = useState(false)

  const profileKey =
    mode === 'demo' ? DEMO_PROFILE_KEY : email.trim().toLowerCase()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (mode === 'demo') {
      const stored = readStoredProfile(DEMO_PROFILE_KEY)
      setEmail(DEMO_PROFILE_EMAIL)
      setDisplayName(stored.displayName ?? 'Usuario demo')
      setBio(stored.bio ?? '')
      setReady(true)
      return
    }

    if (mode !== 'user') {
      setEmail('')
      setDisplayName('')
      setBio('')
      setReady(false)
      return
    }

    return subscribeAuthState((user) => {
      const userEmail = user?.email?.trim() ?? ''
      setEmail(userEmail)

      if (userEmail) {
        const key = userEmail.toLowerCase()
        const stored = readStoredProfile(key)
        setDisplayName(stored.displayName ?? displayNameFromEmail(userEmail))
        setBio(stored.bio ?? '')
      } else {
        setDisplayName('')
        setBio('')
      }

      setReady(true)
    })
  }, [mode])

  const save = useCallback(() => {
    if (!profileKey) return false
    writeStoredProfile(profileKey, {
      displayName: displayName.trim() || undefined,
      bio: bio.trim() || undefined,
    })
    return true
  }, [profileKey, displayName, bio])

  return {
    mode,
    email,
    displayName,
    setDisplayName,
    bio,
    setBio,
    save,
    ready,
  }
}
