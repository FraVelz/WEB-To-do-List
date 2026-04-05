"use client";

import { useAsidebar } from "@/context/context-openAsidebar";

import { LinkPages } from "./LinkPages";
import { asideItems } from "./data";

import DownArrow from "./icons/DownArrow.svg";
import NotificationNotify from "./icons/NotificationNotify.svg";
import Sidebar from "./icons/Sidebar.svg";
import Home from "./icons/Home.svg";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

export default function Aside() {
  const context = useAsidebar();
  if (!context) return null;

  return (
    <header
      className={clsx(
        "bg-surface-sidebar relative h-screen transition-[width] duration-1000",
        context.asideBarOpen ? "w-70" : "w-0",
      )}
    >
      <div
        className={clsx(
          "transition-opacity duration-300",
          context.asideBarOpen ? "opacity-100 delay-500" : "opacity-0 delay-0",
          !context.asideBarOpen && "pointer-events-none",
        )}
      >
        {/* Profile */}
        <div className="mb-3 flex justify-between p-3">
          <button className="hover:bg-interactive-hover-soft flex items-center gap-3 rounded-md px-2 py-1">
            <div className="size-6 rounded-full bg-white"></div>
            <p className="text-text-sidebar text-sm">Fravelz</p>
            <Image src={DownArrow} width={12} height={12} alt="" />
          </button>

          <div className="flex gap-1">
            <Link
              className="hover:bg-interactive-hover-soft rounded-md px-2 py-1"
              href="/notification"
            >
              <Image
                src={NotificationNotify}
                width={20}
                height={20}
                alt="Icono Notificaciones"
              />
            </Link>

            <button
              className="hover:bg-interactive-hover-soft rounded-md px-2 py-1"
              onClick={context.click_button_asidebar}
            >
              <Image src={Sidebar} width={20} height={20} alt="Icono Menú" />
            </button>
          </div>
        </div>

        {/* Pages */}
        <nav aria-label="Menú principal" className="flex flex-col gap-1 px-3">
          <ul className="flex flex-col gap-1">
            {asideItems.map((item) => (
              <li key={item.link}>
                <LinkPages
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
                </LinkPages>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className={clsx(
          "bg-surface-sidebar absolute bottom-0 left-0 mb-4 h-10 w-full px-3 transition-opacity",
          context.asideBarOpen ? "opacity-100 delay-500" : "opacity-0 delay-0",
          !context.asideBarOpen && "pointer-events-none",
        )}
      >
        <LinkPages text="Inicio" link="/" fontsize="text-md">
          <Image src={Home} width={24} height={24} alt="Icono Inicio" />
        </LinkPages>
      </div>
    </header>
  );
}
