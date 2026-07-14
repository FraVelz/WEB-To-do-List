export type DragKind = 'task' | 'section'

export type TaskDragData = {
  kind: 'task'
  taskId: string
  sectionId: string | null
}

export type SectionDragData = {
  kind: 'section'
  sectionId: string
}

export type ProjectDragData = TaskDragData | SectionDragData

export type InsertEdge = 'before' | 'after'

export function isTaskDragData(data: Record<string | symbol, unknown>): data is TaskDragData {
  return data.kind === 'task' && typeof data.taskId === 'string'
}

export function isSectionDragData(
  data: Record<string | symbol, unknown>
): data is SectionDragData {
  return data.kind === 'section' && typeof data.sectionId === 'string'
}
