import clsx from 'clsx'
import { UserIcon } from 'lucide-react'
import Image from 'next/image'

type ProfileAvatarProps = {
  src?: string | null
  size?: 'sm' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'size-6',
  lg: 'size-20',
} as const

const iconSizeClasses = {
  sm: 'size-3.5',
  lg: 'size-10',
} as const

export function ProfileAvatar({
  src,
  size = 'lg',
  className,
}: ProfileAvatarProps) {
  return (
    <div
      className={clsx(
        'border-border-default relative shrink-0 overflow-hidden rounded-full border bg-[var(--theme-on-primary)]',
        sizeClasses[size],
        !src && 'bg-interactive-hover-soft flex items-center justify-center',
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={size === 'lg' ? '80px' : '24px'}
          className="size-full object-cover"
          draggable={false}
          unoptimized
        />
      ) : (
        <UserIcon
          className={clsx('text-text-secondary', iconSizeClasses[size])}
          aria-hidden
        />
      )}
    </div>
  )
}
