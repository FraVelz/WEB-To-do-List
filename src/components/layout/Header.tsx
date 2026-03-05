"use client";

import { useAsideBar } from "@/hooks/useAsideBar";
import Image from "next/image";

export default function Header({ className, useAsideBar }: { className: string, useAsideBar: any }) {
  const [isAsideBarOpen, click_button_asidebar] = useAsideBar();

  return (
    <header className="flex justify-between h-fit w-full py-3 px-6">
      {!isAsideBarOpen && <button className="hover:bg-hover-primary py-1 px-2 rounded-md flex justify-center items-center gap-1" onClick={click_button_asidebar}>
        <Image src="/aside-bar/Sidebar.svg" width={20} height={20} alt="Down Arrow" />
      </button>}
      {isAsideBarOpen && <div></div>}

      <div className="flex gap-3">
        <button className="hover:bg-hover-primary py-1 px-2 rounded-md flex justify-center items-center gap-1">
          <Image src="/aside-bar/Sidebar.svg" width={20} height={20} alt="Down Arrow" />
          <p className="text-sm text-text-header">Prueba Pro gratis</p>
        </button>

        <button className="hover:bg-hover-primary py-1 px-2 rounded-md flex justify-center items-center gap-1">
          <Image src="/aside-bar/Sidebar.svg" width={20} height={20} alt="Down Arrow" />
          <p className="text-sm text-text-header">Formato</p>
        </button>
      </div>
    </header>
  );
}