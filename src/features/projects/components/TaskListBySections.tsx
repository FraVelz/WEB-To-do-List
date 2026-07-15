'use client'

import { PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useModalNavigation } from '@/hooks/useModalNavigation'
import { NameInputModal } from '@/features/projects/components/NameInputModal'
import { DraggableSectionBlock } from '@/features/projects/dnd/DraggableSectionBlock'
import { DraggableTaskItem } from '@/features/projects/dnd/DraggableTaskItem'
import {
  applySectionMove,
  applyTaskMove,
} from '@/features/projects/dnd/reorder'
import type { InsertEdge } from '@/features/projects/dnd/types'
import {
  createSection,
  fetchSections,
  patchSection,
  reorderSections,
  type SectionDto,
} from '@/services/projects'
import { fetchTasks, reorderTasks, type TaskDto } from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'

type Props = {
  projectId: string
}

function collapsedKey(sectionId: string) {
  return `section-collapsed:${sectionId}`
}

function readCollapsed(sectionId: string) {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(collapsedKey(sectionId)) === '1'
}

function targetIndexFromEdge(
  sortedIds: string[],
  targetId: string,
  edge: InsertEdge,
  draggedId: string
) {
  const withoutDragged = sortedIds.filter((id) => id !== draggedId)
  const targetPos = withoutDragged.indexOf(targetId)
  if (targetPos === -1) return withoutDragged.length
  return edge === 'before' ? targetPos : targetPos + 1
}

