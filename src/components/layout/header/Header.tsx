"use client";

import { useAsidebar } from "@/context/context-openAsidebar";
import { useModalPro } from "@/context/context-ModalPro";

import Premium from "./icons/Premium.svg";
import Sidebar from "./../aside-bar/icons/Sidebar.svg";

import Image from "next/image";

export default function Header({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const AsidebarContext = useAsidebar();
  const ModalProContext = useModalPro();

  if (!AsidebarContext) return null;
  if (!ModalProContext) return null;

  return (
    <aside
      className={`flex h-fit w-full justify-between px-6 py-3 ${className}`}
    >
      {!AsidebarContext.asideBarOpen && (
        <button
          className="hover:bg-interactive-hover-soft flex items-center justify-center gap-1 rounded-md px-2 py-1"
          onClick={AsidebarContext.click_button_asidebar}
        >
          <Image
            src={Sidebar}
            width={20}
            height={20}
            alt="Down Arrow"
          />
        </button>
      )}
      {AsidebarContext.asideBarOpen && <div></div>}

      <div className="flex gap-3">
        <button
          className="hover:bg-interactive-hover-soft flex items-center justify-center gap-1 rounded-md px-2 py-1"
          onClick={ModalProContext.openModalPro}
        >
          <Image
            src={Premium}
            width={20}
            height={20}
            alt="Down Arrow"
          />
          <p className="text-text-heading text-sm">Prueba Pro gratis</p>
        </button>

        {children}
      </div>
    </aside>
  );
}
