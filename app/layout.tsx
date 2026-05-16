import type { Metadata, Viewport } from 'next'
import { Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/CartContext'
import { AuthProvider } from '@/lib/AuthContext'
import { LanguageProvider } from '@/lib/LanguageContext'
import { CategoryProvider } from '@/lib/CategoryContext'
import { SearchProvider } from '@/lib/SearchContext'
import { CookieProvider } from '@/lib/CookieContext'
import { FavoritesProvider } from '@/lib/FavoritesContext'
import CookieBanner from '@/components/CookieBanner'
import CookieSettings from '@/components/CookieSettings'
import NextAuthProvider from '@/components/NextAuthProvider'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Modern E-handel',
  description: 'En modern och användarvänlig e-handelssida',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Modern E-handel',
  },
}

export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: '#ffffff',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={playfair.variable}>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body>
        <NextAuthProvider>
        <CookieProvider>
          <LanguageProvider>
            <AuthProvider>
              <SearchProvider>
                <CategoryProvider>
                  <CartProvider>
                    <FavoritesProvider>
                      {children}
                      <CookieBanner />
                      <CookieSettings />
                    </FavoritesProvider>
                  </CartProvider>
                </CategoryProvider>
              </SearchProvider>
            </AuthProvider>
          </LanguageProvider>
        </CookieProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
