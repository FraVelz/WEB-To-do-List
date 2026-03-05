"use client";

import { useAsidebar } from "@/context/context-openAsidebar";
import { usePathLink } from "@/hooks/usePathLink";

import Image from "next/image";
import Link from "next/link";

function Pages({children, link, text, fontsize}: {children: React.ReactElement, text: string, link:string, fontsize?: string}) {
  const isActive = usePathLink({href: link});

  return (
    <Link href={link} className={`px-3 py-2 flex gap-3 hover:bg-hover-primary rounded-md
      ${isActive ? 'bg-background-red text-text-red':''}
    `}>
      {children}
      <p className={fontsize ? fontsize : "text-sm"}>{text}</p>
    </Link>
  );
}

export default function Aside({ className }: { className: string }) {
  const context = useAsidebar();
  if (!context) return null;

  if (context.asideBarVisible) {
    return (
      <aside className={`
      transition-transform duration-1000
      ${context.asideBarOpen ? "transform translate-x-0" : "transform -translate-x-full"}
      ${className}`}>
      <div>
        {/* Profile */}
        <div className="p-3 mb-3 flex justify-between">
          <button className="flex items-center gap-3 hover:bg-hover-primary py-1 px-2 rounded-md">
            <div className="size-6 bg-white rounded-full"></div>
            <p className="text-sm text-text-sidebar">Fravelz</p>
            <Image src="/aside-bar/DownArrow.svg" width={12} height={12} alt="Down Arrow" />
          </button>

          <div className="flex gap-1">
            <button className="hover:bg-hover-primary py-1 px-2 rounded-md">
              <Image src="/aside-bar/NotificationNotify.svg" width={20} height={20} alt="Down Arrow" />
            </button>

            <button className="hover:bg-hover-primary py-1 px-2 rounded-md" onClick={context.click_button_asidebar}>
              <Image src="/aside-bar/Sidebar.svg" width={20} height={20} alt="Down Arrow" />
            </button>
          </div>
        </div>

        {/* Pages */}
        <nav className="px-3 flex flex-col gap-1">
          <Pages text="Agregar tarea" link="/add-task" fontsize="text-md">
            <Image src="/aside-bar/AddPlus.svg" width={24} height={24} alt="Down Arrow" />
          </Pages>
          <Pages text="Buscador" link="/search">
            <Image src="/aside-bar/Search.svg" width={18} height={18} alt="Down Arrow" />
          </Pages>
          <Pages text="Bandeja de entrada" link="/inbox">
            <Image src="/aside-bar/Inbox.svg" width={20} height={20} alt="Down Arrow" />
          </Pages>
          <Pages text="Hoy" link="/today">
            <Image src="/aside-bar/CalendarToday.svg" width={18} height={18} alt="Down Arrow" />
          </Pages>
          <Pages text="Próximo" link="/next">
            <Image src="/aside-bar/Next.svg" width={20} height={20} alt="Down Arrow" />
          </Pages>
          <Pages text="Filtros y Etiquetas" link="/filters">
            <Image src="/aside-bar/Filters.svg" width={20} height={20} alt="Down Arrow" />
          </Pages>
          <Pages text="Completado" link="/completed">
            <Image src="/aside-bar/Complete.svg" width={20} height={20} alt="Down Arrow" />
          </Pages>
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-10 bg-background-sidebar px-3 mb-4">
        <Pages text="Inicio" link="/" fontsize="text-md">
          <Image src="/aside-bar/Home.svg" width={24} height={24} alt="Down Arrow" />
        </Pages>
      </div>
    </aside>
    );
  }
  
  return null;
}

