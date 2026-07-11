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

  it('pasa de demo a user cuando Firebase reporta usuario', () => {
    useAuthSessionStore.getState().enterDemo()
    useAuthSessionStore.getState().syncFromFirebase('user')
    expect(useAuthSessionStore.getState().mode).toBe('user')
    expect(sessionStorage.getItem('todo-auth-mode')).toBe('user')
  })

  it('enterUser fija modo user', () => {
    useAuthSessionStore.getState().enterDemo()
    useAuthSessionStore.getState().enterUser()
    expect(useAuthSessionStore.getState().mode).toBe('user')
    expect(sessionStorage.getItem('todo-auth-mode')).toBe('user')
  })

  it('limpia user a null al sincronizar signed-out', () => {
    useAuthSessionStore.getState().syncFromFirebase('user')
    useAuthSessionStore.getState().syncFromFirebase(null)
    expect(useAuthSessionStore.getState().mode).toBeNull()
    expect(sessionStorage.getItem('todo-auth-mode')).toBeNull()
  })

  it('limpia la sesión', () => {
    useAuthSessionStore.getState().syncFromFirebase('user')
    useAuthSessionStore.getState().clear()
    expect(useAuthSessionStore.getState().mode).toBeNull()
    expect(sessionStorage.getItem('todo-auth-mode')).toBeNull()
  })
})
