import { describe, expect, it, vi } from 'vitest'

import { formatTaskDate } from './date-format'

describe('formatTaskDate', () => {
  it('devuelve cadena vacía para null', () => {
    expect(formatTaskDate(null)).toBe('')
  })

  it('devuelve cadena vacía para ISO inválido', () => {
    expect(formatTaskDate('no-es-fecha')).toBe('')
  })

  it('formatea una fecha válida en español', () => {
    vi.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue(
      '15 ene 2024'
    )
    expect(formatTaskDate('2024-01-15T12:00:00.000Z')).toBe('15 ene 2024')
    vi.restoreAllMocks()
  })
})
