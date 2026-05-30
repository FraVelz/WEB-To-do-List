'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useEffect } from 'react'

import { useThemeStore } from '@/stores/theme-store'
import clsx from 'clsx'

type ThemeToggleProps = {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme)
  const hydrated = useThemeStore((s) => s.hydrated)
  const hydrate = useThemeStore((s) => s.hydrate)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const isDark = theme === 'dark'
  const label = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={clsx(
        'hover:bg-interactive-hover-soft text-text-heading flex items-center justify-center gap-1.5 rounded-md px-2 py-1 transition-colors',
        className
      )}
    >
      {hydrated && isDark ? (
        <SunIcon className="size-5 shrink-0" aria-hidden />
      ) : (
        <MoonIcon className="size-5 shrink-0" aria-hidden />
      )}
      {showLabel ? (
        <span className="text-sm">{isDark ? 'Tema claro' : 'Tema oscuro'}</span>
      ) : null}
    </button>
  )
}
