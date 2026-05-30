import { ContextWrapper } from '@/context/context-wrapper'

import { DemoModeBanner } from '@/features/auth/DemoModeBanner'
import Aside from '@/components/layout/aside-bar/Aside'
import { ModalAddTask } from '@/components/modals/ModalAddTask'
import { ModalSearch } from '@/components/modals/ModalSearch'
import ModalPro from '@/components/ui/ModalPro/ModalPro'
import { Toaster } from '@/components/ui/sonner'

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ContextWrapper>
      <div className="flex min-h-screen items-center justify-center font-sans">
        <Aside />

        <div className="bg-surface-app flex h-screen flex-1 flex-col">
          <DemoModeBanner />
          {children}
        </div>
      </div>

      <ModalPro />
      <ModalAddTask />
      <ModalSearch />
      <Toaster position="top-center" richColors closeButton />
    </ContextWrapper>
  )
}
