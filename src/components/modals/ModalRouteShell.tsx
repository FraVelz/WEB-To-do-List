'use client'

import { useEffect, type ReactNode } from 'react'

import { useModalNavigation } from '@/hooks/useModalNavigation'

type ModalRouteShellProps = {
  children: ReactNode
  className?: string
  align?: 'center' | 'top'
  onClose?: () => void
}

export function ModalRouteShell({
  children,
  className,
  align = 'center',
  onClose,
}: ModalRouteShellProps) {
  const { closeModal } = useModalNavigation()
  const handleClose = onClose ?? closeModal

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose])

  return (
    <div
      className={
        className ??
        (align === 'top'
          ? 'fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 pt-[10vh] pb-12'
          : 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4')
      }
      role="presentation"
      onClick={handleClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}
