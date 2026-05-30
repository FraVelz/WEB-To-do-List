import type { Metadata } from 'next'

import { PageLogin } from '@/features/auth/PageLogin'

export const metadata: Metadata = {
  title: 'Iniciar sesión — To-do',
  description: 'Accede a tu gestor de tareas.',
}

export default function LoginPage() {
  return <PageLogin />
}
