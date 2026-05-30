import { afterEach, describe, expect, it } from 'vitest'

import { readAuthMode, writeAuthMode } from './auth-session'

describe('auth-session', () => {
  afterEach(() => {
    sessionStorage.clear()
  })

  it('devuelve null sin valor guardado', () => {
    expect(readAuthMode()).toBeNull()
  })

  it('persiste y lee modo demo', () => {
    writeAuthMode('demo')
    expect(readAuthMode()).toBe('demo')
  })

  it('limpia la sesión', () => {
    writeAuthMode('user')
    writeAuthMode(null)
    expect(readAuthMode()).toBeNull()
  })
})
