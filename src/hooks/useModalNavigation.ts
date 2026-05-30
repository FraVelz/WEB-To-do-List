'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'

import {
  MODAL_PATHS,
  isModalPath,
  type ModalPath,
} from '@/lib/modal-routes'

export function useModalNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const closeModal = useCallback(() => {
    if (isModalPath(pathname)) {
      router.back()
    }
  }, [pathname, router])

  const openModal = useCallback(
    (path: ModalPath) => {
      if (pathname === path) return
      router.push(path)
    },
    [pathname, router],
  )

  return {
    pathname,
    isModalOpen: isModalPath(pathname),
    closeModal,
    openAddTask: () => openModal(MODAL_PATHS.addTask),
    openSearch: () => openModal(MODAL_PATHS.search),
    openPro: () => openModal(MODAL_PATHS.pro),
  }
}
