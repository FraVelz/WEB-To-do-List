import { describe, expect, it } from 'vitest'

import { isModalPath, MODAL_PATHS } from './modal-routes'

describe('modal-routes', () => {
  it('detecta rutas de modal', () => {
    expect(isModalPath(MODAL_PATHS.addTask)).toBe(true)
    expect(isModalPath('/inbox')).toBe(false)
  })
})
