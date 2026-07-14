'use client'

import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useEffect, useState, type RefObject } from 'react'

import {
  isSectionDragData,
  isTaskDragData,
  type InsertEdge,
  type ProjectDragData,
} from './types'

function edgeFromPointer(element: HTMLElement, clientY: number): InsertEdge {
  const rect = element.getBoundingClientRect()
  const mid = rect.top + rect.height / 2
  return clientY < mid ? 'before' : 'after'
}

export function useTaskDraggable(
  ref: RefObject<HTMLElement | null>,
  data: Extract<ProjectDragData, { kind: 'task' }>,
  enabled = true
) {
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    return draggable({
      element: el,
      getInitialData: () => data,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    })
  }, [ref, data.taskId, data.sectionId, enabled, data])

  return { dragging }
}

export function useTaskDropTarget(
  ref: RefObject<HTMLElement | null>,
  opts: {
    taskId: string
    sectionId: string | null
    enabled?: boolean
    onDropTask: (args: {
      taskId: string
      sectionId: string | null
      edge: InsertEdge
    }) => void
  }
) {
  const [edge, setEdge] = useState<InsertEdge | null>(null)
  const enabled = opts.enabled ?? true

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    return dropTargetForElements({
      element: el,
      getData: () => ({ kind: 'task-target', taskId: opts.taskId }),
      canDrop: ({ source }) => isTaskDragData(source.data),
      onDragEnter: ({ location, source }) => {
        if (!isTaskDragData(source.data)) return
        if (source.data.taskId === opts.taskId) return
        const pos = location.current.input
        setEdge(edgeFromPointer(el, pos.clientY))
      },
      onDrag: ({ location, source }) => {
        if (!isTaskDragData(source.data)) return
        if (source.data.taskId === opts.taskId) return
        setEdge(edgeFromPointer(el, location.current.input.clientY))
      },
      onDragLeave: () => setEdge(null),
      onDrop: ({ source, location }) => {
        setEdge(null)
        if (!isTaskDragData(source.data)) return
        if (source.data.taskId === opts.taskId) return
        const dropEdge = edgeFromPointer(el, location.current.input.clientY)
        opts.onDropTask({
          taskId: source.data.taskId,
          sectionId: opts.sectionId,
          edge: dropEdge,
        })
      },
    })
  }, [ref, opts.taskId, opts.sectionId, enabled, opts])

  return { edge }
}

export function useSectionDraggable(
  ref: RefObject<HTMLElement | null>,
  data: Extract<ProjectDragData, { kind: 'section' }>,
  enabled = true
) {
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    return draggable({
      element: el,
      getInitialData: () => data,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    })
  }, [ref, data.sectionId, enabled, data])

  return { dragging }
}

export function useSectionDropTarget(
  ref: RefObject<HTMLElement | null>,
  opts: {
    sectionId: string | null
    enabled?: boolean
    onDropSection: (args: {
      sectionId: string
      edge: InsertEdge
    }) => void
    onDropTaskOnSection: (args: { taskId: string }) => void
  }
) {
  const [edge, setEdge] = useState<InsertEdge | null>(null)
  const [taskOver, setTaskOver] = useState(false)
  const enabled = opts.enabled ?? true

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    return dropTargetForElements({
      element: el,
      getData: () => ({ kind: 'section-target', sectionId: opts.sectionId }),
      canDrop: ({ source }) =>
        isSectionDragData(source.data) || isTaskDragData(source.data),
      onDragEnter: ({ location, source }) => {
        if (isSectionDragData(source.data)) {
          if (source.data.sectionId === opts.sectionId) return
          setEdge(edgeFromPointer(el, location.current.input.clientY))
          setTaskOver(false)
          return
        }
        if (isTaskDragData(source.data)) {
          setTaskOver(true)
          setEdge(null)
        }
      },
      onDrag: ({ location, source }) => {
        if (isSectionDragData(source.data)) {
          if (source.data.sectionId === opts.sectionId) return
          setEdge(edgeFromPointer(el, location.current.input.clientY))
        }
      },
      onDragLeave: () => {
        setEdge(null)
        setTaskOver(false)
      },
      onDrop: ({ source, location }) => {
        const dropEdge = edgeFromPointer(el, location.current.input.clientY)
        setEdge(null)
        setTaskOver(false)
        if (isSectionDragData(source.data)) {
          if (source.data.sectionId === opts.sectionId) return
          if (opts.sectionId == null) return
          opts.onDropSection({
            sectionId: source.data.sectionId,
            edge: dropEdge,
          })
          return
        }
        if (isTaskDragData(source.data)) {
          opts.onDropTaskOnSection({ taskId: source.data.taskId })
        }
      },
    })
  }, [ref, opts.sectionId, enabled, opts])

  return { edge, taskOver }
}
