import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'

import { getFirebaseApp, isFirebaseConfigured } from './client'

let analytics: Analytics | undefined

export async function initFirebaseAnalytics(): Promise<Analytics | undefined> {
  if (typeof window === 'undefined') return undefined
  if (analytics) return analytics
  if (!isFirebaseConfigured()) return undefined
  if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim()) return undefined
  if (!(await isSupported())) return undefined

  analytics = getAnalytics(getFirebaseApp())
  return analytics
}
