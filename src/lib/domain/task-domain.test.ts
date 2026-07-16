import { describe, expect, it } from 'vitest'

import {
  filterTasksByLabel,
  isInboxTask,
  isTaskDueNext,
  isTaskDueToday,
  isTaskOverdue,
  matchesTaskLabel,
  matchesTaskSearch,
  matchesTaskView,
  normalizeLabel,
  uniqueTaskLabels,
  utcDayRange,
  type TaskLike,
} from './task-domain'

const ref = new Date(Date.UTC(2026, 6, 15, 12, 0, 0)) // 2026-07-15 UTC

function task(partial: Partial<TaskLike> & Pick<TaskLike, 'title'>): TaskLike {
  return {
    completed: false,
    dueDate: null,
    projectId: null,
    label: null,
    description: null,
    ...partial,
  }
}

describe('task-domain — views', () => {
  it('utcDayRange starts at midnight UTC of the ref day', () => {
    const { start, end } = utcDayRange(ref)
    expect(start.toISOString()).toBe('2026-07-15T00:00:00.000Z')
    expect(end.toISOString()).toBe('2026-07-16T00:00:00.000Z')
  })

  it('isInboxTask only for incomplete tasks without project', () => {
    expect(isInboxTask(task({ title: 'A' }))).toBe(true)
    expect(isInboxTask(task({ title: 'B', projectId: 'p1' }))).toBe(false)
    expect(isInboxTask(task({ title: 'C', completed: true }))).toBe(false)
  })

  it('isTaskDueToday matches due dates inside the UTC day', () => {
    expect(
      isTaskDueToday(
        task({ title: 'T', dueDate: '2026-07-15T08:00:00.000Z' }),
        ref
      )
    ).toBe(true)
    expect(
      isTaskDueToday(
        task({ title: 'T', dueDate: '2026-07-16T00:00:00.000Z' }),
        ref
      )
    ).toBe(false)
    expect(isTaskDueToday(task({ title: 'T' }), ref)).toBe(false)
  })

  it('isTaskDueNext includes today through day+6 (7-day window)', () => {
    expect(
      isTaskDueNext(
        task({ title: 'T', dueDate: '2026-07-15T10:00:00.000Z' }),
        ref
      )
    ).toBe(true)
    expect(
      isTaskDueNext(
        task({ title: 'T', dueDate: '2026-07-21T23:00:00.000Z' }),
        ref
      )
    ).toBe(true)
    expect(
      isTaskDueNext(
        task({ title: 'T', dueDate: '2026-07-22T00:00:00.000Z' }),
        ref
      )
    ).toBe(false)
  })

  it('isTaskOverdue is true only before today UTC', () => {
    expect(
      isTaskOverdue(
        task({ title: 'T', dueDate: '2026-07-14T23:59:59.000Z' }),
        ref
      )
    ).toBe(true)
    expect(
      isTaskOverdue(
        task({ title: 'T', dueDate: '2026-07-15T00:00:00.000Z' }),
        ref
      )
    ).toBe(false)
    expect(
      isTaskOverdue(
        task({
          title: 'T',
          dueDate: '2026-07-14T12:00:00.000Z',
          completed: true,
        }),
        ref
      )
    ).toBe(false)
  })

  it('matchesTaskView routes inbox/today/next/completed/overdue/all', () => {
    const inbox = task({ title: 'I' })
    const today = task({ title: 'D', dueDate: '2026-07-15T12:00:00.000Z' })
    const done = task({ title: 'X', completed: true })
    const overdue = task({ title: 'O', dueDate: '2026-07-10T12:00:00.000Z' })

    expect(matchesTaskView(inbox, 'inbox', ref)).toBe(true)
    expect(matchesTaskView(today, 'today', ref)).toBe(true)
    expect(matchesTaskView(today, 'next', ref)).toBe(true)
    expect(matchesTaskView(done, 'completed', ref)).toBe(true)
    expect(matchesTaskView(overdue, 'overdue', ref)).toBe(true)
    expect(matchesTaskView(done, 'all', ref)).toBe(true)
  })
})

describe('task-domain — labels', () => {
  it('normalizeLabel trims and drops empty strings', () => {
    expect(normalizeLabel('  Trabajo  ')).toBe('Trabajo')
    expect(normalizeLabel('   ')).toBeNull()
    expect(normalizeLabel(null)).toBeNull()
    expect(normalizeLabel(undefined)).toBeNull()
  })

  it('matchesTaskLabel compares normalized labels', () => {
    const t = task({ title: 'A', label: ' Personal ' })
    expect(matchesTaskLabel(t, 'Personal')).toBe(true)
    expect(matchesTaskLabel(t, 'personal')).toBe(false)
    expect(matchesTaskLabel(t, '  ')).toBe(true)
  })

  it('uniqueTaskLabels returns sorted unique non-empty labels', () => {
    const labels = uniqueTaskLabels([
      { label: 'Zeta' },
      { label: 'Alfa' },
      { label: 'Alfa' },
      { label: null },
      { label: '  ' },
    ])
    expect(labels).toEqual(['Alfa', 'Zeta'])
  })

  it('filterTasksByLabel keeps only matching label', () => {
    const tasks = [
      task({ title: '1', label: 'Lab' }),
      task({ title: '2', label: 'Casa' }),
      task({ title: '3', label: 'Lab' }),
    ]
    expect(filterTasksByLabel(tasks, 'Lab').map((t) => t.title)).toEqual([
      '1',
      '3',
    ])
  })

  it('matchesTaskSearch matches title and description case-insensitively', () => {
    const t = task({ title: 'Comprar leche', description: 'En el súper' })
    expect(matchesTaskSearch(t, 'LECHE')).toBe(true)
    expect(matchesTaskSearch(t, 'súper')).toBe(true)
    expect(matchesTaskSearch(t, 'pan')).toBe(false)
    expect(matchesTaskSearch(t, '  ')).toBe(true)
  })
})
