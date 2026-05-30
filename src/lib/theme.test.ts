import { afterEach, describe, expect, it } from 'vitest'

import { readTheme, writeTheme } from './theme'

describe('theme', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('lee y persiste tema claro', () => {
    writeTheme('light')
    expect(readTheme()).toBe('light')
  })

  it('limpia el tema guardado', () => {
    writeTheme('dark')
    writeTheme(null)
    expect(readTheme()).toBeNull()
  })
})
