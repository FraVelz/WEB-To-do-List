import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'

import { getFirebaseAuth, isFirebaseConfigured } from './client'

function isUserNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'auth/user-not-found'
  )
}

export async function signInUser(email: string, password: string) {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado. Usa el modo demo o completa .env.')
  }
  const auth = getFirebaseAuth()
  try {
    return await signInWithEmailAndPassword(auth, email.trim(), password)
  } catch (error) {
    if (isUserNotFound(error)) {
      return createUserWithEmailAndPassword(auth, email.trim(), password)
    }
    throw error
  }
}

export async function signOutUser() {
  if (!isFirebaseConfigured()) return
  await signOut(getFirebaseAuth())
}

export async function getIdToken(): Promise<string | null> {
  if (!isFirebaseConfigured()) return null
  const user = getFirebaseAuth().currentUser
  if (!user) return null
  return user.getIdToken()
}

export function subscribeAuthState(listener: (user: User | null) => void) {
  if (!isFirebaseConfigured()) return () => {}
  return onAuthStateChanged(getFirebaseAuth(), listener)
}
