import type { Metadata } from 'next'

import { PageProfile } from '@/features/account/PageProfile'

export const metadata: Metadata = {
  title: 'Perfil — To-do',
  description: 'Datos de tu cuenta.',
}

export default function ProfilePage() {
  return <PageProfile />
}
