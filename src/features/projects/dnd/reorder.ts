export function moveItem<T>(
  list: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length ||
    fromIndex === toIndex
  ) {
    return list
  }
  const next = [...list]
  const [item] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, item)
  return next
}

export function reindexOrders<T extends { id: string }>(
  items: T[]
): Array<{ id: string; order: number }> {
  return items.map((item, index) => ({ id: item.id, order: index }))
}

export type TaskLike = {
  id: string
  sectionId: string | null
  order: number
}

/**
 * Moves a task within/across section buckets and returns updates for persistence.
 */
export function applyTaskMove(
  tasks: TaskLike[],
  taskId: string,
  targetSectionId: string | null,
  targetIndex: number
): {
  tasks: TaskLike[]
  updates: Array<{ id: string; order: number; sectionId: string | null }>
} {
  const moving = tasks.find((t) => t.id === taskId)
  if (!moving) return { tasks, updates: [] }

  const without = tasks.filter((t) => t.id !== taskId)
  const targetList = without
    .filter((t) => t.sectionId === targetSectionId)
    .sort((a, b) => a.order - b.order)

  const clamped = Math.max(0, Math.min(targetIndex, targetList.length))
  const inserted = [...targetList]
  inserted.splice(clamped, 0, { ...moving, sectionId: targetSectionId })

  const other = without.filter((t) => t.sectionId !== targetSectionId)
  const nextTasks = [...other, ...inserted.map((t, i) => ({ ...t, order: i }))]

  const updates = inserted.map((t, i) => ({
    id: t.id,
    order: i,
    sectionId: targetSectionId,
  }))

  return { tasks: nextTasks, updates }
}

export function applySectionMove<T extends { id: string; order: number }>(
  sections: T[],
  sectionId: string,
  targetIndex: number
): { sections: T[]; updates: Array<{ id: string; order: number }> } {
  const sorted = [...sections].sort((a, b) => a.order - b.order)
  const moving = sorted.find((s) => s.id === sectionId)
  if (!moving) return { sections, updates: [] }

  const without = sorted.filter((s) => s.id !== sectionId)
  const clamped = Math.max(0, Math.min(targetIndex, without.length))
  const next = [...without]
  next.splice(clamped, 0, moving)
  const withOrder = next.map((s, i) => ({ ...s, order: i }))
  return {
    sections: withOrder,
    updates: reindexOrders(withOrder),
  }
}
