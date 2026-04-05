'use client'
import { createContext, useContext, useState, useEffect, useRef } from 'react'

type SidebarContextType = {
  asideBarOpen: boolean
  click_button_asidebar: () => void
}

const AsidebarContext = createContext<SidebarContextType | null>(null)

export function AsidebarProvider({ children }: { children: React.ReactNode }) {
  const [asideBarOpen, setAsideBarOpen] = useState(true)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const click_button_asidebar = () => {
    setAsideBarOpen((prev) => !prev)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <AsidebarContext.Provider value={{ asideBarOpen, click_button_asidebar }}>
      {children}
    </AsidebarContext.Provider>
  )
}

export function useAsidebar() {
  return useContext(AsidebarContext)
}
