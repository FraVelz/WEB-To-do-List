'use client'

import { useRouter, usePathname } from 'next/navigation'

import { MODAL_PATHS, isModalPath, type ModalPath } from '@/lib/modal-routes'

export function useModalNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  function closeModal() {
    if (isModalPath(pathname)) {
      router.back()
    }
  }

  function openModal(path: ModalPath, query?: Record<string, string>) {
    const sp = new URLSearchParams()
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value) sp.set(key, value)
      }
    }
    const qs = sp.toString()
    const href = qs ? `${path}?${qs}` : path
    if (pathname === path && !qs) return
    router.push(href)
  }

  return {
    pathname,
    isModalOpen: isModalPath(pathname),
    closeModal,
    openAddTask: (opts?: { projectId?: string; sectionId?: string }) =>
      openModal(MODAL_PATHS.addTask, {
        ...(opts?.projectId ? { projectId: opts.projectId } : {}),
        ...(opts?.sectionId ? { sectionId: opts.sectionId } : {}),
      }),
    openSearch: () => openModal(MODAL_PATHS.search),
    openPro: () => openModal(MODAL_PATHS.pro),
  }
}