export function TaskListBySections({ projectId }: Props) {
  const version = useTasksRefreshStore((s) => s.version)
  const bump = useTasksRefreshStore((s) => s.bump)
  const { openAddTask } = useModalNavigation()
  const [sections, setSections] = useState<SectionDto[]>([])
  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [sectionOpen, setSectionOpen] = useState(false)
  const [renamingSection, setRenamingSection] = useState<SectionDto | null>(
    null
  )

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) setLoading(true)
    })

    Promise.all([fetchSections(projectId), fetchTasks({ projectId })])
      .then(([secs, taskList]) => {
        if (cancelled) return
        setSections(secs)
        setTasks(taskList)
        const next: Record<string, boolean> = {}
        for (const s of secs) next[s.id] = readCollapsed(s.id)
        setCollapsed(next)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          toast.error(e instanceof Error ? e.message : 'Error al cargar')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [projectId, version])

  const unsectioned = useMemo(
    () => tasks.filter((t) => !t.sectionId).sort((a, b) => a.order - b.order),
    [tasks]
  )

  const bySection = useMemo(() => {
    const map = new Map<string, TaskDto[]>()
    for (const s of sections) map.set(s.id, [])
    for (const t of tasks) {
      if (t.sectionId && map.has(t.sectionId)) {
        map.get(t.sectionId)!.push(t)
      }
    }
    for (const [id, list] of map) {
      map.set(
        id,
        [...list].sort((a, b) => a.order - b.order)
      )
    }
    return map
  }, [sections, tasks])

  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections]
  )

  function toggle(sectionId: string) {
    setCollapsed((prev) => {
      const next = !prev[sectionId]
      localStorage.setItem(collapsedKey(sectionId), next ? '1' : '0')
      return { ...prev, [sectionId]: next }
    })
  }

  async function handleAddSection(name: string) {
    const section = await createSection({
      projectId,
      name,
    })
    setSections((prev) => [...prev, section])
    toast.success('Sección creada')
  }

  async function handleRenameSection(name: string) {
    if (!renamingSection) return
    if (renamingSection.name === name) return
    const updated = await patchSection(renamingSection.id, { name })
    setSections((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    )
    toast.success('Sección renombrada')
  }

  async function persistTaskUpdates(
    nextTasks: TaskDto[],
    updates: Array<{ id: string; order: number; sectionId: string | null }>
  ) {
    const prev = tasks
    setTasks(nextTasks)
    try {
      await reorderTasks(updates)
    } catch (e) {
      setTasks(prev)
      toast.error(e instanceof Error ? e.message : 'Error al reordenar')
      bump()
    }
  }

  async function persistSectionUpdates(
    nextSections: SectionDto[],
    updates: Array<{ id: string; order: number }>
  ) {
    const prev = sections
    setSections(nextSections)
    try {
      await reorderSections(updates)
    } catch (e) {
      setSections(prev)
      toast.error(e instanceof Error ? e.message : 'Error al reordenar')
      bump()
    }
  }

  function handleTaskDropOnTask(args: {
    draggedTaskId: string
    targetTaskId: string
    sectionId: string | null
    edge: InsertEdge
  }) {
    const bucket = tasks
      .filter((t) => t.sectionId === args.sectionId)
      .sort((a, b) => a.order - b.order)
    const ids = bucket.map((t) => t.id)
    const index = targetIndexFromEdge(
      ids,
      args.targetTaskId,
      args.edge,
      args.draggedTaskId
    )
    const { tasks: next, updates } = applyTaskMove(
      tasks,
      args.draggedTaskId,
      args.sectionId,
      index
    )
    void persistTaskUpdates(
      next.map((t) => {
        const full = tasks.find((x) => x.id === t.id)!
        return { ...full, sectionId: t.sectionId, order: t.order }
      }),
      updates
    )
  }

  function handleTaskDropOnSection(sectionId: string | null, taskId: string) {
    const bucketLen = tasks.filter((t) => t.sectionId === sectionId).length
    const moving = tasks.find((t) => t.id === taskId)
    const index =
      moving?.sectionId === sectionId ? Math.max(0, bucketLen - 1) : bucketLen
    const { tasks: next, updates } = applyTaskMove(
      tasks,
      taskId,
      sectionId,
      index
    )
    void persistTaskUpdates(
      next.map((t) => {
        const full = tasks.find((x) => x.id === t.id)!
        return { ...full, sectionId: t.sectionId, order: t.order }
      }),
      updates
    )
  }

  function handleSectionDrop(args: {
    draggedSectionId: string
    targetSectionId: string
    edge: InsertEdge
  }) {
    const ids = sortedSections.map((s) => s.id)
    const index = targetIndexFromEdge(
      ids,
      args.targetSectionId,
      args.edge,
      args.draggedSectionId
    )
    const { sections: next, updates } = applySectionMove(
      sortedSections,
      args.draggedSectionId,
      index
    )
    void persistSectionUpdates(next, updates)
  }

  if (loading) {
    return <p className="text-text-secondary mt-6 text-sm">Cargando…</p>
  }

  return (
    <div className="mt-6 flex max-w-2xl flex-col gap-4">
      {sortedSections.map((section) => {
        const sectionTasks = bySection.get(section.id) ?? []
        const isCollapsed = collapsed[section.id]
        return (
          <DraggableSectionBlock
            key={section.id}
            section={section}
            taskCount={sectionTasks.length}
            collapsed={Boolean(isCollapsed)}
            onToggle={() => toggle(section.id)}
            onAddTask={() => openAddTask({ projectId, sectionId: section.id })}
            onRename={() => setRenamingSection(section)}
            onDropSection={handleSectionDrop}
            onDropTaskOnSection={(taskId) =>
              handleTaskDropOnSection(section.id, taskId)
            }
          >
            <ul className="mt-2 flex flex-col gap-2">
              {sectionTasks.map((task) => (
                <DraggableTaskItem
                  key={task.id}
                  task={task}
                  onDropTask={handleTaskDropOnTask}
                />
              ))}
              {sectionTasks.length === 0 && (
                <li className="text-text-secondary px-2 text-sm">
                  Sin tareas en esta sección.
                </li>
              )}
            </ul>
          </DraggableSectionBlock>
        )
      })}

      {unsectioned.length > 0 && (
        <section>
          <h3 className="text-text-heading font-semibold">Sin sección</h3>
          <ul className="mt-2 flex flex-col gap-2">
            {unsectioned.map((task) => (
              <DraggableTaskItem
                key={task.id}
                task={task}
                onDropTask={handleTaskDropOnTask}
              />
            ))}
          </ul>
        </section>
      )}

      <button
        type="button"
        onClick={() => setSectionOpen(true)}
        className="text-text-secondary hover:text-text-primary mt-2 flex items-center gap-2 text-sm"
      >
        <PlusIcon className="size-4" />
        Añadir sección
      </button>

      <NameInputModal
        open={sectionOpen}
        onOpenChange={setSectionOpen}
        title="Nueva sección"
        label="Nombre de la sección"
        confirmLabel="Crear"
        onSubmit={handleAddSection}
      />

      <NameInputModal
        open={renamingSection !== null}
        onOpenChange={(open) => {
          if (!open) setRenamingSection(null)
        }}
        title="Renombrar sección"
        label="Nombre de la sección"
        confirmLabel="Guardar"
        initialValue={renamingSection?.name ?? ''}
        onSubmit={handleRenameSection}
      />
    </div>
  )
}
