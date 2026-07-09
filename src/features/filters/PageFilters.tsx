'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import clsx from 'clsx'

import Header from '@/components/layout/header/Header'
import { fetchTaskLabels } from '@/services/tasks'
import { TaskList } from '@/features/tasks/TaskList'

export function PageFilters() {
  const [labels, setLabels] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    fetchTaskLabels()
      .then(setLabels)
      .catch(() => toast.error('No se pudieron cargar las etiquetas'))
  }, [])

  return (
    <>
      <Header />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6">
        <h1 className="text-text-heading text-2xl font-bold">
          Filtros y etiquetas
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Elige una etiqueta para ver solo esas tareas pendientes.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {labels.length === 0 && (
            <span className="text-text-secondary text-sm">
              Aún no hay etiquetas. Añádelas al crear una tarea.
            </span>
          )}
          {labels.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() =>
                setSelected((prev) => (prev === label ? null : label))
              }
              className={clsx(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                selected === label
                  ? 'border-text-accent bg-surface-accent-soft text-text-accent'
                  : 'border-border-default hover:bg-interactive-hover-soft'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {selected ? (
          <>
            <h2 className="text-text-heading mt-8 text-lg font-semibold">
              Etiqueta: {selected}
            </h2>
            <TaskList filter="inbox" label={selected} />
          </>
        ) : (
          <p className="text-text-secondary mt-8 text-sm">
            Selecciona una etiqueta para filtrar.
          </p>
        )}
      </main>
    </>
  )
}
