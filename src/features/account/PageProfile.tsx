'use client'

import Header from '@/components/layout/header/Header'
import { Button } from '@/components/ui/button'
import { MailIcon, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function PageProfile() {
  const [name, setName] = useState('Fravelz')
  const [email, setEmail] = useState('fravelz@ejemplo.com')
  const [bio, setBio] = useState('')

  return (
    <>
      <Header />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-4">
        <h1 className="text-text-heading text-2xl font-bold">Perfil</h1>
        <p className="text-text-secondary mt-1 text-sm">
          Datos de tu cuenta y preferencias básicas.
        </p>

        <div className="border-border-default mt-8 max-w-xl rounded-xl border bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="bg-interactive-hover-soft flex size-20 shrink-0 items-center justify-center rounded-full">
              <UserIcon className="text-text-secondary size-10" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <label
                  htmlFor="profile-name"
                  className="text-text-secondary mb-1 block text-xs font-medium tracking-wide uppercase"
                >
                  Nombre visible
                </label>
                <input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-border-default bg-surface-app focus:ring-ring text-text-primary w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-email"
                  className="text-text-secondary mb-1 flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase"
                >
                  <MailIcon className="size-3.5" aria-hidden />
                  Correo
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border-default bg-surface-app focus:ring-ring text-text-primary w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-bio"
                  className="text-text-secondary mb-1 block text-xs font-medium tracking-wide uppercase"
                >
                  Bio
                </label>
                <textarea
                  id="profile-bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Una línea sobre ti…"
                  className="border-border-default bg-surface-app focus:ring-ring text-text-primary placeholder:text-muted-foreground w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                />
              </div>
              <Button
                type="button"
                onClick={() => toast.success('Cambios guardados (solo en esta sesión).')}
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
