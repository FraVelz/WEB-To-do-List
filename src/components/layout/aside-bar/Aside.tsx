'use client'

import { useModalNavigation } from '@/hooks/useModalNavigation'
import { useSidebarStore } from '@/stores/sidebar-store'

import { AsideNavIcon } from './AsideNavIcon'
import { LinkPages } from './LinkPages'
import { asideItems } from './data'

import NotificationNotify from './icons/NotificationNotify.svg'
import Sidebar from './icons/Sidebar.svg'
import Home from './icons/Home.svg'

import Search from './icons/Search.svg'
import AddPlus from './icons/AddPlus.svg'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import { ButtonProfile } from './components/buttonProfile'

export default function Aside() {
  const asideBarOpen = useSidebarStore((s) => s.asideBarOpen)
  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar)
  const { openAddTask, openSearch } = useModalNavigation()
  const pathname = usePathname()
  const isNotificationActive = pathname === '/notification'

  return (
    <header
      className={clsx(
        'bg-surface-sidebar relative h-screen transition-[width] duration-1000',
        asideBarOpen ? 'w-70' : 'w-0'
      )}
    >
      <div
        className={clsx(
          'transition-opacity duration-300',
          asideBarOpen ? 'opacity-100 delay-500' : 'opacity-0 delay-0',
          !asideBarOpen && 'pointer-events-none'
        )}
      >
        {/* Profile */}
        <div className="mb-3 flex justify-between p-3">
          <ButtonProfile />

          <div className="flex gap-1">
            <Link
              className="group hover:bg-interactive-hover-soft rounded-md px-2 py-1"
              href="/notification"
            >
              <AsideNavIcon
                src={NotificationNotify}
                size={20}
                active={isNotificationActive}
              />
            </Link>

            <button
              type="button"
              className="group hover:bg-interactive-hover-soft rounded-md px-2 py-1"
              onClick={toggleSidebar}
              aria-label="Alternar menú lateral"
            >
              <AsideNavIcon src={Sidebar} size={20} />
            </button>
          </div>
        </div>

        {/* Pages */}
        <nav aria-label="Menú principal" className="flex flex-col gap-1 px-3">
          <ul className="flex flex-col gap-1">
            <li>
              <button
                type="button"
                className={clsx(
                  'group hover:bg-interactive-hover-soft text-text-primary text-md',
                  'flex w-full items-center gap-3 rounded-md px-2 py-1'
                )}
                onClick={openAddTask}
              >
                <AsideNavIcon src={AddPlus} size={24} variant="accent" />
                Agregar tarea
              </button>
            </li>

            <li>
              <button
                type="button"
                className={clsx(
                  'group hover:bg-interactive-hover-soft text-text-primary text-md',
                  'flex w-full items-center gap-3 rounded-md px-2 py-1'
                )}
                onClick={openSearch}
              >
                <AsideNavIcon src={Search} size={18} />
                Buscar
              </button>
            </li>

            {asideItems.map((item) => (
              <li key={item.link}>
                <LinkPages
                  text={item.text}
                  link={item.link}
                  iconSrc={item.icon}
                  iconSize={item.width}
                  fontsize={item.fontSize}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className={clsx(
          'bg-surface-sidebar absolute bottom-0 left-0 mb-4 h-10 w-full px-3 transition-opacity',
          asideBarOpen ? 'opacity-100 delay-500' : 'opacity-0 delay-0',
          !asideBarOpen && 'pointer-events-none'
        )}
      >
        <LinkPages
          text="Bandeja"
          link="/inbox"
          iconSrc={Home}
          iconSize={24}
          fontsize="text-md"
        />
      </div>
    </header>
  )
}
