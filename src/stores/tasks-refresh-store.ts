import { create } from 'zustand'

type TasksRefreshState = {
  version: number
  bump: () => void
}

export const useTasksRefreshStore = create<TasksRefreshState>((set) => ({
  version: 0,
  bump: () => set((s) => ({ version: s.version + 1 })),
}))
