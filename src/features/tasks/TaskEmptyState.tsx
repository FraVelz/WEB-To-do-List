'use client'

import Link from 'next/link'

type View = 'inbox' | 'today' | 'next' | 'generic'

const COPY: Record<
  View,
  { title: string; body: string; ctaHref?: string; ctaLabel?: string }
> = {
  inbox: {
    title: 'Inbox cero — añade una tarea',
    body: 'Captura rápido desde «Agregar tarea» o el atajo del menú lateral.',
    ctaHref: '/add-task',
    ctaLabel: 'Agregar tarea',
  },
  today: {
    title: 'Nada para hoy — planifica',
    body: 'Programa una fecha en Inbox o revisa lo pendiente en Próximo.',
    ctaHref: '/inbox',
    ctaLabel: 'Ir a Inbox',
  },
  next: {
    title: 'Semana libre',
    body: 'No hay tareas con fecha en los próximos 7 días para este día.',
    ctaHref: '/inbox',
    ctaLabel: 'Ir a Inbox',
  },
  generic: {
    title: 'Sin tareas aquí',
    body: 'Crea una con «Agregar tarea».',
    ctaHref: '/add-task',
    ctaLabel: 'Agregar tarea',
  },
}

type Props = {
  view?: View
  className?: string
}

export function TaskEmptyState({ view = 'generic', className }: Props) {
  const copy = COPY[view]

  return (
    <div
      className={
        className ??
        'border-border-subtle bg-surface-sidebar/40 mt-6 max-w-2xl rounded-lg border px-4 py-6'
      }
      role="status"
    >
      <p className="text-text-heading font-medium">{copy.title}</p>
      <p className="text-text-secondary mt-1 text-sm">{copy.body}</p>
      {copy.ctaHref && copy.ctaLabel && (
        <Link
          href={copy.ctaHref}
          className="text-text-accent mt-3 inline-block text-sm font-medium underline-offset-2 hover:underline"
        >
          {copy.ctaLabel}
        </Link>
      )}
    </div>
  )
}
