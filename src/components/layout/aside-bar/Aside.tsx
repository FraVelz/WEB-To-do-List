'use client'

import { useEffect, useState } from 'react'

import { useModalNavigation } from '@/hooks/useModalNavigation'
import { useSidebarStore } from '@/stores/sidebar-store'
import { fetchTaskCounts, type TaskCounts } from '@/services/tasks'
import { useTasksRefreshStore } from '@/stores/tasks-refresh-store'

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
import { ProjectsNav } from '@/features/projects/components/ProjectsNav'

const MOBILE_MQ = '(max-width: 767px)'

function isMobileViewport() {
  return window.matchMedia(MOBILE_MQ).matches
}

export default function Aside() {
  const asideBarOpen = useSidebarStore((s) => s.asideBarOpen)
  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar)
  const setSidebarOpen = useSidebarStore((s) => s.setSidebarOpen)
  const { openAddTask, openSearch } = useModalNavigation()
  const pathname = usePathname()
  const isNotificationActive = pathname === '/notification'
  const version = useTasksRefreshStore((s) => s.version)
  const [counts, setCounts] = useState<TaskCounts | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchTaskCounts()
      .then((data) => {
        if (!cancelled) setCounts(data)
      })
      .catch(() => {
        if (!cancelled) setCounts(null)
      })
    return () => {
      cancelled = true
    }
  }, [version])

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const sync = () => setSidebarOpen(!mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [setSidebarOpen])

  useEffect(() => {
    if (isMobileViewport()) setSidebarOpen(false)
  }, [pathname, setSidebarOpen])

  useEffect(() => {
    if (!asideBarOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileViewport()) setSidebarOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    if (isMobileViewport()) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        window.removeEventListener('keydown', onKeyDown)
        document.body.style.overflow = prev
      }
    }

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [asideBarOpen, setSidebarOpen])

  const closeIfMobile = () => {
    if (isMobileViewport()) setSidebarOpen(false)
  }

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar menú lateral"
        className={clsx(
          'fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden',
          asideBarOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
        onClick={() => setSidebarOpen(false)}
        tabIndex={asideBarOpen ? 0 : -1}
      />

      <header
        className={clsx(
          'bg-surface-sidebar fixed inset-y-0 left-0 z-40 h-screen w-70 overflow-hidden',
          'transition-transform duration-300 ease-out',
          'md:relative md:z-auto md:transition-[width] md:duration-300',
          asideBarOpen
            ? 'translate-x-0 md:w-70'
            : 'pointer-events-none -translate-x-full md:w-0 md:translate-x-0'
        )}
        aria-hidden={!asideBarOpen}
      >
        <div
          className={clsx(
            'h-full w-70 transition-opacity duration-200',
            asideBarOpen
              ? 'opacity-100 delay-75 md:delay-150'
              : 'opacity-0 delay-0',
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
                onClick={closeIfMobile}
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
                aria-expanded={asideBarOpen}
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
                  onClick={() => {
                    closeIfMobile()
                    openAddTask()
                  }}
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
                  onClick={() => {
                    closeIfMobile()
                    openSearch()
                  }}
                >
                  <AsideNavIcon src={Search} size={18} />
                  Buscar
                </button>
              </li>

              {asideItems.map((item) => {
                const badge =
                  item.link === '/today'
                    ? (counts?.today ?? 0) + (counts?.overdue ?? 0)
                    : item.link === '/next'
                      ? (counts?.next ?? 0) + (counts?.overdue ?? 0)
                      : item.link === '/inbox'
                        ? counts?.inbox
                        : undefined
                return (
                  <li key={item.link}>
                    <LinkPages
                      text={item.text}
                      link={item.link}
                      iconSrc={item.icon}
                      iconSize={item.width}
                      fontsize={item.fontSize}
                      onNavigate={closeIfMobile}
                      badge={badge}
                    />
                  </li>
                )
              })}
            </ul>
            <ProjectsNav onNavigate={closeIfMobile} />
          </nav>
        </div>

        <div
          className={clsx(
            'bg-surface-sidebar absolute bottom-0 left-0 mb-4 h-10 w-70 px-3 transition-opacity',
            asideBarOpen
              ? 'opacity-100 delay-75 md:delay-150'
              : 'opacity-0 delay-0',
            !asideBarOpen && 'pointer-events-none'
          )}
        >
          <LinkPages
            text="Bandeja"
            link="/inbox"
            iconSrc={Home}
            iconSize={24}
            fontsize="text-md"
            onNavigate={closeIfMobile}
          />
        </div>
      </header>
    </>
  )
}
