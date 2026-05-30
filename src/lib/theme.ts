export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'todo-theme'

export function readTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  const value = localStorage.getItem(THEME_STORAGE_KEY)
  if (value === 'dark' || value === 'light') return value
  return null
}

export function writeTheme(theme: Theme | null): void {
  if (typeof window === 'undefined') return
  if (theme) localStorage.setItem(THEME_STORAGE_KEY, theme)
  else localStorage.removeItem(THEME_STORAGE_KEY)
}

export function applyThemeToDocument(theme: Theme): void {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
}

export const DEFAULT_THEME: Theme = 'dark'
