import type { Metadata } from 'next'

import { AuthProvider } from '@/components/auth/AuthProvider'
import { FirebaseAnalytics } from '@/components/auth/FirebaseAnalytics'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/lib/theme'

import { Geist } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'To-do — Organiza tu día',
  description: 'Gestor de tareas con notificaciones y bandeja de entrada.',
}

const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var theme=(t==='light'||t==='dark')?t:${JSON.stringify(DEFAULT_THEME)};document.documentElement.setAttribute('data-theme',theme);document.documentElement.style.colorScheme=theme;}catch(e){document.documentElement.setAttribute('data-theme',${JSON.stringify(DEFAULT_THEME)});}})();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} bg-surface-app antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <FirebaseAnalytics />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
