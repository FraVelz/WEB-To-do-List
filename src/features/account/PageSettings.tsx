'use client'

import Header from '@/components/layout/header/Header'
import type { LucideIcon } from 'lucide-react'
import { BellIcon, GlobeIcon, MoonIcon } from 'lucide-react'
import { useState } from 'react'

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
    <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="flex min-w-0 gap-3">
        <Icon className="text-text-secondary mt-0.5 size-5 shrink-0" aria-hidden />
        <div>
          <label htmlFor={id} className="text-text-heading cursor-pointer text-sm font-medium">
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
        className={
          checked
            ? 'bg-interactive-primary relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors'
            : 'bg-interactive-hover-soft relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors'
        }
      >
        <span
          className={
            checked
              ? 'translate-x-5 bg-surface-app pointer-events-none inline-block size-5 rounded-full shadow-sm transition-transform'
              : 'translate-x-0.5 bg-surface-app pointer-events-none inline-block size-5 rounded-full shadow-sm transition-transform'
          }
        />
      </button>
    </div>
  )
}

export function PageSettings() {
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(false)
  const [weekStartsMonday, setWeekStartsMonday] = useState(true)
  const [darkMatchSystem, setDarkMatchSystem] = useState(true)

  return (
    <>
      <Header />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-4">
        <h1 className="text-text-heading text-2xl font-bold">Ajustes</h1>
        <p className="text-text-secondary mt-1 text-sm">
          Notificaciones, idioma y apariencia. Los cambios se guardan solo en el navegador de esta demo.
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
            title="Coincidir con el sistema"
            description="Tema claro u oscuro según tu sistema (demo visual)."
            checked={darkMatchSystem}
            onCheckedChange={setDarkMatchSystem}
          />
        </div>
      </main>
    </>
  )
}
