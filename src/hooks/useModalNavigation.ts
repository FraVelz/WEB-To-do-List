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

  function openModal(path: ModalPath) {
    if (pathname === path) return
    router.push(path)
  }

  return {
    pathname,
    isModalOpen: isModalPath(pathname),
    closeModal,
    openAddTask: () => openModal(MODAL_PATHS.addTask),
    openSearch: () => openModal(MODAL_PATHS.search),
    openPro: () => openModal(MODAL_PATHS.pro),
  }
}
