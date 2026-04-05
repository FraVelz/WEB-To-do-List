'use client'

import { createContext, useContext } from 'react'

const ModalSearchContext = createContext(false)

export const ModalSearchProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ModalSearchContext.Provider value={false}>
      {children}
    </ModalSearchContext.Provider>
  )
}

export const useModalSearch = () => useContext(ModalSearchContext)
