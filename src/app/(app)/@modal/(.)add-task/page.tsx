import { Suspense } from 'react'

import { ModalAddTask } from '@/components/modals/ModalAddTask'

export default function AddTaskModalPage() {
  return (
    <Suspense fallback={null}>
      <ModalAddTask />
    </Suspense>
  )
}
