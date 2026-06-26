import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'

import { getFirebaseAuth, isFirebaseConfigured } from './client'

export async function signInUser(email: string, password: string) {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase no está configurado. Usa el modo demo o completa .env.'
    )
  }

  return signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password)
}

export async function signUpUser(email: string, password: string) {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase no está configurado. Usa el modo demo o completa .env.'
    )
  }

  return createUserWithEmailAndPassword(
    getFirebaseAuth(),
    email.trim(),
    password
  )
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
