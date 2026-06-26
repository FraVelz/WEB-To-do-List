'use client'

import Header from '@/components/layout/header/Header'
import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'
import { BellIcon, GlobeIcon, MoonIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useThemeStore } from '@/stores/theme-store'

function ToggleRow({
  id,
  title,
  description,
  icon: Icon,
  checked,
  onCheckedChange,
}: {
  id: string
  title: string
  description: string
  icon: LucideIcon
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="text-text-secondary size-5 shrink-0" aria-hidden />
        <div>
          <label
            htmlFor={id}
            className="text-text-heading cursor-pointer text-sm font-medium"
          >
            {title}
          </label>
          <p className="text-text-secondary mt-0.5 text-xs">{description}</p>
        </div>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={clsx(
          'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-interactive-primary' : 'bg-interactive-hover-soft'
        )}
      >
        <span
          aria-hidden
          className={clsx(
            'bg-surface-app pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-sm transition-[left]',
            checked ? 'left-[22px]' : 'left-0.5'
          )}
        />
      </button>
    </div>
  )
}

export function PageSettings() {
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(false)
  const [weekStartsMonday, setWeekStartsMonday] = useState(true)
  const theme = useThemeStore((s) => s.theme)
  const hydrateTheme = useThemeStore((s) => s.hydrate)
  const setTheme = useThemeStore((s) => s.setTheme)
  const isDark = theme === 'dark'

  useEffect(() => {
    hydrateTheme()
  }, [hydrateTheme])

  return (
    <>
      <Header />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-4">
        <h1 className="text-text-heading text-2xl font-bold">Ajustes</h1>
        <p className="text-text-secondary mt-1 text-sm">
          Notificaciones, idioma y apariencia. Los cambios se guardan solo en el
          navegador de esta demo.
        </p>

        <div className="border-border-default mt-8 max-w-xl divide-y divide-[var(--color-border-default)] rounded-xl border bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] px-6 py-2">
          <ToggleRow
            id="set-email"
            icon={BellIcon}
            title="Correo de resumen"
            description="Recibe un resumen semanal de tareas pendientes."
            checked={emailNotif}
            onCheckedChange={setEmailNotif}
          />
          <ToggleRow
            id="set-push"
            icon={BellIcon}
            title="Notificaciones en el navegador"
            description="Avisos cuando venza una tarea o llegue un recordatorio."
            checked={pushNotif}
            onCheckedChange={setPushNotif}
          />
          <ToggleRow
            id="set-week"
            icon={GlobeIcon}
            title="Semana empieza en lunes"
            description="Afecta a vistas de calendario y al agrupar por semana."
            checked={weekStartsMonday}
            onCheckedChange={setWeekStartsMonday}
          />
          <ToggleRow
            id="set-theme"
            icon={MoonIcon}
            title="Tema oscuro"
            description="Desactiva para usar el tema claro con paleta azul."
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>
      </main>
    </>
  )
}
