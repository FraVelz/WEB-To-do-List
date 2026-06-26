import clsx from 'clsx'
import { UserIcon } from 'lucide-react'

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
        'border-border-default shrink-0 overflow-hidden rounded-full border bg-[var(--theme-on-primary)]',
        sizeClasses[size],
        !src && 'bg-interactive-hover-soft flex items-center justify-center',
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="size-full object-cover"
          draggable={false}
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
