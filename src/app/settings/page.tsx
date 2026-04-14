import type { Metadata } from 'next'

import { PageSettings } from '@/features/account/PageSettings'

export const metadata: Metadata = {
  title: 'Ajustes — To-do',
  description: 'Preferencias de la aplicación.',
}

export default function SettingsPage() {
  return <PageSettings />
}
