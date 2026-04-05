import { ModalSearchProvider } from './contex-ModalSearch'
import { ModalAddTaskProvider } from './context-ModalAddTask'
import { ModalProProvider } from './context-ModalPro'
import { AsidebarProvider } from './context-openAsidebar'

export function ContextWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ModalSearchProvider>
      <ModalAddTaskProvider>
        <ModalProProvider>
          <AsidebarProvider>{children}</AsidebarProvider>
        </ModalProProvider>
      </ModalAddTaskProvider>
    </ModalSearchProvider>
  )
}
