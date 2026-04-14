import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TaskRow } from './TaskRow'

const patchTask = vi.fn()
const deleteTask = vi.fn()
const bump = vi.fn()

vi.mock('@/services/tasks', () => ({
  patchTask: (...args: unknown[]) => patchTask(...args),
  deleteTask: (...args: unknown[]) => deleteTask(...args),
}))

vi.mock('@/stores/tasks-refresh-store', () => ({
  useTasksRefreshStore: (sel: (s: { bump: () => void }) => unknown) =>
    sel({ bump }),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

const baseTask = {
  id: 't1',
  title: 'Mi tarea',
  description: 'Detalle',
  completed: false,
  dueDate: null as string | null,
  priority: 0,
  label: 'Tag',
  createdAt: '',
  updatedAt: '',
}

describe('TaskRow', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    patchTask.mockReset()
    deleteTask.mockReset()
    bump.mockReset()
    patchTask.mockResolvedValue({ ...baseTask, completed: true })
    deleteTask.mockResolvedValue(undefined)
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('renderiza título y etiqueta', () => {
    render(<TaskRow task={baseTask} />)

    expect(screen.getByText('Mi tarea')).toBeInTheDocument()
    expect(screen.getByText('Tag')).toBeInTheDocument()
  })

  it('al marcar checkbox llama patchTask y bump', async () => {
    render(<TaskRow task={baseTask} />)

    fireEvent.click(
      screen.getAllByRole('checkbox', { name: /marcar hecha/i })[0]!
    )

    await waitFor(() => {
      expect(patchTask).toHaveBeenCalledWith('t1', { completed: true })
      expect(bump).toHaveBeenCalled()
    })
  })

  it('eliminar llama deleteTask cuando confirm es true', async () => {
    render(<TaskRow task={baseTask} />)

    fireEvent.click(
      screen.getAllByRole('button', { name: /eliminar tarea/i })[0]!
    )

    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith('t1')
      expect(bump).toHaveBeenCalled()
    })
  })
})
