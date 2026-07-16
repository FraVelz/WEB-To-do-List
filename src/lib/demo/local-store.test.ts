import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  DEMO_STORAGE_KEY,
  createDemoTask,
  deleteDemoTask,
  listDemoTaskLabels,
  listDemoTasks,
  patchDemoTask,
} from './local-store'

describe('demo local-store', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('inicializa datos de ejemplo en localStorage', () => {
    const tasks = listDemoTasks({ filter: 'inbox' })
    expect(tasks.length).toBeGreaterThan(0)
    expect(localStorage.getItem(DEMO_STORAGE_KEY)).toBeTruthy()
  })

  it('crea, actualiza y elimina tareas', () => {
    const created = createDemoTask({ title: 'Nueva demo' })
    expect(created.title).toBe('Nueva demo')

    const patched = patchDemoTask(created.id, { completed: true })
    expect(patched?.completed).toBe(true)

    expect(deleteDemoTask(created.id)).toBe(true)
    expect(
      listDemoTasks({ filter: 'completed' }).some((t) => t.id === created.id)
    ).toBe(false)
  })

  it('lista etiquetas únicas', () => {
    createDemoTask({ title: 'A', label: 'Personal' })
    createDemoTask({ title: 'B', label: 'Personal' })
    const labels = listDemoTaskLabels()
    expect(labels).toContain('Tutorial')
    expect(labels).toContain('Personal')
  })
})
