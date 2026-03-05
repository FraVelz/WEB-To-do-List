"use client";

import { useAsidebar } from "@/context/context-openAsidebar";
import { usePathLink } from "@/hooks/usePathLink";

import Image from "next/image";
import Link from "next/link";

function Pages({children, link, text, fontsize}: {children: React.ReactElement, text: string, link:string, fontsize?: string}) {
  const isActive = usePathLink({href: link});

  return (
    <Link href={link} className={`px-3 py-2 flex gap-3 hover:bg-interactive-hover-soft rounded-md
      ${isActive ? 'bg-surface-accent-soft text-text-accent':''}
    `}>
      {children}
      <p className={fontsize ? fontsize : "text-sm"}>{text}</p>
    </Link>
  );
}

type AsideItem = {
  text: string;
  link: string;
  icon: string;
  width: number;
  height: number;
  fontSize?: string;
};

const asideItems: AsideItem[] = [
  {
    text: "Agregar tarea",
    link: "/add-task",
    icon: "/aside-bar/AddPlus.svg",
    width: 24,
    height: 24,
    fontSize: "text-md",
  },
  {
    text: "Buscador",
    link: "/search",
    icon: "/aside-bar/Search.svg",
    width: 18,
    height: 18,
  },
  {
    text: "Bandeja de entrada",
    link: "/inbox",
    icon: "/aside-bar/Inbox.svg",
    width: 20,
    height: 20,
  },
  {
    text: "Hoy",
    link: "/today",
    icon: "/aside-bar/CalendarToday.svg",
    width: 18,
    height: 18,
  },
  {
    text: "Próximo",
    link: "/next",
    icon: "/aside-bar/Next.svg",
    width: 20,
    height: 20,
  },
  {
    text: "Filtros y Etiquetas",
    link: "/filters",
    icon: "/aside-bar/Filters.svg",
    width: 20,
    height: 20,
  },
  {
    text: "Completado",
    link: "/completed",
    icon: "/aside-bar/Complete.svg",
    width: 20,
    height: 20,
  },
];

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
          <button className="flex items-center gap-3 hover:bg-interactive-hover-soft py-1 px-2 rounded-md">
            <div className="size-6 bg-white rounded-full"></div>
            <p className="text-sm text-text-sidebar">Fravelz</p>
            <Image src="/aside-bar/DownArrow.svg" width={12} height={12} alt="" />
          </button>

          <div className="flex gap-1">
            <button className="hover:bg-interactive-hover-soft py-1 px-2 rounded-md">
              <Image src="/aside-bar/NotificationNotify.svg" width={20} height={20} alt="Icono Notificaciones" />
            </button>

            <button className="hover:bg-interactive-hover-soft py-1 px-2 rounded-md" onClick={context.click_button_asidebar}>
              <Image src="/aside-bar/Sidebar.svg" width={20} height={20} alt="Icono Menú" />
            </button>
          </div>
        </div>

        {/* Pages */}
        <nav aria-label="Menú principal" className="px-3 flex flex-col gap-1">
          <ul className="flex flex-col gap-1">
            {asideItems.map((item) => (
              <li key={item.link}>
                <Pages
                  text={item.text}
                  link={item.link}
                  fontsize={item.fontSize}
                >
                  <Image
                    src={item.icon}
                    width={item.width}
                    height={item.height}
                    alt={item.text}
                  />
                </Pages>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-10 bg-surface-sidebar px-3 mb-4">
        <Pages text="Inicio" link="/" fontsize="text-md">
          <Image src="/aside-bar/Home.svg" width={24} height={24} alt="Icono Inicio" />
        </Pages>
      </div>
    </aside>
    );
  }
  
  return null;
}

