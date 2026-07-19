'use client'

import Header from '@/components/layout/header/Header'
import { Button } from '@/components/ui/button'
import { MailIcon } from 'lucide-react'
import { useRef } from 'react'
import { toast } from '@pheralb/toast'

import { ProfileAvatar } from './components/ProfileAvatar'
import { useUserProfile } from './hooks/useUserProfile'

export function PageProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    email,
    displayName,
    setDisplayName,
    bio,
    setBio,
    avatarUrl,
    setAvatarFromFile,
    removeAvatar,
    save,
    ready,
  } = useUserProfile()

  function handleSave() {
    if (!save()) return
    toast.success({ text: 'Cambios guardados.' })
  }

  async function handleAvatarChange(file: File | undefined) {
    if (!file) return
    const outcome = await setAvatarFromFile(file)
    if (!outcome.ok) {
      toast.error({ text: outcome.error })
      return
    }
    toast.success({ text: 'Foto de perfil actualizada.' })
  }

  function handleRemoveAvatar() {
    if (!removeAvatar()) return
    if (fileInputRef.current) fileInputRef.current.value = ''
    toast.success({ text: 'Foto de perfil eliminada.' })
  }

  return (
    <>
      <Header />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6">
        <h1 className="text-text-heading text-2xl font-bold">Perfil</h1>
        <p className="text-text-secondary mt-1 text-sm">
          Datos de tu cuenta y preferencias básicas. La foto se guarda en este
          navegador por usuario.
        </p>

        <div className="border-border-default mt-8 max-w-xl rounded-xl border bg-[color-mix(in_srgb,var(--color-surface-sidebar)_85%,transparent)] p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <ProfileAvatar src={avatarUrl} size="lg" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-label="Seleccionar foto de perfil"
                className="sr-only"
                disabled={!ready}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  void handleAvatarChange(file)
                }}
              />
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!ready}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Cambiar foto
                </Button>
                {avatarUrl ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={!ready}
                    onClick={handleRemoveAvatar}
                  >
                    Quitar foto
                  </Button>
                ) : null}
              </div>
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
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={!ready}
                  className="border-border-default bg-surface-app focus:ring-ring text-text-primary w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-60"
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
                  readOnly
                  className="border-border-default bg-surface-app text-text-secondary w-full cursor-default rounded-lg border px-3 py-2 text-sm outline-none"
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
                  disabled={!ready}
                  placeholder="Una línea sobre ti…"
                  className="border-border-default bg-surface-app focus:ring-ring text-text-primary placeholder:text-muted-foreground w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-60"
                />
              </div>
              <Button type="button" disabled={!ready} onClick={handleSave}>
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
