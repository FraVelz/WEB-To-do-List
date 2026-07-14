'use client'

import { useRef } from 'react'
import clsx from 'clsx'

import { TaskRow } from '@/features/tasks/TaskRow'
import type { TaskDto } from '@/services/tasks'

import type { InsertEdge } from './types'
import { useTaskDraggable, useTaskDropTarget } from './useProjectDnd'

type Props = {
  task: TaskDto
  onDropTask: (args: {
    draggedTaskId: string
    targetTaskId: string
    sectionId: string | null
    edge: InsertEdge
  }) => void
}

export function DraggableTaskItem({ task, onDropTask }: Props) {
  const ref = useRef<HTMLLIElement>(null)
  const { dragging } = useTaskDraggable(
    ref,
    { kind: 'task', taskId: task.id, sectionId: task.sectionId },
    true
  )
  const { edge } = useTaskDropTarget(ref, {
    taskId: task.id,
    sectionId: task.sectionId,
    onDropTask: ({ taskId, sectionId, edge: dropEdge }) => {
      onDropTask({
        draggedTaskId: taskId,
        targetTaskId: task.id,
        sectionId,
        edge: dropEdge,
      })
    },
  })

  return (
    <li
      ref={ref}
      className={clsx(
        'relative',
        dragging && 'opacity-40',
        edge === 'before' &&
          'before:bg-interactive-primary before:absolute before:inset-x-0 before:-top-0.5 before:h-0.5',
        edge === 'after' &&
          'after:bg-interactive-primary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5'
      )}
    >
      <TaskRow task={task} hideProjectMeta />
    </li>
  )
}
