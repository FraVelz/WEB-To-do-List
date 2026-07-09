import { describe, expect, it } from 'vitest'

import { useSidebarStore } from './sidebar-store'

describe('useSidebarStore', () => {
  it('alterna la barra lateral', () => {
    useSidebarStore.setState({ asideBarOpen: true })
    useSidebarStore.getState().toggleSidebar()
    expect(useSidebarStore.getState().asideBarOpen).toBe(false)
  })

  it('setSidebarOpen fija el estado', () => {
    useSidebarStore.getState().setSidebarOpen(true)
    expect(useSidebarStore.getState().asideBarOpen).toBe(true)
    useSidebarStore.getState().setSidebarOpen(false)
    expect(useSidebarStore.getState().asideBarOpen).toBe(false)
  })
})
