import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TaskList } from './TaskList'

const fetchTasks = vi.fn()
const bump = vi.fn()

vi.mock('@/services/tasks', () => ({
  fetchTasks: (...args: unknown[]) => fetchTasks(...args),
}))

vi.mock('@/stores/tasks-refresh-store', () => ({
  useTasksRefreshStore: (
    sel: (s: { version: number; bump: () => void }) => unknown
  ) => sel({ version: 0, bump }),
}))

vi.mock('@/services/projects', () => ({
  fetchProjects: vi.fn().mockResolvedValue([]),
  fetchSections: vi.fn().mockResolvedValue([]),
}))

vi.mock('@pheralb/toast', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}))

const tasks = [
  {
    id: 'a',
    title: 'Primera',
    description: null,
    completed: false,
    dueDate: null,
    priority: 0,
    label: null,
    projectId: null,
    sectionId: null,
    order: 0,
    completedAt: null,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'b',
    title: 'Segunda',
    description: null,
    completed: false,
    dueDate: null,
    priority: 0,
    label: null,
    projectId: null,
    sectionId: null,
    order: 1,
    completedAt: null,
    createdAt: '',
    updatedAt: '',
  },
]

describe('TaskList keyboard a11y (L6-5)', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    fetchTasks.mockReset()
    fetchTasks.mockResolvedValue(tasks)
  })

  it('mueve el foco con ArrowDown / ArrowUp entre filas', async () => {
    render(<TaskList filter="inbox" />)

    await waitFor(() => {
      expect(
        screen.getByRole('list', { name: /lista de tareas/i })
      ).toBeInTheDocument()
    })

    const first = screen.getByLabelText('Primera', {
      selector: 'div[tabindex]',
    })
    first.focus()
    expect(first).toHaveFocus()

    fireEvent.keyDown(first, { key: 'ArrowDown' })

    await waitFor(() => {
      expect(
        screen.getByLabelText('Segunda', { selector: 'div[tabindex]' })
      ).toHaveFocus()
    })

    fireEvent.keyDown(
      screen.getByLabelText('Segunda', { selector: 'div[tabindex]' }),
      { key: 'ArrowUp' }
    )

    await waitFor(() => {
      expect(
        screen.getByLabelText('Primera', { selector: 'div[tabindex]' })
      ).toHaveFocus()
    })
  })
})
