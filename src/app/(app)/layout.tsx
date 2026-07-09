import { AuthGate } from '@/components/auth/AuthGate'
import { DemoModeBanner } from '@/features/auth/DemoModeBanner'
import Aside from '@/components/layout/aside-bar/Aside'
import { Toaster } from '@/components/ui/sonner'

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
        <DemoModeBanner />
        <AuthGate>{children}</AuthGate>
      </div>

      {modal}
      <Toaster position="top-center" richColors closeButton />
    </div>
  )
}
