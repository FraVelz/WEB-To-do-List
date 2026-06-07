import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

function getFirebaseConfig() {
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim()

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    ...(measurementId ? { measurementId } : {}),
  }
}

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig()
  return Boolean(config.apiKey && config.projectId)
}

export function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) return getApp()

  const config = getFirebaseConfig()
  if (!config.apiKey || !config.projectId) {
    throw new Error(
      'Configura las variables NEXT_PUBLIC_FIREBASE_* en tu archivo .env'
    )
  }

  return initializeApp(config)
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp())
}
