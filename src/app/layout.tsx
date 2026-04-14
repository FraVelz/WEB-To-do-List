import type { Metadata } from 'next'

import { ContextWrapper } from '@/context/context-wrapper'

import Aside from '@/components/layout/aside-bar/Aside'
import { ModalAddTask } from '@/components/modals/ModalAddTask'
import { ModalSearch } from '@/components/modals/ModalSearch'
import ModalPro from '@/components/ui/ModalPro/ModalPro'
import { Toaster } from '@/components/ui/sonner'

import { Geist } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'To-do — Organiza tu día',
  description: 'Gestor de tareas con notificaciones y bandeja de entrada.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} bg-surface-app antialiased`}>
        <ContextWrapper>
          <div className="flex min-h-screen items-center justify-center font-sans">
            <Aside />

            <div className="bg-surface-app flex h-screen flex-1 flex-col">
              {children}
            </div>
          </div>

          <ModalPro />
          <ModalAddTask />
          <ModalSearch />
          <Toaster position="top-center" richColors closeButton />
        </ContextWrapper>
      </body>
    </html>
  )
}
