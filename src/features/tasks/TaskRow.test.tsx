import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { toast } from 'sonner'

import { TaskRow } from './TaskRow'

const patchTask = vi.fn()
const deleteTask = vi.fn()
const bump = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
  usePathname: () => '/inbox',
}))

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
    vi.mocked(toast.success).mockReset()
    vi.mocked(toast.error).mockReset()
    patchTask.mockResolvedValue({ ...baseTask, completed: true })
    deleteTask.mockResolvedValue(undefined)
  })

  it('renderiza título y etiqueta', () => {
    render(<TaskRow task={baseTask} />)

    expect(screen.getByText('Mi tarea')).toBeInTheDocument()
    expect(screen.getByText('Tag')).toBeInTheDocument()
  })

  it('al marcar checkbox llama patchTask, toast de éxito y bump', async () => {
    render(<TaskRow task={baseTask} />)

    fireEvent.click(
      screen.getAllByRole('checkbox', { name: /marcar hecha/i })[0]!
    )

    await waitFor(() => {
      expect(patchTask).toHaveBeenCalledWith('t1', { completed: true })
      expect(toast.success).toHaveBeenCalledWith('Tarea completada')
      expect(bump).toHaveBeenCalled()
    })
  })

  it('al reabrir tarea muestra toast de pendiente', async () => {
    patchTask.mockResolvedValue({ ...baseTask, completed: false })
    render(<TaskRow task={{ ...baseTask, completed: true }} />)

    fireEvent.click(
      screen.getAllByRole('checkbox', { name: /marcar pendiente/i })[0]!
    )

    await waitFor(() => {
      expect(patchTask).toHaveBeenCalledWith('t1', { completed: false })
      expect(toast.success).toHaveBeenCalledWith(
        'Tarea marcada como pendiente'
      )
      expect(bump).toHaveBeenCalled()
    })
  })

  it('eliminar abre modal y llama deleteTask al confirmar', async () => {
    render(<TaskRow task={baseTask} />)

    fireEvent.click(
      screen.getAllByRole('button', { name: /eliminar tarea/i })[0]!
    )

    expect(
      screen.getByRole('dialog', { name: /¿eliminar esta tarea\?/i })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^eliminar$/i }))

    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith('t1')
      expect(toast.success).toHaveBeenCalledWith('Tarea eliminada')
      expect(bump).toHaveBeenCalled()
    })
  })

  it('cancelar en el modal no elimina la tarea', async () => {
    render(<TaskRow task={baseTask} />)

    fireEvent.click(
      screen.getAllByRole('button', { name: /eliminar tarea/i })[0]!
    )
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(deleteTask).not.toHaveBeenCalled()
    expect(
      screen.queryByRole('dialog', { name: /¿eliminar esta tarea\?/i })
    ).not.toBeInTheDocument()
  })
})
