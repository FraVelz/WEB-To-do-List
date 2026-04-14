'use client'

import Header from '@/components/layout/header/Header'
import { Button } from '@/components/ui/button'
import { CreditCardIcon, ReceiptIcon, SparklesIcon } from 'lucide-react'

export function PageBilling() {
  return (
    <>
      <Header />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-4">
        <h1 className="text-text-heading text-2xl font-bold">Facturación</h1>
        <p className="text-text-secondary mt-1 text-sm">
          Plan actual, método de pago e historial de facturas.
        </p>

        <div className="mt-8 grid max-w-3xl gap-6 lg:grid-cols-2">
          <section className="border-border-default rounded-xl border bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-text-secondary text-xs font-medium tracking-wide uppercase">
                  Plan
                </p>
                <p className="text-text-heading mt-1 text-lg font-semibold">Gratis</p>
                <p className="text-text-secondary mt-1 text-sm">
                  Tareas y notificaciones ilimitadas en este entorno de demostración.
                </p>
              </div>
              <SparklesIcon className="text-text-accent size-8 shrink-0" aria-hidden />
            </div>
            <Button className="mt-6 w-full sm:w-auto" type="button" variant="outline">
              Ver planes Pro
            </Button>
          </section>

          <section className="border-border-default rounded-xl border bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] p-6">
            <p className="text-text-secondary text-xs font-medium tracking-wide uppercase">
              Método de pago
            </p>
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-[var(--color-border-default)] px-4 py-6">
              <CreditCardIcon className="text-text-secondary size-8 shrink-0" aria-hidden />
              <div>
                <p className="text-text-heading text-sm font-medium">
                  Sin tarjeta registrada
                </p>
                <p className="text-text-secondary text-xs">
                  Añade una tarjeta cuando conectes un proveedor de pagos.
                </p>
              </div>
            </div>
            <Button className="mt-4" type="button" variant="secondary" size="sm">
              Añadir método de pago
            </Button>
          </section>
        </div>

        <section className="border-border-default mt-6 max-w-3xl rounded-xl border bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] p-6">
          <div className="flex items-center gap-2">
            <ReceiptIcon className="text-text-secondary size-5" aria-hidden />
            <h2 className="text-text-heading text-base font-semibold">
              Facturas recientes
            </h2>
          </div>
          <p className="text-text-secondary mt-4 text-sm">
            No hay facturas todavía. Aparecerán aquí cuando tengas un plan de pago activo.
          </p>
        </section>
      </main>
    </>
  )
}
