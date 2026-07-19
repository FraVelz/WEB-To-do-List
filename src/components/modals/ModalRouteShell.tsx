'use client'

import { useEffect, useRef, type ReactNode } from 'react'

import { useModalNavigation } from '@/hooks/useModalNavigation'

const FOCUSABLE_SELECTOR = [
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]),',
  "select:not([disabled]), [tabindex]:not([tabindex='-1'])",
].join(' ')

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
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose])

  useEffect(() => {
    const el = panelRef.current
    if (!el) return

    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    const focusInitial = () => {
      const preferred = el.querySelector<HTMLElement>(
        '[data-autofocus], [autofocus]'
      )
      if (preferred) {
        preferred.focus()
        return
      }
      const focusables = el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      focusables[0]?.focus()
    }
    const raf = requestAnimationFrame(focusInitial)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusables = [
        ...el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ].filter(
        (node) =>
          !node.hasAttribute('disabled') &&
          node.getAttribute('aria-hidden') !== 'true'
      )
      if (focusables.length === 0) return
      const first = focusables[0]!
      const last = focusables[focusables.length - 1]!
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    el.addEventListener('keydown', handleKeyDown)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('keydown', handleKeyDown)
      if (trigger?.isConnected) {
        requestAnimationFrame(() => trigger.focus())
      }
    }
  }, [])

  return (
    <div
      className={
        className ??
        (align === 'top'
          ? 'fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 pt-[10vh] pb-12'
          : 'fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8')
      }
      role="presentation"
      onClick={handleClose}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        ref={panelRef}
        className="flex w-full justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
