import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-surface-app relative flex min-h-screen items-center justify-center font-sans">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      {children}
    </div>
  )
}
