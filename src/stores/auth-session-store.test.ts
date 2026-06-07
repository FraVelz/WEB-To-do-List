import { afterEach, describe, expect, it } from 'vitest'

import { useAuthSessionStore } from './auth-session-store'

describe('useAuthSessionStore', () => {
  afterEach(() => {
    sessionStorage.clear()
    useAuthSessionStore.setState({ mode: null, hydrated: false })
  })

  it('entra en modo demo sin Firebase y persiste', () => {
    useAuthSessionStore.getState().enterDemo()
    const s = useAuthSessionStore.getState()
    expect(s.mode).toBe('demo')
    expect(sessionStorage.getItem('todo-auth-mode')).toBe('demo')
  })

  it('no sobrescribe demo cuando Firebase reporta null', () => {
    useAuthSessionStore.getState().enterDemo()
    useAuthSessionStore.getState().syncFromFirebase(null)
    expect(useAuthSessionStore.getState().mode).toBe('demo')
  })

  it('limpia la sesión', () => {
    useAuthSessionStore.getState().syncFromFirebase('user')
    useAuthSessionStore.getState().clear()
    expect(useAuthSessionStore.getState().mode).toBeNull()
    expect(sessionStorage.getItem('todo-auth-mode')).toBeNull()
  })
})
