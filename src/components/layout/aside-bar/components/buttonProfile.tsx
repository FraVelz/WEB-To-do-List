'use client'

import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { LogoutConfirmModal } from '@/features/account/components/LogoutConfirmModal'
import { useUserProfile } from '@/features/account/hooks/useUserProfile'

import { AsideNavIcon } from '../AsideNavIcon'
import DownArrow from '../icons/DownArrow.svg'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthSessionStore } from '@/stores/auth-session-store'

export function ButtonProfile() {
  const [logoutOpen, setLogoutOpen] = useState(false)
  const hydrate = useAuthSessionStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const { displayName } = useUserProfile()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="hover:bg-interactive-hover-soft flex items-center gap-3 rounded-md px-2 py-1">
          <div className="border-border-default size-6 rounded-full border bg-[var(--theme-on-primary)]" />
          <p className="text-text-sidebar text-sm">{displayName}</p>
          <AsideNavIcon src={DownArrow} size={12} className="opacity-80" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-44">
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex cursor-pointer items-center gap-1.5"
          >
            <UserIcon />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="flex cursor-pointer items-center gap-1.5"
          >
            <SettingsIcon />
            Ajustes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onSelect={() => setLogoutOpen(true)}
        >
          <LogOutIcon />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>

      <LogoutConfirmModal open={logoutOpen} onOpenChange={setLogoutOpen} />
    </DropdownMenu>
  )
}
