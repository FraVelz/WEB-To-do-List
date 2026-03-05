"use client"

import { useState } from "react";

export function useAsideBar() {
  const [asideBarOpen, setAsideBarOpen] = useState(true)
  
  const click_button_asidebar = () => {
    if (asideBarOpen) setAsideBarOpen(false)
    else setAsideBarOpen(true)
  }

  return [asideBarOpen, click_button_asidebar] as const
}