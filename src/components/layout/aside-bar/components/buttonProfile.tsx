import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react'

import Image from 'next/image'

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

      <DropdownMenuContent>
        <DropdownMenuItem>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
