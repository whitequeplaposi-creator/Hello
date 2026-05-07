import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/CartContext'
import { AuthProvider } from '@/lib/AuthContext'
import { LanguageProvider } from '@/lib/LanguageContext'
import { CategoryProvider } from '@/lib/CategoryContext'
import { SearchProvider } from '@/lib/SearchContext'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Modern E-handel',
  description: 'En modern och användarvänlig e-handelssida',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" className={playfair.variable}>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <SearchProvider>
              <CategoryProvider>
                <CartProvider>{children}</CartProvider>
              </CategoryProvider>
            </SearchProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
