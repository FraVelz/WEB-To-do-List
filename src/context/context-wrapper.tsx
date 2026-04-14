import { ModalProProvider } from './context-ModalPro'
import { AsidebarProvider } from './context-openAsidebar'

export function ContextWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ModalProProvider>
      <AsidebarProvider>{children}</AsidebarProvider>
    </ModalProProvider>
  )
}
