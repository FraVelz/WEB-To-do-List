import type { Metadata } from 'next'

import { PageLogout } from '@/features/account/PageLogout'

export const metadata: Metadata = {
  title: 'Cerrar sesión — To-do',
  description: 'Finalizar sesión en este dispositivo.',
}

export default function LogoutPage() {
  return <PageLogout />
}
