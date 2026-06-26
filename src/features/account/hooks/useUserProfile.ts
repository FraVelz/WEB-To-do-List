'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

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
const ACCEPTED_AVATAR_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

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
  const hydrated = useAuthSessionStore((s) => s.hydrated)
  const hydrate = useAuthSessionStore((s) => s.hydrate)
  const [userEmail, setUserEmail] = useState('')
  const [userDisplayName, setUserDisplayName] = useState('')
  const [userBio, setUserBio] = useState('')
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [profileRevision, setProfileRevision] = useState(0)

  const demoProfile = useMemo(
    () =>
      mode === 'demo'
        ? loadProfileFromStorage(DEMO_PROFILE_KEY, 'Usuario demo')
        : null,
    [mode, profileRevision]
  )

  const email =
    mode === 'demo' ? DEMO_PROFILE_EMAIL : mode === 'user' ? userEmail : ''
  const displayName =
    mode === 'demo'
      ? (demoProfile?.displayName ?? '')
      : mode === 'user'
        ? userDisplayName
        : ''
  const bio =
    mode === 'demo' ? (demoProfile?.bio ?? '') : mode === 'user' ? userBio : ''
  const avatarUrl =
    mode === 'demo'
      ? (demoProfile?.avatarUrl ?? null)
      : mode === 'user'
        ? userAvatarUrl
        : null

  const profileKey =
    mode === 'demo' ? DEMO_PROFILE_KEY : email.trim().toLowerCase()

  const applyStoredProfile = useCallback(
    (key: string, fallbackName: string) => {
      const stored = loadProfileFromStorage(key, fallbackName)
      setUserDisplayName(stored.displayName)
      setUserBio(stored.bio)
      setUserAvatarUrl(stored.avatarUrl)
    },
    []
  )

  const bumpProfileRevision = useCallback(() => {
    setProfileRevision((revision) => revision + 1)
  }, [])

  const setDisplayName = useCallback(
    (value: string) => {
      if (mode === 'demo') {
        writeStoredProfile(DEMO_PROFILE_KEY, { displayName: value })
        bumpProfileRevision()
        return
      }
      if (mode === 'user') setUserDisplayName(value)
    },
    [mode, bumpProfileRevision]
  )

  const setBio = useCallback(
    (value: string) => {
      if (mode === 'demo') {
        writeStoredProfile(DEMO_PROFILE_KEY, { bio: value })
        bumpProfileRevision()
        return
      }
      if (mode === 'user') setUserBio(value)
    },
    [mode, bumpProfileRevision]
  )

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (mode !== 'user') return

    return subscribeAuthState((user) => {
      const nextEmail = user?.email?.trim() ?? ''
      setUserEmail(nextEmail)

      if (nextEmail) {
        const key = nextEmail.toLowerCase()
        applyStoredProfile(key, displayNameFromEmail(nextEmail))
      } else {
        setUserDisplayName('')
        setUserBio('')
        setUserAvatarUrl(null)
      }

      setUserLoaded(true)
    })
  }, [mode, applyStoredProfile])

  const ready =
    hydrated &&
    (mode === 'demo' || (mode !== null && mode !== 'user') || userLoaded)

  useEffect(() => {
    if (!profileKey) return

    function onProfileUpdate(event: Event) {
      const detail = (event as CustomEvent<{ profileKey: string }>).detail
      if (detail?.profileKey !== profileKey) return
      if (mode === 'demo') {
        bumpProfileRevision()
        return
      }
      const fallback = email ? displayNameFromEmail(email) : 'Usuario'
      applyStoredProfile(profileKey, fallback)
    }

    window.addEventListener(PROFILE_UPDATE_EVENT, onProfileUpdate)
    return () =>
      window.removeEventListener(PROFILE_UPDATE_EVENT, onProfileUpdate)
  }, [profileKey, mode, email, applyStoredProfile, bumpProfileRevision])

  const persistProfile = useCallback(
    (
      patch: { displayName?: string; bio?: string; avatarUrl?: string },
      options?: { dropAvatar?: boolean }
    ) => {
      if (!profileKey) return false
      writeStoredProfile(profileKey, patch, options)
      return true
    },
    [profileKey]
  )

  const save = useCallback(() => {
    const saved = persistProfile(
      {
        displayName: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
        ...(avatarUrl ? { avatarUrl } : {}),
      },
      { dropAvatar: !avatarUrl }
    )
    if (saved && mode === 'demo') bumpProfileRevision()
    return saved
  }, [persistProfile, displayName, bio, avatarUrl, mode, bumpProfileRevision])

  const setAvatarFromFile = useCallback(
    async (file: File) => {
      if (!profileKey)
        return { ok: false as const, error: 'Sin sesión activa.' }
      if (!ACCEPTED_AVATAR_TYPES.has(file.type)) {
        return { ok: false as const, error: 'Usa JPG, PNG o WebP.' }
      }
      if (file.size > MAX_AVATAR_BYTES) {
        return {
          ok: false as const,
          error: 'La imagen debe pesar menos de 512 KB.',
        }
      }

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error('No se pudo leer la imagen.'))
        reader.readAsDataURL(file)
      })

      if (mode === 'user') setUserAvatarUrl(dataUrl)
      persistProfile({ avatarUrl: dataUrl })
      if (mode === 'demo') bumpProfileRevision()
      return { ok: true as const }
    },
    [profileKey, persistProfile, mode, bumpProfileRevision]
  )

  const removeAvatar = useCallback(() => {
    if (!profileKey) return false
    if (mode === 'user') setUserAvatarUrl(null)
    clearStoredAvatar(profileKey)
    if (mode === 'demo') bumpProfileRevision()
    return true
  }, [profileKey, mode, bumpProfileRevision])

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
