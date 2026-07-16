'use client'

import Header from '@/components/layout/header/Header'
import { TaskList } from '@/features/tasks/TaskList'

export function PageInbox() {
  return (
    <>
      <Header />

      <main
        id="main-content"
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6"
      >
        <h1 className="text-text-heading text-2xl font-bold">
          Bandeja de entrada
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Todas las tareas pendientes.
        </p>
        <TaskList filter="inbox" emptyView="inbox" />
      </main>
    </>
  )
}
