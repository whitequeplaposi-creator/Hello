'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CategoryIcons from '@/components/CategoryIcons'
import ProductGrid from '@/components/ProductGrid'
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations'
import Cart from '@/components/Cart'
import InlineSearchResults from '@/components/InlineSearchResults'
import Footer from '@/components/Footer'
import type { Product } from '@/lib/types'
import { useLanguage } from '@/lib/LanguageContext'
import { useAuth } from '@/lib/AuthContext'
import { useSearch } from '@/lib/SearchContext'

export default function ClientHomePage({ products }: { products: Product[] }) {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const { searchQuery } = useSearch()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const isSearchActive = searchQuery.trim().length >= 2

  return (
    <>
      <Header />
      <main>
        {isSearchActive ? (
          /* ── Search results — replaces entire page content ── */
          <InlineSearchResults products={products} />
        ) : (
          /* ── Normal home page ── */
          <>
            <Hero products={products} onOpenCart={() => setIsCartOpen(true)} />
            <CategoryIcons products={products} />

            {isAuthenticated && (
              <section className="bg-white py-8 px-3 sm:px-4 md:px-6 border-t border-neutral-200/90">
                <div className="max-w-7xl mx-auto">
                  <PersonalizedRecommendations
                    sections={['for_you', 'trending', 'because_you_viewed', 'similar_users']}
                  />
                </div>
              </section>
            )}

            <section className="border-t border-neutral-200/90 bg-[#f5f5f5] py-6 md:py-8 px-3 sm:px-4 md:px-6">
              <div className="max-w-7xl mx-auto text-center">
                <Link
                  href="/"
                  prefetch
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-black"
                >
                  {t('featuredViewAllProducts')}
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </section>

            <ProductGrid initialProducts={products} />
          </>
        )}
      </main>
      <Footer />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
