import { describe, expect, it } from 'vitest'

import {
  applySectionMove,
  applyTaskMove,
  moveItem,
  reindexOrders,
} from './reorder'

describe('dnd reorder helpers', () => {
  it('moveItem reorders within a list', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a'])
    expect(moveItem(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b'])
    expect(moveItem(['a', 'b'], 0, 0)).toEqual(['a', 'b'])
  })

  it('reindexOrders assigns sequential orders', () => {
    expect(reindexOrders([{ id: 'x' }, { id: 'y' }])).toEqual([
      { id: 'x', order: 0 },
      { id: 'y', order: 1 },
    ])
  })

  it('applyTaskMove moves across sections', () => {
    const tasks = [
      { id: 't1', sectionId: 's1', order: 0 },
      { id: 't2', sectionId: 's1', order: 1 },
      { id: 't3', sectionId: 's2', order: 0 },
    ]
    const { updates } = applyTaskMove(tasks, 't1', 's2', 0)
    expect(updates).toEqual([
      { id: 't1', order: 0, sectionId: 's2' },
      { id: 't3', order: 1, sectionId: 's2' },
    ])
  })

  it('applyTaskMove to Sin sección (null)', () => {
    const tasks = [
      { id: 't1', sectionId: 's1', order: 0 },
      { id: 't2', sectionId: null, order: 0 },
    ]
    const { updates } = applyTaskMove(tasks, 't1', null, 1)
    expect(updates).toEqual([
      { id: 't2', order: 0, sectionId: null },
      { id: 't1', order: 1, sectionId: null },
    ])
  })

  it('applySectionMove reindexes sections', () => {
    const sections = [
      { id: 's1', order: 0 },
      { id: 's2', order: 1 },
      { id: 's3', order: 2 },
    ]
    const { updates } = applySectionMove(sections, 's3', 0)
    expect(updates).toEqual([
      { id: 's3', order: 0 },
      { id: 's1', order: 1 },
      { id: 's2', order: 2 },
    ])
  })
})
