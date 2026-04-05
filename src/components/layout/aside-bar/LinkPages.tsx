import { usePathLink } from '@/hooks/usePathLink'
import Link from 'next/link'

export function LinkPages({
  children,
  link,
  text,
  fontsize,
}: {
  children: React.ReactElement
  text: string
  link: string
  fontsize?: string
}) {
  const isActive = usePathLink({ href: link })

  return (
    <Link
      href={link}
      className={`hover:bg-interactive-hover-soft flex gap-3 rounded-md px-3 py-2 ${isActive ? 'bg-surface-accent-soft text-text-accent' : ''} `}
    >
      {children}
      <p className={fontsize ? fontsize : 'text-sm'}>{text}</p>
    </Link>
  )
}
