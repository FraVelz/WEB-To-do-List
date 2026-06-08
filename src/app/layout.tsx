import type { Metadata } from 'next'

import { AuthProvider } from '@/components/auth/AuthProvider'
import { FirebaseAnalytics } from '@/components/auth/FirebaseAnalytics'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import {
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
} from '@/lib/site'
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/lib/theme'

import { Geist } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: siteUrl,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/brand/og-logo.svg',
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/brand/og-logo.svg'],
  },
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
