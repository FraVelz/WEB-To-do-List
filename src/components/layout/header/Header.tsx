'use client'

import { useModalNavigation } from '@/hooks/useModalNavigation'
import { useSidebarStore } from '@/stores/sidebar-store'

import { AsideNavIcon } from '@/components/layout/aside-bar/AsideNavIcon'

import Premium from './icons/Premium.svg'
import Sidebar from './../aside-bar/icons/Sidebar.svg'

import clsx from 'clsx'

import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function Header({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const asideBarOpen = useSidebarStore((s) => s.asideBarOpen)
  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar)
  const { openPro } = useModalNavigation()

  return (
    <aside
      className={clsx(
        'flex h-fit w-full justify-between px-4 py-3 md:px-6',
        className
      )}
    >
      <button
        type="button"
        aria-label="Abrir menú lateral"
        aria-expanded={asideBarOpen}
        className={clsx(
          'hover:bg-interactive-hover-soft flex w-fit items-center justify-center gap-1 rounded-md px-2 py-1',
          asideBarOpen
            ? 'pointer-events-none cursor-default opacity-0'
            : 'opacity-100'
        )}
        onClick={toggleSidebar}
      >
        <AsideNavIcon src={Sidebar} size={20} />
      </button>

      <div className="flex min-w-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <button
          type="button"
          className="hover:bg-interactive-hover-soft flex items-center justify-center gap-1 rounded-md px-2 py-1"
          onClick={openPro}
        >
          <AsideNavIcon src={Premium} size={20} variant="heading" />
          <p className="text-text-heading hidden text-sm sm:inline">
            Prueba Pro gratis
          </p>
        </button>

        {children}
      </div>
    </aside>
  )
}
