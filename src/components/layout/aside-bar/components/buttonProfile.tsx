import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'

import DownArrow from '../icons/DownArrow.svg'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ButtonProfile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="hover:bg-interactive-hover-soft flex items-center gap-3 rounded-md px-2 py-1">
          <div className="size-6 rounded-full bg-white"></div>
          <p className="text-text-sidebar text-sm">Fravelz</p>
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
