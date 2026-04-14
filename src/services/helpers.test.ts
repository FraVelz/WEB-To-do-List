import { beforeEach, describe, expect, it } from 'vitest'

import { LocalStorageJson } from './helpers'

describe('LocalStorageJson', () => {
  const key = 'testing_localstorage_json'

  beforeEach(() => {
    localStorage.removeItem(key)
  })

  const obj = new LocalStorageJson(key)

  it('create guarda JSON en localStorage', () => {
    expect(
      obj.create({
        title: 'title1',
        description: 'lorem ipsum',
      })
    ).toBe(true)
  })

  it('read devuelve el JSON guardado', () => {
    obj.create({ title: 'title1', description: 'lorem ipsum' })
    expect(JSON.parse(obj.read())).toEqual({
      title: 'title1',
      description: 'lorem ipsum',
    })
  })

  it('write devuelve cadena vacía (stub)', () => {
    expect(obj.write()).toBe('')
  })
})
