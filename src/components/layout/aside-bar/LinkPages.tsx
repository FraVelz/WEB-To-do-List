import clsx from 'clsx'

import { AsideNavIcon } from '@/components/layout/aside-bar/AsideNavIcon'
import { usePathLink } from '@/hooks/usePathLink'
import Link from 'next/link'
import type { StaticImageData } from 'next/image'

export function LinkPages({
  iconSrc,
  iconSize = 20,
  link,
  text,
  fontsize,
}: {
  iconSrc: string | StaticImageData
  iconSize?: number
  text: string
  link: string
  fontsize?: string
}) {
  const isActive = usePathLink({ href: link })

  return (
    <Link
      href={link}
      className={clsx(
        'group hover:bg-interactive-hover-soft flex items-center gap-3 rounded-md px-3 py-2 transition-colors',
        isActive
          ? 'bg-surface-accent-soft text-text-accent'
          : 'text-text-primary',
      )}
    >
      <AsideNavIcon src={iconSrc} size={iconSize} active={isActive} />
      <p className={fontsize ?? 'text-sm'}>{text}</p>
    </Link>
  )
}
