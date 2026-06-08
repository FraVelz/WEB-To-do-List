'use client'

import { useCallback, useEffect, useState } from 'react'

import { subscribeAuthState } from '@/lib/firebase/auth-client'
import { useAuthSessionStore } from '@/stores/auth-session-store'

import {
  clearStoredAvatar,
  DEMO_PROFILE_EMAIL,
  DEMO_PROFILE_KEY,
  displayNameFromEmail,
  PROFILE_UPDATE_EVENT,
  readStoredProfile,
  writeStoredProfile,
} from '../utils/profile-storage'

const MAX_AVATAR_BYTES = 512_000
const ACCEPTED_AVATAR_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

function loadProfileFromStorage(profileKey: string, fallbackName: string) {
  const stored = readStoredProfile(profileKey)
  return {
    displayName: stored.displayName ?? fallbackName,
    bio: stored.bio ?? '',
    avatarUrl: stored.avatarUrl ?? null,
  }
}

export function useUserProfile() {
  const mode = useAuthSessionStore((s) => s.mode)
  const hydrate = useAuthSessionStore((s) => s.hydrate)
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  const profileKey =
    mode === 'demo' ? DEMO_PROFILE_KEY : email.trim().toLowerCase()

  const applyStoredProfile = useCallback(
    (key: string, fallbackName: string) => {
      const stored = loadProfileFromStorage(key, fallbackName)
      setDisplayName(stored.displayName)
      setBio(stored.bio)
      setAvatarUrl(stored.avatarUrl)
    },
    [],
  )

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (mode === 'demo') {
      setEmail(DEMO_PROFILE_EMAIL)
      applyStoredProfile(DEMO_PROFILE_KEY, 'Usuario demo')
      setReady(true)
      return
    }

    if (mode !== 'user') {
      setEmail('')
      setDisplayName('')
      setBio('')
      setAvatarUrl(null)
      setReady(false)
      return
    }

    return subscribeAuthState((user) => {
      const userEmail = user?.email?.trim() ?? ''
      setEmail(userEmail)

      if (userEmail) {
        const key = userEmail.toLowerCase()
        applyStoredProfile(key, displayNameFromEmail(userEmail))
      } else {
        setDisplayName('')
        setBio('')
        setAvatarUrl(null)
      }

      setReady(true)
    })
  }, [mode, applyStoredProfile])

  useEffect(() => {
    if (!profileKey) return

    function onProfileUpdate(event: Event) {
      const detail = (event as CustomEvent<{ profileKey: string }>).detail
      if (detail?.profileKey !== profileKey) return
      const fallback =
        mode === 'demo'
          ? 'Usuario demo'
          : email
            ? displayNameFromEmail(email)
            : 'Usuario'
      applyStoredProfile(profileKey, fallback)
    }

    window.addEventListener(PROFILE_UPDATE_EVENT, onProfileUpdate)
    return () => window.removeEventListener(PROFILE_UPDATE_EVENT, onProfileUpdate)
  }, [profileKey, mode, email, applyStoredProfile])

  const persistProfile = useCallback(
    (
      patch: { displayName?: string; bio?: string; avatarUrl?: string },
      options?: { dropAvatar?: boolean },
    ) => {
      if (!profileKey) return false
      writeStoredProfile(profileKey, patch, options)
      return true
    },
    [profileKey],
  )

  const save = useCallback(() => {
    return persistProfile(
      {
        displayName: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
        ...(avatarUrl ? { avatarUrl } : {}),
      },
      { dropAvatar: !avatarUrl },
    )
  }, [persistProfile, displayName, bio, avatarUrl])

  const setAvatarFromFile = useCallback(
    async (file: File) => {
      if (!profileKey) return { ok: false as const, error: 'Sin sesión activa.' }
      if (!ACCEPTED_AVATAR_TYPES.has(file.type)) {
        return { ok: false as const, error: 'Usa JPG, PNG o WebP.' }
      }
      if (file.size > MAX_AVATAR_BYTES) {
        return { ok: false as const, error: 'La imagen debe pesar menos de 512 KB.' }
      }

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error('No se pudo leer la imagen.'))
        reader.readAsDataURL(file)
      })

      setAvatarUrl(dataUrl)
      persistProfile({ avatarUrl: dataUrl })
      return { ok: true as const }
    },
    [profileKey, persistProfile],
  )

  const removeAvatar = useCallback(() => {
    if (!profileKey) return false
    setAvatarUrl(null)
    clearStoredAvatar(profileKey)
    return true
  }, [profileKey])

  return {
    mode,
    email,
    displayName,
    setDisplayName,
    bio,
    setBio,
    avatarUrl,
    setAvatarFromFile,
    removeAvatar,
    save,
    ready,
  }
}
