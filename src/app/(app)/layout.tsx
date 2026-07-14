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
        <DemoModeBanner />
        <AuthGate>{children}</AuthGate>
      </div>

      {modal}
    </div>
  )
}
