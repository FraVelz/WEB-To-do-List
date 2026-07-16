import { AuthGate } from '@/components/auth/AuthGate'
import Aside from '@/components/layout/aside-bar/Aside'
import { DemoModeBanner } from '@/features/auth/DemoModeBanner'

export default function AppLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen overflow-x-hidden font-sans">
      <Aside />

      <div className="bg-surface-app flex h-screen min-w-0 flex-1 flex-col">
        <a
          href="#main-content"
          className="bg-interactive-primary text-text-primary focus:ring-text-accent sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus:ring-2"
        >
          Saltar al contenido
        </a>
        <DemoModeBanner />
        <AuthGate>{children}</AuthGate>
      </div>

      {modal}
    </div>
  )
}
