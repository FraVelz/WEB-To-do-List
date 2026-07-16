'use client'

import Header from '@/components/layout/header/Header'
import { OverdueSection } from '@/features/tasks/components/OverdueSection'
import { TaskList } from '@/features/tasks/TaskList'

export function PageToday() {
  return (
    <>
      <Header />

      <main
        id="main-content"
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6"
      >
        <h1 className="text-text-heading text-2xl font-bold">Hoy</h1>
        <p className="text-text-secondary mt-1 text-sm">
          Tareas con fecha para hoy (UTC).
        </p>
        <OverdueSection />
        <section className="mt-6">
          <h2 className="text-text-heading max-w-2xl font-semibold">Hoy</h2>
          <TaskList filter="today" emptyView="today" />
        </section>
      </main>
    </>
  )
}
