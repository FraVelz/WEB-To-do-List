import { describe, expect, it } from 'vitest'

import { useUiStore } from './ui-store'

describe('useUiStore', () => {
  it('abre modal de tarea y cierra búsqueda', () => {
    useUiStore.setState({
      addTaskOpen: false,
      searchOpen: true,
    })
    useUiStore.getState().openAddTask()
    const s = useUiStore.getState()
    expect(s.addTaskOpen).toBe(true)
    expect(s.searchOpen).toBe(false)
  })

  it('abre búsqueda y cierra modal de tarea', () => {
    useUiStore.setState({
      addTaskOpen: true,
      searchOpen: false,
    })
    useUiStore.getState().openSearch()
    const s = useUiStore.getState()
    expect(s.searchOpen).toBe(true)
    expect(s.addTaskOpen).toBe(false)
  })

  it('resetea estado tras tests', () => {
    useUiStore.setState({ addTaskOpen: false, searchOpen: false })
  })
})
