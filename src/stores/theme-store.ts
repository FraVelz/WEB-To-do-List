import { create } from 'zustand'

import {
  applyThemeToDocument,
  DEFAULT_THEME,
  readTheme,
  writeTheme,
  type Theme,
} from '@/lib/theme'

type ThemeState = {
  theme: Theme
  hydrated: boolean
  hydrate: () => void
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: DEFAULT_THEME,
  hydrated: false,
  hydrate: () => {
    const stored = readTheme() ?? DEFAULT_THEME
    applyThemeToDocument(stored)
    set({ theme: stored, hydrated: true })
  },
  setTheme: (theme) => {
    writeTheme(theme)
    applyThemeToDocument(theme)
    set({ theme, hydrated: true })
  },
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
    get().setTheme(next)
  },
}))
