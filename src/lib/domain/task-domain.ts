/**
 * Pure task/label domain helpers (Camino A Lab).
 * Used by the demo store and covered by domain unit tests.
 */

export type TaskLike = {
  completed: boolean
  dueDate: string | null
  projectId: string | null
  label: string | null
  title: string
  description?: string | null
}

export type TaskViewFilter =
  | 'inbox'
  | 'today'
  | 'next'
  | 'completed'
  | 'overdue'
  | 'all'

export function utcDayRange(ref: Date = new Date()) {
  const start = new Date(
    Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate())
  )
  const end = new Date(start.getTime() + 86400000)
  return { start, end }
}

/** Inbox = incomplete tasks not attached to a project. */
export function isInboxTask(task: TaskLike): boolean {
  return !task.completed && task.projectId == null
}

export function isTaskOverdue(task: TaskLike, ref: Date = new Date()): boolean {
  if (task.completed || !task.dueDate) return false
  const { start } = utcDayRange(ref)
  return new Date(task.dueDate) < start
}

export function isTaskDueToday(
  task: TaskLike,
  ref: Date = new Date()
): boolean {
  if (task.completed || !task.dueDate) return false
  const { start, end } = utcDayRange(ref)
  const due = new Date(task.dueDate)
  return due >= start && due < end
}

/** Next = due within [today UTC, today+7d) including today. */
export function isTaskDueNext(
  task: TaskLike,
  ref: Date = new Date(),
  days = 7
): boolean {
  if (task.completed || !task.dueDate) return false
  const { start } = utcDayRange(ref)
  const windowEnd = new Date(start.getTime() + days * 86400000)
  const due = new Date(task.dueDate)
  return due >= start && due < windowEnd
}

export function matchesTaskView(
  task: TaskLike,
  filter: TaskViewFilter,
  ref: Date = new Date()
): boolean {
  switch (filter) {
    case 'completed':
      return task.completed
    case 'all':
      return true
    case 'today':
      return isTaskDueToday(task, ref)
    case 'next':
      return isTaskDueNext(task, ref)
    case 'overdue':
      return isTaskOverdue(task, ref)
    case 'inbox':
    default:
      return isInboxTask(task)
  }
}

/** Empty / whitespace labels are treated as no label. */
export function normalizeLabel(
  label: string | null | undefined
): string | null {
  if (label == null) return null
  const trimmed = label.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function matchesTaskLabel(
  task: { label: string | null },
  label: string
): boolean {
  const needle = normalizeLabel(label)
  if (!needle) return true
  return normalizeLabel(task.label) === needle
}

export function matchesTaskSearch(task: TaskLike, q: string): boolean {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  return (
    task.title.toLowerCase().includes(needle) ||
    (task.description?.toLowerCase().includes(needle) ?? false)
  )
}

export function uniqueTaskLabels(
  tasks: Array<{ label: string | null }>
): string[] {
  const labels = new Set<string>()
  for (const task of tasks) {
    const label = normalizeLabel(task.label)
    if (label) labels.add(label)
  }
  return [...labels].sort((a, b) => a.localeCompare(b, 'es'))
}

export function filterTasksByLabel<T extends { label: string | null }>(
  tasks: T[],
  label: string
): T[] {
  return tasks.filter((task) => matchesTaskLabel(task, label))
}
