import clsx from 'clsx'
import type { StaticImageData } from 'next/image'

type AsideNavIconProps = {
  src: string | StaticImageData
  size?: number
  variant?: 'default' | 'accent'
  active?: boolean
  className?: string
}

function resolveSrc(src: string | StaticImageData): string {
  return typeof src === 'string' ? src : src.src
}

export function AsideNavIcon({
  src,
  size = 20,
  variant = 'default',
  active = false,
  className,
}: AsideNavIconProps) {
  const url = resolveSrc(src)

  return (
    <span
      aria-hidden
      className={clsx(
        'inline-block shrink-0 transition-colors duration-150',
        active && 'bg-icon-sidebar-active',
        !active && variant === 'accent' && 'bg-icon-action',
        !active &&
          variant === 'default' &&
          'bg-icon-sidebar group-hover:bg-text-primary',
        className,
      )}
      style={{
        width: size,
        height: size,
        maskImage: `url("${url}")`,
        WebkitMaskImage: `url("${url}")`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
    />
  )
}
