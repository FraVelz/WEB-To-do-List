'use client'

import { useEffect } from 'react'

import { initFirebaseAnalytics } from '@/lib/firebase/analytics'
import { isFirebaseConfigured } from '@/lib/firebase/client'

export function FirebaseAnalytics() {
  useEffect(() => {
    if (!isFirebaseConfigured()) return
    void initFirebaseAnalytics()
  }, [])

  return null
}
