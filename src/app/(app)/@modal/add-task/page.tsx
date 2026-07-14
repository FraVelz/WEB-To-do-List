import { Suspense } from 'react'

import { ModalAddTask } from '@/components/modals/ModalAddTask'

export default function AddTaskModalHardNavPage() {
  return (
    <Suspense fallback={null}>
      <ModalAddTask />
    </Suspense>
  )
}
