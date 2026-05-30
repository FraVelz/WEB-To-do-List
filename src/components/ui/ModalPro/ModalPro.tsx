'use client'

import Image from 'next/image'

import { ModalRouteShell } from '@/components/modals/ModalRouteShell'
import { useModalNavigation } from '@/hooks/useModalNavigation'

import ClosedIcon from './icons/ClosedIcon.svg'
import ModalProImg from './icons/img-box-premium.png'

export default function ModalPro() {
  const { closeModal } = useModalNavigation()

  return (
    <ModalRouteShell className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-24">
      <div
        role="dialog"
        aria-modal="true"
        className="z-10 flex h-full max-h-167.5 max-w-3xl"
        tabIndex={-1}
      >
        <div className="bg-surface-app rounded-tl-1xl flex h-full basis-3/5 flex-col gap-3 rounded-bl-3xl p-6">
          <h1 className="text-xl font-bold">Pro gratis</h1>
          <p>
            Millones de personas ya usan nuestras herramientas simples pero
            potentes para enfocarse y alcanzar sus metas.
          </p>

          <h2 className="mt-4 font-bold">Ciclo de facturación</h2>
          <div className="border-interactive-primary rounded-md border px-2 py-3">
            <p className="font-bold">Anual</p>

            <p className="mt-1 font-bold">
              0 US$
              <span className="font-normal contrast-75">/mes</span>
              <span className="text-text-accent bg-accent-soft ml-5 rounded-md px-1 py-0.5 text-[12px] font-normal">
                Gratis
              </span>
            </p>
          </div>
        </div>

        <div className="bg-surface-sidebar relative flex h-full basis-2/5 flex-col items-center justify-center gap-3 rounded-tr-3xl p-6">
          <button type="button" onClick={closeModal} aria-label="Cerrar modal">
            <Image
              src={ClosedIcon}
              className="absolute top-3 right-3 size-7 cursor-pointer rounded-md px-0.5 py-px transition duration-300 hover:bg-white/10"
              alt=""
            />
          </button>

          <Image
            src={ModalProImg}
            className="select-none"
            draggable={false}
            width={250}
            height={250}
            alt=""
          />

          <h1 className="text-xl font-bold">Pro gratis</h1>

          <p>Funcionalidades, opciones y características, próximamente...</p>

          <p className="absolute bottom-3 text-center text-[14px] font-normal contrast-75">
            Esta web es un proyecto de código abierto de práctica, no un
            producto ni servicio oficial.
          </p>
        </div>
      </div>
    </ModalRouteShell>
  )
}
