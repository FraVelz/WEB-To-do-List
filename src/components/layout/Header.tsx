"use client";

import { useAsidebar } from "@/context/context-openAsidebar";
import Image from "next/image";

export default function Header({ className, children }: { className?: string, children?: React.ReactNode }) {
  const context = useAsidebar();
  if (!context) return null;

  return (
    <header className={`flex justify-between h-fit w-full py-3 px-6 ${className}`}>
      {!context.asideBarOpen && <button
        className="hover:bg-interactive-hover-soft py-1 px-2 rounded-md flex justify-center items-center gap-1"
        onClick={context.click_button_asidebar}>
        <Image src="/aside-bar/Sidebar.svg" width={20} height={20} alt="Down Arrow" />
      </button>}
      {context.asideBarOpen && <div></div>}

      <div className="flex gap-3">
        <button className="hover:bg-interactive-hover-soft py-1 px-2 rounded-md flex justify-center items-center gap-1">
          <Image src="/header/Premium.svg" width={20} height={20} alt="Down Arrow" />
          <p className="text-sm text-text-heading">Prueba Pro gratis</p>
        </button>

        {children}
      </div>
    </header>
  );
}
{/* <button className="hover:bg-interactive-hover-soft py-1 px-2 rounded-md flex justify-center items-center gap-1">
          <Image src="/aside-bar/Sidebar.svg" width={20} height={20} alt="Down Arrow" />
          <p className="text-sm text-text-heading">Formato</p>
        </button>
  */}