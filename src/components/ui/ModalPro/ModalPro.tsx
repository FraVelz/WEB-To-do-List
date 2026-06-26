'use client'

import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  CloudIcon,
  FilterIcon,
  PaletteIcon,
  SparklesIcon,
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

import { ModalRouteShell } from '@/components/modals/ModalRouteShell'
import { Button } from '@/components/ui/button'
import { useModalNavigation } from '@/hooks/useModalNavigation'

import ClosedIcon from './icons/ClosedIcon.svg'
import ProIllustration from './icons/pro-illustration.svg'

const PRO_FEATURES = [
  {
    icon: FilterIcon,
    title: 'Filtros y etiquetas avanzados',
    description:
      'Organiza tareas por prioridad, etiqueta o fecha con vistas personalizadas.',
  },
  {
    icon: CalendarIcon,
    title: 'Planificación con fechas límite',
    description:
      'Programa el día, la semana y el próximo con recordatorios visuales.',
  },
  {
    icon: BellIcon,
    title: 'Notificaciones ilimitadas',
    description: 'Recibe avisos en la app sin límite de bandeja ni historial.',
  },
  {
    icon: CloudIcon,
    title: 'Sincronización en la nube',
    description:
      'Tus datos siguen disponibles al iniciar sesión desde otro dispositivo.',
  },
  {
    icon: PaletteIcon,
    title: 'Temas y personalización',
    description:
      'Modo claro u oscuro y ajustes de perfil para adaptar la experiencia.',
  },
] as const

const FREE_VS_PRO = [
  { label: 'Tareas y notificaciones', free: true, pro: true },
  { label: 'Modo demo sin registro', free: true, pro: true },
  { label: 'Filtros avanzados', free: false, pro: true },
  { label: 'Sincronización Firebase', free: false, pro: true },
  { label: 'Soporte prioritario (demo)', free: false, pro: true },
] as const

export default function ModalPro() {
  const { closeModal } = useModalNavigation()

  function handleActivate() {
    toast.success('Plan Pro activado en este entorno de demostración.')
    closeModal()
  }

  return (
    <ModalRouteShell className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-pro-title"
        className="z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl shadow-2xl lg:max-h-[42rem] lg:flex-row"
        tabIndex={-1}
      >
        <div className="bg-surface-app flex max-h-[70vh] flex-col gap-4 overflow-y-auto p-6 lg:max-h-none lg:basis-3/5 lg:rounded-tl-3xl lg:rounded-bl-3xl">
          <div className="flex items-start gap-3">
            <SparklesIcon
              className="text-text-accent mt-0.5 size-6 shrink-0"
              aria-hidden
            />
            <div>
              <h1
                id="modal-pro-title"
                className="text-text-heading text-xl font-bold"
              >
                Pro gratis
              </h1>
              <p className="text-text-secondary mt-1 text-sm">
                Todo lo esencial del plan gratuito, más herramientas para llevar
                el control de tus tareas sin coste en este proyecto de práctica.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-text-heading text-sm font-semibold">
              Qué incluye Pro
            </h2>
            <ul className="mt-3 space-y-3">
              {PRO_FEATURES.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex gap-3">
                  <span className="bg-surface-accent-soft text-text-accent flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-text-heading text-sm font-medium">
                      {title}
                    </p>
                    <p className="text-text-secondary text-xs">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-text-heading text-sm font-semibold">
              Gratis vs Pro
            </h2>
            <div className="border-border-default mt-3 overflow-hidden rounded-lg border text-sm">
              <div className="bg-interactive-hover-soft text-text-secondary grid grid-cols-[1fr_3.5rem_3.5rem] gap-2 px-3 py-2 text-xs font-medium tracking-wide uppercase">
                <span>Función</span>
                <span className="text-center">Gratis</span>
                <span className="text-center">Pro</span>
              </div>
              {FREE_VS_PRO.map((row) => (
                <div
                  key={row.label}
                  className="border-border-default text-text-primary grid grid-cols-[1fr_3.5rem_3.5rem] gap-2 border-t px-3 py-2.5"
                >
                  <span>{row.label}</span>
                  <span className="flex justify-center">
                    {row.free ? (
                      <CheckIcon
                        className="text-state-success size-4"
                        aria-hidden
                      />
                    ) : (
                      <span className="text-text-secondary" aria-hidden>
                        —
                      </span>
                    )}
                  </span>
                  <span className="flex justify-center">
                    <CheckIcon
                      className="text-state-success size-4"
                      aria-hidden
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-text-heading text-sm font-semibold">
              Ciclo de facturación
            </h2>
            <div className="border-interactive-primary mt-3 rounded-lg border px-4 py-3">
              <p className="text-text-heading font-semibold">Anual</p>
              <p className="text-text-heading mt-1 font-bold">
                0 US$
                <span className="text-text-secondary font-normal">/mes</span>
                <span className="text-text-accent bg-surface-accent-soft ml-3 rounded-md px-2 py-0.5 text-xs font-normal">
                  Gratis
                </span>
              </p>
              <p className="text-text-secondary mt-2 text-xs">
                Sin tarjeta ni pasarela de pago: es una simulación para el
                portfolio.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface-sidebar relative flex flex-col items-center gap-4 p-6 lg:basis-2/5 lg:rounded-tr-3xl lg:rounded-br-3xl">
          <button type="button" onClick={closeModal} aria-label="Cerrar modal">
            <Image
              src={ClosedIcon}
              className="absolute top-3 right-3 size-7 cursor-pointer rounded-md px-0.5 py-px transition duration-300 hover:bg-white/10"
              alt=""
            />
          </button>

          <Image
            src={ProIllustration}
            className="mt-4 select-none lg:mt-8"
            draggable={false}
            width={220}
            height={220}
            alt=""
          />

          <div className="text-center">
            <h2 className="text-text-heading text-xl font-bold">Empieza hoy</h2>
            <p className="text-text-secondary mt-2 max-w-xs text-sm">
              Activa Pro en un clic y explora todas las funciones del proyecto
              sin registrarte en ningún servicio de pago.
            </p>
          </div>

          <Button
            type="button"
            className="w-full max-w-xs"
            onClick={handleActivate}
          >
            Activar Pro gratis
          </Button>

          <p className="text-text-secondary mt-auto max-w-xs text-center text-xs leading-relaxed">
            Esta web es un proyecto de código abierto de práctica, no un
            producto ni servicio oficial.
          </p>
        </div>
      </div>
    </ModalRouteShell>
  )
}
