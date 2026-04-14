import { create } from 'zustand'

type UiState = {
  addTaskOpen: boolean
  searchOpen: boolean
  openAddTask: () => void
  closeAddTask: () => void
  openSearch: () => void
  closeSearch: () => void
}

export const useUiStore = create<UiState>((set) => ({
  addTaskOpen: false,
  searchOpen: false,
  openAddTask: () =>
    set({ addTaskOpen: true, searchOpen: false }),
  closeAddTask: () => set({ addTaskOpen: false }),
  openSearch: () =>
    set({ searchOpen: true, addTaskOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
}))
