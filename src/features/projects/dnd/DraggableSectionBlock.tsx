'use client'

import { ChevronDownIcon, PlusIcon } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import clsx from 'clsx'

import type { SectionDto } from '@/services/projects'

import type { InsertEdge } from './types'
import { useSectionDraggable, useSectionDropTarget } from './useProjectDnd'

type Props = {
  section: SectionDto
  taskCount: number
  collapsed: boolean
  onToggle: () => void
  onAddTask: () => void
  children: ReactNode
  onDropSection: (args: {
    draggedSectionId: string
    targetSectionId: string
    edge: InsertEdge
  }) => void
  onDropTaskOnSection: (taskId: string) => void
}

export function DraggableSectionBlock({
  section,
  taskCount,
  collapsed,
  onToggle,
  onAddTask,
  children,
  onDropSection,
  onDropTaskOnSection,
}: Props) {
  const headerRef = useRef<HTMLDivElement>(null)
  const { dragging } = useSectionDraggable(headerRef, {
    kind: 'section',
    sectionId: section.id,
  })
  const { edge, taskOver } = useSectionDropTarget(headerRef, {
    sectionId: section.id,
    onDropSection: ({ sectionId, edge: dropEdge }) => {
      onDropSection({
        draggedSectionId: sectionId,
        targetSectionId: section.id,
        edge: dropEdge,
      })
    },
    onDropTaskOnSection: ({ taskId }) => onDropTaskOnSection(taskId),
  })

  return (
    <section className={clsx(dragging && 'opacity-40')}>
      <div
        ref={headerRef}
        className={clsx(
          'group relative flex items-center gap-2 rounded-md',
          taskOver && 'bg-interactive-hover-soft',
          edge === 'before' &&
            'before:bg-interactive-primary before:absolute before:inset-x-0 before:-top-0.5 before:h-0.5',
          edge === 'after' &&
            'after:bg-interactive-primary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5'
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          className="text-text-heading flex min-w-0 flex-1 items-center gap-2 text-left font-semibold"
        >
          <ChevronDownIcon
            className={clsx(
              'text-text-secondary size-4 shrink-0 transition-transform',
              collapsed && '-rotate-90'
            )}
          />
          <span className="truncate">{section.name}</span>
          <span className="text-text-secondary text-sm font-normal">
            {taskCount}
          </span>
        </button>
        <button
          type="button"
          onClick={onAddTask}
          className="text-interactive-primary hover:bg-interactive-hover-soft rounded p-1 opacity-0 group-hover:opacity-100"
          aria-label={`Añadir tarea a ${section.name}`}
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
      {!collapsed && children}
    </section>
  )
}
