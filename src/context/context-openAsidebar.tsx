"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";

type SidebarContextType = {
  asideBarVisible: boolean
  asideBarOpen: boolean
  click_button_asidebar: () => void
}

const AsidebarContext = createContext<SidebarContextType | null>(null);


export function AsidebarProvider({ children }: { children: React.ReactNode }) {
  const [asideBarVisible, setAsideBarVisible] = useState(true)
  const [asideBarOpen, setAsideBarOpen] = useState(true)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const click_button_asidebar = () => {
    if (asideBarOpen) {
      setAsideBarOpen(false)
      timeoutRef.current = setTimeout(() => {
        setAsideBarVisible(false)
      }, 1000)
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setAsideBarVisible(true)
      setAsideBarOpen(true)
    }
  }

    useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <AsidebarContext.Provider value={{asideBarVisible, asideBarOpen, click_button_asidebar}}>
      {children}
    </AsidebarContext.Provider>
  );
}

export function useAsidebar() {
  return useContext(AsidebarContext);
}
