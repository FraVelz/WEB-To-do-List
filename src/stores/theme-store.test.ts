import { afterEach, describe, expect, it } from 'vitest'

import { useThemeStore } from './theme-store'

describe('useThemeStore', () => {
  afterEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    useThemeStore.setState({ theme: 'dark', hydrated: false })
  })

  it('alterna entre oscuro y claro', () => {
    useThemeStore.getState().setTheme('dark')
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
