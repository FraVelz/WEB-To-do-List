"use client";

import { createContext, useContext, useState } from "react";

type SidebarContextType = {
  asideBarVisible: boolean
  asideBarOpen: boolean
  click_button_asidebar: () => void
}

const Context = createContext<SidebarContextType | null>(null);


export function AsidebarProvider({ children }: { children: React.ReactNode }) {
  const [asideBarVisible, setAsideBarVisible] = useState(true)
  const [asideBarOpen, setAsideBarOpen] = useState(true)

  const click_button_asidebar = () => {
    if (asideBarOpen) {
      setAsideBarOpen(false)
      setTimeout(() => setAsideBarVisible(false), 1000)
    }
    else {
      setAsideBarVisible(true)
      setAsideBarOpen(true)
    }
  }

  return (
    <Context.Provider value={{asideBarVisible, asideBarOpen, click_button_asidebar}}>
      {children}
    </Context.Provider>
  );
}

export function useAsidebar() {
  return useContext(Context);
}
