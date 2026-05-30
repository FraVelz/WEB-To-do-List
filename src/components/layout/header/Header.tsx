'use client'

import { useModalNavigation } from '@/hooks/useModalNavigation'
import { useSidebarStore } from '@/stores/sidebar-store'

import { AsideNavIcon } from '@/components/layout/aside-bar/AsideNavIcon'

import Premium from './icons/Premium.svg'
import Sidebar from './../aside-bar/icons/Sidebar.svg'

import Image from 'next/image'
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
      className={clsx('flex h-fit w-full justify-between px-6 py-3', className)}
    >
      <button
        className={clsx(
          'hover:bg-interactive-hover-soft flex w-fit items-center justify-center gap-1 rounded-md px-2 py-1',
          !asideBarOpen
            ? ''
            : 'pointer-events-none cursor-default opacity-0'
        )}
        onClick={toggleSidebar}
      >
        <AsideNavIcon src={Sidebar} size={20} />
      </button>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          className="hover:bg-interactive-hover-soft flex items-center justify-center gap-1 rounded-md px-2 py-1"
          onClick={openPro}
        >
          <Image src={Premium} width={20} height={20} alt="Down Arrow" />
          <p className="text-text-heading text-sm">Prueba Pro gratis</p>
        </button>

        {children}
      </div>
    </aside>
  )
}
