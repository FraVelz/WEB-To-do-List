'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { formatTaskDate } from '@/lib/date-format'
import { fetchTasks, type TaskDto } from '@/services/tasks'
import { useUiStore } from '@/stores/ui-store'

export function ModalSearch() {
  const searchOpen = useUiStore((s) => s.searchOpen)
  const closeSearch = useUiStore((s) => s.closeSearch)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TaskDto[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!searchOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen, closeSearch])

  useEffect(() => {
    if (!searchOpen) return

    let cancelled = false

    queueMicrotask(() => {
      if (!cancelled) setLoading(true)
    })

    const t = window.setTimeout(() => {
      void (async () => {
        const q = query.trim() || undefined
        const list = await fetchTasks({
          filter: 'inbox',
          q,
        }).catch(() => undefined)

        if (cancelled) return

        if (list !== undefined) {
          setResults(list)
        } else {
          toast.error('No se pudo buscar')
          setResults([])
        }
        setLoading(false)
      })()
    }, 280)

    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [searchOpen, query])

  if (!searchOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 pt-[10vh] pb-12"
      role="presentation"
      onClick={closeSearch}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-search-title"
        className="border-border-default bg-surface-sidebar w-full max-w-lg rounded-xl border shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-border-subtle border-b p-4">
          <h2
            id="modal-search-title"
            className="text-text-heading text-lg font-bold"
          >
            Buscar tareas
          </h2>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título o descripción…"
            className="border-border-default bg-surface-app text-text-primary mt-3 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            autoFocus
          />
        </div>

        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {loading && (
            <li className="text-text-secondary px-3 py-4 text-sm">Buscando…</li>
          )}
          {!loading && results.length === 0 && (
            <li className="text-text-secondary px-3 py-4 text-sm">
              No hay tareas que coincidan.
            </li>
          )}
          {!loading &&
            results.map((task) => (
              <li key={task.id}>
                <Link
                  href="/inbox"
                  onClick={closeSearch}
                  className="hover:bg-interactive-hover-soft flex flex-col gap-1 rounded-md px-3 py-2"
                >
                  <span className="font-medium">{task.title}</span>
                  {task.description && (
                    <span className="text-text-secondary line-clamp-2 text-sm">
                      {task.description}
                    </span>
                  )}
                  <span className="text-text-secondary text-xs">
                    {task.dueDate
                      ? `Vence: ${formatTaskDate(task.dueDate)}`
                      : 'Sin fecha'}
                    {task.label ? ` · ${task.label}` : ''}
                  </span>
                </Link>
              </li>
            ))}
        </ul>

        <div className="border-border-subtle flex justify-end border-t p-3">
          <button
            type="button"
            onClick={closeSearch}
            className="hover:bg-interactive-hover-soft rounded-md px-4 py-2 text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
