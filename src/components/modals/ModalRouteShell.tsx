'use client'

import { useEffect, type ReactNode } from 'react'

import { useModalNavigation } from '@/hooks/useModalNavigation'

type ModalRouteShellProps = {
  children: ReactNode
  className?: string
  align?: 'center' | 'top'
}

export function ModalRouteShell({
  children,
  className,
  align = 'center',
}: ModalRouteShellProps) {
  const { closeModal } = useModalNavigation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal])

  return (
    <div
      className={
        className ??
        (align === 'top'
          ? 'fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 pt-[10vh] pb-12'
          : 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4')
      }
      role="presentation"
      onClick={closeModal}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}
