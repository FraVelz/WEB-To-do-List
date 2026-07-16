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
  onNavigate,
  badge,
}: {
  iconSrc: string | StaticImageData
  iconSize?: number
  text: string
  link: string
  fontsize?: string
  onNavigate?: () => void
  badge?: number
}) {
  const isActive = usePathLink({ href: link })

  return (
    <Link
      href={link}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'group hover:bg-interactive-hover-soft flex items-center gap-3 rounded-md px-3 py-2 transition-colors',
        isActive
          ? 'bg-surface-accent-soft text-text-accent'
          : 'text-text-primary'
      )}
    >
      <AsideNavIcon src={iconSrc} size={iconSize} active={isActive} />
      <p className={clsx('min-w-0 flex-1', fontsize ?? 'text-sm')}>{text}</p>
      {badge != null && badge > 0 && (
        <span
          className={clsx(
            'rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums',
            isActive
              ? 'bg-interactive-primary text-text-primary'
              : 'bg-surface-accent-soft text-text-accent'
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  )
}
