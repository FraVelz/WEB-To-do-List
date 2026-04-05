'use client'

import { createContext, useContext } from 'react'

const ModalAddTaskContext = createContext(false)

export const ModalAddTaskProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ModalAddTaskContext.Provider value={false}>
      {children}
    </ModalAddTaskContext.Provider>
  )
}

export const useModalAddTask = () => useContext(ModalAddTaskContext)
