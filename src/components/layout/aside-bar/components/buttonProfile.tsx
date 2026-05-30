'use client'

import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

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
  const mode = useAuthSessionStore((s) => s.mode)
  const hydrate = useAuthSessionStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const displayName = mode === 'demo' ? 'Usuario demo' : 'Fravelz'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="hover:bg-interactive-hover-soft flex items-center gap-3 rounded-md px-2 py-1">
          <div className="border-border-default size-6 rounded-full border bg-[var(--theme-on-primary)]" />
          <p className="text-text-sidebar text-sm">{displayName}</p>
          <Image src={DownArrow} width={12} height={12} alt="" />
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
            href="/billing"
            className="flex cursor-pointer items-center gap-1.5"
          >
            <CreditCardIcon />
            Facturación
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
        <DropdownMenuItem variant="destructive" asChild>
          <Link
            href="/logout"
            className="flex cursor-pointer items-center gap-1.5"
          >
            <LogOutIcon />
            Cerrar sesión
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
