'use client'

import Header from '@/components/layout/header/Header'
import { SectionNotification } from './SectionNotifications'

import { clsx } from 'clsx'
import { useState } from 'react'

export function PageNotification() {
  const [activeTodas, setActiveTodas] = useState(true)

  return (
    <>
      <Header></Header>

      <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto px-4 py-4 md:px-6">
        <div className="w-full max-w-3xl">
          <h1 className="text-text-heading text-2xl font-bold md:text-3xl">
            Notificaciones
          </h1>

          <div className="bg-interactive-hover-soft mt-7 flex w-fit gap-3 rounded-full px-1 py-1">
            <button
              className={clsx(
                `text-text-primary rounded-full px-2 py-1 text-[14px] font-bold`,
                {
                  'bg-black/50': activeTodas,
                }
              )}
              onClick={() => {
                setActiveTodas(true)
              }}
            >
              Todas
            </button>

            <button
              className={clsx(
                `text-text-primary rounded-full px-2 py-1 text-[14px] font-bold`,
                {
                  'bg-black/50': !activeTodas,
                }
              )}
              onClick={() => {
                setActiveTodas(false)
              }}
            >
              Sin leer
            </button>
          </div>

          <SectionNotification unreadOnly={!activeTodas} />
        </div>
      </div>
    </>
  )
}
