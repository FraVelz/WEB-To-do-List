import { create } from 'zustand'

type SidebarState = {
  asideBarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  asideBarOpen: true,
  toggleSidebar: () => set((s) => ({ asideBarOpen: !s.asideBarOpen })),
  setSidebarOpen: (open) => set({ asideBarOpen: open }),
}))
