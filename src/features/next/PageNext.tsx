'use client'

import Header from '@/components/layout/header/Header'
import { TaskList } from '@/features/tasks/TaskList'

export function PageNext() {
  return (
    <>
      <Header />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-4">
        <h1 className="text-text-heading text-2xl font-bold">Próximo</h1>
        <p className="text-text-secondary mt-1 text-sm">
          Próximos 7 días (incluye hoy, UTC).
        </p>
        <TaskList filter="next" />
      </main>
    </>
  )
}
