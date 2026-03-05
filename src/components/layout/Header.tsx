"use client";

import { useAsidebar } from "@/context/context-openAsidebar";
import { useModalPro } from "@/context/context-ModalPro";
import Image from "next/image";

export default function Header({ className, children }: { className?: string, children?: React.ReactNode }) {
  const AsidebarContext = useAsidebar();
  const ModalProContext = useModalPro();

  if (!AsidebarContext) return null;
  if (!ModalProContext) return null;

  return (
    <header className={`flex justify-between h-fit w-full py-3 px-6 ${className}`}>
      {!AsidebarContext.asideBarOpen && <button
        className="hover:bg-interactive-hover-soft py-1 px-2 rounded-md flex justify-center items-center gap-1"
        onClick={AsidebarContext.click_button_asidebar}>
        <Image src="/aside-bar/Sidebar.svg" width={20} height={20} alt="Down Arrow" />
      </button>}
      {AsidebarContext.asideBarOpen && <div></div>}

      <div className="flex gap-3">
        <button
        className="hover:bg-interactive-hover-soft py-1 px-2 rounded-md flex justify-center items-center gap-1"
        onClick={ModalProContext.openModalPro}
        >
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