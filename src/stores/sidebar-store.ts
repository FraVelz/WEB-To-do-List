import { create } from 'zustand'

type SidebarState = {
  asideBarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  // Cerrado por defecto: en mobile evita flash del drawer; desktop lo abre al montar
  asideBarOpen: false,
  toggleSidebar: () => set((s) => ({ asideBarOpen: !s.asideBarOpen })),
  setSidebarOpen: (open) => set({ asideBarOpen: open }),
}))
